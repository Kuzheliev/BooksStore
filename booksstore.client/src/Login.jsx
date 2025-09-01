import { useState } from "react";
import axios from "axios";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";
function LoginForm({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
                const response = await axios.post("auth/login", { email, password });
                const { token, user } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                onLogin(token, user);
        } catch (err) {
            console.error(err);
        }
    };

    const handleNavigateRegister = () => {
        navigate("/register"); // navigate to create account page
    };

    return (
        <div className="p-4 border rounded w-64">
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
            />
            <button
                onClick={handleLogin}
                className="btn login-btn"
            >
                Login
            </button>
            <button className="btn register-btnl" onClick={handleNavigateRegister}>
                Create Account
            </button>

        </div>
    );
}

export default LoginForm;
