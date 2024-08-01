import axios from 'axios';
import {
    API_URL
} from '../config/config.json';
import {
    loadAuthToken
} from '../utils/localStorage';


axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.resolve(error.response);
});

export async function getLogs() {
    const response = await axios.get(`${API_URL}/log/all`, {
        headers: {
            "Authorization": `Bearer ${loadAuthToken()}`
        }
    });

    return response.data;
}

export async function clearLogs() {
    const response = await axios.delete(`${API_URL}/log/clear`, {
        headers: {
            "Authorization": `Bearer ${loadAuthToken()}`
        }
    });

    return response.data;
}


export async function getActivities(userId, filter) {
    const response = await axios.get(`${API_URL}/log/activity${userId ? `/${userId}` : ''}${
        Object.keys(filter).length > 0 ? `?${Object.keys(filter).map(key => `${key}=${filter[key]}`).join('&')}` : ''}`, {

        headers: {
            "Authorization": `Bearer ${loadAuthToken()}`
        }
    });

    return response.data;
}

export async function getActivityCount(userId) {
    const response = await axios.get(`${API_URL}/log/activity/count${userId ? `/${userId}` : ''}`, {
        headers: {
            "Authorization": `Bearer ${loadAuthToken()}`
        }
    });

    return response.data;
}