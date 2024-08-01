package com.sqlcinema.backend.model.response;

import com.sqlcinema.backend.model.Ticket;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@EqualsAndHashCode(callSuper = true)
@Data
public class TicketResponse extends Ticket {
    private String title;
    private String name;
}
