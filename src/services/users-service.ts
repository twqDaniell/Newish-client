import apiClient from "./api-client.ts"; // Assuming you have an Axios instance

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: File; // File for the updated profile picture
  password?: string;
  soldCount?: number;
}

export const userService = {
  updateUser: async (id: string, data: FormData) => {
    const token = localStorage.getItem("accessToken"); // Retrieve the token from storage
    const response = await apiClient.put(`/users/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Include the token here
      },
    });
    return response.data;
  },

  sellProduct: async (userId: string): Promise<void> => {
    const token = localStorage.getItem("accessToken");
  
    await apiClient.put(
      `/users/sell/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the user's token for authentication
        },
      }
    );
  }
};

