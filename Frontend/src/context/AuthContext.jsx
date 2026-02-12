import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

// Context object (capitalize to use in JSX as <AuthContext.Provider>)
export const AuthContext = createContext();

// Provider component — export as default for convenience
function AuthProvider({ children }) {
  const serverUrl = "http://localhost:8000";
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  // Setup Socket.io connection
  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(serverUrl);
      newSocket.on("connect", () => {
        console.log("Socket.io connected");
        newSocket.emit("userJoined", user._id);
      });
      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [isAuthenticated, user]);

  const value = {
    serverUrl,
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    socket,
    isAdmin: user?.role === "admin" || user?.role === "owner",
    isOwner: user?.role === "owner",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
