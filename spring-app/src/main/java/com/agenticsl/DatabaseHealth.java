package com.agenticsl;
import org.springframework.boot.actuate.health.*;
import org.springframework.stereotype.Component;

@Component
public class DatabaseHealth implements HealthIndicator {
  private final Store store;
  public DatabaseHealth(Store s){store=s;}
  public Health health(){if(!store.databaseConfigured())return Health.up().withDetail("mode","demo").build();try{store.ping();return Health.up().build();}catch(Exception error){return Health.down().build();}}
}
