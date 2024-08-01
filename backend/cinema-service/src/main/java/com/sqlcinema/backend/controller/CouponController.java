package com.sqlcinema.backend.controller;

import com.sqlcinema.backend.manager.ActivityManager;
import com.sqlcinema.backend.model.Coupon;
import com.sqlcinema.backend.model.CouponType;
import com.sqlcinema.backend.model.activity.ActivityType;
import com.sqlcinema.backend.model.request.CouponRequest;
import com.sqlcinema.backend.service.CouponService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;
import java.util.List;

import static com.sqlcinema.backend.common.Constants.getCurrentUser;
import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/api/coupon")
@AllArgsConstructor
public class CouponController {
    private final CouponService couponService;
    private final ActivityManager activityManager;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/")
    public ResponseEntity<List<? extends Coupon>> getCoupon(
            @RequestParam(name = "type", defaultValue = "ALL") CouponType type) {
        return ok(couponService.getCoupons(type));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{code}")
    public ResponseEntity<Coupon> getCouponByCode(@PathVariable("code") String code) {
        Coupon existing = couponService.getCouponByCode(code);
        if (existing == null) {
            return notFound().build();
        }

        return ok(existing);
    }
    
    
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/")
    public ResponseEntity<Coupon> createCoupon(@RequestBody @DateTimeFormat(pattern="yyyy-MM-dd") CouponRequest couponRequest) {
        Coupon coupon = couponService.createCoupon(couponRequest);
        activityManager.addActivity(getCurrentUser().getUserId(), ActivityType.CREATE, "User created a new coupon");
        return ok(coupon);
    }
    
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{code}")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable("code") String code, @RequestBody CouponRequest couponRequest) {
        Coupon existing = couponService.getCouponByCode(code);
        if (existing == null) {
            return notFound().build();
        }
        Coupon coupon = couponService.updateCoupon(code, couponRequest);
        activityManager.addActivity(getCurrentUser().getUserId(), ActivityType.UPDATE, "User updated a coupon");
        return ok(coupon);
    }
    
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable("code") String code) {
        Coupon existing = couponService.getCouponByCode(code);
        if (existing == null) {
            return notFound().build();
        }
        couponService.deleteCoupon(code);
        activityManager.addActivity(getCurrentUser().getUserId(), ActivityType.DELETE, "User deleted a coupon");
        return ok().build();
    }
}
