package com.agenticsl;

import java.net.*;
import java.net.http.*;
import java.time.Duration;
import java.util.*;
import com.fasterxml.jackson.databind.*;
import org.bson.Document;
import org.springframework.stereotype.Component;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.server.ResponseStatusException;

@Component
public class GitHubGateway {
  private final Settings settings;private final ObjectMapper mapper;
  private final Optional<OAuth2AuthorizedClientService> authorizedClients;
  private final HttpClient client=HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(8)).followRedirects(HttpClient.Redirect.NEVER).build();
  public GitHubGateway(Settings settings,ObjectMapper mapper,Optional<OAuth2AuthorizedClientService> authorizedClients){
    this.settings=settings;
    this.mapper=mapper;
    this.authorizedClients=authorizedClients;
  }
  String authorizationToken(String method){
    if(!settings.githubToken.isBlank())return settings.githubToken;
    // Use the signed-in account for public reads. Branch creation still requires the configured repository token.
    if(!"GET".equals(method)||authorizedClients.isEmpty())return "";
    var authentication=SecurityContextHolder.getContext().getAuthentication();
    if(!(authentication instanceof OAuth2AuthenticationToken login)||!login.isAuthenticated()||!"github".equals(login.getAuthorizedClientRegistrationId()))return "";
    OAuth2AuthorizedClient authorized=authorizedClients.get().loadAuthorizedClient("github",login.getName());
    return authorized==null?"":authorized.getAccessToken().getTokenValue();
  }
  protected JsonNode api(String path,String method,Object body){
    if(!settings.repository.matches("[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+"))throw new IllegalStateException("Invalid official repository");
    try{
      var b=HttpRequest.newBuilder(URI.create("https://api.github.com/repos/"+settings.repository+path)).timeout(Duration.ofSeconds(15)).header("Accept","application/vnd.github+json").header("X-GitHub-Api-Version","2022-11-28").header("User-Agent","AgenticSL");
      var token=authorizationToken(method);
      if(!token.isBlank())b.header("Authorization","Bearer "+token);
      b.method(method,body==null?HttpRequest.BodyPublishers.noBody():HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)));
      var r=client.send(b.build(),HttpResponse.BodyHandlers.ofString());
      if(r.statusCode()==404)return mapper.createObjectNode().put("missing",true);
      if(r.statusCode()<200||r.statusCode()>=300)throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,"GitHub could not confirm this operation. Check repository access and rate limits.");
      return mapper.readTree(r.body());
    }catch(ResponseStatusException e){throw e;}catch(Exception e){throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,"GitHub is unavailable. Nothing has been marked verified.");}
  }
  public String prepareBranch(String login){
    if(!login.matches("[A-Za-z0-9-]{1,39}"))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid GitHub username");
    String branch="learners/"+login.toLowerCase(Locale.ROOT);
    if(!api("/git/ref/heads/"+branch,"GET",null).path("missing").asBoolean())return branch;
    if(settings.githubToken.isBlank())throw new ResponseStatusException(HttpStatus.CONFLICT,"Create branch "+branch+" from main in the official repository, then approve again. Automatic branch creation needs the optional repository token.");
    var main=api("/git/ref/heads/main","GET",null);var sha=main.path("object").path("sha").asText();
    if(sha.isBlank())throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,"Official main branch could not be read.");
    api("/git/refs","POST",Map.of("ref","refs/heads/"+branch,"sha",sha));return branch;
  }
  public Document pull(String url,String owner,String branch){
    final int number;
    try{var uri=URI.create(url);String prefix="/"+settings.repository+"/pull/";
      if(!"https".equals(uri.getScheme())||!"github.com".equals(uri.getHost())||uri.getPort()!=-1||uri.getUserInfo()!=null||uri.getQuery()!=null||uri.getFragment()!=null||!uri.getPath().startsWith(prefix))throw new IllegalArgumentException();
      number=Integer.parseInt(uri.getPath().substring(prefix.length()));if(number<1)throw new IllegalArgumentException();
    }catch(Exception ex){throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Use a pull request URL in the official repository.");}
    var p=api("/pulls/"+number,"GET",null);
    if(p.path("missing").asBoolean()||!owner.equals(p.path("user").path("id").asText())||!branch.equals(p.path("base").path("ref").asText())||!settings.repository.equalsIgnoreCase(p.path("base").path("repo").path("full_name").asText()))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"The PR must be yours and target your approved learner branch in the official repository.");
    var headRepository=p.path("head").path("repo");
    boolean personalFork=headRepository.path("fork").asBoolean()&&owner.equals(headRepository.path("owner").path("id").asText());
    boolean officialAdminBranch=owner.equals(settings.adminId)&&settings.repository.equalsIgnoreCase(headRepository.path("full_name").asText());
    if(!personalFork&&!officialAdminBranch)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Submit from a fork owned by your signed-in GitHub account.");
    return new Document("number",number).append("url",url).append("headSha",p.path("head").path("sha").asText()).append("merged",p.path("merged").asBoolean()).append("state",p.path("state").asText()).append("base",branch);
  }
}
