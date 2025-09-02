import React, { createContext, useState, useContext } from "react";

// Create context
export const AuthContext = createContext();

// Provider component
export default function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch {
            return null;
        }
    });

    const login = (tokenValue, userData) => {
        if (!userData) return;

        const mappedUser = {
            id: userData.id,
            ...userData,
            isAdmin: userData.IsAdmin || userData.isAdmin || false
        };

        localStorage.setItem("token", tokenValue);
        localStorage.setItem("user", JSON.stringify(mappedUser));
        setToken(tokenValue);
        setUser(mappedUser);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
