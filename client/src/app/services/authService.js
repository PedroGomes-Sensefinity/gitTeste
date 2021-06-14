import axios from 'axios';
import jwt_decode from 'jwt-decode';
import moment from 'moment';

export const TOKEN_KEY = '@sense-token';
export const USER_KEY = '@sense-user';

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUser = () => JSON.parse(localStorage.getItem(USER_KEY));

export const login = (username, password) => {
    let config = {
        auth: {
            username: username,
            password: password,
        },
    };
    return axios.get(`${process.env.REACT_APP_REST_API_URL}jwt/`, config);
};


export const signIn = () => {
    return axios.get(`${process.env.REACT_APP_REST_API_URL}jwt/`);
};

export const logout = () => {
    removeToken();
    removeUser();
};

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const setUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeToken = () => {
    removeLocalStorageValue(TOKEN_KEY);
};

export const removeUser = () => {
    removeLocalStorageValue(USER_KEY);
};

export const removeLocalStorageValue = (key) => {
    localStorage.removeItem(key);
};

export const checkJwtIsCloseToExpire = () => {
    const tokenDecoded = jwt_decode(getToken());
    const now = moment.utc();
    // JWT exp is in seconds
    const expireToken = moment(tokenDecoded.exp * 1000);

    let duration = moment.duration(expireToken.diff(now));
    let minutes = duration.asMinutes();
    
    return (minutes < 5);
};
