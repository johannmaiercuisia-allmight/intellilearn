import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';

const navItems = {
  student: [
    { label: 'Dashboard', path: '/student', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Courses', path: '/student/courses', icon: <MenuBookIcon fontSize="small" /> },
    { label: 'Calendar', path: '/student/calendar', icon: <CalendarMonthIcon fontSize="small" /> },
    { label: 'Profile', path: '/student/profile', icon: <PersonIcon fontSize="small" /> },
  ],
  instructor: [
    { label: 'Dashboard', path: '/instructor', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Courses', path: '/instructor/courses', icon: <MenuBookIcon fontSize="small" /> },
    { label: 'Students', path: '/instructor/students', icon: <GroupIcon fontSize="small" /> },
    { label: 'Grading', path: '/instructor/grading', icon: <SchoolIcon fontSize="small" /> },
    { label: 'Profile', path: '/instructor/profile', icon: <PersonIcon fontSize="small" /> },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Users', path: '/admin/users', icon: <GroupIcon fontSize="small" /> },
    { label: 'Courses', path: '/admin/courses', icon: <MenuBookIcon fontSize="small" /> },
    { label: 'Reports', path: '/admin/reports', icon: <BarChartIcon fontSize="small" /> },
  ],
};

const typeIcon = { announcement: '📢', assessment: '📝', material: '📎' };
const typeColor = { announcement: 'text-amber-600 bg-amber-50', assessment: 'text-indigo-600 bg-indigo-50', material: 'text-teal-600 bg-teal-50' };

function NotificationPanel({ onClose }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/student/feed')
      .then(res => setFeed(res.data.feed || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleClick = (item) => {
    onClose();
    if (item.type === 'assessment' && item.course_id && item.item_id) {
      navigate(`/student/courses/${item.course_id}/assessments/${item.item_id}`);
    } else if (item.course_id) {
      navigate(`/student/courses/${item.course_id}`);
    }
  };

  return (
    <div ref={panelRef} className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <span className="font-semibold text-slate-800 text-sm">Notifications</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">✕</button>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: '420px' }}>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : feed.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-10">No recent activity.</p>
        ) : (
          feed.map((item, idx) => (
            <button key={idx} onClick={() => handleClick(item)}
              className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
              <div className="flex items-start gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 mt-0.5 ${typeColor[item.type]}`}>
                  {typeIcon[item.type]} {item.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{item.body}</p>
                  <p className="text-xs text-indigo-500 mt-0.5 truncate">{item.course}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(item.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const items = navItems[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-shell">
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar role-${user?.role || 'student'} ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <span className="dot">IL</span> Intellilearn
        </div>
        <div className="sidebar-profile">
          <div className="avatar">{user?.first_name?.[0]}{user?.last_name?.[0]}</div>
          <div>
            <div className="sidebar-profile-name">{user?.first_name} {user?.last_name}</div>
            <div className="sidebar-profile-role">{user?.role}</div>
          </div>
        </div>
        <div className="sidebar-nav">
          {items.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogoutIcon fontSize="small" /> Log out
        </button>
      </aside>

      <div className="main-layout">
        <header className="topbar">
          <button className="topbar-toggle" onClick={() => setSidebarOpen(true)}><MenuIcon /></button>
          <div className="topbar-title">{items.find((i) => i.path === location.pathname)?.label || 'Dashboard'}</div>

          <div className="topbar-search">
            <input type="text" placeholder="Search courses..." />
          </div>

          {/* Notification bell — students only */}
          {user?.role === 'student' && (
            <div className="relative">
              <button
                className="topbar-icon-btn"
                title="Notifications"
                onClick={() => setNotifOpen((v) => !v)}
              >
                <NotificationsIcon fontSize="small" />
              </button>
              {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
            </div>
          )}

          <div className="topbar-user">
            <div className="avatar">{user?.first_name?.[0]}{user?.last_name?.[0]}</div>
            <div>
              <div className="topbar-user-name">{user?.first_name} {user?.last_name}</div>
              <div className="topbar-user-id">{user?.email}</div>
            </div>
          </div>
        </header>

        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}
