package com.sqlcinema.backend.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class CouponResponse {
    private float beforePrice;
    private float afterPrice;
    private String couponCode;
}
