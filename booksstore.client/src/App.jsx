import React, { useState } from "react";
import LoginForm from "./Login"; 
import UpdateButton from "./UpdateButton";
    
function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
    const [showLogin, setShowLogin] = useState(false); // controls login form display

    // Handler after successful login
    const handleLogin = (token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(token);
        setUser(userData);
        setShowLogin(false); // hide login form after login
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser({});
    };

    // Show login form if showLogin is true
    if (showLogin) {
        return <LoginForm onLogin={handleLogin} />;
    }

    // Main app view
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                {token ? `Welcome, ${user.username}!` : "Books Store Admin"}
            </h1>

            {token && <UpdateProductButton productId={1} />}

            <div className="mt-4">
                {!token && (
                    <button
                        onClick={() => setShowLogin(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Go to Login
                    </button>
                )}

                {token && (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
}

export default App;
