package com.sqlcinema.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

@Configuration
@Order(1)
public class DatabaseConfiguration {
    
    @Value("${spring.datasource.driver-class-name}")
    private String driverName;
    
    @Value("${spring.datasource.url}")
    private String url;
    
    @Value("${spring.datasource.username}")
    private String username;
    
    @Value("${spring.datasource.password}")
    private String password;
    
    @Bean
    public JdbcTemplate jdbcTemplate() {
        DriverManagerDataSource managerDataSource = new DriverManagerDataSource();
        managerDataSource.setDriverClassName(driverName);
        managerDataSource.setUrl(url);
        managerDataSource.setUsername(username);
        managerDataSource.setPassword(password);
        return new JdbcTemplate(managerDataSource);
    }
}
