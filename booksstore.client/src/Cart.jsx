import React from "react";
import { Link } from "react-router-dom";
import "./styles/Cart.css";
import { useCart } from "./CartContext";

function Cart() {
    const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

    if(cart.length === 0) {
        return (
            <div className="cart-container">
                <h2>Your Cart is Empty</h2>
                <Link to="/">Go Back to Home</Link>
            </div>
        );
    }
    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Book</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>
                                {item.price
                                    ? item.price.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD"
                                    })
                                    : "$0.00"}
                            </td>
                            <td>
                                <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                                <span className="quantity">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                            </td>
                            <td>
                                {((item.price || 0) * item.quantity).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD"
                                })}
                            </td>
                            <td>
                                <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3 className="total">
                Total: {getTotal().toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </h3>
            <Link to="/checkout">
                <button className="checkout-button">Proceed to Checkout</button>
            </Link>
            <div className="cart-container">
                <Link to="/">Go Back to Home</Link>
            </div>
        </div>
    );
}

export default Cart;
