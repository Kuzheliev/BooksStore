import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./styles/Checkout.css";

function Checkout() {
    const { cart, getTotal, clearCart } = useCart();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        country: "",
        payment: "card",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user info by ID
    useEffect(() => {
        if (!user || !token) {
            setLoading(false); // stop loading until user exists
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get(`/User/${user.id}`);

                console.log("Fetched user data:", response.data);
                setForm(prev => ({
                    ...prev,
                    email: response.data.email || "",
                    phoneNumber: response.data.phone || "",
                    address: response.data.address || "",
                    city: response.data.city || "",
                    country: response.data.country || "",
                }));
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Failed to load user information.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [user, token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.email || !form.phoneNumber || !form.address || !form.city || !form.country) {
            alert("Please fill out all required fields.");
            return;
        }

        alert("Order placed successfully! 🎉");
        clearCart();
        navigate("/");
    };

    if (loading) return <p className="loading">Loading user info...</p>;
    if (error) return <p className="error">{error}</p>;
    if (cart.length === 0) return <p>Your cart is empty.</p>;

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="checkout-content">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <h3>Contact Information</h3>
                    <label>
                        Email:
                        <input type="email" name="email" value={form.email} onChange={handleChange} required />
                    </label>
                    <label>
                        Phone Number:
                        <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
                    </label>
                    <label className="address-label">
                        Address:
                        <input name="address" value={form.address} onChange={handleChange} required />
                    </label>
                    <label>
                        City:
                        <input type="text" name="city" value={form.city} onChange={handleChange} required />
                    </label>
                    <label>
                        Country:
                        <input type="text" name="country" value={form.country} onChange={handleChange} required />
                    </label>
                    <label>
                        Payment Method:
                        <select name="payment" value={form.payment} onChange={handleChange}>
                            <option value="card">Credit/Debit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="cod">Cash on Delivery</option>
                        </select>
                    </label>
                    <div className="checkout-buttons">
                        <button type="button" className="back-button" onClick={() => navigate("/cart")}>
                            Back
                        </button>
                        <button type="submit" className="place-order-button">
                            Place Order
                        </button>
                    </div>
                </form>

                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <ul>
                        {cart.map((item) => (
                            <li key={item.id}>
                                {item.name} x {item.quantity} ={" "}
                                {((item.price || 0) * item.quantity).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </li>
                        ))}
                    </ul>
                    <h4>
                        Total:{" "}
                        {getTotal().toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}
                    </h4>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
