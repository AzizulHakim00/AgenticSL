package com.agenticsl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.*;
import org.bson.Document;
import com.fasterxml.jackson.databind.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.web.server.ResponseStatusException;

class WorkflowTest {
  Settings settings;Store store;GitHubGateway github;Course course;Learning learning;ObjectMapper mapper;
  Learning.Actor learner=new Learning.Actor("42","learner",false,false),admin=new Learning.Actor("157488702","admin",true,false);
  @BeforeEach void setup()throws Exception{mapper=new ObjectMapper();settings=new Settings();settings.repository="AzizulHakim00/AgenticSL";settings.mongoUri="";store=mock(Store.class);github=mock(GitHubGateway.class);course=new Course(mapper);learning=new Learning(course,store,github,settings,mapper);when(store.records(anyString())).thenReturn(List.of());}
  @Test void pendingLearnerCannotRecordProgress()throws Exception{
    when(store.enrollment("42")).thenReturn(new Document("status","PENDING"));
    assertThrows(ResponseStatusException.class,()->learning.action(learner,mapper.readTree("{\"type\":\"task\",\"day\":1,\"index\":0,\"checked\":true}")));
    verify(store,never()).append(anyString(),any());
  }
  @Test void approvalCreatesOrVerifiesBranchBeforeApproving(){
    when(store.enrollment("42")).thenReturn(new Document("_id","42").append("login","learner").append("status","PENDING"));when(github.prepareBranch("learner")).thenReturn("learners/learner");
    learning.approve("42");verify(github).prepareBranch("learner");verify(store).saveEnrollment(argThat(e->e.getString("status").equals("APPROVED")&&e.getString("branch").equals("learners/learner")));
  }
  @Test void finalReviewRejectsChangedOrUnmergedCommit(){
    var original=new Document("headSha","original");var sub=new Document("id","submission-1").append("day",1).append("kind","submission").append("payload",new Document("evidenceUrl","https://github.com/AzizulHakim00/AgenticSL/pull/1").append("pr",original));
    when(store.records("42")).thenReturn(List.of(sub));when(store.enrollment("42")).thenReturn(new Document("branch","learners/learner"));
    when(github.pull(anyString(),eq("42"),anyString())).thenReturn(new Document("headSha","changed").append("merged",true));
    assertThrows(ResponseStatusException.class,()->learning.review("42",1,"submission-1",90,"Reviewed evidence",true,admin));
    when(github.pull(anyString(),eq("42"),anyString())).thenReturn(new Document("headSha","original").append("merged",false));
    assertThrows(ResponseStatusException.class,()->learning.review("42",1,"submission-1",90,"Reviewed evidence",true,admin));verify(store,never()).append(anyString(),any());
  }
  @Test void prValidationRejectsWrongAuthorBaseAndNonGithubUrl(){
    var gateway=new GitHubGateway(settings,mapper,Optional.empty()){@Override protected JsonNode api(String path,String method,Object body){return mapper.createObjectNode();}};
    assertThrows(ResponseStatusException.class,()->gateway.pull("https://example.test/pull/1","42","learners/learner"));
    assertThrows(ResponseStatusException.class,()->gateway.pull("https://github.com/AzizulHakim00/AgenticSL/pull/1","42","learners/learner"));
  }
  @Test void learnerCompletesDayAfterApprovalAndReviewOfMergedPersonalFork()throws Exception{
    String branch="learners/learner";
    var enrollment=new AtomicReference<Document>();
    var events=new ArrayList<Document>();
    when(store.enrollment(learner.id())).thenAnswer(call->enrollment.get());
    doAnswer(call->{enrollment.set(call.getArgument(0));return null;}).when(store).saveEnrollment(any(Document.class));
    when(store.records(learner.id())).thenAnswer(call->List.copyOf(events));
    when(store.append(eq(learner.id()),any(Document.class))).thenAnswer(call->{
      Document event=call.getArgument(1);
      events.add(event);
      return event;
    });
    var pr=mapper.createObjectNode().put("merged",false).put("state","open");
    pr.putObject("user").put("id",42);
    pr.putObject("base").put("ref",branch).putObject("repo").put("full_name",settings.repository);
    var forkOwner=pr.putObject("head").put("sha","submitted-sha").putObject("repo").put("fork",true).putObject("owner").put("id",43);
    var gateway=new GitHubGateway(settings,mapper,Optional.empty()){
      @Override protected JsonNode api(String path,String method,Object body){
        assertEquals("GET",method);
        return switch(path){
          case "/git/ref/heads/learners/learner" -> mapper.createObjectNode().put("ref","refs/heads/"+branch);
          case "/pulls/5" -> pr;
          default -> throw new AssertionError("Unexpected GitHub path: "+path);
        };
      }
    };
    learning=new Learning(course,store,gateway,settings,mapper);
    learning.requestAccess(learner);
    assertEquals("PENDING",learning.membership(learner).getString("status"));
    learning.approve(learner.id());
    assertEquals(branch,learning.membership(learner).getString("branch"));
    assertEquals("APPROVED",learning.membership(learner).getString("status"));

    var submission=mapper.createObjectNode().put("type","submission").put("day",1)
      .put("answer","Implemented the exercise").put("evidence","Local checks passed")
      .put("evidenceUrl","https://github.com/"+settings.repository+"/pull/5");
    var wrongFork=assertThrows(ResponseStatusException.class,()->learning.action(learner,submission));
    assertTrue(wrongFork.getReason().contains("fork owned"));
    assertTrue(events.isEmpty());
    forkOwner.put("id",42);
    String submissionId=learning.action(learner,submission).getString("id");
    for(int index=0;index<3;index++)learning.action(learner,mapper.createObjectNode().put("type","task").put("day",1).put("index",index).put("checked",true));
    var quiz=mapper.createObjectNode().put("type","quiz").put("day",1);
    var answers=quiz.putArray("answers");
    course.day(1).path("questions").forEach(question->answers.add(question.path("answer").asInt()));
    learning.action(learner,quiz);
    assertEquals(0,learning.summary(learner.id()).getInteger("completed"));

    pr.put("merged",true).put("state","closed");
    learning.review(learner.id(),1,submissionId,90,"Verified the merged submission",true,admin);
    var summary=learning.summary(learner.id());
    assertEquals(1,summary.getInteger("completed"));
    assertEquals(2,summary.getInteger("currentDay"));
    assertEquals(0,learning.summary("43").getInteger("completed"));
  }
  @Test void signedInGitHubTokenIsUsedOnlyForReads(){
    settings.githubToken="";
    var clients=mock(OAuth2AuthorizedClientService.class);
    var login=mock(OAuth2AuthenticationToken.class);
    var authorized=mock(OAuth2AuthorizedClient.class);
    var accessToken=new OAuth2AccessToken(OAuth2AccessToken.TokenType.BEARER,"test-token",null,null);
    when(login.isAuthenticated()).thenReturn(true);
    when(login.getAuthorizedClientRegistrationId()).thenReturn("github");
    when(login.getName()).thenReturn("42");
    when(clients.loadAuthorizedClient("github","42")).thenReturn(authorized);
    when(authorized.getAccessToken()).thenReturn(accessToken);
    var gateway=new GitHubGateway(settings,mapper,Optional.of(clients));
    try{
      SecurityContextHolder.getContext().setAuthentication(login);
      assertEquals("test-token",gateway.authorizationToken("GET"));
      assertEquals("",gateway.authorizationToken("POST"));
      verify(clients,times(1)).loadAuthorizedClient("github","42");
    }finally{
      SecurityContextHolder.clearContext();
    }
  }
}
