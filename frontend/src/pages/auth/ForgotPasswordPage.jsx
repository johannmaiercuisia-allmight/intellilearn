import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import logo from '../../assets/logo.png';
import loginBg from '../../assets/login_bg.png';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await api.post('/forgot-password', form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: [err.response?.data?.message || 'Something went wrong.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      backgroundImage: `url(${loginBg})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
    }}>
      <style>{`
        .fp-input-wrap {
          display: flex; align-items: center;
          border: 1.5px solid #dde3ed; border-radius: 10px;
          background: #f8fafc; overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .fp-input-wrap:focus-within {
          border-color: #173861;
          box-shadow: 0 0 0 3px rgba(23,56,97,0.08);
          background: #fff;
        }
        .fp-input {
          flex: 1; padding: 13px 10px 13px 0;
          border: none; background: transparent;
          font-size: 14px; color: #0f172a; outline: none;
          font-family: 'DM Sans', sans-serif;
        }
        .fp-input::placeholder { color: #94a3b8; }
        .fp-btn {
          width: 100%; background: #173861; color: white;
          border: none; border-radius: 10px; padding: 14px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(23,56,97,0.28);
        }
        .fp-btn:hover:not(:disabled) {
          background: #0f2a4a; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(23,56,97,0.38);
        }
        .fp-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        height: 68, background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(203,213,225,0.5)',
        boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', padding: '0 48px',
      }}>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src={logo} alt="IntelliLearn" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
        </Link>
      </nav>

      {/* Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          width: '100%', maxWidth: 420,
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 20, padding: '40px 40px 36px',
          boxShadow: '0 8px 40px rgba(23,56,97,0.14)',
        }}>
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#173861', marginBottom: 10 }}>Password Reset!</h2>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 28 }}>
                Your password has been successfully reset. Redirecting to login...
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: 30, fontWeight: 900, color: '#173861', margin: '0 0 8px', textAlign: 'center' }}>
                Reset Password
              </h2>
              <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 28, lineHeight: 1.6 }}>
                Enter your email and new password to reset your account.
              </p>

              {errors.general && (
                <div style={{
                  background: '#FEF2F2', color: '#DC2626', fontSize: 13,
                  padding: '10px 14px', borderRadius: 8, marginBottom: 16,
                  border: '1px solid #FECACA',
                }}>{errors.general[0]}</div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                    Email Address
                  </label>
                  <div className="fp-input-wrap" style={errors.email ? { borderColor: '#EF4444' } : {}}>
                    <span style={{ padding: '0 12px', display: 'flex', alignItems: 'center' }}>
                      <EmailOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    </span>
                    <input
                      type="email" className="fp-input"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  {errors.email && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.email[0]}</p>}
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                    New Password
                  </label>
                  <div className="fp-input-wrap" style={errors.password ? { borderColor: '#EF4444' } : {}}>
                    <span style={{ padding: '0 12px', display: 'flex', alignItems: 'center' }}>
                      <LockOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    </span>
                    <input
                      type="password" className="fp-input"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>
                  {errors.password && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.password[0]}</p>}
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                    Confirm New Password
                  </label>
                  <div className="fp-input-wrap">
                    <span style={{ padding: '0 12px', display: 'flex', alignItems: 'center' }}>
                      <LockOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    </span>
                    <input
                      type="password" className="fp-input"
                      placeholder="••••••••"
                      value={form.password_confirmation}
                      onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="fp-btn">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Link to="/login" style={{ fontSize: 13, color: '#173861', fontWeight: 700, textDecoration: 'none' }}>
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
