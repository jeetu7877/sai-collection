import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("msp_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const persist = (userData, token) => {
    setUser(userData);
    localStorage.setItem("msp_user", JSON.stringify(userData));
    if (token) localStorage.setItem("msp_token", token);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      persist(data, data.token);
      toast.success(`Welcome back, ${data.name}!`);
      return data;
    } catch (err) {
      if (!err.response?.data?.needsVerification) {
        toast.error(err.response?.data?.message || "Login failed");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      // Does NOT log the user in — account is unverified until they enter the emailed code.
      const { data } = await api.post("/auth/register", payload);
      toast.success(data.message || "Check your email for a verification code.");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, code) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-email", { email, code });
      persist(data, data.token);
      toast.success(`Welcome to MenStyle Pro, ${data.name}!`);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email) => {
    try {
      const { data } = await api.post("/auth/resend-verification", { email });
      toast.success(data.message || "New code sent.");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't resend code");
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("msp_user");
    localStorage.removeItem("msp_token");
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser: persist, login, register, verifyEmail, resendVerification, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
