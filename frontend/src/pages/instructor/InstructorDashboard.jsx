import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function InstructorDashboard() {
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
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="page-content">
      <div className="dashboard-main">
        <header className="dashboard-title-row">
          <h1>My Courses</h1>
          <div className="page-actions">
            <button className="action-btn" aria-label="Search">🔍</button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div className="stat-card">
            <div className="stat-label">My Courses</div>
            <div className="stat-value">{courses.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{courses.reduce((sum, c) => sum + (c.students_count || 0), 0)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Grading</div>
            <div className="stat-value">—</div>
          </div>
        </div>

        <div className="courses-list">
          {courses.length === 0 ? (
            <div className="empty-card">No courses created yet.</div>
          ) : courses.map((course) => (
            <Link key={course.id} to={`/instructor/courses/${course.id}`} className="course-card">
              <div className="course-card-left" style={{ background: 'var(--purple-light)' }}>
                📚
              </div>
              <div className="course-card-content">
                <h2 className="course-card-title">{course.name}</h2>
                <p className="course-card-desc">{course.code} · {course.section || 'Section A'}</p>
                <small>{course.students_count || 0} students enrolled</small>
              </div>
              <div className="course-card-action">→</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
