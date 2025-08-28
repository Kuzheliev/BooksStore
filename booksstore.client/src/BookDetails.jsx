import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`/book/id/${id}`);
                console.log("response ", response);
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!book) return <p>Book not found.</p>;

    return (
        <div style={{ padding: "1rem" }}>
            <Link to="/"> Back to Home</Link>

            <h1>{book.name || "Unnamed Book"}</h1>

            <img
                src={
                    book.imageUrl
                        ? book.imageUrl.replace(/^\/?wwwroot/, '')  // remove leading /wwwroot if present
                        : '/placeholder.png'
                }
                alt={book.name}
                style={{ maxWidth: "300px", margin: "1rem 0" }}
            />

            <p><strong>Author:</strong> {book.author || "Unknown"}</p>
            <p><strong>Genre:</strong> {book.genre || "N/A"}</p>
            <p><strong>Price:</strong> ${book.price?.toFixed(2) || "0.00"}</p>
            <p><strong>Description:</strong> {book.description || "No description available."}</p>
        </div>
    );
}

export default BookDetails;
