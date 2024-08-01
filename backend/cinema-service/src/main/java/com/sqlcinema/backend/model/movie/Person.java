package com.sqlcinema.backend.model.movie;

import com.sqlcinema.backend.model.movie.Gender;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
public class Person {
    private int personId;
    private String name;
    private Gender gender;
    private String profilePath;
}
