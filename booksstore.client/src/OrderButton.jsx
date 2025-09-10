import React from "react";
import { useNavigate } from "react-router-dom";

function OrderButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/orders");
    };

    return (
        <button className="btn admin-btn" onClick={handleClick}>
            Orders
        </button>
    );
}

export default OrderButton;
