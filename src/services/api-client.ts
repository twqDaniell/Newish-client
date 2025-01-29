import axios, { CanceledError } from "axios";

export { CanceledError }

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
});

export default apiClient;