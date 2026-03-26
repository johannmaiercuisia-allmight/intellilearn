import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function StudentProfilePage() {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await api.put('/profile', form);
      setMessage('Profile updated successfully.');
      setEditing(false);
      // Update local storage
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await api.put('/profile/password', passwordForm);
      setMessage('Password changed successfully.');
      setShowPasswordForm(false);
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors?.current_password) {
        setError(errors.current_password[0]);
      } else if (errors?.password) {
        setError(errors.password[0]);
      } else {
        setError(err.response?.data?.message || 'Failed to change password.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-indigo-600">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user?.first_name} {user?.last_name}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-600 text-sm px-4 py-3 rounded-lg border border-emerald-100">{message}</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">{error}</div>
      )}

      {/* Personal info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Edit</button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
                <input type="text" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
                <input type="text" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditing(false)}
                className="bg-slate-100 text-slate-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">First name</p>
                <p className="text-sm text-slate-800 mt-1 font-medium">{user?.first_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Last name</p>
                <p className="text-sm text-slate-800 mt-1 font-medium">{user?.last_name}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
              <p className="text-sm text-slate-800 mt-1 font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Role</p>
              <p className="text-sm text-slate-800 mt-1 font-medium capitalize">{user?.role}</p>
            </div>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Security</h3>
          <button onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordForm ? (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Current password</label>
              <input type="password" value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
              <input type="password" value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Minimum 8 characters" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
              <input type="password" value={passwordForm.password_confirmation}
                onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
            </div>
            <button type="submit" disabled={saving}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        ) : (
          <p className="text-sm text-slate-500">Click "Change Password" to update your password.</p>
        )}
      </div>

      {/* Logout */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-500 mb-4">Logging out will end your current session.</p>
        <button onClick={logout}
          className="bg-red-50 text-red-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-100 border border-red-200 transition-colors">
          Log out
        </button>
      </div>
    </div>
  );
}
