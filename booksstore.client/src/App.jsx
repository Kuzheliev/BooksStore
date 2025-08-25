import React, { createContext, useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import LoginForm from "./Login";
import AuthProvider from "./AuthContext";
import "./App.css";
import { useAuth } from "./AuthContext";

function Home() {
    const { token, user, logout } = useAuth();

    return (
        <div>
            <div className="header">
                <h1>Books Store</h1>
                <div className="header-buttons">
                    {!token ? (
                        <Link to="/login">
                            <button className="btn login-btn">Login</button>
                        </Link>
                    ) : (
                        <button onClick={logout} className="btn logout-btn">
                            Logout
                        </button>
                    )}
                </div>
            </div>
            <div className="app-container">
                {token ? <p>You are logged in.</p> : <p>Please log in to continue.</p>}
            </div>
        </div>
    );
}

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLoginSubmit = (token, userData) => {
        login(token, userData);
        navigate("/", { replace: true });
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <h1>Login</h1>
                <LoginForm onLogin={handleLoginSubmit} />
                <button onClick={() => navigate("/")} className="btn cancel-btn">Cancel</button>
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
