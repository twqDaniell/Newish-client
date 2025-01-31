import apiClient, { CanceledError } from "./api-client.ts";

export { CanceledError };

class Sender {
  _id: string;
  username: string;
  profilePicture: string;
  phoneNumber: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  sender: Sender;
  oldPrice: string;
  newPrice: string;
  city: string;
  picture: string;
  likes: string[];
  timesWorn: string;
  createdAt: string;
}

export const getPosts = (page: number = 1, limit: number = 10, sender: string | null = null) => {
  const abortController = new AbortController();
  const params: any = { page, limit };
  if (sender) {
    params.sender = sender; // Add sender only if provided
  }
  const token = localStorage.getItem("accessToken");
  const request = apiClient.get<{ posts: Post[]; totalPages: number; totalPosts: number }>(
    "/posts",
    {
      headers: {
        "Content-Type": "multipart/form-data", // Set the content type for file uploads
        Authorization: `Bearer ${token}`
      },
      params, // Include dynamic params
      signal: abortController.signal,
    }
  );
  return { request, abort: () => abortController.abort() };
};

export const createPost = (formData: FormData) => {
  const token = localStorage.getItem("accessToken");
  return apiClient.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Set the content type for file uploads
      Authorization: `Bearer ${token}`
    },
  });
};

export const likePost = async (postId: string, userId: string) => {
  const token = localStorage.getItem("accessToken");

  return apiClient.put(`/posts/${postId}/like`, { userId }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePost = async (postId: string) => {
  const token = localStorage.getItem("accessToken");

  return apiClient.delete(`/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updatePost = async (postId: string, formData: FormData) => {
  const token = localStorage.getItem("accessToken");

  return apiClient.put(`/posts/${postId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
