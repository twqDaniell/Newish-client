import apiClient, { CanceledError } from "./api-client.ts";

export { CanceledError };

export interface Post {
  _id: string;
  title: string;
  content: string;
  sender: string;
  oldPrice: string;
  newPrice: string;
  city: string;
  picture: string;
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

