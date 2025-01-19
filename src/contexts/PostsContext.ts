import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the context interface
interface PostContextInterface {
  posts: Post[] | [];
  setPosts: React.Dispatch<React.SetStateAction<Post[] | []>>;
}

// Define the user type
export interface Post {
    title: string;
    content: string;
    sender: string;
    oldPrice: string;
    newPrice: string;
    city: string;
    picture: string;
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
  const [posts, setPosts] = useState<Post[] | []>([]);
  
  const value: PostContextInterface = {
    posts,
    setPosts,
  };

  return React.createElement(PostContext.Provider, { value }, children);
};
  
export default PostProvider;
