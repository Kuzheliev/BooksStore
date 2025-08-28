import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import CreateButton from "./CreateButton";

function Home() {
    const { token, logout, user } = useAuth();

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
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <h1>Books Store</h1>  

                {/* Search Bar */}
                <div>
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="header-search-input"
                    />
                </div>
                <div className="header-buttons">
                    {user?.isAdmin && <CreateButton />}

                    {!token ? (
                        <Link to="/login">
                            <button className="btn login-btn">Login</button>
                        </Link>
                    ) : (
                        <button className="btn logout-btn" onClick={logout}>Logout</button>
                    )}
                </div>
            </header>

            {/* Books List */}
            <div className="books-list">
                {books.length === 0 ? (
                    searchQuery ? <p>No books found.</p> : null
                ) : (
                    books.map((book) => (
                        <Link
                            key={book.id}
                            to={`/books/${book.id}`}
                            className="book-card-link"
                        >
                            <div className="book-card">
                                <h3>{book.name}</h3>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;
