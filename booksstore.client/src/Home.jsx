import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import CreateButton from "./CreateButton";
import "./Home.css";

function Home() {
    const { token, logout, user } = useAuth();
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");

    // Unified fetch function
    const fetchBooks = async (search = "", genre = "") => {
        try {
            const params = {};
            if (search) params.search = search;
            if (genre) params.genre = genre;

            const response = await axios.get("/book", { params });
            setBooks(response.data);

            // Extract genres only once
            if (!genres.length) {
                const uniqueGenres = Array.from(
                    new Set(response.data.map(b => b.genre).filter(Boolean))
                );
                setGenres(uniqueGenres);
            }
        } catch (err) {
            console.error("Error fetching books:", err);
        }
    };

    // Fetch all books initially
    useEffect(() => {
        fetchBooks();
    }, []);

    // Fetch books when searchQuery or selectedGenre changes
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchBooks(searchQuery, selectedGenre);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, selectedGenre]);

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Books Store</h1>

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
                        onClick={() => setSelectedGenre("")} // Show all books
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
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            )}

            {/* Books List */}
            <div className="books-list">
                {books.length === 0 ? (
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
                                    alt={book.name}
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
