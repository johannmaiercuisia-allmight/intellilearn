import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ComputerIcon from '@mui/icons-material/Computer';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ScienceIcon from '@mui/icons-material/Science';
import PushPinIcon from '@mui/icons-material/PushPin';

const courseColors = [
  { bg: '#EEF3FF', icon: <ComputerIcon fontSize="medium" sx={{ color: '#4c6ef5' }} /> },
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

  const isToday = (d) =>
    d && d === now.getDate() && month === now.getMonth() && year === now.getFullYear();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <section className="right-card">
      <div className="right-card-header">
        <span>{monthNames[month]} {year}</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={prevMonth} className="cal-nav-btn"><ChevronLeftIcon fontSize="small" /></button>
          <button onClick={nextMonth} className="cal-nav-btn"><ChevronRightIcon fontSize="small" /></button>
        </div>
      </div>
      <div className="mini-calendar-grid">
        {dayNames.map(d => <div key={d} className="day-label">{d}</div>)}
        {days.map((d, i) => (
          <div key={i} className={`day-cell${isToday(d) ? ' today' : ''}${!d ? ' empty' : ''}`}>
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
      .then(async (coursesRes) => {
        const courseList = coursesRes.data.courses || [];
        setCourses(courseList);

        const allAnn = [];
        await Promise.all(
          courseList.map(async (course) => {
            try {
              const r = await api.get(`/courses/${course.id}/announcements`);
              r.data.announcements.forEach(a => {
                a.course_name = course.name;
                a.course_id = course.id;
              });
              allAnn.push(...r.data.announcements);
            } catch (_) {}
          })
        );
        allAnn.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setAnnouncements(allAnn);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-state">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard-grid">

      {/* ── Main Column ── */}
      <div className="dashboard-main">

        {/* Greeting — same bold heading style as the original "My Courses" */}
        <header className="dashboard-title-row">
          <div>
            <h1>Welcome back, {user?.first_name || 'Student'}!</h1>
            <p className="dashboard-subtitle">
              Here's what's happening across your courses.
            </p>
          </div>
        </header>

        {/* Announcements — identical markup to the original */}
        <div className="announcements-section">
          <h2 className="announcements-heading">Announcements</h2>

          {announcements.length === 0 ? (
            <div className="empty-card">No announcements yet.</div>
          ) : (
            <div className="announcements-list">
              {announcements.map((ann) => (
                <Link
                  key={ann.id}
                  to={`/student/courses/${ann.course_id}`}
                  className="ann-card-link"
                >
                  <div className="ann-card">
                    <div className="ann-card-inner">
                      {ann.is_pinned && (
                        <PushPinIcon
                          sx={{ fontSize: 15, color: '#f59e0b', marginTop: '2px', flexShrink: 0 }}
                        />
                      )}
                      <div className="ann-card-body">
                        <div className="ann-card-top">
                          <p className="ann-card-title">{ann.title}</p>
                          <span className="ann-card-date">
                            {new Date(ann.created_at).toLocaleDateString('en-PH', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="ann-card-course">{ann.course_name}</p>
                        <p className="ann-card-content">{ann.content}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Sidebar Column ── */}
      <aside className="dashboard-side">
        <MiniCalendar />

        {/* Quick course links — same structure as original sidebar */}
        <section className="right-card">
          <div className="right-card-header">
            <span>My Courses</span>
            <Link to="/student/courses" className="right-card-view-all">
              View all
            </Link>
          </div>
          <div className="side-courses-list">
            {courses.length === 0 ? (
              <p className="side-empty">No courses yet.</p>
            ) : (
              courses.slice(0, 5).map((course, idx) => {
                const theme = courseColors[idx % courseColors.length];
                return (
                  <Link
                    key={course.id}
                    to={`/student/courses/${course.id}`}
                    className="side-course-item"
                  >
                    <div className="side-course-icon" style={{ background: theme.bg }}>
                      {theme.icon}
                    </div>
                    <div className="side-course-info">
                      <p className="side-course-name">{course.name}</p>
                      <p className="side-course-code">{course.code}</p>
                    </div>
                    <ArrowForwardIosIcon sx={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }} />
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}