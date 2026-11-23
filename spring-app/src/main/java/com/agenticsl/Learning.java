package com.agenticsl;

import java.time.*;
import java.util.*;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.core.type.TypeReference;

@Service
public class Learning {
  public record Actor(String id,String login,boolean admin,boolean demo,String githubId,String githubLogin){
    public Actor(String id,String login,boolean admin,boolean demo){this(id,login,admin,demo,id.matches("[0-9]+")?id:null,login);}
  }
  private final Course course;private final Store store;private final GitHubGateway github;private final Settings settings;private final ObjectMapper mapper;
  public Learning(Course c,Store s,GitHubGateway g,Settings p,ObjectMapper m){course=c;store=s;github=g;settings=p;mapper=m;}
  static void need(boolean ok,String message){if(!ok)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,message);}
  private static int integer(JsonNode n,String name,int min,int max){need(n.has(name)&&n.get(name).isIntegralNumber()&&n.get(name).canConvertToInt(),name+" must be an integer");int v=n.get(name).intValue();need(v>=min&&v<=max,name+" is out of range");return v;}
  private static String text(JsonNode n,String name,int max){String v=n.path(name).asText("").trim();need(!v.isBlank()&&v.length()<=max,name+" is required (maximum "+max+" characters)");return v;}
  public Document membership(Actor a){
    if(a.demo())return new Document("status","DEMO").append("branch","demo/session");
    if(a.admin())return new Document("status","APPROVED").append("branch","learners/"+a.githubLogin().toLowerCase(Locale.ROOT));
    var e=store.enrollment(a.id());
    if(e!=null)return e;
    return new Document("status",a.githubId()==null?"NOT_LINKED":"NOT_REQUESTED");
  }
  public void requestAccess(Actor a){need(!a.demo(),"Demo accounts cannot enrol");need(a.githubId()!=null&&!a.githubId().isBlank(),"Connect and verify your GitHub account before requesting repository access.");var existing=store.enrollment(a.id());if(existing!=null&&List.of("PENDING","APPROVED").contains(existing.getString("status")))return;store.saveEnrollment(new Document("_id",a.id()).append("login",a.githubLogin()).append("githubId",a.githubId()).append("displayName",a.login()).append("status","PENDING").append("requestedAt",Instant.now().toString()));}
  public void approve(String id){var e=store.enrollment(id);need(e!=null,"Unknown participation request");var branch=github.prepareBranch(e.getString("login"));e.put("branch",branch);e.put("status","APPROVED");e.put("approvedAt",Instant.now().toString());store.saveEnrollment(e);}
  public void reject(String id){var e=store.enrollment(id);need(e!=null,"Unknown participation request");e.put("status","REJECTED");store.saveEnrollment(e);}
  public List<Document> enrollments(){return store.enrollments();}
  public Document action(Actor a,JsonNode input){
    need(input.isObject(),"An action object is required");var type=text(input,"type",30);
    // Daily learning, quizzes, study logs and skills are available immediately after signup.
    // GitHub verification and admin approval gate only code-PR submissions.
    if("submission".equals(type)&&!a.demo()&&!a.admin()&&!"APPROVED".equals(membership(a).getString("status")))
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Connect GitHub and receive admin approval before submitting a pull request.");
    int day=List.of("reflection","skill").contains(type)?0:integer(input,"day",1,course.dayCount());Document p=new Document();
    switch(type){
      case "task"->{p.put("index",integer(input,"index",0,2));need(input.path("checked").isBoolean(),"checked must be boolean");p.put("checked",input.get("checked").booleanValue());}
      case "study"->{p.put("minutes",integer(input,"minutes",1,720));p.put("confidence",integer(input,"confidence",1,5));need(input.path("notes").asText("").length()<=12000,"Notes are too long");p.put("notes",input.path("notes").asText(""));}
      case "skill"->{p.put("module",integer(input,"module",1,course.moduleCount()));p.put("baseline",integer(input,"baseline",0,5));p.put("current",integer(input,"current",0,5));p.put("target",integer(input,"target",1,5));}
      case "reflection"->{p.put("week",integer(input,"week",1,course.weekCount()));for(String key:List.of("wins","blockers","next"))p.put(key,text(input,key,12000));}
      case "quiz"->{var answers=input.path("answers");need(answers.isArray()&&answers.size()==2,"Answer both quiz questions");int correct=0;var results=new ArrayList<Document>();for(int i=0;i<2;i++){need(answers.get(i).isIntegralNumber()&&answers.get(i).asInt()>=0&&answers.get(i).asInt()<4,"Invalid quiz choice");var q=course.day(day).get("questions").get(i);boolean ok=answers.get(i).asInt()==q.get("answer").asInt();if(ok)correct++;results.add(new Document("correct",ok).append("answer",q.get("answer").asInt()).append("explanation",q.get("explanation").asText()));}p.put("score",correct*50);p.put("answers",mapper.convertValue(answers,List.class));p.put("results",results);}
      case "submission"->{p.put("answer",text(input,"answer",12000));p.put("evidence",text(input,"evidence",20000));var url=text(input,"evidenceUrl",2000);p.put("evidenceUrl",url);if(a.demo()){need(url.startsWith("https://github.com/"),"Use an HTTPS GitHub PR URL");p.put("pr",new Document("url",url).append("headSha","demo-only").append("merged",false).append("number",0));}else p.put("pr",github.pull(url,a.githubId(),membership(a).getString("branch")));}
      case "review","approval"->{throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Only the admin can evaluate and approve submissions in the admin review panel.");}
      default->throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Unknown action");
    }
    var requestId=input.path("requestId").asText(UUID.randomUUID().toString());need(requestId.matches("[A-Za-z0-9_-]{8,100}"),"Invalid request ID");
    var event=new Document("id",requestId).append("kind",type).append("day",day).append("payload",p).append("actor",a.id()).append("created_at",Instant.now().toString());
    return store.append(a.id(),event);
  }
  public void review(String owner,int day,String submissionId,int score,String feedback,boolean approved,Actor admin){
    if(!admin.admin()||admin.demo())throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Admin review is required");
    need(score>=0&&score<=100,"Score must be 0 to 100");need(!feedback.isBlank()&&feedback.length()<=12000,"Feedback is required");
    var all=store.records(owner);var latest=all.stream().filter(e->"submission".equals(e.getString("kind"))&&e.getInteger("day")==day).reduce((a,b)->b).orElseThrow(()->new ResponseStatusException(HttpStatus.CONFLICT,"Submission no longer exists"));
    need(submissionId.equals(latest.getString("id")),"Review only the latest submission");
    var payload=latest.get("payload",Document.class);var original=payload.get("pr",Document.class);var enrollment=store.enrollment(owner);
    String branch=owner.equals(admin.id())?"learners/"+admin.githubLogin().toLowerCase(Locale.ROOT):enrollment==null?"":enrollment.getString("branch");
    String githubId=owner.equals(admin.id())?admin.githubId():enrollment==null?null:enrollment.getString("githubId");
    if(githubId==null&&owner.matches("[0-9]+"))githubId=owner; // legacy GitHub account
    need(githubId!=null&&!githubId.isBlank(),"Verified GitHub identity is missing.");
    var current=github.pull(payload.getString("evidenceUrl"),githubId,branch);
    boolean unchanged=Objects.equals(current.get("headSha"),original.get("headSha"));
    if(approved)need(score>=70&&Boolean.TRUE.equals(current.getBoolean("merged"))&&unchanged,"Final approval requires a passing score and a merged PR whose current commit matches the submitted evidence. Resubmit if its commit changed.");
    var p=new Document("submissionId",submissionId).append("score",score).append("feedback",feedback).append("approved",approved).append("reviewer",admin.login()).append("pr",current);
    store.append(owner,new Document("id",UUID.randomUUID().toString()).append("kind","review").append("day",day).append("payload",p).append("actor",admin.id()).append("created_at",Instant.now().toString()));
  }
  @SuppressWarnings("unchecked")
  public Document summary(String owner){
    var events=store.records(owner);var days=new ArrayList<Document>();var reflections=new ArrayList<Object>();var skills=new ArrayList<Document>();
    for(int i=1;i<=course.moduleCount();i++)skills.add(new Document("module",i).append("name",course.modules.get(i-1).get("name").asText()).append("baseline",0).append("current",0).append("target",4));
    for(int n=1;n<=course.dayCount();n++)days.add(new Document("day",n).append("tasks",new ArrayList<>(List.of(false,false,false))).append("submissions",new ArrayList<Document>()).append("attempts",new ArrayList<Document>()).append("minutes",0).append("confidence",null).append("notes","").append("review",null).append("approval",null));
    for(var e:events){var p=new Document((Map<String,Object>)e.get("payload"));String kind=e.getString("kind");p.put("id",e.getString("id"));p.put("at",e.getString("created_at"));
      if(kind.equals("reflection")){reflections.add(p);continue;}if(kind.equals("skill")){skills.get(p.getInteger("module")-1).putAll(p);continue;}
      int n=e.getInteger("day");if(n<1||n>course.dayCount())continue;var d=days.get(n-1);
      switch(kind){case "task"->((List<Boolean>)d.get("tasks")).set(p.getInteger("index"),p.getBoolean("checked"));case "submission"->((List<Document>)d.get("submissions")).add(p);case "quiz"->((List<Document>)d.get("attempts")).add(p);case "study"->{d.put("minutes",d.getInteger("minutes")+p.getInteger("minutes"));d.put("confidence",p.get("confidence"));d.put("notes",p.get("notes"));}case "review"->d.put("review",p);default->{}}
    }
    int completed=0,minutes=0,current=course.dayCount();var allScores=new ArrayList<Integer>();var weak=new ArrayList<Document>();
    for(var d:days){var attempts=(List<Document>)d.get("attempts");var subs=(List<Document>)d.get("submissions");Integer best=attempts.stream().map(x->x.getInteger("score")).max(Integer::compare).orElse(null);d.put("quizBest",best);attempts.forEach(x->allScores.add(x.getInteger("score")));var latest=subs.isEmpty()?null:subs.getLast();var review=(Document)d.get("review");if(review!=null&&(latest==null||!review.getString("submissionId").equals(latest.getString("id"))))review=null;d.put("review",review);boolean accepted=review!=null&&Boolean.TRUE.equals(review.getBoolean("approved"));d.put("approval",accepted?new Document("approved",true):null);
      boolean tasks=((List<Boolean>)d.get("tasks")).stream().allMatch(Boolean::booleanValue);String status=tasks&&best!=null&&best>=70&&accepted?"completed":latest!=null?(review!=null&&review.getInteger("score")<70?"needs_revision":accepted?"in_progress":"awaiting_review"):((List<Boolean>)d.get("tasks")).contains(true)||best!=null||d.getInteger("minutes")>0?"in_progress":"not_started";
      d.put("status",status);if(status.equals("completed"))completed++;minutes+=d.getInteger("minutes");if(best!=null&&best<70)weak.add(new Document("day",d.getInteger("day")).append("title",course.day(d.getInteger("day")).path("title").asText()).append("score",best));
    }
    current=days.stream().filter(d->!"completed".equals(d.getString("status"))).map(d->d.getInteger("day")).findFirst().orElse(course.dayCount());
    var modules=new ArrayList<Document>();for(var m:course.modules){var doc=mapper.convertValue(m,Document.class);int start=m.get("start").asInt(),end=m.get("end").asInt();doc.put("total",end-start+1);doc.put("completed",(int)days.stream().filter(d->d.getInteger("day")>=start&&d.getInteger("day")<=end&&d.getString("status").equals("completed")).count());modules.add(doc);}
    var activity=new ArrayList<Document>();for(int i=events.size()-1;i>=Math.max(0,events.size()-12);i--){var e=events.get(i);activity.add(new Document("kind",e.get("kind")).append("day",e.get("day")).append("at",e.get("created_at")));}
    var dates=new HashSet<LocalDate>();for(var e:events)dates.add(Instant.parse(e.getString("created_at")).atZone(ZoneId.of("Asia/Dhaka")).toLocalDate());var today=LocalDate.now(ZoneId.of("Asia/Dhaka"));if(!dates.contains(today))today=today.minusDays(1);int streak=0;while(dates.contains(today)){streak++;today=today.minusDays(1);}
    return new Document("days",days).append("modules",modules).append("skills",skills).append("reflections",reflections).append("completed",completed).append("percent",Math.round(completed/(double)course.dayCount()*100)).append("minutes",minutes).append("quizAverage",allScores.isEmpty()?null:Math.round(allScores.stream().mapToInt(Integer::intValue).average().orElse(0))).append("currentDay",current).append("streak",streak).append("activity",activity).append("weakAreas",weak).append("updatedAt",events.isEmpty()?null:events.getLast().getString("created_at"));
  }
  public List<Document> records(String id){return store.records(id);}
}
