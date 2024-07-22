package com.sqlcinema.backend.security.jwt;


import com.catchpoint.trace.api.invocation.InvocationAPI;
import com.sqlcinema.backend.model.UserAccount;
import com.sqlcinema.backend.service.JwtService;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.sqlcinema.backend.common.Constants.JWT_TOKEN_HEADER;
import static com.sqlcinema.backend.common.Constants.JWT_TOKEN_PREFIX;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @NonNull
    private final JwtService jwtService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        
        final String header = request.getHeader(JWT_TOKEN_HEADER);
        
        if (header == null || !header.startsWith(JWT_TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        final String token = header.replace(JWT_TOKEN_PREFIX, "");
        if (!jwtService.validateToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        final String username = jwtService.extractUsername(token);
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            final UserAccount userAccount = jwtService.extractUserAccount(token);
            if (userAccount == null) {
                filterChain.doFilter(request, response);
                return;
            }
            
            final UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userAccount, null, userAccount.getAuthorities());
            
            authentication.setDetails(userAccount);
            SecurityContextHolder.getContext().setAuthentication(authentication);   
        }

        InvocationAPI.setTag("username", username);
        filterChain.doFilter(request, response);
    }
}