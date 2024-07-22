package com.sqlcinema.backend.model.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Data
@Getter
@Setter
public class AirTimesResponse {
    private int ticketId;
    private String title;
    private Date showTime;
}
