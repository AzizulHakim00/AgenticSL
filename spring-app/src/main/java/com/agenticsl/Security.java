package com.agenticsl;

import java.util.*;
import org.springframework.context.annotation.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.registration.*;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;

@Configuration
public class Security {
  @Bean
  @ConditionalOnExpression("!'${app.github-client-id:}'.isEmpty() && !'${app.github-client-secret:}'.isEmpty()")
  ClientRegistrationRepository clients(Settings s){
    var github=ClientRegistration.withRegistrationId("github").clientId(s.clientId).clientSecret(s.clientSecret)
      .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE).redirectUri(s.publicUrl+"/login/oauth2/code/github")
      .scope("read:user").authorizationUri("https://github.com/login/oauth/authorize")
      .tokenUri("https://github.com/login/oauth/access_token").userInfoUri("https://api.github.com/user")
      .userNameAttributeName("id").clientName("GitHub").build();
    return new InMemoryClientRegistrationRepository(github);
  }
  @Bean
  SecurityFilterChain filters(HttpSecurity http,Settings s,ObjectProvider<ClientRegistrationRepository> clients)throws Exception{
    http.authorizeHttpRequests(a->a
      .requestMatchers("/","/login","/demo","/css/**","/js/**","/api/demo/**","/actuator/health","/error","/oauth2/**","/login/**","/github/webhook").permitAll()
      .requestMatchers("/admin/**").hasRole("ADMIN").anyRequest().authenticated())
      .csrf(c->c.ignoringRequestMatchers("/github/webhook"))
      .logout(l->l.logoutSuccessUrl("/"))
      .exceptionHandling(e->e.authenticationEntryPoint((req,res,error)->{if(req.getRequestURI().startsWith("/api/")){res.setStatus(401);res.setContentType("application/json");res.getWriter().write("{\"error\":\"Sign in with GitHub to use your private workspace.\"}");}else res.sendRedirect("/login");}))
      .headers(h->h.contentSecurityPolicy(c->c.policyDirectives("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'")));
    if(clients.getIfAvailable()!=null)http.oauth2Login(o->o.loginPage("/login").defaultSuccessUrl("/dashboard",true).userInfoEndpoint(u->u.userService(request->{
      var user=new DefaultOAuth2UserService().loadUser(request);
      var id=String.valueOf(user.getAttribute("id"));
      Set<org.springframework.security.core.GrantedAuthority> roles=new HashSet<>(user.getAuthorities());roles.add(new SimpleGrantedAuthority(id.equals(s.adminId)?"ROLE_ADMIN":"ROLE_LEARNER"));
      return new DefaultOAuth2User(roles,user.getAttributes(),"id");
    })));
    return http.build();
  }
}
