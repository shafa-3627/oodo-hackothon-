import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ loginId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = signIn(form.loginId, form.password);
      if (result.success) navigate('/employees');
      else setError(result.error || 'Sign in failed.');
      setLoading(false);
    }, 400);
  };

  const fillCredentials = (loginId: string, password: string) => {
    setForm({ loginId, password });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">

        {/* Example credentials card */}
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Login Examples
          </p>
          <div className="space-y-2">
            {/* HR / Admin */}
            <button
              type="button"
              onClick={() => fillCredentials('admin@dayflow.com', 'Admin@123')}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  HR
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">HR / Admin</p>
                  <p className="text-xs text-gray-500 font-mono">admin@dayflow.com</p>
                </div>
              </div>
              <span className="text-xs text-purple-500 font-mono bg-purple-100 px-2 py-0.5 rounded">
                Admin@123
              </span>
            </button>

            {/* Employee */}
            <button
              type="button"
              onClick={() => fillCredentials('john@dayflow.com', 'Admin@123')}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  JS
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Employee (John Smith)</p>
                  <p className="text-xs text-gray-500 font-mono">john@dayflow.com</p>
                </div>
              </div>
              <span className="text-xs text-gray-600 font-mono bg-gray-200 px-2 py-0.5 rounded">
                Admin@123
              </span>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">↑ Click to auto-fill credentials</p>
        </div>

        {/* Sign In card */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm px-8 py-7">

          {/* App/Web Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 border border-gray-200 rounded px-4 py-1.5 bg-gray-50">
              <div className="w-5 h-5 rounded bg-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">D</span>
              </div>
              <span className="text-gray-500 text-xs font-medium">App/Web Logo</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Login ID / Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                Login Id/Email :-
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
                value={form.loginId}
                onChange={(e) => setForm({ ...form, loginId: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                Password :-
              </label>
              <input
                type="password"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* SIGN IN button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2.5 rounded transition-colors disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'SIGN IN'}
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Don't have an Account?{' '}
            <Link to="/signup" className="text-purple-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
