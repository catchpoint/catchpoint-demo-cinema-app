package com.sqlcinema.backend.repository;

import com.sqlcinema.backend.common.CustomLogger;
import com.sqlcinema.backend.model.activity.Activity;
import com.sqlcinema.backend.model.activity.ActivityType;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

import static com.sqlcinema.backend.common.Constants.createObjectArray;

@AllArgsConstructor
@Repository
public class ActivityRepository {

    private final JdbcTemplate jdbcTemplate;
    private final CustomLogger customLogger;

    public void addActivity(int userId, ActivityType type, String message) {
        try {
            jdbcTemplate.update("CALL create_activity(?, ?, ?)", userId, type.name(), message);
        } catch (Exception e) {
            customLogger.info(e.getMessage());
        }
    }

    public void deleteActivity(int activityId) {
        try {
            jdbcTemplate.update("CALL delete_activity(?)", activityId);
        } catch (Exception e) {
            customLogger.info(e.getMessage());
        }
    }

    public List<Activity> getActivities(int userId, int page, int size) {
        try {
            String query = "SELECT a.*, au.username FROM Activity a " +
                    "INNER JOIN UserAccount au ON a.user_id = au.user_id";
            if (userId != 0) {
                query += " WHERE a.user_id = ?";
            }
            
            query += " ORDER BY issue_timestamp DESC" +
                    " LIMIT " + (page - 1) * size + ", " + size ;
                            
            
            
            customLogger.sqlLog(query, createObjectArray(userId, page, size));
            return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(Activity.class));
        } catch (Exception e) {
            customLogger.info(e.getMessage());
            return new ArrayList<>();
        }
    }
    
    public int getActivitiesCount(int userId) {
        try {
            String query = "SELECT COUNT(*) FROM Activity";
            if (userId != 0) {
                query += " WHERE user_id = ?";
            }
            
            customLogger.sqlLog(query, createObjectArray(userId));
            return jdbcTemplate.queryForObject(query, Integer.class);
        } catch (Exception e) {
            customLogger.info(e.getMessage());
            return 0;
        }
    }
}
