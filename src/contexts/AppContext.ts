import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the context interface
interface AppContextInterface {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
    snackbar: Snackbar | null;
    setSnackbar: React.Dispatch<React.SetStateAction<Snackbar>>;
}

// Define the user type
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  phoneNumber: string;
}

interface Snackbar {
    open: boolean;
    type: "success" | "error";
    message: string;
}

// Create the context with a default value of undefined
const AppContext = createContext<AppContextInterface | undefined>(undefined);

// Create a custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Define the provider props
interface AppProviderProps {
  children: ReactNode;
}

// Create the provider component
const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<Snackbar>({ open: false, type: "success", message: "" });

  const value: AppContextInterface = {
    user,
    setUser,
    snackbar,
    setSnackbar,
  };

  return React.createElement(AppContext.Provider, { value }, children);
};
  
export default AppProvider;
