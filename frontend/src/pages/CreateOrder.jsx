import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const CreateOrder = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        clientId: '',
        inspectionManagerId: ''
    });
    const [users, setUsers] = useState([]); // To select client and inspection manager
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch users to populate dropdowns
        // Assuming there's an endpoint to get users by role or all users
        // Based on routes, /users might be available.
        // Let's try to fetch all users and filter client-side for now if backend doesn't support filtering
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users'); // Need to verify this endpoint
                setUsers(response.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/orders', formData);
            navigate('/orders');
        } catch (err) {
            setError('Failed to create order');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const clients = users.filter(u => u.role === 'client');
    const inspectionManagers = users.filter(u => u.role === 'inspection');

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Order</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <Input
                    label="Order Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <select
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Manager</label>
                    <select
                        name="inspectionManagerId"
                        value={formData.inspectionManagerId}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Inspection Manager</option>
                        {inspectionManagers.map(manager => (
                            <option key={manager.id} value={manager.id}>{manager.name} ({manager.email})</option>
                        ))}
                    </select>
                </div>

                <Button type="submit" disabled={loading} className="w-full mt-4">
                    {loading ? 'Creating...' : 'Create Order'}
                </Button>
            </form>
        </div>
    );
};

export default CreateOrder;
