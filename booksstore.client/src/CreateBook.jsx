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
        <div className="p-4 border rounded shadow w-80">
            <h3 className="text-lg font-bold mb-4">Create New Book</h3>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full mb-2 rounded" />
            <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 w-full mb-2 rounded" />
            <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className="border p-2 w-full mb-2 rounded" />
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 w-full mb-2 rounded" />
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="border p-2 w-full mb-2 rounded" />
            <input type="text" placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} className="border p-2 w-full mb-2 rounded" />

            {/* File picker for image */}
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="border p-2 w-full mb-2 rounded" />

            <button onClick={handleCreate} disabled={!name || !price} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 w-full mb-2">
                Create
            </button>

            <Link to="/">
                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full">Back to Home</button>
            </Link>
        </div>
    );
}

export default CreateBook;
