package com.sqlcinema.backend.model;

import lombok.Data;
import org.springframework.data.relational.core.mapping.Column;

import java.util.List;

@Data
public class Theatre {
    private int theatreId;
    private String name;
    private boolean available;

    private List<Seat> seats;
}
