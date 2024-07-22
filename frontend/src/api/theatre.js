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

export async function getTheatres() {
    const response = await axios.get(`${API_URL}/theatre/`, {
        headers: {
            Authorization: `Bearer ${loadAuthToken()}`,
        },
    });
    return response.data;
}

export async function createTheatre(theatre) {

    theatre = {
        name: theatre.name,
        available: theatre.available,
    };

    const response = await axios.post(`${API_URL}/theatre/`, theatre, {
        headers: {
            Authorization: `Bearer ${loadAuthToken()}`,
        },
    });
    return response.data;
}

export async function updateTheatre(theatre) {
    theatre = {
        theatreId: theatre.theatreId,
        name: theatre.name,
        available: theatre.available,
    };

    const response = await axios.put(`${API_URL}/theatre/${theatre.theatreId}`, theatre, {
        headers: {
            Authorization: `Bearer ${loadAuthToken()}`,
        },
    });
    return response.data;
}

export async function deleteTheatre(theatreId) {
    const response = await axios.delete(`${API_URL}/theatre/${theatreId}`, {
        headers: {
            Authorization: `Bearer ${loadAuthToken()}`,
        },
    });

    return response.data;
}