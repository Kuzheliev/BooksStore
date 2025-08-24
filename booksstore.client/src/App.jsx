import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import LoginForm from "./Login";
import UpdateButton from "./UpdateButton";
import "./App.css";

function Home({ token, user, handleLogout }) {
    return (
        <div className="app-container">
            {/* Header */}
            <div className="header">
                <h1>
                    {token ? `Welcome, ${user.username || "User"}!` : "Books Store Admin"}
                </h1>

                <div className="header-buttons">
                    {!token && <Link to="/login"><button className="btn login-btn">Login</button></Link>}
                    {token && (
                        <button onClick={handleLogout} className="btn logout-btn">
                            Logout
                        </button>
                    )}
                </div>
            </div>

            {/* Protected button */}
            {token && <UpdateButton productId={1} />}
        </div>
    );
}

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || {};
        } catch {
            return {};
        }
    });

    const handleLogin = (token, userData, navigate) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(token);
        setUser(userData);
        navigate("/"); // redirect to home after login
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser({});
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home token={token} user={user} handleLogout={handleLogout} />} />
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            </Routes>
        </Router>
    );
}

function LoginPage({ onLogin }) {
    const navigate = useNavigate();

    const handleLogin = (token, userData) => {
        onLogin(token, userData, navigate);
    };

    return (
        <div className="app-container">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <LoginForm onLogin={handleLogin} />
            <button onClick={() => navigate("/")} className="btn cancel-btn mt-2">Cancel</button>
        </div>
    );
}

export default App;
