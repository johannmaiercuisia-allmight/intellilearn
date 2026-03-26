import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
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

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const items = navItems[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-shell">
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
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
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
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
            <SearchIcon fontSize="small" />
          </div>

          <button className="topbar-icon-btn" title="Notifications"><NotificationsIcon fontSize="small" /></button>
          <div className="topbar-user">
            <div className="avatar">{user?.first_name?.[0]}{user?.last_name?.[0]}</div>
            <div>
              <div className="topbar-user-name">{user?.first_name} {user?.last_name}</div>
              <div className="topbar-user-id">{user?.email || 'student@ecoursie.com'}</div>
            </div>
          </div>
        </header>

        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}
