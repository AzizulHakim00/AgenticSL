package com.agenticsl;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.*;

@SpringBootTest(properties={"app.mongodb-uri=","app.github-client-id=","app.github-client-secret=","server.servlet.session.cookie.secure=false"})
@AutoConfigureMockMvc
class ProductTest {
  @Autowired MockMvc mvc;
  @Autowired ObjectMapper mapper;
  @Autowired Course course;
  @Test void academicCurriculumHas120Sessions16ModulesAnd240Questions(){assertEquals(120,course.days.size());assertEquals(16,course.modules.size());for(var d:course.safeDays()){assertEquals(3,d.path("objectives").size());assertEquals(2,d.path("questions").size());for(var q:d.path("questions"))assertFalse(q.has("answer"));}}
  @Test void advancedDaysAreSequentialAndHaveLongerLectures(){
    assertEquals("HTTP, REST & JSON",course.day(1).path("title").asText());
    assertEquals("Advanced",course.day(61).path("academicTrack").asText());
    assertEquals(16,course.day(120).path("module").asInt());
    for(int n=1;n<=120;n++){
      assertEquals(n,course.day(n).path("day").asInt());
      assertTrue(course.day(n).path("minutes").asInt()>=240);
      assertEquals(2,course.day(n).path("questions").size());
    }
  }
  @Test void homepageAndDemoRenderAsActualProduct()throws Exception{
    mvc.perform(get("/")).andExpect(status().isOk()).andExpect(content().string(org.hamcrest.Matchers.containsString("Your next skill")));
    mvc.perform(get("/demo")).andExpect(status().isOk()).andExpect(content().string(org.hamcrest.Matchers.containsString("Demo sandbox")));
    mvc.perform(get("/js/learning.js")).andExpect(status().isOk());
    mvc.perform(get("/js/academic-lessons.js")).andExpect(status().isOk());
    mvc.perform(get("/css/academic.css")).andExpect(status().isOk());
    mvc.perform(get("/js/visual-lectures.js")).andExpect(status().isOk());
    mvc.perform(get("/js/visual-lectures-data.js")).andExpect(status().isOk());
    mvc.perform(get("/js/visual-lectures-expanded.js")).andExpect(status().isOk());
    mvc.perform(get("/css/visual-lectures.css")).andExpect(status().isOk());
  }
  @Test void publicSignupAndPasswordLoginPagesAreAvailable()throws Exception{
    mvc.perform(get("/register")).andExpect(status().isOk())
      .andExpect(content().string(org.hamcrest.Matchers.containsString("Create free account")));
    mvc.perform(get("/login")).andExpect(status().isOk())
      .andExpect(content().string(org.hamcrest.Matchers.containsString("username")));
    mvc.perform(post("/register").param("username","learner").param("email","user@example.com")
      .param("password","a-very-long-passphrase")).andExpect(status().isForbidden());
  }
  @Test void freshDemoIsEmptyAndSessionsAreIsolated()throws Exception{
    var first=new MockHttpSession();var second=new MockHttpSession();
    mvc.perform(post("/api/demo/action").session(first).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"type\":\"task\",\"day\":1,\"index\":0,\"checked\":true,\"requestId\":\"test-request-0001\"}")).andExpect(status().isOk()).andExpect(jsonPath("$.state.days[0].tasks[0]").value(true));
    mvc.perform(get("/api/demo/state").session(second)).andExpect(status().isOk()).andExpect(jsonPath("$.state.days[0].tasks[0]").value(false)).andExpect(jsonPath("$.state.completed").value(0));
    mvc.perform(get("/api/demo/state").session(first)).andExpect(jsonPath("$.state.days[0].tasks[0]").value(true));
  }
  @Test void quizScoresAreComputedOnServer()throws Exception{
    var body=mapper.createObjectNode().put("type","quiz").put("day",1);var answers=body.putArray("answers");course.day(1).get("questions").forEach(q->answers.add(q.get("answer").asInt()));
    mvc.perform(post("/api/demo/action").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(body.toString())).andExpect(status().isOk()).andExpect(jsonPath("$.result.score").value(100)).andExpect(jsonPath("$.state.completed").value(0));
  }
  @Test void demoCannotApproveItsOwnWorkAndNeedsCsrf()throws Exception{
    mvc.perform(post("/api/demo/action").contentType(MediaType.APPLICATION_JSON).content("{\"type\":\"task\",\"day\":1,\"index\":0,\"checked\":true}")).andExpect(status().isForbidden());
    mvc.perform(post("/api/demo/action").with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"type\":\"review\",\"day\":1}")).andExpect(status().isForbidden());
  }
  @Test void privateRecordsAndAdminPanelRejectUnauthorizedCallers()throws Exception{
    mvc.perform(get("/api/state")).andExpect(status().isUnauthorized());
    mvc.perform(get("/admin").with(oauth2Login().attributes(a->{a.put("id",123);a.put("login","learner");}))).andExpect(status().isForbidden());
  }
  @Test void malformedActionsCannotSetScoresOrIndexOtherTasks()throws Exception{
    mvc.perform(post("/api/demo/action").with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"type\":\"task\",\"day\":1,\"index\":30,\"checked\":true}")).andExpect(status().isBadRequest());
    mvc.perform(post("/api/demo/action").with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"type\":\"quiz\",\"day\":121,\"answers\":[0,0]}")).andExpect(status().isBadRequest());
  }
  @Test void exportsContainOnlyCurrentDemoSession()throws Exception{
    mvc.perform(get("/api/demo/export")).andExpect(status().isOk()).andExpect(jsonPath("$.demo").value(true)).andExpect(jsonPath("$.records").isEmpty());
    mvc.perform(get("/api/demo/export?format=csv")).andExpect(status().isOk()).andExpect(header().string("Content-Disposition","attachment; filename=AgenticSL-progress.csv"));
  }
}
