import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HRProvider } from './context/HRContext';
import Layout from './components/Layout';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Employees from './pages/Employees';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import TimeOff from './pages/TimeOff';

export default function App() {
  return (
    <AuthProvider>
      <HRProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected — top-nav layout */}
            <Route element={<Layout />}>
              <Route path="/employees"        element={<Employees />} />
              <Route path="/employees/:id"    element={<Profile />} />
              <Route path="/profile"          element={<Profile />} />
              <Route path="/attendance"       element={<Attendance />} />
              <Route path="/timeoff"          element={<TimeOff />} />
            </Route>

            {/* Default */}
            <Route path="*" element={<Navigate to="/employees" replace />} />
          </Routes>
        </BrowserRouter>
      </HRProvider>
    </AuthProvider>
  );
}
