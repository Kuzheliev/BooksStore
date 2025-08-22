import { useState } from "react";
import axios from "axios";

function UpdateButton({ productId }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const handleUpdate = () => {
        axios.put(`book/${productId}`, {
            id: productId,
            name: name,
            price: parseFloat(price)
        })
            .then(res => {
                alert("Product updated successfully!");
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
                alert("Failed to update product.");
            });
    };

    return (
        <div className="p-4 border rounded shadow w-64">
            <h3 className="text-lg font-bold mb-2">Update   </h3>

            <input
                className="border p-2 w-full mb-2 rounded"
                type="text"
                placeholder="Book Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                className="border p-2 w-full mb-2 rounded"
                type="number"
                placeholder="Book Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />

            <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Update
            </button>
        </div>
    );
}

export default UpdateButton;
