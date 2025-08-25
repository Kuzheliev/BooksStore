import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./Home.css";

function Home() {
    const { token, user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [books, setBooks] = useState([]);

    // Fetch books from backend with debounce
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchBooks = async () => {
                try {

                    if (!searchQuery.trim()) {
                        setBooks([]);
                        return;
                    }

                    const response = await axios.get("/book", {
                        params: { search: searchQuery },
                    });
                    setBooks(response.data);

                } catch (err) {
                    console.error("Error fetching books:", err);
                }
            };

            fetchBooks();
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    return (
        <div style={{ padding: "1rem" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Books Store</h1>
                <div>
                    {!token ? (
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
                    ) : (
                        <button onClick={logout}>Logout</button>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
            <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
            </div>
            {/* Books List */}
            <div className="books-list">
                {books.length === 0 ? (
                    searchQuery ? <p>No books found.</p> : null
                ) : (
                    books.map((book) => (
                        <Link
                            key={book.id}
                            to={`/books/${book.id}`}      // redirect to BookDetails page
                            className="book-card-link"
                        >
                            <div className="book-card">
                                <h3>{book.name}</h3>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Login message */}
            <p>{token ? "You are logged in." : "Please log in to continue."}</p>
        </div>
    );
}

export default Home;
