import React, { createContext, useState, useContext, ReactNode } from "react";
import { Post } from "../services/posts-service.ts";

// Define the context interface
interface PostContextInterface {
  buyPosts: Post[];
  setBuyPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  sellPosts: Post[];
  setSellPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

// Create the context with a default value of undefined
const PostContext = createContext<PostContextInterface | undefined>(undefined);

// Create a custom hook to use the context
export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Define the provider props
interface PostProviderProps {
  children: ReactNode;
}

// Create the provider component
const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [buyPosts, setBuyPosts] = useState<Post[]>([]);
  const [sellPosts, setSellPosts] = useState<Post[]>([]);
  
  const value: PostContextInterface = {
    buyPosts,
    setBuyPosts,
    sellPosts,
    setSellPosts
  };

  return React.createElement(PostContext.Provider, { value }, children);
};
  
export default PostProvider;
