package com.agenticsl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoRepositoriesAutoConfiguration;

@SpringBootApplication(exclude={MongoAutoConfiguration.class,MongoDataAutoConfiguration.class,MongoRepositoriesAutoConfiguration.class})
public class Application {
  public static void main(String[] args){SpringApplication.run(Application.class,args);}
}
