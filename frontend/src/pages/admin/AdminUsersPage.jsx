import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    // We'll use the register endpoint to create users
    // and a custom query to list them. For now, fetch from psql or
    // we'll add a lightweight admin users endpoint
    api.get('/admin/users')
      .then((res) => setUsers(res.data.users))
      .catch(() => {
        // Fallback: if endpoint doesn't exist yet, show empty
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter((u) =>
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const toggleActive = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}`, { is_active: !isActive });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, is_active: !isActive } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>;
  }

  const roleColors = {
    student: 'bg-blue-100 text-blue-700',
    instructor: 'bg-teal-100 text-teal-700',
    admin: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500 mt-1">{users.length} total users</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium
            hover:bg-indigo-700 transition-colors"
        >
          + Add User
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            placeholder-slate-400"
        />
      </div>

      {/* Create user form */}
      {showCreateForm && (
        <CreateUserForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => { setShowCreateForm(false); fetchUsers(); }}
        />
      )}

      {/* Users table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <p className="text-slate-500 p-8 text-center">
            {search ? 'No users match your search.' : 'No users found. The admin users API endpoint may need to be set up.'}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-5 py-3 font-medium text-slate-600">Email</th>
                <th className="text-left px-5 py-3 font-medium text-slate-600">Role</th>
                <th className="text-left px-5 py-3 font-medium text-slate-600">Status</th>
                <th className="text-right px-5 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{user.first_name} {user.last_name}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{user.email}</td>
                  <td className="px-5 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer
                        ${roleColors[user.role]} appearance-none text-center`}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(user.id, user.is_active)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer
                        ${user.is_active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'}`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function CreateUserForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '',
    password_confirmation: '', role: 'student',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/admin/users', form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6">
      <h4 className="font-semibold text-slate-800 mb-4">Add New User</h4>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="First name" value={form.first_name} required
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          <input type="text" placeholder="Last name" value={form.last_name} required
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <input type="email" placeholder="Email" value={form.email} required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        <div className="grid grid-cols-2 gap-3">
          <input type="password" placeholder="Password" value={form.password} required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          <input type="password" placeholder="Confirm password" value={form.password_confirmation} required
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {saving ? 'Creating...' : 'Create User'}
          </button>
          <button type="button" onClick={onClose}
            className="bg-white text-slate-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 border border-slate-300 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
