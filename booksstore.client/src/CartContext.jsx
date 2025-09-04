import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);



// Provider component
const CartProvider = ({ children }) => {
    // Initialize cart from localStorage
    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("cart")) || [];
        } catch {
            return [];
        }
    });

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Add a book to the cart
    const addToCart = (book) => {
        setCart(prevCart => {
            const index = prevCart.findIndex(item => item.id === book.id);
            if (index !== -1) {
                // Book exists, increment quantity
                const updatedCart = [...prevCart];
                updatedCart[index].quantity += 1;
                return updatedCart;
            } else {
                // New book, add with quantity 1
                return [...prevCart, { ...book, quantity: 1 }];
            }
        });
    };

    // Remove a book from the cart
    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    // Update quantity of a book in the cart
    const updateQuantity = (id, delta) => {
        setCart(prevCart =>
            prevCart
                .map(item =>
                    item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
                )
                .filter(item => item.quantity > 0) // optional: remove if quantity reaches 0
        );
    };

    const clearCart = () => setCart([]);

    // Calculate total price
    const getTotal = () =>
        cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
