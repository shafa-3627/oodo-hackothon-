import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHR } from '../context/HRContext';
import { User, LogOut } from 'lucide-react';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function TopNav() {
  const { currentUser, signOut } = useAuth();
  const { employees } = useHR();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const myEmp = employees.find((e) => e.id === currentUser?.id);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    signOut();
    navigate('/signin');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 h-12">
      <div className="flex items-center h-full px-4 gap-0">

        {/* Company Logo */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-200 h-full">
          <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">D</span>
          </div>
          <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">Company Logo</span>
        </div>

        {/* Nav tabs */}
        <nav className="flex items-center h-full">
          {[
            { to: '/employees',  label: 'Employees'  },
            { to: '/attendance', label: 'Attendance' },
            { to: '/timeoff',    label: 'Time Off'   },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'h-full flex items-center px-4 text-sm font-semibold text-purple-700 border-b-2 border-purple-600 bg-purple-50'
                  : 'h-full flex items-center px-4 text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-gray-50 border-b-2 border-transparent transition-colors'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side: status dot + avatar */}
        <div className="ml-auto flex items-center gap-3" ref={dropRef}>

          {/* Status dot — red when checked out, green when checked in */}
          <div
            title={myEmp?.checkedIn ? 'Present' : 'Not checked in'}
            className={`w-3 h-3 rounded-full flex-shrink-0 ${
              myEmp?.checkedIn ? 'bg-green-500' : 'bg-red-500'
            }`}
          />

          {/* Avatar button */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded px-2 py-1 transition-colors"
          >
            {/* Avatar circle */}
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
              {getInitials(currentUser?.name || 'U')}
            </div>
          </button>

          {/* Dropdown — My Profile + Log Out */}
          {dropdownOpen && (
            <div className="absolute right-4 top-12 w-40 bg-white border border-gray-200 rounded shadow-lg py-1 z-50">
              <button
                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User size={14} className="text-gray-400" />
                My Profile
              </button>
              <hr className="border-gray-100" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={14} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
