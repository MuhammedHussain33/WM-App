import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Directly load user from sessionStorage on first render
    const storedUser = sessionStorage.getItem("ecoWasteUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Sync if session changes elsewhere
    const handleStorageChange = () => {
      const storedUser = sessionStorage.getItem("ecoWasteUser");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (userData) => {
    sessionStorage.setItem("ecoWasteUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("ecoWasteUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
