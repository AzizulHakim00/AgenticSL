package com.agenticsl;

import java.time.Instant;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;
import org.bson.Document;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * The learning account is permanent; GitHub is an OPTIONAL verified contributor identity.
 * Never link identities by matching unverified email addresses.
 * Legacy GitHub logins retain their numeric account IDs and existing learning records.
 */
@Service
public class Accounts {
  private static final Pattern USERNAME=Pattern.compile("[A-Za-z][A-Za-z0-9_-]{2,29}");
  private static final Pattern EMAIL=Pattern.compile("^[^\\s@]{1,64}@[^\\s@]{1,190}$");
  private static final Pattern GITHUB_LOGIN=Pattern.compile("[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?");
  private final Store store;
  private final PasswordEncoder encoder;

  public Accounts(Store store,PasswordEncoder encoder){this.store=store;this.encoder=encoder;}

  public Document byId(String id){return store.account(id);}
  public Document byUsername(String username){return store.accountBy("usernameKey",username.trim().toLowerCase(Locale.ROOT));}
  public Document byGoogle(String sub){return store.accountBy("googleSub",sub);}
  public Document byGithub(String id){return store.accountBy("githubId",id);}

  public Document register(String username,String email,String password){
    username=username==null?"":username.trim();
    email=email==null?"":email.trim().toLowerCase(Locale.ROOT);
    if(!USERNAME.matcher(username).matches())throw bad("Username must be 3–30 letters, numbers, underscores or hyphens and start with a letter.");
    if(!EMAIL.matcher(email).matches())throw bad("Enter a valid email address.");
    if(password==null||password.length()<12||password.length()>128)throw bad("Use a password between 12 and 128 characters.");
    var account=new Document("_id","acct:"+UUID.randomUUID()).append("username",username)
      .append("usernameKey",username.toLowerCase(Locale.ROOT)).append("email",email)
      .append("passwordHash",encoder.encode(password)).append("emailVerified",false)
      .append("createdAt",Instant.now().toString()).append("method","password");
    try{return store.createAccount(account);}
    catch(DuplicateKeyException e){throw new ResponseStatusException(HttpStatus.CONFLICT,"Username is already taken.");}
  }

  public Document google(String sub,String email,String name,boolean verified){
    if(sub==null||sub.isBlank()||!verified)throw new ResponseStatusException(HttpStatus.FORBIDDEN,"A verified Google account is required.");
    var existing=byGoogle(sub);
    if(existing!=null)return existing;
    String preferred=(name==null?"learner":name).toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9_-]","")
      .replaceAll("^([^a-z]).*","learner");
    if(preferred.length()<3)preferred="learner";
    if(preferred.length()>19)preferred=preferred.substring(0,19);
    String username=preferred+"-"+UUID.randomUUID().toString().substring(0,8);
    var doc=new Document("_id","acct:"+UUID.randomUUID()).append("username",username)
      .append("usernameKey",username.toLowerCase(Locale.ROOT))
      .append("googleSub",sub).append("email",email==null?"":email.toLowerCase(Locale.ROOT))
      .append("emailVerified",true).append("createdAt",Instant.now().toString()).append("method","google");
    try{return store.createAccount(doc);}
    catch(DuplicateKeyException e){
      var after=byGoogle(sub);
      if(after!=null)return after;
      throw new ResponseStatusException(HttpStatus.CONFLICT,"Account creation conflict. Please retry.");
    }
  }

  public Document github(String id,String login,String linkingAccountId){
    if(id==null||!id.matches("[0-9]{1,30}")||login==null||!GITHUB_LOGIN.matcher(login).matches())
      throw bad("GitHub did not return a valid verified identity.");
    var linked=byGithub(id);
    if(linkingAccountId!=null){
      var target=byId(linkingAccountId);
      if(target==null)throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Your original login session has expired. Sign in again.");
      if(linked!=null&&!linked.getString("_id").equals(linkingAccountId))
        throw new ResponseStatusException(HttpStatus.CONFLICT,"This GitHub identity is already connected to another learning account.");
      if(target.getString("githubId")!=null&&!id.equals(target.getString("githubId")))
        throw new ResponseStatusException(HttpStatus.CONFLICT,"Unlink your existing GitHub account before connecting another.");
      if((store.account(id)!=null&&!id.equals(linkingAccountId)) ||
          (store.records(id)!=null&&!store.records(id).isEmpty()) || store.enrollment(id)!=null)
        throw new ResponseStatusException(HttpStatus.CONFLICT,"An existing GitHub learning profile needs administrator reconciliation before linking. Your previous records will not be overwritten.");
      target.put("githubId",id);
      target.put("githubLogin",login);
      try{store.saveAccount(target);}catch(DuplicateKeyException e){
        throw new ResponseStatusException(HttpStatus.CONFLICT,"This GitHub identity is already linked.");
      }
      return target;
    }
    if(linked!=null){
      if(!login.equals(linked.getString("githubLogin"))){
        linked.put("githubLogin",login);
        store.saveAccount(linked);
      }
      return linked;
    }
    // Preserve the GitHub numeric ID used by the original application for progress.
    String username=login;
    if(byUsername(username)!=null)username=login.substring(0,Math.min(login.length(),19))+"-"+UUID.randomUUID().toString().substring(0,8);
    var doc=new Document("_id",id).append("username",username)
      .append("usernameKey",username.toLowerCase(Locale.ROOT))
      .append("githubId",id).append("githubLogin",login)
      .append("createdAt",Instant.now().toString()).append("method","github");
    try{return store.createAccount(doc);}
    catch(DuplicateKeyException e){
      var after=byGithub(id);
      if(after!=null)return after;
      throw new ResponseStatusException(HttpStatus.CONFLICT,"GitHub identity conflict.");
    }
  }

  private static ResponseStatusException bad(String reason){
    return new ResponseStatusException(HttpStatus.BAD_REQUEST,reason);
  }
}
