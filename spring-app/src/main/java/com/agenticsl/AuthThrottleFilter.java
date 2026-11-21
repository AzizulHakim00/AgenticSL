package com.agenticsl;

import java.io.IOException;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Small single-instance abuse guard for Render Free. Not a substitute for
 * an external rate limiter, email verification or bot protection at scale.
 */
public class AuthThrottleFilter extends OncePerRequestFilter {
  private record Window(long start,int requests){}
  private final ConcurrentHashMap<String,Window> windows=new ConcurrentHashMap<>();

  @Override
  protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)
      throws ServletException,IOException{
    String path=req.getServletPath();
    if(!"POST".equals(req.getMethod())||
        (!"/register".equals(path)&&!"/login/password".equals(path))){
      chain.doFilter(req,res);return;
    }
    final long now=Instant.now().getEpochSecond();
    final long seconds="/register".equals(path)?3600:600;
    final int limit="/register".equals(path)?4:20;
    String ip=req.getRemoteAddr()==null?"unknown":req.getRemoteAddr();
    String key=ip+":"+path;
    var current=windows.compute(key,(k,old)->old==null||now-old.start()>=seconds?
      new Window(now,1):new Window(old.start(),old.requests()+1));
    if(windows.size()>4000)
      windows.entrySet().removeIf(entry->now-entry.getValue().start()>3600);
    if(current.requests()>limit){
      res.setStatus(429);
      res.setContentType("text/plain;charset=UTF-8");
      res.setHeader("Retry-After",String.valueOf(Math.max(1,seconds-(now-current.start()))));
      res.getWriter().write("Too many sign-in or registration attempts. Please try again later.");
      return;
    }
    chain.doFilter(req,res);
  }
}
