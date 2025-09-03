import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import "./styles/BookDetails.css";
import { useCart } from "./CartContext";

function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [added, setAdded] = useState(false); // feedback state
    const { addToCart } = useCart(); // use CartContext

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`/book/id/${id}`);
                setBook(response.data);
            } catch (err) {
                setError("Book not found or error fetching data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleAddToCart = () => {
        if (!book) return;

        // Add to cart via CartContext
        addToCart(book);
        setAdded(true);

        // Temporary feedback
        setTimeout(() => setAdded(false), 5000);
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!book) return <p className="error">Book not found.</p>;

    return (
        <div className="book-details-screen">
            <div className="book-details-content">
                <Link to="/" className="back-link">← Back to Home</Link>

                <div className="book-horizontal">
                    <img
                        src={book.imageUrl ? book.imageUrl.replace(/^\/?wwwroot/, '') : '/placeholder.png'}
                        alt={book.name}
                        className="book-image"
                    />

                    <div className="book-info">
                        <h1 className="book-title">{book.name || "Unnamed Book"}</h1>
                        <p><strong>Author:</strong> {book.author || "Unknown"}</p>
                        <p><strong>Genre:</strong> {book.genre || "N/A"}</p>
                        <p>
                            <strong>Price:</strong>{" "}
                            {book.price
                                ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(book.price)
                                : "$0.00"}
                        </p>
                        <p><strong>Description:</strong> {book.description || "No description available."}</p>

                        <div className="buttons-row">
                            {book.inStock ? (
                                <button className="add-cart-button" onClick={handleAddToCart}>
                                    {added ? "Added!" : "Add to Cart"}
                                </button>
                            ) : (
                                <button className="add-cart-button disabled" disabled>
                                    Out of Stock
                                </button>
                            )}

                            {user?.isAdmin && (
                                <Link to={`/books/edit/${book.id}`}>
                                    <button className="edit-button">Edit</button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookDetails;
