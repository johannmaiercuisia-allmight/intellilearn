import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ComputerIcon from '@mui/icons-material/Computer';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ScienceIcon from '@mui/icons-material/Science';

const courseColors = [
  { bg: '#EEF0FF', icon: <ComputerIcon fontSize="medium" sx={{ color: '#4C3BCF' }} /> },
  { bg: '#FFF0F9', icon: <SmartToyIcon fontSize="medium" sx={{ color: '#C026D3' }} /> },
  { bg: '#FFF7ED', icon: <EngineeringIcon fontSize="medium" sx={{ color: '#EA580C' }} /> },
  { bg: '#F0FDF4', icon: <AutoStoriesIcon fontSize="medium" sx={{ color: '#16A34A' }} /> },
  { bg: '#EFF6FF', icon: <ScienceIcon fontSize="medium" sx={{ color: '#2563EB' }} /> },
];

function MiniCalendar() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7;

  const days = [];
  for (let i = 0; i < startDow; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);

  const isToday = (d) => d && d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
  const highlighted = [9, 10, 13];

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <section className="right-card">
      <div className="right-card-header">
        <span>Calendar</span>
        <div>
          <button onClick={prevMonth} aria-label="Previous month"><ChevronLeftIcon fontSize="small" /></button>
          <button onClick={nextMonth} aria-label="Next month"><ChevronRightIcon fontSize="small" /></button>
        </div>
      </div>
      <div className="mini-calendar-grid">
        {dayNames.map(d => <div key={d} className="day-label">{d}</div>)}
        {days.map((d, i) => (
          <div key={i} className={`day-cell ${isToday(d) ? 'today' : highlighted.includes(d) ? 'highlight' : ''}`}>
            {d || ''}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then(async (res) => {
        setCourses(res.data.courses || []);
        const allAnn = [];
        for (const course of res.data.courses || []) {
          try {
            const r = await api.get(`/courses/${course.id}/announcements`);
            r.data.announcements.forEach(a => { a.course_name = course.name; });
            allAnn.push(...r.data.announcements);
          } catch (e) {
            // ignore per-course announcement failures
          }
        }
        allAnn.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setAnnouncements(allAnn.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-state">Loading your dashboard...</div>
    );
  }

  return (
    <div className="dashboard-grid">
      <div className="dashboard-main">
        <header className="dashboard-title-row">
          <h1>My Courses</h1>
          <div className="page-actions">
            <button className="action-btn" aria-label="Search"><SearchIcon fontSize="small" /></button>
            <button className="action-btn" aria-label="Notifications"><NotificationsIcon fontSize="small" /></button>
          </div>
        </header>

        <div className="courses-list">
          {courses.length === 0 ? (
            <div className="empty-card">No courses found yet.</div>
          ) : courses.map((course, idx) => {
            const theme = courseColors[idx % courseColors.length];
            return (
              <Link key={course.id} to={`/student/courses/${course.id}`} className="course-card">
                <div className="course-card-left" style={{ background: theme.bg }}>
                  {theme.icon}
                </div>
                <div className="course-card-content">
                  <h2>{course.name}</h2>
                  <p>{course.description || `${course.code || ''}  Section ${course.section || 'N/A'}`}</p>
                  <small>Created by <strong>{course.instructor?.first_name} {course.instructor?.last_name}</strong></small>
                </div>
                <div className="course-card-action"><ArrowForwardIosIcon sx={{ fontSize: 16 }} /></div>
              </Link>
            );
          })}
        </div>
      </div>

      <aside className="dashboard-side">
        <MiniCalendar />

        <section className="right-card">
          <div className="right-card-header">
            <span>Online Users</span>
            <a href="#!">See all</a>
          </div>
          <div className="online-users">
            {announcements.slice(0, 4).map((ann) => (
              <div key={ann.id} className="online-user-item">
                <div className="avatar-small">{ann.author?.first_name?.[0]}{ann.author?.last_name?.[0]}</div>
                <div>
                  <strong>{ann.author?.first_name} {ann.author?.last_name}</strong>
                  <small>{ann.course_name}</small>
                </div>
              </div>
            ))}
            {announcements.length === 0 && <p>No online users right now.</p>}
          </div>
        </section>
      </aside>
    </div>
  );
}
