package com.agenticsl;

import java.util.*;
import java.time.Instant;
import jakarta.servlet.http.*;
import com.fasterxml.jackson.databind.*;
import org.bson.Document;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class Web {
  private final Learning learning;private final Course course;private final Settings settings;private final Accounts accounts;
  public Web(Learning l,Course c,Settings s,Accounts accounts){learning=l;course=c;settings=s;this.accounts=accounts;}
  Learning.Actor actor(HttpServletRequest request,Authentication authentication){
    if(request.getRequestURI().startsWith("/api/demo")||request.getRequestURI().equals("/demo"))
      return new Learning.Actor("demo:"+request.getSession().getId(),"Demo learner",false,true);
    if(authentication==null||!authentication.isAuthenticated())
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Sign in to your learning account.");
    org.bson.Document account=null;
    String legacyId=null,legacyLogin=null;
    if(authentication.getPrincipal() instanceof OAuth2User user){
      if(authentication instanceof OAuth2AuthenticationToken oauth && "google".equals(oauth.getAuthorizedClientRegistrationId())){
        String sub=String.valueOf(user.getAttributes().get("sub"));
        if(settings.storageReady())account=accounts.byGoogle(sub);
      }else{
        legacyId=String.valueOf(user.getAttributes().get("id"));
        legacyLogin=String.valueOf(user.getAttributes().get("login"));
        if(settings.storageReady())account=accounts.byId(legacyId);
      }
    }else if(authentication.getPrincipal() instanceof UserDetails user){
      if(settings.storageReady())account=accounts.byUsername(user.getUsername());
    }
    boolean administrator=authentication.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_ADMIN"));
    if(account==null){
      // Only support pre-existing Spring Security test actors when database is off.
      if(!settings.storageReady()&&legacyId!=null)
        return new Learning.Actor(legacyId,legacyLogin,administrator,false);
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Your account could not be resolved.");
    }
    String id=account.getString("_id"), username=account.getString("username");
    String githubId=account.getString("githubId"), githubLogin=account.getString("githubLogin");
    return new Learning.Actor(id,username,administrator,false,githubId,githubLogin);
  }
  @GetMapping("/")String home(Model m,Authentication a){m.addAttribute("modules",course.modules);m.addAttribute("oauthReady",settings.oauthReady());m.addAttribute("googleReady",settings.googleReady());m.addAttribute("signedIn",a!=null);return "home";}
  @GetMapping("/login")String login(Model m){m.addAttribute("oauthReady",settings.oauthReady());m.addAttribute("googleReady",settings.googleReady());return "login";}
  @GetMapping({"/demo","/dashboard"})String dashboard(Model m,HttpServletRequest r,Authentication a){var who=actor(r,a);m.addAttribute("demo",who.demo());m.addAttribute("login",who.login());m.addAttribute("admin",who.admin());return "dashboard";}
  @ResponseBody
  @GetMapping({"/api/state","/api/demo/state"})Document state(HttpServletRequest r,Authentication a){var who=actor(r,a);return new Document("hosting","spring").append("curriculum",course.safeDays()).append("modules",course.modules).append("state",learning.summary(who.id())).append("viewer",new Document("id",who.id()).append("login",who.login()).append("admin",who.admin()).append("demo",who.demo()).append("githubConnected",who.githubId()!=null&&!who.githubId().isBlank()).append("githubLogin",who.githubLogin())).append("enrollment",learning.membership(who)).append("repository",settings.repository);}
  @ResponseBody
  @PostMapping({"/api/action","/api/demo/action"})Document action(@RequestBody JsonNode input,HttpServletRequest r,Authentication a){if(input.toString().length()>150000)throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE,"Submission is too large");var who=actor(r,a);var saved=learning.action(who,input);return new Document("id",saved.get("id")).append("result",saved.get("payload")).append("state",learning.summary(who.id()));}
  @ResponseBody
  @PostMapping("/api/enrollment")Document request(HttpServletRequest r,Authentication a){var who=actor(r,a);learning.requestAccess(who);return new Document("status","PENDING");}
  @ResponseBody
  @GetMapping({"/api/export","/api/demo/export"})ResponseEntity<?> export(@RequestParam(defaultValue="json")String format,HttpServletRequest r,Authentication a){var who=actor(r,a);var state=learning.summary(who.id());
    if(format.equals("csv")){var out=new StringBuilder("Day,Lesson,Status,Objectives,Quiz best,Study minutes\r\n");for(var d:(List<Document>)state.get("days")){out.append(d.get("day")).append(',').append(csv(course.day(d.getInteger("day")).get("title").asText())).append(',').append(csv(d.getString("status"))).append(',').append(((List<Boolean>)d.get("tasks")).stream().filter(Boolean::booleanValue).count()).append(',').append(d.get("quizBest")==null?"":d.get("quizBest")).append(',').append(d.get("minutes")).append("\r\n");}return ResponseEntity.ok().header("Cache-Control","no-store").header("Content-Disposition","attachment; filename=AgenticSL-progress.csv").contentType(MediaType.parseMediaType("text/csv; charset=utf-8")).body(out.toString());}
    return ResponseEntity.ok().header("Cache-Control","no-store").header("Content-Disposition","attachment; filename=AgenticSL-learning-records.json").body(new Document("app","AgenticSL").append("version",2).append("demo",who.demo()).append("exportedAt",Instant.now().toString()).append("records",learning.records(who.id())).append("state",state));
  }
  static String csv(String value){if(value.matches("^[=+@\\-\\t\\r].*"))value="'"+value;return '"'+value.replace("\"","\"\"")+'"';}
}
