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

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <section className="right-card">
      <div className="right-card-header">
        <span>{monthNames[month]} {year}</span>
        <div>
          <button onClick={prevMonth}><ChevronLeftIcon fontSize="small" /></button>
          <button onClick={nextMonth}><ChevronRightIcon fontSize="small" /></button>
        </div>
      </div>
      <div className="mini-calendar-grid">
        {dayNames.map(d => <div key={d} className="day-label">{d}</div>)}
        {days.map((d, i) => (
          <div key={i} className={`day-cell ${isToday(d) ? 'today' : ''}`}>{d || ''}</div>
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
    Promise.all([
      api.get('/courses'),
    ]).then(async ([coursesRes]) => {
      const courseList = coursesRes.data.courses || [];
      setCourses(courseList);

      // Fetch announcements from all enrolled courses
      const allAnn = [];
      await Promise.all(courseList.map(async (course) => {
        try {
          const r = await api.get(`/courses/${course.id}/announcements`);
          r.data.announcements.forEach(a => { a.course_name = course.name; a.course_id = course.id; });
          allAnn.push(...r.data.announcements);
        } catch (_) {}
      }));
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
      <div className="dashboard-main">
        <header className="dashboard-title-row">
          <h1>My Courses</h1>
        </header>

        <div className="courses-list">
          {courses.length === 0 ? (
            <div className="empty-card">No courses found yet.</div>
          ) : courses.map((course, idx) => {
            const theme = courseColors[idx % courseColors.length];
            return (
              <Link key={course.id} to={`/student/courses/${course.id}`} className="course-card">
                <div className="course-card-left" style={{ background: theme.bg }}>{theme.icon}</div>
                <div className="course-card-content">
                  <h2>{course.name}</h2>
                  <p>{course.description || `${course.code || ''}  Section ${course.section || 'N/A'}`}</p>
                  <small>By <strong>{course.instructor?.first_name} {course.instructor?.last_name}</strong></small>
                </div>
                <div className="course-card-action"><ArrowForwardIosIcon sx={{ fontSize: 16 }} /></div>
              </Link>
            );
          })}
        </div>

        {/* Announcements */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Announcements</h2>
          {announcements.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500 text-sm">
              No announcements yet.
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <Link
                  key={ann.id}
                  to={`/student/courses/${ann.course_id}`}
                  className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
                    {ann.is_pinned && <PushPinIcon sx={{ fontSize: 15, color: '#f59e0b', marginTop: '3px', flexShrink: 0 }} />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800 truncate">{ann.title}</p>
                        <span className="text-xs text-slate-400 shrink-0">
                          {new Date(ann.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-600 mt-0.5">{ann.course_name}</p>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{ann.content}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="dashboard-side">
        <MiniCalendar />

        {/* Upcoming assessments */}
        <section className="right-card">
          <div className="right-card-header">
            <span>My Courses</span>
          </div>
          <div className="space-y-2">
            {courses.slice(0, 5).map((course, idx) => {
              const theme = courseColors[idx % courseColors.length];
              return (
                <Link key={course.id} to={`/student/courses/${course.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: theme.bg }}>
                    {theme.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{course.name}</p>
                    <p className="text-xs text-slate-400">{course.code}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </aside>
    </div>
  );
}
