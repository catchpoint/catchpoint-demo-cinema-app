package com.sqlcinema.backend.manager;

import com.sqlcinema.backend.model.activity.Activity;
import com.sqlcinema.backend.model.activity.ActivityType;

import java.util.List;

public interface ActivityManager {
    
    List<Activity> getActivities(int userId, int page, int size);
    void addActivity(int userId, ActivityType type, String message);
    void deleteActivity(int activityId);
    
    int getActivitiesCount(int userId);
    
}
