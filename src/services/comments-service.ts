import apiClient from "./api-client.ts";

export interface Comment {
  _id?: string;
  postId: string;
  user: {
    _id: string;
    username: string;
    profilePicture: string;
    googleId: string;
  }; 
  message: string;
  createdAt?: string;
}

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const response = await apiClient.get<Comment[]>("/comments", {
    params: { postId },
  });
  return response.data;
};

// Create a new comment
export const createComment = async (postId: string, message: string, userId: string): Promise<Comment> => {
  const token = localStorage.getItem("accessToken");
  const response = await apiClient.post<Comment>(
    "/comments",
    { postId, message, user: userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
