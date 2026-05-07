import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScienceIcon from '@mui/icons-material/Science';
import CodeIcon from '@mui/icons-material/Code';
import BiotechIcon from '@mui/icons-material/Biotech';
import CalculateIcon from '@mui/icons-material/Calculate';

// Green shades that complement the orange (#ea580c) instructor sidebar
const courseColors = [
  { bg: '#ECFDF5', icon: <MenuBookIcon   fontSize="medium" sx={{ color: '#059669' }} /> },
  { bg: '#F0FDF4', icon: <ScienceIcon    fontSize="medium" sx={{ color: '#16A34A' }} /> },
  { bg: '#DCFCE7', icon: <CodeIcon       fontSize="medium" sx={{ color: '#15803D' }} /> },
  { bg: '#D1FAE5', icon: <BiotechIcon    fontSize="medium" sx={{ color: '#047857' }} /> },
  { bg: '#A7F3D0', icon: <CalculateIcon  fontSize="medium" sx={{ color: '#065F46' }} /> },
];

export default function InstructorCoursesListPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = () => {
    api.get('/courses')
      .then((res) => setCourses(res.data.courses || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (e, courseId, courseName) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete "${courseName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="dashboard-main">

        {/* Page heading */}
        <header className="dashboard-title-row">
          <h1>My Courses</h1>
          <button
            onClick={() => navigate('/instructor/courses/create')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            + Create Course
          </button>
        </header>

        {/* Full course list */}
        <div className="courses-list">
          {courses.length === 0 ? (
            <div className="empty-card">No courses assigned yet.</div>
          ) : (
            courses.map((course, idx) => {
              const theme = courseColors[idx % courseColors.length];
              return (
                <div key={course.id} style={{ position: 'relative' }}>
                  <Link
                    to={`/instructor/courses/${course.id}`}
                    className="course-card"
                  >
                    <div className="course-card-left" style={{ background: theme.bg }}>
                      {theme.icon}
                    </div>
                    <div className="course-card-content">
                      <h2>{course.name}</h2>
                      <p>{course.code} · {course.section || 'Section A'}</p>
                      <small>{course.students_count || 0} students enrolled</small>
                    </div>
                    <div className="course-card-action" style={{
                      background: '#ECFDF5', color: '#059669',
                    }}>
                      →
                    </div>
                  </Link>
                  <button
                    onClick={(e) => handleDelete(e, course.id, course.name)}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: '#FEE2E2',
                      color: '#DC2626',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#FCA5A5';
                      e.target.style.color = '#991B1B';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#FEE2E2';
                      e.target.style.color = '#DC2626';
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}