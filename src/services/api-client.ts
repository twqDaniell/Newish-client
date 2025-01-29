import axios, { CanceledError } from "axios";
const apiUrl = window.ENV?.BASE_API_URL || process.env.REACT_APP_BASE_API_URL;

export { CanceledError }

const apiClient = axios.create({
    baseURL: apiUrl,
});

export default apiClient;