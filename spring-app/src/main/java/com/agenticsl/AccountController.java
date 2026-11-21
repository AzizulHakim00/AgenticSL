package com.agenticsl;

import java.time.Instant;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class AccountController {
  private final Accounts accounts;
  private final Web web;
  private final Settings settings;

  public AccountController(Accounts accounts,Web web,Settings settings){
    this.accounts=accounts;this.web=web;this.settings=settings;
  }

  @GetMapping("/register")
  String registration(Model model){
    return "register";
  }

  @PostMapping("/register")
  String register(@RequestParam String username,@RequestParam String email,
                  @RequestParam String password,Model model){
    try{
      accounts.register(username,email,password);
      return "redirect:/login?registered";
    }catch(ResponseStatusException exception){
      model.addAttribute("error",exception.getReason());
      model.addAttribute("username",username);
      return "register";
    }
  }

  /** Verified GitHub OAuth link, not a self-reported username field. */
  @PostMapping("/account/github/connect")
  String connectGithub(HttpServletRequest request,Authentication authentication){
    if(!settings.oauthReady())throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"GitHub OAuth is not configured.");
    var actor=web.actor(request,authentication);
    if(actor.demo())throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Demo users cannot connect GitHub.");
    if(actor.githubId()!=null&&!actor.githubId().isBlank())
      return "redirect:/dashboard";
    request.getSession().setAttribute("GITHUB_LINK_USER",actor.id());
    request.getSession().setAttribute("GITHUB_LINK_TIME",Instant.now().getEpochSecond());
    return "redirect:/oauth2/authorization/github";
  }
}
