import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then((res) => setCourses(res.data.courses))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="dashboard-main">
        <header className="dashboard-title-row">
          <h1>Admin Panel</h1>
          <div className="page-actions">
            <Link to="/admin/courses/create" className="btn-primary">+ New Course</Link>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div className="stat-card">
            <div className="stat-label">Total Courses</div>
            <div className="stat-value">{courses.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{courses.reduce((sum, c) => sum + (c.students_count || 0), 0)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Courses</div>
            <div className="stat-value">
              {courses.filter((c) => c.status === 'active').length}
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>All Courses</h3>
          </div>
          <table style={{ width: '100%', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem' }}>Course</th>
                <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem' }}>Instructor</th>
                <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem' }}>Students</th>
                <th style={{ textAlign: 'left', padding: '12px 0', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.78rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 0', color: 'var(--text-body)' }}>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)' }}>{course.name}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.code}</p>
                  </td>
                  <td style={{ padding: '12px 0', color: 'var(--text-body)' }}>
                    {course.instructor?.first_name} {course.instructor?.last_name}
                  </td>
                  <td style={{ padding: '12px 0', color: 'var(--text-body)' }}>{course.students_count || 0}</td>
                  <td style={{ padding: '12px 0' }}>
                    <span className="badge" style={{
                      background: course.status === 'active' ? '#D1FADF' : '#F3F4F6',
                      color: course.status === 'active' ? '#047857' : '#6B7280'
                    }}>
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}