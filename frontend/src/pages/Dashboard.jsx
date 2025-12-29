import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Actions based on Role */}
                <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Orders</h3>
                    <p className="text-gray-500 mb-4">Manage and view all your orders.</p>
                    <Link to="/orders">
                        <Button variant="primary" className="w-full">View Orders</Button>
                    </Link>
                </div>

                {user?.role === 'procurement' && (
                    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Create Order</h3>
                        <p className="text-gray-500 mb-4">Create a new procurement order.</p>
                        <Link to="/orders/create">
                            <Button variant="secondary" className="w-full">Create New Order</Button>
                        </Link>
                    </div>
                )}

                {/* Add more cards based on role */}
                <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile</h3>
                    <p className="text-gray-500 mb-4">View and edit your profile settings.</p>
                    <Button variant="outline" className="w-full">Manage Profile</Button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
