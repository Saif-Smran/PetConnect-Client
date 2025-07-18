import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminLayout from './AdminLayout';

const AdminLayoutRoute = () => {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <Navbar />
            <div className="flex-1 flex">
                <AdminLayout>
                    <Outlet />
                </AdminLayout>
            </div>
            <Footer />
        </div>
    );
};

export default AdminLayoutRoute;
