import { useState } from "react";
import axios from "axios";

function LoginForm({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
                Login
            </button>
        </div>
    );
}

export default LoginForm;
