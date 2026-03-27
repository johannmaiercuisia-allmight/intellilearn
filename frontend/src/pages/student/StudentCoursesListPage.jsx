import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ComputerIcon from '@mui/icons-material/Computer';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ScienceIcon from '@mui/icons-material/Science';

const courseColors = [
  { bg: '#EEF3FF', icon: <ComputerIcon fontSize="medium" sx={{ color: '#4c6ef5' }} /> },
  { bg: '#FFF0F9', icon: <SmartToyIcon fontSize="medium" sx={{ color: '#C026D3' }} /> },
  { bg: '#FFF7ED', icon: <EngineeringIcon fontSize="medium" sx={{ color: '#EA580C' }} /> },
  { bg: '#F0FDF4', icon: <AutoStoriesIcon fontSize="medium" sx={{ color: '#16A34A' }} /> },
  { bg: '#EFF6FF', icon: <ScienceIcon fontSize="medium" sx={{ color: '#2563EB' }} /> },
];

export default function StudentCoursesListPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then((res) => setCourses(res.data.courses || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-state">Loading courses...</div>;
  }

  return (
    <div className="dashboard-main">

      {/* Page heading — same bold style as the original "My Courses" */}
      <header className="dashboard-title-row">
        <h1>My Courses</h1>
      </header>

      {/* Course cards — exact same markup as the original dashboard course list */}
      <div className="courses-list">
        {courses.length === 0 ? (
          <div className="empty-card">You are not enrolled in any courses yet.</div>
        ) : (
          courses.map((course, idx) => {
            const theme = courseColors[idx % courseColors.length];
            return (
              <Link
                key={course.id}
                to={`/student/courses/${course.id}`}
                className="course-card"
              >
                <div className="course-card-left" style={{ background: theme.bg }}>
                  {theme.icon}
                </div>
                <div className="course-card-content">
                  <h2>{course.name}</h2>
                  <p>
                    {course.description ||
                      `${course.code || ''}  Section ${course.section || 'N/A'}`}
                  </p>
                  <small>
                    By <strong>
                      {course.instructor?.first_name} {course.instructor?.last_name}
                    </strong>
                  </small>
                </div>
                <div className="course-card-action">
                  <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}