package com.sqlcinema.backend.model.activity;

import lombok.Data;

@Data
public class Activity {
    private int activityId;
    private String username;
    private ActivityType activityType;
    private String activityBody;
    private Long issueTimestamp;
}
