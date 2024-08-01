package com.sqlcinema.backend.model.order;

public enum CouponOrder {
    COUPONCODE("Coupon.code ASC"),
    EXPIRE_DATE("Coupon.expire_date ASC"),
    COUPONLEFT("Coupon.coupon_left ASC"),
    ACTIVATEDATE("Coupon.activate_date ASC");

    private String value;

    CouponOrder(String value) {
        this.value = value;
    }
    public String getValue() {
        return value;
    }

    public CouponOrder descending() {
        CouponOrder order = this;
        order.value = order.value.replace("ASC", "DESC");
        return order;
    }
}
