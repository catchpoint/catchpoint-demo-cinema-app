import axios from "axios";
import {
    API_URL
} from "../config/config.json";
import {
    loadAuthToken
} from "../utils/localStorage";

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.resolve(error.response);
});

export async function getCoupons() {
    const response = await axios.get(`${API_URL}/coupon/`, {
        headers: {
            Authorization: `Bearer ${loadAuthToken()}`,
        },
    });
    return response.data;
}


export async function deleteCoupon(code) {
    const response = await axios.delete(`${API_URL}/coupon/${code}`, {
        headers: {
            Authorization: `Bearer ${loadAuthToken()}`,
        },
    });
    return response.data;
}

export async function createCoupon(coupon) {

    coupon = {
        ...coupon,
        type: coupon.amount ? "AMOUNT" : "PERCENT",
        discount: coupon.amount || coupon.rate,
        limit: coupon.minPrice || coupon.upTo,
    };

    const response = await axios.post(`${API_URL}/coupon/`, coupon, {
        headers: {
            Authorization: `Bearer ${loadAuthToken()}`,
        },
    });
    return response.data;
}

export async function updateCoupon(code, coupon) {
    coupon = {
        ...coupon,
        type: coupon.amount ? "AMOUNT" : "PERCENT",
        discount: coupon.amount || coupon.rate,
        limit: coupon.minPrice || coupon.upTo,
    };

    const response = await axios.put(`${API_URL}/coupon/${code}`, coupon, {
        headers: {
            Authorization: `Bearer ${loadAuthToken()}`,
        },
    });

    return response.data;
}