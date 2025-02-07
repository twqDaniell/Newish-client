import axios, { CanceledError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useAppContext } from "../contexts/AppContext";

const setUser = useAppContext().setUser;
const apiUrl = window.ENV?.BASE_API_URL || process.env.REACT_APP_BASE_API_URL;

const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  return Date.now() >= exp * 1000;
};

const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  setUser(null);
  window.location.href = "/";
};

export { CanceledError };

const apiClient = axios.create({
  baseURL: apiUrl,
});

// Axios request interceptor: Check token before making a request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (isTokenExpired(token)) {
    logoutUser(); // Log out if token is expired
    return Promise.reject(new Error("Token expired"));
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Axios response interceptor: Catch 401 errors and log out
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logoutUser();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
