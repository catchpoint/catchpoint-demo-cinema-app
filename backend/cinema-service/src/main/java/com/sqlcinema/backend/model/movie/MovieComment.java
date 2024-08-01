package com.sqlcinema.backend.model.movie;

import lombok.Data;
@Data
public class MovieComment {
    private int commentId;
    private int movieId;
    private String username;
    private String comment;
}
