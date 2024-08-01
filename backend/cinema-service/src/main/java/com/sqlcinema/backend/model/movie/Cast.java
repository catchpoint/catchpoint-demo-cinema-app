package com.sqlcinema.backend.model.movie;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
public class Cast extends Person {
    private int movieId;
    private int personId;
    private String character;
    
}
