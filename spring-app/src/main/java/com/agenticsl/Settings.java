package com.agenticsl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Settings {
  @Value("${app.public-url}") public String publicUrl;
  @Value("${app.admin-id}") public String adminId;
  @Value("${app.repository}") public String repository;
  @Value("${app.github-client-id}") public String clientId;
  @Value("${app.github-client-secret}") public String clientSecret;
  @Value("${app.github-token}") public String githubToken;
  @Value("${app.webhook-secret}") public String webhookSecret;
  @Value("${app.mongodb-uri}") public String mongoUri;
  @Value("${app.mongodb-database}") public String mongoDatabase;
  public boolean oauthReady(){return !clientId.isBlank()&&!clientSecret.isBlank();}
  public boolean storageReady(){return !mongoUri.isBlank();}
}
