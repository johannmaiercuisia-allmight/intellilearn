import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'instructor') navigate('/instructor');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '1.8rem', fontWeight: 800,
            color: '#fff', letterSpacing: '-0.02em',
          }}>
            <span style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
              borderRadius: 10,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 900, color: 'white',
              boxShadow: '0 4px 14px rgba(139,92,246,0.5)',
            }}>IL</span>
            Intellilearn
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8, fontSize: '0.875rem' }}>
            AI-Powered Learning Management System
          </p>
        </div>

        <div className="auth-card">
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '1.35rem', fontWeight: 800,
            color: 'var(--text-dark)', marginBottom: 24, marginTop: 0,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            Welcome back 👋
          </h2>

          {error && (
            <div style={{
              background: '#FEF2F2', color: '#DC2626', fontSize: '0.82rem',
              padding: '12px 14px', borderRadius: 10, marginBottom: 18,
              border: '1px solid #FECACA',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@omsc.edu.ph"
                required
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-body)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--purple-primary)' }} />
                Remember me
              </label>
              <Link to="/forgot-password" style={{
                fontSize: '0.82rem', color: 'var(--purple-primary)',
                textDecoration: 'none', fontWeight: 600,
              }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '12px' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 24, marginBottom: 0 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--purple-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}