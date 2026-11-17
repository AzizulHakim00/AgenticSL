package com.agenticsl;

import java.util.*;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.Document;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;

@Controller
@RequestMapping("/admin")
public class Admin {
  private final Learning learning;private final Course course;private final Web web;
  public Admin(Learning l,Course c,Web w){learning=l;course=c;web=w;}
  @GetMapping String panel(Model m,HttpServletRequest request,Authentication auth){
    var who=web.actor(request,auth);var members=learning.enrollments();
    var reviews=new ArrayList<Document>();var owners=new ArrayList<Document>(members);if(owners.stream().noneMatch(x->who.id().equals(x.getString("_id"))))owners.add(new Document("_id",who.id()).append("login",who.login()));
    for(var member:owners){String id=member.getString("_id");var state=learning.summary(id);for(var day:(List<Document>)state.get("days")){var subs=(List<Document>)day.get("submissions");if(!subs.isEmpty()){var latest=subs.getLast();reviews.add(new Document("owner",id).append("login",member.getString("login")).append("day",day.get("day")).append("title",course.day(day.getInteger("day")).get("title").asText()).append("submission",latest).append("status",day.get("status")));}}}
    m.addAttribute("members",members);m.addAttribute("reviews",reviews);return "admin";
  }
  @PostMapping("/members/{id}/approve")String approve(@PathVariable String id){learning.approve(id);return "redirect:/admin";}
  @PostMapping("/members/{id}/reject")String reject(@PathVariable String id){learning.reject(id);return "redirect:/admin";}
  @PostMapping("/review")String review(@RequestParam String owner,@RequestParam int day,@RequestParam String submissionId,@RequestParam int score,@RequestParam String feedback,@RequestParam(defaultValue="false")boolean approved,HttpServletRequest request,Authentication auth){learning.review(owner,day,submissionId,score,feedback,approved,web.actor(request,auth));return "redirect:/admin";}
}
