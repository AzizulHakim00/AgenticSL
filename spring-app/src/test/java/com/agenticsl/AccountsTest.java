package com.agenticsl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import java.util.concurrent.atomic.AtomicReference;
import org.bson.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

class AccountsTest {
  Store store;
  Accounts accounts;
  @BeforeEach void init(){
    store=mock(Store.class);
    accounts=new Accounts(store,new BCryptPasswordEncoder(4));
  }
  @Test void localRegistrationHasStableIdAndStrongHashedPassword(){
    var captured=new AtomicReference<Document>();
    when(store.createAccount(any())).thenAnswer(c->{Document d=c.getArgument(0);captured.set(d);return d;});
    var created=accounts.register("learner_42","student@example.com","correct-horse-battery");
    assertTrue(created.getString("_id").startsWith("acct:"));
    assertEquals("learner_42",created.getString("username"));
    assertNotEquals("correct-horse-battery",created.getString("passwordHash"));
    assertFalse(created.getString("passwordHash").isBlank());
    assertFalse(created.getBoolean("emailVerified"));
    assertNull(created.getString("githubId"));
    verify(store).createAccount(any());
  }
  @Test void rejectsWeakPasswordAndInvalidUsername(){
    assertThrows(ResponseStatusException.class,
      ()->accounts.register("me","test@example.com","too-short"));
    assertThrows(ResponseStatusException.class,
      ()->accounts.register("hello","test@example.com","short"));
    verify(store,never()).createAccount(any());
  }
  @Test void googleSignupDoesNotAutomaticallyGrantGithubId(){
    when(store.createAccount(any())).thenAnswer(c->c.getArgument(0));
    var created=accounts.google("google-sub-1","learner@gmail.com","Learner Example",true);
    assertEquals("google-sub-1",created.getString("googleSub"));
    assertNull(created.getString("githubId"));
    assertTrue(created.getBoolean("emailVerified"));
    assertThrows(ResponseStatusException.class,
      ()->accounts.google("sub","fake@example.com","Fake",false));
  }
  @Test void githubLegacyIdIsPreserved(){
    when(store.createAccount(any())).thenAnswer(c->c.getArgument(0));
    var created=accounts.github("157488702","AzizulHakim00",null);
    assertEquals("157488702",created.getString("_id"));
    assertEquals("157488702",created.getString("githubId"));
    assertEquals("AzizulHakim00",created.getString("githubLogin"));
  }
  @Test void linksOnlyAuthenticatedGithubIdentityToAnExistingLearningAccount(){
    var target=new Document("_id","acct:existing").append("username","learner").append("usernameKey","learner");
    when(store.account("acct:existing")).thenReturn(target);
    var linked=accounts.github("42","learnerGithub","acct:existing");
    assertEquals("acct:existing",linked.getString("_id"));
    assertEquals("42",linked.getString("githubId"));
    verify(store).saveAccount(target);
    var other=new Document("_id","acct:another").append("githubId","42");
    when(store.accountBy("githubId","42")).thenReturn(other);
    assertThrows(ResponseStatusException.class,
      ()->accounts.github("42","learnerGithub","acct:existing"));
  }
}
