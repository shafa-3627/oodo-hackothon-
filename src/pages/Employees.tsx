import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, X } from 'lucide-react';
import { useHR } from '../context/HRContext';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function StatusDot({ checkedIn, onLeave }: { checkedIn: boolean; onLeave: boolean }) {
  if (onLeave) return <span title="On Leave" className="text-blue-500 text-sm leading-none">✈</span>;
  return <span title={checkedIn ? 'Present' : 'Absent'}
    className={`w-3 h-3 rounded-full block flex-shrink-0 ${checkedIn ? 'bg-green-500' : 'bg-yellow-400'}`} />;
}

export default function Employees() {
  const { employees, attendance, checkIn, checkOut } = useHR();
  const { currentUser, signUp } = useAuth();
  const { refreshEmployees } = useHR();
  const navigate = useNavigate();

  const [search, setSearch]       = useState('');
  const [showNew, setShowNew]     = useState(false);
  const [newForm, setNewForm]     = useState({ name: '', email: '', phone: '', role: 'employee' as Role, password: '' });
  const [newError, setNewError]   = useState('');
  const [newResult, setNewResult] = useState('');

  const isAdmin  = currentUser?.role === 'admin';
  const today    = new Date().toISOString().split('T')[0];
  const myEmp    = employees.find((e) => e.id === currentUser?.id);
  const myRec    = attendance.find((a) => a.employeeId === currentUser?.id && a.date === today);

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase()) ||
    e.designation.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setNewError('');
    if (newForm.password.length < 6) { setNewError('Password must be at least 6 characters.'); return; }
    const result = signUp({ ...newForm });
    if (!result.success) { setNewError(result.error || 'Failed'); return; }
    refreshEmployees();
    setNewResult(result.loginId || '');
    setNewForm({ name: '', email: '', phone: '', role: 'employee', password: '' });
  };

  return (
    <div className="flex gap-0 min-h-[calc(100vh-48px)]">

      {/* ── Main ── */}
      <div className="flex-1 p-5">

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4">
          {isAdmin && (
            <button onClick={() => { setShowNew(true); setNewResult(''); setNewError(''); }}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-1.5 rounded transition-colors">
              NEW
            </button>
          )}
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full border border-gray-300 rounded px-3 py-1.5 pl-8 text-sm focus:outline-none focus:border-purple-400 bg-white"
              placeholder="Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Present</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> Absent</span>
          <span className="flex items-center gap-1.5"><span className="text-blue-500">✈</span> On Leave</span>
        </div>

        {/* Employee Card Grid — 3 columns */}
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((emp) => (
            <div key={emp.id}
              onClick={() => navigate(isAdmin && emp.id !== currentUser?.id ? `/employees/${emp.id}` : `/profile`)}
              className="bg-white border border-gray-200 rounded p-3 cursor-pointer hover:border-purple-300 hover:shadow-sm transition-all relative">

              {/* Status dot top-right */}
              <div className="absolute top-2.5 right-2.5">
                <StatusDot checkedIn={emp.checkedIn} onLeave={emp.onLeave} />
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center pt-1 pb-2">
                <div className="w-12 h-12 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 font-semibold text-sm mb-2 overflow-hidden">
                  {emp.profilePicture
                    ? <img src={emp.profilePicture} alt={emp.name} className="w-full h-full object-cover" />
                    : <User size={22} className="text-gray-400" />}
                </div>
                <p className="text-xs font-semibold text-gray-800 text-center truncate w-full px-1">{emp.name}</p>
                <p className="text-xs text-gray-400 text-center truncate w-full px-1">{emp.designation || '—'}</p>
              </div>

              {/* Department */}
              <div className="border-t border-gray-100 pt-1.5 mt-1">
                <p className="text-xs text-gray-400 text-center truncate">{emp.department || '—'}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">No employees found</div>
        )}
      </div>

      {/* ── Check In / Check Out side panel (employees only) ── */}
      {!isAdmin && myEmp && (
        <div className="w-48 border-l border-gray-200 bg-white flex flex-col p-4 gap-4 flex-shrink-0">

          {/* Check In */}
          <div className="border border-gray-200 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-3 h-3 rounded-full flex-shrink-0 transition-colors ${myEmp.checkedIn ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-600 font-medium">
                {myRec?.checkIn ? `In: ${myRec.checkIn}` : 'Not checked in'}
              </span>
            </div>
            <button disabled={!!myEmp.checkedIn}
              onClick={() => checkIn(currentUser!.id)}
              className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700 font-medium">
              Check In →
            </button>
          </div>

          {/* Check Out */}
          <div className="border border-gray-200 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">
                {myRec?.checkOut ? `Out: ${myRec.checkOut}` : 'Not checked out'}
              </span>
            </div>
            <button disabled={!myEmp.checkedIn || !!myRec?.checkOut}
              onClick={() => checkOut(currentUser!.id)}
              className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700 font-medium">
              Check Out →
            </button>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Use Check In/Out to mark attendance. Records appear in the Attendance module.
          </p>
        </div>
      )}

      {/* ── Admin: Create New Employee Modal ── */}
      {isAdmin && showNew && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Add New Employee</h3>
              <button onClick={() => setShowNew(false)}><X size={16} className="text-gray-400" /></button>
            </div>

            {newResult ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-2xl">✓</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Employee Created!</p>
                <p className="text-xs text-gray-500 mb-3">System-generated Login ID:</p>
                <div className="bg-purple-50 border border-purple-200 rounded px-3 py-2 mb-4">
                  <p className="font-mono font-bold text-purple-700 text-sm">{newResult}</p>
                </div>
                <p className="text-xs text-gray-400 mb-4">Share this Login ID with the employee. Default password was set during creation.</p>
                <button onClick={() => setShowNew(false)}
                  className="bg-purple-600 text-white text-sm px-4 py-2 rounded w-full">Close</button>
              </div>
            ) : (
              <form onSubmit={handleCreateEmployee} className="p-5 space-y-3">
                {newError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded">{newError}</div>}
                {[
                  { label: 'Full Name',    field: 'name',     type: 'text',     required: true },
                  { label: 'Work Email',   field: 'email',    type: 'email',    required: true },
                  { label: 'Phone',        field: 'phone',    type: 'tel',      required: false },
                  { label: 'Password',     field: 'password', type: 'password', required: true },
                ].map((f) => (
                  <div key={f.field}>
                    <label className="block text-xs text-gray-600 mb-1">{f.label}</label>
                    <input type={f.type} required={f.required}
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-400"
                      value={newForm[f.field as keyof typeof newForm]}
                      onChange={(e) => setNewForm({ ...newForm, [f.field]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Role</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-purple-400"
                    value={newForm.role}
                    onChange={(e) => setNewForm({ ...newForm, role: e.target.value as Role })}>
                    <option value="employee">Employee</option>
                    <option value="admin">HR / Admin</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded">Create</button>
                  <button type="button" onClick={() => setShowNew(false)} className="flex-1 border border-gray-300 text-sm py-2 rounded hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
