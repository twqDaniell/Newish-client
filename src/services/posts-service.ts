import apiClient, { CanceledError } from "./api-client.ts";

export { CanceledError };

class Sender {
  _id: string;
  username: string;
  profilePicture: string;
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
}

export const getPosts = () => {
  const abortController = new AbortController();
  const request = apiClient.get<Post[]>("/posts", {
    signal: abortController.signal,
  });
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
