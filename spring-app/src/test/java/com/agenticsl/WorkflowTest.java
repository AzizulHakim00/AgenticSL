package com.agenticsl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.*;
import org.bson.Document;
import com.fasterxml.jackson.databind.*;
import java.util.*;
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
    var gateway=new GitHubGateway(settings,mapper){@Override protected JsonNode api(String path,String method,Object body){return mapper.createObjectNode();}};
    assertThrows(ResponseStatusException.class,()->gateway.pull("https://example.test/pull/1","42","learners/learner"));
    assertThrows(ResponseStatusException.class,()->gateway.pull("https://github.com/AzizulHakim00/AgenticSL/pull/1","42","learners/learner"));
  }
}
