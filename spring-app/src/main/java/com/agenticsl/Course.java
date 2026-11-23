package com.agenticsl;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** Sequential, backward-compatible academic curriculum. Days 1–60 keep their original IDs. */
@Component
public class Course {
  public final ArrayNode days;
  public final ArrayNode modules;
  public Course(ObjectMapper mapper)throws Exception{
    var base=mapper.readTree(new ClassPathResource("curriculum.json").getInputStream());
    var advanced=mapper.readTree(new ClassPathResource("advanced-curriculum.json").getInputStream());
    days=mapper.createArrayNode();
    modules=mapper.createArrayNode();
    base.get("modules").forEach(modules::add);
    advanced.get("modules").forEach(modules::add);
    base.get("curriculum").forEach(days::add);
    advanced.get("curriculum").forEach(days::add);
    if(base.get("curriculum").size()!=60||days.size()!=120||modules.size()!=16)
      throw new IllegalStateException("Academic course must have 60 foundation and 60 advanced lessons in 16 modules.");
    for(int i=0;i<days.size();i++){
      var lesson=(ObjectNode)days.get(i);
      if(lesson.path("day").asInt()!=i+1||lesson.path("module").asInt()<1||
         lesson.path("module").asInt()>modules.size()||lesson.path("questions").size()!=2||
         lesson.path("objectives").size()!=3)
        throw new IllegalStateException("Invalid academic lesson at day "+(i+1));
      // Minimum four guided hours: lecture, illustration, coding lab, checking and review.
      lesson.put("minutes",Math.max(240,lesson.path("minutes").asInt(240)));
      lesson.put("academicTrack",i<60?"Foundation":"Advanced");
    }
    for(int i=0;i<modules.size();i++){
      var mod=modules.get(i);
      if(mod.path("id").asInt()!=i+1)
        throw new IllegalStateException("Module numbering is not sequential");
      int start=mod.path("start").asInt(),end=mod.path("end").asInt();
      if(start<1||end>days.size()||start>end)throw new IllegalStateException("Invalid module range");
      for(int day=start;day<=end;day++)
        if(days.get(day-1).path("module").asInt()!=i+1)
          throw new IllegalStateException("Module/day mismatch for day "+day);
    }
  }
  public int dayCount(){return days.size();}
  public int moduleCount(){return modules.size();}
  public int weekCount(){return (dayCount()+6)/7;}
  public ObjectNode day(int n){
    if(n<1||n>dayCount())
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Day must be between 1 and "+dayCount()+".");
    return (ObjectNode)days.get(n-1);
  }
  public ArrayNode safeDays(){
    var copy=days.deepCopy();
    for(var d:copy)for(var q:d.get("questions")){
      ((ObjectNode)q).remove("answer");
      ((ObjectNode)q).remove("explanation");
    }
    return copy;
  }
}
