// types.ts (optional file to store your types)
export interface User {
    id: string;
    name: string;
  }
  
  export interface GlobalContextInterface {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
  }
  