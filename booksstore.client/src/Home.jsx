import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { useCart } from "./CartContext";
import CreateButton from "./CreateButton";
import "./styles/Home.css";

function Home() {
    const { token, logout, user } = useAuth();
    const { cart } = useCart();

    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper: fetch books with optional search/genre, with retry
    const fetchBooks = async (search = "", genre = "", retries = 10, delay = 1000) => {
        setLoading(true);
        setError(null);

        for (let i = 0; i < retries; i++) {
            try {
                const params = {};
                if (search) params.search = search;
                if (genre) params.genre = genre;

                const response = await axios.get("/book", { params });
                setBooks(response.data);

                // Only update genres on initial load
                if (!search && !genre) {
                    const uniqueGenres = Array.from(
                        new Set(response.data.map(b => b.genre).filter(Boolean))
                    );
                    setGenres(uniqueGenres);
                }

                setLoading(false);
                return; // success
            } catch (err) {
                console.warn(`Fetch attempt ${i + 1} failed. Retrying in ${delay}ms...`);
                if (i === retries - 1) {
                    setError("Failed to load books. Server may not be ready.", err);
                    setLoading(false);
                } else {
                    await new Promise(res => setTimeout(res, delay));
                }
            }
        }
    };

    // Load all books on first render
    useEffect(() => {
        if (!token) return;
        fetchBooks();
    }, [token]);

    // Re-fetch books on search or genre change (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBooks(searchQuery, selectedGenre);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedGenre]);

    return (
        <div className="home-container">
            <header className="home-header">
                <Link to="/" className="home-title-link">
                    <h1>Books Store</h1>
                </Link>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="header-search-input"
                />

                <div className="header-buttons">
                    {user?.isAdmin && <CreateButton />}

                    <Link to="/cart">
                        <button className="btn cart-btn">Cart</button>
                    </Link>
                    {cart.length > 0 && <span className="cart-indicator"></span>}

                    {!token ? (
                        <Link to="/login">
                            <button className="btn login-btn">Login</button>
                        </Link>
                    ) : (
                        <button className="btn logout-btn" onClick={logout}>
                            Logout
                        </button>
                    )}
                </div>
            </header>

            {/* Genre Carousel */}
            {genres.length > 0 && (
                <div className="genres-carousel">
                    <button
                        className={`genre-btn ${selectedGenre === "" ? "active" : ""}`}
                        onClick={() => setSelectedGenre("")}
                        aria-pressed={selectedGenre === ""}
                    >
                        All Genres
                    </button>
                    {genres.map((genre) => (
                        <button
                            key={genre}
                            className={`genre-btn ${selectedGenre === genre ? "active" : ""}`}
                            onClick={() =>
                                setSelectedGenre(genre === selectedGenre ? "" : genre)
                            }
                            aria-pressed={selectedGenre === genre}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            )}

            {/* Books List */}
            <div className="books-list">
                {loading && books.length === 0 ? (
                    <p>Loading books...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : books.length === 0 ? (
                    <p>No books found.</p>
                ) : (
                    books.map((book) => (
                        <Link
                            key={book.id}
                            to={`/books/${book.id}`}
                            className="book-card-link"
                        >
                            <div className="book-card">
                                <img
                                    src={
                                        book.imageUrl
                                            ? book.imageUrl.replace(/^\/?wwwroot/, "")
                                            : "/placeholder.png"
                                    }
                                    alt={book.name || "Book cover"}
                                />
                                <h3>{book.name}</h3>
                                <p>{book.author}</p>
                                <p>${book.price?.toFixed(2)}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;
