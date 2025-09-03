import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


interface User {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  sendOtp: (phone: string) => Promise<string>;
  verifyOtp: (sessionId: string, otp: string, phone: string) => Promise<User>;
  completeProfile: (phone: string, firstName: string, lastName: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const loadAuth = async () => {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await axios.get("http://localhost:3000/api/auth/verify-token", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          console.log("Verified user:", response.data.user);
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Token verification failed:", err);
          await logout();
        }
      }
      setLoading(false);
    };
    loadAuth();
  }, []);

  const sendOtp = async (phone: string): Promise<string> => {
    const response = await axios.post("http://localhost:3000/api/auth/send-otp", { phone });
    return response.data.sessionId;
  };

  const verifyOtp = async (sessionId: string, otp: string, phone: string): Promise<User> => {
    const response = await axios.post("http://localhost:3000/api/auth/verify-otp", { sessionId, otp, phone });
    console.log("Verification Response:", response.data);
    const { token: newToken, user: userData } = response.data;
    if (newToken) {
      await AsyncStorage.setItem("authToken", newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      throw new Error("Token not received from server");
    }
    return userData;
  };

  const completeProfile = async (phone: string, firstName: string, lastName: string, email: string): Promise<void> => {
    const response = await axios.post("http://localhost:3000/api/auth/complete-profile", {
      phone,
      firstName,
      lastName,
      email,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(response.data.user);
  };

  const logout = async (): Promise<void> => {
    await AsyncStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, loading, sendOtp, verifyOtp, completeProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
