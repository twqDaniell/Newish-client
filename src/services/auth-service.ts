import apiClient from "./api-client.ts";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  _id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const authService = {
  // Login a user
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },
};
