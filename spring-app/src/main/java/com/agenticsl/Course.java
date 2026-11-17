package com.agenticsl;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class Course {
  public final ArrayNode days;
  public final ArrayNode modules;
  public Course(ObjectMapper mapper)throws Exception{var root=mapper.readTree(new ClassPathResource("curriculum.json").getInputStream());days=(ArrayNode)root.get("curriculum");modules=(ArrayNode)root.get("modules");if(days.size()!=60)throw new IllegalStateException("Expected 60 lessons");}
  public ObjectNode day(int n){if(n<1||n>60)throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST,"Day must be 1 to 60.");return (ObjectNode)days.get(n-1);}
  public ArrayNode safeDays(){var copy=days.deepCopy();for(var d:copy)for(var q:d.get("questions")){((ObjectNode)q).remove("answer");((ObjectNode)q).remove("explanation");}return copy;}
}
