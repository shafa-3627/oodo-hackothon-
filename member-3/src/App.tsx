import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../member-2/src/context/AuthContext';
import { HRProvider } from '../../member-2/src/context/HRContext';
import Layout from '../../member-1/src/components/Layout';
import SignIn from '../../member-1/src/pages/SignIn';
import SignUp from '../../member-1/src/pages/SignUp';
import Employees from '../../member-1/src/pages/Employees';
import Profile from '../../member-1/src/pages/Profile';
import Attendance from '../../member-1/src/pages/Attendance';
import TimeOff from '../../member-1/src/pages/TimeOff';

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
