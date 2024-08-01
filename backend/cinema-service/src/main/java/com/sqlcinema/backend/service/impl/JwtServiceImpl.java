package com.sqlcinema.backend.service.impl;

import com.sqlcinema.backend.model.Role;
import com.sqlcinema.backend.model.UserAccount;
import com.sqlcinema.backend.repository.UserRepository;
import com.sqlcinema.backend.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import static com.sqlcinema.backend.common.Constants.JWT_SECRET;
import static com.sqlcinema.backend.common.Constants.ONE_WEEK_AS_MILLISECONDS;

@Service
public class JwtServiceImpl implements JwtService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public String extractRole(String token) {
        return extractClaim(token, Claims::getAudience);
    }

    @Override
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    @Override
    public UserAccount extractUserAccount(String token) {
        String username = extractUsername(token);
        return userRepository.findUserAccountByUsername(username);
    }

    @Override
    public String generateToken(UserAccount userAccount) {
        Role role = (Role) userAccount.getAuthorities().stream().findFirst().orElse(null);
        if (role == null) {
            throw new RuntimeException("Role not found");
        }

        return Jwts.builder()
                .setSubject(userAccount.getUsername())
                .setAudience(role.getAuthority())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + ONE_WEEK_AS_MILLISECONDS))
                .signWith(Keys.hmacShaKeyFor(JWT_SECRET.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public boolean validateToken(String token) {
        try {
            return extractExpiration(token).after(new Date()) && extractUsername(token) != null;
        } catch (Exception e) {
            return false;
        }
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        Key key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes());
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}
