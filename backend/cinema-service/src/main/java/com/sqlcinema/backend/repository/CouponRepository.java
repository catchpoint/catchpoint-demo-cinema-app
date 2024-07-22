package com.sqlcinema.backend.repository;

import com.sqlcinema.backend.common.CustomLogger;
import com.sqlcinema.backend.model.*;
import com.sqlcinema.backend.model.order.CouponOrder;
import com.sqlcinema.backend.model.request.CouponRequest;
import com.sqlcinema.backend.model.response.CouponResponse;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static com.sqlcinema.backend.common.Constants.createObjectArray;
import static com.sqlcinema.backend.common.Constants.createStringArray;

@Repository
@AllArgsConstructor
public class CouponRepository {
    private final JdbcTemplate jdbcTemplate;
    private final CustomLogger logger;

    private List<PercentCoupon> getPercentCoupon() {
        String query = "SELECT * FROM Coupon NATURAL INNER JOIN PercentCoupon ORDER BY expire_date DESC";
        logger.sqlLog(query, createObjectArray(""));
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(PercentCoupon.class));
    }

    private List<AmountCoupon> getAmountCoupon() {
        String query = "SELECT * FROM Coupon NATURAL INNER JOIN AmountCoupon ORDER BY expire_date DESC";
        logger.sqlLog(query, createObjectArray(""));
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(AmountCoupon.class));
    }

    public void useCoupon(String code) {
        String query = "UPDATE Coupon SET coupon_left = coupon_left - 1 WHERE code = ?";
        logger.sqlLog(query, createObjectArray(code));
        jdbcTemplate.update(query, code);
    }

    public List<? extends Coupon> getCoupons(CouponType type) {
        List<Coupon> coupons = new ArrayList<>();

        if (type.equals(CouponType.ALL)) {
            coupons.addAll(getPercentCoupon());
            coupons.addAll(getAmountCoupon());
            return coupons;
        } else if (type.equals(CouponType.PERCENT)) {
            return getPercentCoupon();
        } else if (type.equals(CouponType.AMOUNT)) {
            return getAmountCoupon();
        }

        return coupons;
    }

    public Coupon getCouponByCode(String code) {
        String percentQuery = "SELECT * FROM " +
                "(SELECT * FROM Coupon WHERE Coupon.code = ? ) AS Coupon " +
                "NATURAL INNER JOIN PercentCoupon";

        PercentCoupon percentCoupon;

        try {
            percentCoupon = jdbcTemplate.queryForObject(percentQuery,
                    BeanPropertyRowMapper.newInstance(PercentCoupon.class), code);
        } catch (Exception e) {
            percentCoupon = null;
        }


        if (percentCoupon != null) {
            logger.sqlLog(percentQuery, createObjectArray(code));
            return percentCoupon;
        }

        String amountQuery = "SELECT * FROM " +
                "(SELECT * FROM Coupon WHERE Coupon.code = ? ) AS Coupon " +
                "NATURAL INNER JOIN AmountCoupon";

        AmountCoupon amountCoupon;

        try {
            amountCoupon = jdbcTemplate.queryForObject(amountQuery,
                    BeanPropertyRowMapper.newInstance(AmountCoupon.class), code);
        } catch (Exception e) {
            amountCoupon = null;
        }


        if (amountCoupon != null) {
            logger.sqlLog(amountQuery, createObjectArray(code));
            return amountCoupon;
        }

        return null;
    }

    public Coupon createCoupon(CouponRequest couponRequest) {

        String query = "CALL create_coupon(?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(query, couponRequest.getCode(), couponRequest.getCouponLeft(),
                couponRequest.getExpireDate(), couponRequest.getActivateDate(),
                couponRequest.getType().name(), couponRequest.getDiscount(), couponRequest.getLimit());

        logger.sqlLog(query, createObjectArray(couponRequest.getCode(), couponRequest.getCouponLeft(),
                couponRequest.getExpireDate(), couponRequest.getActivateDate(),
                couponRequest.getType(), couponRequest.getDiscount(), couponRequest.getLimit()));

        return jdbcTemplate.queryForObject("SELECT * FROM Coupon WHERE Coupon.code = ?",
                BeanPropertyRowMapper.newInstance(Coupon.class), couponRequest.getCode());
    }

    public Coupon updateCoupon(String code, CouponRequest request) {
        
        String query = "CALL update_coupon(?, ?, ?, ?, ?, ?, ?)";
        logger.sqlLog(query, createObjectArray(code, request.getCouponLeft(),
                request.getExpireDate(), request.getActivateDate(),
                request.getType().name(), request.getDiscount(), request.getLimit()));
        
        jdbcTemplate.update(query, code, request.getCouponLeft(),
                request.getExpireDate(), request.getActivateDate(),
                request.getType().name(), request.getDiscount(), request.getLimit());
        
        return getCouponByCode(code);
    }

    public void deleteCoupon(String code) {
        String query = "DELETE FROM Coupon WHERE Coupon.code = ?";
        jdbcTemplate.update(query, code);
        logger.sqlLog(query, createObjectArray(code));
    }

}
