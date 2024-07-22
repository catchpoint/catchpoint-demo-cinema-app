package com.sqlcinema.backend.model.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AvailableMoviesResponse {
    private int ticketId;
    private String title;
}
