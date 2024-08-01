import axios from 'axios';

import {
    API_URL
} from '../config/config.json';
import {
    loadAuthToken
} from '../utils/localStorage';
import {
    getTheatres
} from './theatre';

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.resolve(error.response);
});

export async function getTickets(movieId) {
    const theatres = await getTheatres();
    const response = await axios.get(`${API_URL}/ticket/${movieId}`, {
        headers: {
            Authorization: `Bearer ${loadAuthToken()}`
        }
    });
    for (let i = 0; i < response.data.length; i++) {
        response.data[i].theatre = theatres.find(theatre => theatre.theatreId === response.data[i].theatreId);
    }

    return response.data;
}


export async function getSeats(ticketId) {
    const response = await axios.get(`${API_URL}/ticket/${ticketId}/seats`, {
        headers: {
            Authorization: `Bearer ${loadAuthToken()}`
        }
    });

    return response.data;
}

export async function reserveTicket(ticket, seats, paymentInfo) {
    const response = await axios.post(`${API_URL}/ticket/reserve`, {
        ticketId: ticket,
        seatCodes: seats.map(seat => seat.seatCode),
        paymentInfo
    }, {
        headers: {
            Authorization: `Bearer ${loadAuthToken()}`
        }
    });

    return response;
}