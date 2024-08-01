package com.sqlcinema.backend.controller;

import com.sqlcinema.backend.common.CustomLogger;
import com.sqlcinema.backend.manager.ActivityManager;
import com.sqlcinema.backend.model.Log;
import com.sqlcinema.backend.model.activity.Activity;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/log")
@AllArgsConstructor
public class LogController {
    private final CustomLogger customLogger;
    private final ActivityManager activityService;
    
    @GetMapping("/all")
    public ResponseEntity<List<Log>>
    getAllLogs() {
        return ok(customLogger.getAllLogs());
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearLogs() {
        customLogger.clearLogs();
        return ok().build();
    }


    @GetMapping(path = {"/activity", "/activity/{userId}"})
    public ResponseEntity<List<Activity>> getActivities(@PathVariable(required = false, name = "userId") Integer userId,
                                                        @RequestParam(required = false, defaultValue = "1") int page,
                                                        @RequestParam(required = false, defaultValue = "10") int size) {
        
        userId = userId == null ? 0 : userId;
        if (userId < 0) {
            return ResponseEntity.badRequest().build();
        }
        return ok(activityService.getActivities(userId, page, size));
    }
    
    @GetMapping(path = {"/activity/count", "/activity/count/{userId}"})
    public ResponseEntity<Integer> getActivitiesCount(@PathVariable(required = false, name = "userId") Integer userId) {
        userId = userId == null ? 0 : userId;
        if (userId < 0) {
            return ResponseEntity.badRequest().build();
        }
        return ok(activityService.getActivitiesCount(userId));
    }
}
