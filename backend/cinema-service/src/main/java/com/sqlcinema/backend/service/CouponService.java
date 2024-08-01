package com.sqlcinema.backend.service;
import com.sqlcinema.backend.model.Coupon;
import com.sqlcinema.backend.model.CouponType;
import com.sqlcinema.backend.model.request.CouponRequest;

import java.util.List;

public interface CouponService {
    List<? extends Coupon> getCoupons(CouponType type);

    Coupon getCouponByCode(String code);
    void deleteCoupon(String code);

    Coupon updateCoupon(String code, CouponRequest couponRequest);

    Coupon createCoupon(CouponRequest couponRequest);
}
