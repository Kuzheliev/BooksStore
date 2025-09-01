import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/CreateAccount.css';

const CreateAccount = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        city: '',
        address: '',
        country: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Call backend register API
            const response = await axios.post('/auth/register', {
                Name: form.username,
                Email: form.email,
                Phone: form.phoneNumber,
                City: form.city,
                Address: form.address,
                Country: form.country,
                Password: form.password,
            });

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setSuccess(true);

            // Redirect after success
            setTimeout(() => navigate('/'), 1500);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    const handleBack = () => {
        navigate(-1); // go back to previous page
    };

    return (
        <div className="create-account-container">
            <h2>Create Account</h2>
            {error && <div className="error">{error}</div>}
            {success ? (
                <div className="success">Account created successfully! Redirecting...</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {[
                        { label: 'Username', name: 'username', type: 'text', required: true },
                        { label: 'Email', name: 'email', type: 'email', required: true },
                        { label: 'Phone Number', name: 'phoneNumber', type: 'tel' },
                        { label: 'City', name: 'city', type: 'text' },
                        { label: 'Address', name: 'address', type: 'text' },
                        { label: 'Country', name: 'country', type: 'text' },
                        { label: 'Password', name: 'password', type: 'password', required: true },
                        { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true },
                    ].map((field) => (
                        <div key={field.name}>
                            <label htmlFor={field.name}>{field.label}:</label>
                            <input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                value={form[field.name]}
                                onChange={handleChange}
                                required={field.required}
                            />
                        </div>
                    ))}

                    <button type="submit" className="btn register-btnl">
                        Create Account
                    </button>
                    <button type="button" className="btn cancel-btn" onClick={handleBack}>
                        Back
                    </button>
                </form>
            )}
        </div>
    );
};

export default CreateAccount;
