import apiClient from "./api-client.ts";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  soldCount: number;
  postsCount: number;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePicture?: string;
}

export const authService = {
  // Login a user
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  // Logout a user
  logout: async (refreshToken: string) => {
    const response = await apiClient.post("/auth/logout", { refreshToken });
    return response.data;
  },

  // Register a user
  register: async (formData: FormData) => {
    const response = await apiClient.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Inform the server about the form-data format
      },
    });
    return response.data;
  },

  // Check if the user is authenticated (token-based check)
  isAuthenticated: (): boolean => {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken; // Returns true if accessToken exists
  },
};
