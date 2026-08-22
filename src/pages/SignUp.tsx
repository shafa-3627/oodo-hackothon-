import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHR } from '../context/HRContext';
import type { Role } from '../types';

export default function SignUp() {
  const { signUp } = useAuth();
  const { refreshEmployees } = useHR();
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'employee' as Role,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdLoginId, setCreatedLoginId] = useState('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = signUp({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      });
      if (result.success) {
        refreshEmployees();
        setCreatedLoginId(result.loginId || '');
      } else {
        setError(result.error || 'Registration failed.');
      }
      setLoading(false);
    }, 400);
  };

  /* ── Success screen ── */
  if (createdLoginId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-300 rounded-lg px-8 py-8 shadow-sm w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-base font-bold text-gray-800 mb-2">Account Created!</h2>
          <p className="text-xs text-gray-500 mb-3">Your system-generated Login ID:</p>
          <div className="bg-purple-50 border border-purple-200 rounded px-3 py-2 mb-4">
            <p className="font-mono font-bold text-purple-700 text-sm tracking-wider">{createdLoginId}</p>
          </div>
          <p className="text-xs text-gray-400 mb-5">Use this Login ID and your password to sign in.</p>
          <button onClick={() => navigate('/signin')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 rounded transition-colors">
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  /* ── Sign Up Form ── */
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm w-full max-w-md px-10 py-8">

        {/* Header: Logo + Upload */}
        <div className="flex items-center justify-between mb-7">
          <div
            onClick={() => logoInputRef.current?.click()}
            className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {logoPreview
              ? <img src={logoPreview} alt="logo" className="h-5 w-16 object-contain" />
              : <>
                  <div className="w-5 h-5 rounded bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">D</span>
                  </div>
                  <span className="text-gray-500 text-xs">App/Web Logo</span>
                </>
            }
          </div>

          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="flex items-center gap-1.5 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Upload size={12} />
            Upload Logo
          </button>
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Company Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Company Name :-</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Name :-</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Email :-</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Phone :-</label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Role :-</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            >
              <option value="employee">Employee</option>
              <option value="admin">HR / Admin</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Password :-</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400 pr-9"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Confirm Password :-</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400 pr-9"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Sign Up button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2.5 rounded transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Already have an account ?{' '}
          <Link to="/signin" className="text-purple-600 hover:underline font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
