import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CreateBook() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [genre, setGenre] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const handleCreate = () => {
        const token = localStorage.getItem("token");

        axios.post("https://localhost:59211/api/book", {
            name,
            description,
            author,
            title,
            price: parseFloat(price),
            genre,
            imageUrl
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                alert("Book created successfully!");
                setName(""); setDescription(""); setAuthor(""); setTitle("");
                setPrice(""); setGenre(""); setImageUrl("");
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
                alert("Failed to create book.");
            });
    };

    return (
        <div className="p-4 border rounded shadow w-80">
            <h3 className="text-lg font-bold mb-4">Create New Book</h3>

            <input className="border p-2 w-full mb-2 rounded" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input className="border p-2 w-full mb-2 rounded" type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <input className="border p-2 w-full mb-2 rounded" type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
            <input className="border p-2 w-full mb-2 rounded" type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <input className="border p-2 w-full mb-2 rounded" type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
            <input className="border p-2 w-full mb-2 rounded" type="text" placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
            <input className="border p-2 w-full mb-2 rounded" type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />

            <button
                onClick={handleCreate}
                disabled={!name || !price}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 w-full mb-2"
            >
                Create
            </button>
            <Link to="/">
                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full">
                    Back to Home
                </button>
            </Link>
        </div>
    );
}

export default CreateBook;
