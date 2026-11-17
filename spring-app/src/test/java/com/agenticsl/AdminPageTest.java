package com.agenticsl;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;

@SpringBootTest(properties={"app.mongodb-uri=","app.github-client-id=","app.github-client-secret="})
@AutoConfigureMockMvc
class AdminPageTest {
  @Autowired MockMvc mvc;
  @MockBean Store store;
  @Test void adminConsoleRendersWithNoFabricatedLearners()throws Exception{
    when(store.enrollments()).thenReturn(List.of());when(store.records(anyString())).thenReturn(List.of());
    mvc.perform(get("/admin").with(oauth2Login().attributes(a->{a.put("id",157488702);a.put("login","AzizulHakim00");}).authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
      .andExpect(status().isOk()).andExpect(content().string(org.hamcrest.Matchers.containsString("No participation requests yet.")));
  }
}
