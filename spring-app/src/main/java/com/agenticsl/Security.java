package com.agenticsl;

import java.time.Instant;
import java.util.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.*;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class Security {
  @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder(12);}

  @Bean
  UserDetailsService localUsers(Accounts accounts){
    return username->{
      var doc=accounts.byUsername(username);
      if(doc==null||doc.getString("passwordHash")==null)throw new UsernameNotFoundException("Invalid credentials");
      return User.withUsername(doc.getString("username"))
        .password(doc.getString("passwordHash")).authorities("ROLE_LEARNER").build();
    };
  }

  @Bean
  @ConditionalOnExpression("(!'${app.github-client-id:}'.isEmpty() && !'${app.github-client-secret:}'.isEmpty()) || (!'${app.google-client-id:}'.isEmpty() && !'${app.google-client-secret:}'.isEmpty())")
  ClientRegistrationRepository clients(Settings s){
    var providers=new ArrayList<ClientRegistration>();
    if(s.oauthReady()){
      providers.add(ClientRegistration.withRegistrationId("github")
        .clientId(s.clientId).clientSecret(s.clientSecret)
        .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
        .redirectUri(s.publicUrl+"/login/oauth2/code/github")
        .scope("read:user").authorizationUri("https://github.com/login/oauth/authorize")
        .tokenUri("https://github.com/login/oauth/access_token")
        .userInfoUri("https://api.github.com/user")
        .userNameAttributeName("id").clientName("GitHub").build());
    }
    if(s.googleReady()){
      providers.add(CommonOAuth2Provider.GOOGLE.getBuilder("google")
        .clientId(s.googleClientId).clientSecret(s.googleClientSecret)
        .redirectUri(s.publicUrl+"/login/oauth2/code/google")
        .scope("openid","email","profile").build());
    }
    return new InMemoryClientRegistrationRepository(providers);
  }

  @Bean
  SecurityFilterChain filters(HttpSecurity http,Settings s,
      ObjectProvider<ClientRegistrationRepository> clients,Accounts accounts)throws Exception {
    http.authorizeHttpRequests(a->a
      .requestMatchers("/","/login","/register","/demo","/css/**","/js/**","/api/demo/**",
        "/actuator/health","/error","/oauth2/**","/login/**","/github/webhook").permitAll()
      .requestMatchers("/admin/**").hasRole("ADMIN")
      .anyRequest().authenticated())
      .csrf(c->c.ignoringRequestMatchers("/github/webhook"))
      .logout(l->l.logoutSuccessUrl("/"))
      .formLogin(f->f.loginPage("/login").loginProcessingUrl("/login/password")
        .usernameParameter("username").passwordParameter("password")
        .defaultSuccessUrl("/dashboard",true).failureUrl("/login?error"))
      .exceptionHandling(e->e.authenticationEntryPoint((req,res,error)->{
        if(req.getRequestURI().startsWith("/api/")){
          res.setStatus(401);res.setContentType("application/json");
          res.getWriter().write("{\"error\":\"Sign in to access your private learning workspace.\"}");
        }else res.sendRedirect("/login");
      }))
      .headers(h->h.contentSecurityPolicy(c->c.policyDirectives(
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'")));

    if(clients.getIfAvailable()!=null)http.oauth2Login(o->o
      .loginPage("/login").defaultSuccessUrl("/dashboard",true)
      .userInfoEndpoint(u->u
        .userService(request->{
          var upstream=new DefaultOAuth2UserService().loadUser(request);
          if(!"github".equals(request.getClientRegistration().getRegistrationId()))return upstream;
          String githubId=String.valueOf(upstream.getAttributes().get("id"));
          String githubLogin=String.valueOf(upstream.getAttributes().get("login"));
          var attrs=(ServletRequestAttributes)RequestContextHolder.currentRequestAttributes();
          HttpSession session=attrs.getRequest().getSession(false);
          String target=null;
          if(session!=null&&session.getAttribute("GITHUB_LINK_USER") instanceof String value){
            Object started=session.getAttribute("GITHUB_LINK_TIME");
            session.removeAttribute("GITHUB_LINK_USER");
            session.removeAttribute("GITHUB_LINK_TIME");
            if(!(started instanceof Long)||Instant.now().getEpochSecond()-(Long)started>600L)
              throw new OAuth2AuthenticationException("GitHub account linking expired. Restart from your profile.");
            if(githubId.equals(s.adminId))throw new OAuth2AuthenticationException("The administrator GitHub identity cannot be linked to a different learning account.");
            target=value;
          }
          var account=accounts.github(githubId,githubLogin,target);
          var attributes=new HashMap<String,Object>(upstream.getAttributes());
          attributes.put("id",account.getString("_id"));
          attributes.put("login",account.getString("username"));
          attributes.put("githubId",githubId);
          attributes.put("githubLogin",githubLogin);
          Set<GrantedAuthority> authorities=new HashSet<>(upstream.getAuthorities());
          authorities.add(new SimpleGrantedAuthority(
            githubId.equals(s.adminId)&&target==null?"ROLE_ADMIN":"ROLE_LEARNER"));
          return new DefaultOAuth2User(authorities,attributes,"id");
        })
        .oidcUserService(request->{
          var user=new OidcUserService().loadUser(request);
          accounts.google(user.getSubject(),user.getEmail(),user.getFullName(),
            Boolean.TRUE.equals(user.getClaims().get("email_verified")));
          return user;
        })));
    return http.build();
  }
}
