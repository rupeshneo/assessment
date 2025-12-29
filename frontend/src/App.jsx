import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OrderList from './pages/OrderList';
import CreateOrder from './pages/CreateOrder';
import CreateChecklist from './pages/CreateChecklist';
import ConductInspection from './pages/ConductInspection';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/orders/create" element={<CreateOrder />} />
                    <Route path="/orders/:orderId/checklist/create" element={<CreateChecklist />} />
                    <Route path="/orders/:orderId/inspect" element={<ConductInspection />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
