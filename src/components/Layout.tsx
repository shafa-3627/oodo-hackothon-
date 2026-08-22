import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import TopNav from './TopNav';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <TopNav />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
