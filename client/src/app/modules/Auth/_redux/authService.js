import axios from "axios";

export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";
// export const ME_URL = `${process.env.REACT_APP_API_URL}/auth/me`;
export const ME_URL = `https://run.mocky.io/v3/17bd11e0-e20d-43de-a438-001e88cd221a`;

export function login(username, password) {
    let config = {
        auth: {
            username: username,
            password: password,
        }
    }
    return axios.get(`${process.env.REACT_APP_REST_API_URL}jwt/`, config)
}

export function register(email, fullname, username, password) {
    return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function recoverPassword(id, password, confirmPassword) {
    console.log(id, password, confirmPassword)
    return axios.post(`${process.env.REACT_APP_REST_API_URL}recover-password/`, { id, password, confirmPassword });
}

export function checkInfo(id) {
    return axios.get(`${process.env.REACT_APP_REST_API_URL}checkpasstoken/`+id);
}

export function requestPassword(email) {
  return axios.post(`${process.env.REACT_APP_REST_API_URL}forgot-password/` , { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}