package com.sqlcinema.backend.model.order;
public enum MovieOrder {
    ID("Movie.movie_id ASC"),
    TITLE("Movie.title ASC"),
    RELEASE_DATE("Movie.release_date ASC"),
    RUNTIME("Movie.runtime ASC"),
    POPULARITY("Movie.rating ASC");
    
    private String value;
    
    MovieOrder(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    public MovieOrder descending() {
        MovieOrder order = this;
        order.value = order.value.replace("ASC", "DESC");
        return order;
    }
}