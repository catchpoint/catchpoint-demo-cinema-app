package com.sqlcinema.backend.service.impl;

import com.sqlcinema.backend.model.AmountCoupon;
import com.sqlcinema.backend.model.Coupon;
import com.sqlcinema.backend.model.CouponType;
import com.sqlcinema.backend.model.PercentCoupon;
import com.sqlcinema.backend.model.order.CouponOrder;
import com.sqlcinema.backend.model.request.CouponRequest;
import com.sqlcinema.backend.model.response.CouponResponse;
import com.sqlcinema.backend.repository.CouponRepository;
import com.sqlcinema.backend.service.CouponService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@AllArgsConstructor
public class CouponServiceImpl implements CouponService {
    private final CouponRepository couponRepository;
    
    public List<? extends Coupon> getCoupons(CouponType type){
        return couponRepository.getCoupons(type);
    }
    
    public Coupon getCouponByCode(String code){
        return couponRepository.getCouponByCode(code);
    }
    public void deleteCoupon(String code) {
        couponRepository.deleteCoupon(code);
    }

    public Coupon updateCoupon(String code, CouponRequest couponRequest) {
        return couponRepository.updateCoupon(code, couponRequest);
    }

    public Coupon createCoupon(CouponRequest couponRequest) {
        return couponRepository.createCoupon(couponRequest);
    }
}
