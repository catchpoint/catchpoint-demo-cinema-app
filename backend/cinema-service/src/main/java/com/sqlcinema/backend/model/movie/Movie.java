package com.sqlcinema.backend.model.movie;

import com.catchpoint.trace.api.invocation.InvocationAPI;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.List;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Movie {
    private int movieId;
    private String title;
    private String overview;
    private int runtime;
    private Date releaseDate;
    private float rating;
    private String backdropPath;
    private String posterPath;
    private String trailerLink;
    private String country;
    private String language;
    private String keywords;
    private boolean favorite;
    private List<Genre> genres;
    private List<Person> cast;

    @JsonIgnore
    public void setTags() {
        InvocationAPI.setTag("title", title);
        InvocationAPI.setTag("country", country);
        InvocationAPI.setTag("language", language);
        InvocationAPI.setTag("rating", String.valueOf(rating));
    }
}
