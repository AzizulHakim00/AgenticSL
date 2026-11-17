package com.agenticsl;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.http.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@ControllerAdvice
public class Errors {
  @ExceptionHandler(ResponseStatusException.class)
  public Object expected(ResponseStatusException e,HttpServletRequest r){
    if(r.getRequestURI().startsWith("/api/"))return ResponseEntity.status(e.getStatusCode()).header("Cache-Control","no-store").body(Map.of("error",e.getReason()==null?"Request could not be completed":e.getReason()));
    var view=new ModelAndView("message");view.setStatus(e.getStatusCode());view.addObject("message",e.getReason());return view;
  }
  @ExceptionHandler(org.springframework.data.mongodb.UncategorizedMongoDbException.class)
  public Object database(Exception e,HttpServletRequest r){return expected(new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"The database could not be reached. Your work has not been reported as saved."),r);}
}
