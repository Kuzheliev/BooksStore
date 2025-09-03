import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/EditBook.css";

function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [genre, setGenre] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [inStock, setInStock] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`/book/id/${id}`);
                const book = response.data;
                setName(book.name || "");
                setDescription(book.description || "");
                setAuthor(book.author || "");
                setTitle(book.title || "");
                setPrice(book.price || "");
                setGenre(book.genre || "");
                setImageUrl(book.imageUrl || "");
                setInStock(book.inStock || false);

            } catch (err) {
                console.error("Error fetching book:", err);
                alert("Failed to fetch book data.");
            }
        };

        fetchBook();
    }, [id]);

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("author", author);
            formData.append("title", title);
            formData.append("price", parseFloat(price));
            formData.append("genre", genre);
            formData.append("inStock", inStock ? "true" : "false"); 
            if (imageFile) {
                formData.append("Image", imageFile);
            }

            const token = localStorage.getItem("token");

            await axios.put(`/book/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Book updated successfully!");
            navigate(`/books/${id}`);
        } catch (err) {
            console.error("Failed to update book:", err);
            alert("Failed to update book.");
        }
    };

    return (
        <div className="edit-book-container">
            <h2 className="edit-book-title">Edit Book</h2>

            <div className="edit-book-form">
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label>Author</label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />

                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label>Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <label>Genre</label>
                <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                />

                <label>Image</label>
                <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
                {imageUrl && !imageFile && (
                    <img
                        src={imageUrl.replace(/^\/?wwwroot/, "")}
                        alt="Book"
                        className="preview-image"
                    />
                )}
                <label>Stock Status</label>
                <select
                    value={inStock ? "true" : "false"}  
                    onChange={(e) => setInStock(e.target.value === "true")}
                >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                </select>

                <button onClick={handleUpdate} className="update-button">
                    Update Book
                </button>
            </div>
        </div>
    );
}

export default EditBook;
