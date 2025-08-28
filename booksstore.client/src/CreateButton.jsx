import React from "react";
import { useNavigate } from "react-router-dom";

function CreateButton() {
    const navigate = useNavigate();

    return (
        <button className="btn admin-btn" onClick={() => navigate("/books/new")}>
            Add New Book
        </button>
    );
}

export default CreateButton;