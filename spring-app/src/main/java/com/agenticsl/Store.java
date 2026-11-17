package com.agenticsl;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.bson.Document;
import org.springframework.data.mongodb.core.*;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.data.domain.Sort;
import com.mongodb.client.MongoClients;
import org.springframework.stereotype.Component;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Component
public class Store {
  private final MongoTemplate mongo;
  private final Map<String,List<Document>> demos=new ConcurrentHashMap<>();
  private final Map<String,Instant> touched=new ConcurrentHashMap<>();
  public Store(Settings settings){mongo=settings.storageReady()?new MongoTemplate(MongoClients.create(settings.mongoUri),settings.mongoDatabase):null;}
  private void live(){if(mongo==null)throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"Persistent storage is not connected. Use the isolated demo meanwhile.");}
  public boolean databaseConfigured(){return mongo!=null;}
  public void ping(){live();mongo.executeCommand(new Document("ping",1));}
  public List<Document> records(String owner){
    if(owner.startsWith("demo:")){touched.put(owner,Instant.now());if(touched.size()>500){var cutoff=Instant.now().minusSeconds(7200);touched.forEach((k,v)->{if(v.isBefore(cutoff)){demos.remove(k);touched.remove(k);}});}return new ArrayList<>(demos.getOrDefault(owner,List.of()));}
    live();return mongo.find(Query.query(Criteria.where("ownerId").is(owner)).with(Sort.by("sequence")),Document.class,"learning_records");
  }
  public synchronized Document append(String owner,Document record){
    var id=record.getString("id");
    if(owner.startsWith("demo:")){
      var list=demos.computeIfAbsent(owner,k->new ArrayList<>());
      var found=list.stream().filter(e->id.equals(e.getString("id"))).findFirst();
      if(found.isPresent())return duplicate(found.get(),record);
      if(list.size()>=1000)throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,"Demo limit reached. Start a new browser session.");
      list.add(record);return record;
    }
    live();var key=owner+":"+id;var existing=mongo.findById(key,Document.class,"learning_records");
    if(existing!=null)return duplicate(existing,record);
    var counter=mongo.findAndModify(Query.query(Criteria.where("_id").is(owner)),new Update().inc("sequence",1),FindAndModifyOptions.options().upsert(true).returnNew(true),Document.class,"event_sequences");
    record.put("_id",key);record.put("ownerId",owner);record.put("sequence",counter.get("sequence"));
    try{mongo.insert(record,"learning_records");return record;}catch(org.springframework.dao.DuplicateKeyException ex){return duplicate(mongo.findById(key,Document.class,"learning_records"),record);}
  }
  private Document duplicate(Document old,Document next){
    if(!Objects.equals(old.get("kind"),next.get("kind"))||!Objects.equals(old.get("day"),next.get("day"))||!Objects.equals(old.get("payload"),next.get("payload")))throw new ResponseStatusException(HttpStatus.CONFLICT,"Request ID was already used for different content.");return old;
  }
  public Document enrollment(String owner){live();return mongo.findById(owner,Document.class,"enrollments");}
  public void saveEnrollment(Document doc){live();mongo.save(doc,"enrollments");}
  public List<Document> enrollments(){live();return mongo.find(new Query().with(Sort.by("requestedAt")),Document.class,"enrollments");}
}
