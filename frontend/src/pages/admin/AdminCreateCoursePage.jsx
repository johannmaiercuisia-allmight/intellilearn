import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AdminCreateCoursePage() {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    instructor_id: '',
    semester: '',
    section: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch instructors for the dropdown
    api.get('/admin/users')
      .then((res) => {
        const inst = res.data.users.filter((u) => u.role === 'instructor');
        setInstructors(inst);
      })
      .catch(() => setInstructors([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setErrors({});

    try {
      await api.post('/courses', {
        ...form,
        instructor_id: parseInt(form.instructor_id),
      });
      navigate('/admin/courses');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Failed to create course.');
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) => `w-full px-4 py-2.5 rounded-lg border text-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
    placeholder-slate-400 ${errors[field] ? 'border-red-400' : 'border-slate-300'}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => navigate('/admin/courses')}
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4"
        >
          ← Back to courses
        </button>
        <h2 className="text-xl font-bold text-slate-800">Create New Course</h2>
        <p className="text-sm text-slate-500 mt-1">Fill in the details to create a new course.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Course Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass('name')}
              placeholder="e.g. Social and Professional Issues II"
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
          </div>

          {/* Course code */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Course Code</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className={inputClass('code')}
              placeholder="e.g. SPI2-2026-A"
              required
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code[0]}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass('description')}
              placeholder="Course description (optional)"
              rows={3}
            />
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Assign Instructor</label>
            <select
              value={form.instructor_id}
              onChange={(e) => setForm({ ...form, instructor_id: e.target.value })}
              className={inputClass('instructor_id')}
              required
            >
              <option value="">Select an instructor...</option>
              {instructors.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.first_name} {inst.last_name} ({inst.email})
                </option>
              ))}
            </select>
            {errors.instructor_id && <p className="text-red-500 text-xs mt-1">{errors.instructor_id[0]}</p>}
            {instructors.length === 0 && (
              <p className="text-amber-500 text-xs mt-1">
                No instructors found. Create an instructor account first in User Management.
              </p>
            )}
          </div>

          {/* Semester and Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Semester</label>
              <input
                type="text"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className={inputClass('semester')}
                placeholder="e.g. 2nd Semester 2025-2026"
                required
              />
              {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Section</label>
              <input
                type="text"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                className={inputClass('section')}
                placeholder="e.g. BSIT-3A"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold
                hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Creating...' : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/courses')}
              className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium
                hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
