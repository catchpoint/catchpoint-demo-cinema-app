package com.sqlcinema.backend.authservice.util;

import lombok.Getter;

/**
 * author: mehmetyildiz
 */
public class ErrorInjector {

    private ErrorInjector() {
    }

    @Getter
    private static boolean activated = false;

    public static void activate() {
        activated = true;
    }

    public static void deactivate() {
        activated = false;
    }

    public static boolean shouldInjectDatabaseError() {
        if (!activated) {
            return false;
        }

        return Math.random() > 0.8;
    }

}
