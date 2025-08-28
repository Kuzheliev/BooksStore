import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


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

            console.log("formData", formData);


            alert("Book updated successfully!");
            navigate(`/books/${id}`);
        } catch (err) {
            console.error("Failed to update book:", err);
            alert("Failed to update book.");
        }
    };

    return (
        <div className="p-4 border rounded shadow w-80">
            <h3 className="text-lg font-bold mb-4">Edit Book</h3>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
            />
            <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
            />
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
            />
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
            />
            <input
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
            />

            <div className="mb-2">
                <label className="block mb-1">Image</label>
                <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="border p-2 w-full rounded"
                />
                {imageUrl && !imageFile && (
                    <img
                        src={imageUrl.replace(/^\/?wwwroot/, "")}
                        alt="Book"
                        style={{ maxWidth: "100px", marginTop: "5px" }}
                    />
                )}
            </div>
            
            <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
                Edit
                </button>
            
        </div>
    );
}

export default EditBook;
