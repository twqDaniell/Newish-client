import apiClient, { CanceledError } from "./api-client.ts";

export { CanceledError }

export interface Post {
    _id: string;
    title: string;
    content: string;
    sender: string;
}

export const getPosts = () => {
    const abortController = new AbortController();
    const request = apiClient.get<Post[]>("/posts", {
      signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
  };