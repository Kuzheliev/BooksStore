import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styles/CreateBook.css";

function CreateBook() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [genre, setGenre] = useState("");
    const [image, setImageFile] = useState(null);

    const handleCreate = async () => {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("Name", name);
        formData.append("Description", description);
        formData.append("Author", author);
        formData.append("Title", title);
        formData.append("Price", parseFloat(price));
        formData.append("Genre", genre);
        if (image) formData.append("Image", image);

        try {
            const res = await axios.post("/Book", formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("Book created successfully!");
            setName(""); setDescription(""); setAuthor(""); setTitle("");
            setPrice(""); setGenre(""); setImageFile(null);
            console.log(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to create book.");
        }
    };

    return (
        <div className="create-book-container">
            <h2 className="create-book-title">Create New Book</h2>

            <div className="create-book-form">
                <label>Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />

                <label>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} />

                <label>Author</label>
                <input type="text" value={author} onChange={e => setAuthor(e.target.value)} />

                <label>Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} />

                <label>Price</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} />

                <label>Genre</label>
                <input type="text" value={genre} onChange={e => setGenre(e.target.value)} />

                <label>Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                {image && (
                    <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="preview-image"
                    />
                )}

                <button
                    onClick={handleCreate}
                    disabled={!name || !price}
                    className="create-button"
                >
                    Create
                </button>

                <Link to="/">
                    <button className="back-button">Back to Home</button>
                </Link>
            </div>
        </div>
    );
}

export default CreateBook;
