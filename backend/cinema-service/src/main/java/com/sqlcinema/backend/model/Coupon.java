package com.sqlcinema.backend.model;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Value;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Data
@SuperBuilder
@NoArgsConstructor
public class Coupon {
    private String code;
    private int couponLeft;
    private Date expireDate;
    private Date activateDate;
    
    
    public boolean isValid() {
        if (couponLeft <= 0) {
            return false;
        }
        if (expireDate.before(new Date())) {
            return false;
        }
        if (activateDate.after(new Date())) {
            return false;
        }
        
        return true;
    }
}
