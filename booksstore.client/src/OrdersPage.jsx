import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './styles/OrdersPage.css'; // Dark theme CSS

const OrdersPage = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/order', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load orders.');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchOrders();
    }, [token]);

    return (
        <div className="orders-page">
            <div className="orders-header">
                <button className="btn back-btn" onClick={() => navigate('/')}>
                    &larr; Back to Main Menu
                </button>
                <h1>Orders</h1>
            </div>

            {loading && <p>Loading orders...</p>}
            {error && <p>{error}</p>}
            {!loading && orders.length === 0 && <p>No orders found.</p>}

            {orders.length > 0 && (
                <div className="orders-table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User</th>
                                <th>Name</th>
                                <th>City</th>
                                <th>Country</th>
                                <th>Address</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th>CheckOut Date</th>
                                <th>Price</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.user?.name || order.user?.email}</td>
                                    <td>{order.name}</td>
                                    <td>{order.city}</td>
                                    <td>{order.country}</td>
                                    <td>{order.address}</td>
                                    <td>{order.email}</td>
                                    <td>{order.phone}</td>
                                    <td>{order.paymentMethod}</td>
                                    <td>{order.status}</td>
                                    <td>{new Date(order.checkOutDate).toLocaleString()}</td>
                                    <td>${order.price.toFixed(2)}</td>
                                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                                    <td>{new Date(order.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <ul>
                                            {order.items?.map(item => (
                                                <li key={item.id}>
                                                    {item.bookName} x {item.quantity} (${item.price.toFixed(2)})
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
