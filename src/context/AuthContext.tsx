/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from "@/lib/appwrite/api";
import { IUser } from "@/types";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
  id: "",
  name: "",
  email: "",
  username: "",
  imageUrl: "",
  bio: "",
};
const INITIAL_STATE: {
  user: typeof INITIAL_USER;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
} = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => {
    return false;
  },
};
const AuthContext = createContext(INITIAL_STATE);
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const checkAuthUser = async () => {
    try {
      const currentAccount: any = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount?.$id,
          name: currentAccount?.name,
          email: currentAccount?.email,
          imageUrl: currentAccount?.imageUrl,
          bio: currentAccount?.bio,
          username: currentAccount?.username,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (
      localStorage?.getItem("cookieFallback") === "[]" ||
      localStorage?.getItem("cookieFallback") === null
    ) {
      navigate("/sign-in");
    }
    checkAuthUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);
