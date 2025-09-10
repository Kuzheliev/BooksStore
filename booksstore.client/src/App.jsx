import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import LoginForm from "./Login";
import AuthProvider, { useAuth } from "./AuthContext";
import CartProvider from "./CartContext"; 
import "./styles/App.css";
import Home from "./Home";
import BookDetails from "./BookDetails";
import CreateBook from "./CreateBook";
import Cart from "./Cart";
import EditBook from "./EditBook";
import CreateAccount from "./CreateAccount";
import CheckOut from "./CheckOut";
import OrdersPage from "./OrdersPage";

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
            <CartProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<CreateAccount />} />
                        <Route path="/checkout" element={<CheckOut />} />
                        <Route path="/books/:id" element={<BookDetails />} />
                        <Route path="/books/new" element={<CreateBook />} />
                        <Route path="/books/edit/:id" element={<EditBook />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="*" element={<p>Page not found!</p>} />
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
