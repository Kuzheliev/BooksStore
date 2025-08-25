import React, { createContext, useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import LoginForm from "./Login";
import AuthProvider from "./AuthContext";
import "./App.css";
import { useAuth } from "./AuthContext";
import Home from "./Home";
import BookDetails from "./BookDetails";



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
                    <Route path="/books/:id" element={<BookDetails />} />
                    <Route path="*" element={<p>Page not found!</p>} /> 
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
