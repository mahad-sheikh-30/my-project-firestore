import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface User {
  name: string;
  email: string;
  role: string;
  token: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  updateRole: (role: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<User | null>(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return {
      token,
      name: localStorage.getItem("name") || "",
      email: localStorage.getItem("email") || "",
      role: localStorage.getItem("role") || "user",
    };
  });

  const setUser = (user: User) => {
    localStorage.setItem("token", user.token);
    localStorage.setItem("name", user.name);
    localStorage.setItem("email", user.email);
    localStorage.setItem("role", user.role);
    setUserState(user);
  };

  const updateRole = (role: string) => {
    if (!user) return;
    const updatedUser = { ...user, role };
    localStorage.setItem("role", role);
    setUserState(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateRole, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
