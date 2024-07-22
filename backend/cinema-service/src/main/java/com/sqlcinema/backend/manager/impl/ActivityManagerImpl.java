package com.sqlcinema.backend.manager.impl;

import com.sqlcinema.backend.manager.ActivityManager;
import com.sqlcinema.backend.model.activity.Activity;
import com.sqlcinema.backend.model.activity.ActivityType;
import com.sqlcinema.backend.repository.ActivityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class ActivityManagerImpl implements ActivityManager {
    
    private final ActivityRepository activityRepository;

    @Override
    public List<Activity> getActivities(int userId, int page, int size) {
        return activityRepository.getActivities(userId, page, size);
    }

    @Override
    public void addActivity(int userId, ActivityType type, String message) {
        activityRepository.addActivity(userId, type, message);
    }

    @Override
    public void deleteActivity(int activityId) {
        activityRepository.deleteActivity(activityId);
    }

    @Override
    public int getActivitiesCount(int userId) {
        return activityRepository.getActivitiesCount(userId);
    }
}
