import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import heroImg from '../../assets/Student_LandingPage.png';
import logo from '../../assets/logo.png';
import loginBg from '../../assets/login_bg.png';

import imgLearningPath from '../../assets/Personalized_Learning_Path.png';
import imgFeedback     from '../../assets/Instant_Feedback_System.png';
import imgAnalytics    from '../../assets/Predictive_Analytics.png';
import imgChatbot      from '../../assets/AI_Chatbot_Assistant.png';
import imgLMS          from '../../assets/Complete_LMS_Tools.png';

import RouteIcon             from '@mui/icons-material/Route';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BarChartIcon          from '@mui/icons-material/BarChart';
import SmartToyIcon          from '@mui/icons-material/SmartToy';
import SchoolIcon            from '@mui/icons-material/School';
import EmailOutlinedIcon     from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon      from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon    from '@mui/icons-material/PersonOutlined';
import VisibilityOutlinedIcon    from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const features = [
  {
    img: imgLearningPath,
    muiIcon: <RouteIcon sx={{ fontSize: 28, color: '#ffffff' }} />,
    title: 'Personalized Learning Path',
    desc: 'The system analyzes your quiz results and automatically recommends materials to help you improve on weak areas.',
  },
  {
    img: imgFeedback,
    muiIcon: <ChatBubbleOutlineIcon sx={{ fontSize: 28, color: '#ffffff' }} />,
    title: 'Instant Feedback System',
    desc: 'Quizzes and essays are checked automatically using AI, giving immediate feedback to guide your learning.',
  },
  {
    img: imgAnalytics,
    muiIcon: <BarChartIcon sx={{ fontSize: 28, color: '#ffffff' }} />,
    title: 'Predictive Analytics',
    desc: 'The system detects students at risk based on performance and activity, helping instructors take early action.',
  },
  {
    img: imgChatbot,
    muiIcon: <SmartToyIcon sx={{ fontSize: 28, color: '#ffffff' }} />,
    title: 'AI Chatbot Assistant',
    desc: 'Ask questions anytime. The AI chatbot provides answers based on course content even outside class hours.',
  },
  {
    img: imgLMS,
    muiIcon: <SchoolIcon sx={{ fontSize: 28, color: '#ffffff' }} />,
    title: 'Complete LMS Tools',
    desc: 'Everything in one platform. (Course management, Assignments & quizzes, Progress tracking, Announcements)',
  },
];

const S = {
  lbl: {
    display: 'block', fontSize: 13, fontWeight: 700,
    color: '#374151', marginBottom: 6,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  ico: { padding: '0 12px', display: 'flex', alignItems: 'center', flexShrink: 0 },
  ferr: { color: '#DC2626', fontSize: 11, marginTop: 4, fontFamily: "'DM Sans', sans-serif" },
  linkBtn: {
    background: 'none', border: 'none', color: '#173861',
    fontWeight: 700, cursor: 'pointer', fontSize: 13,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    textDecoration: 'underline',
  },
};

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [activeSlide, setActiveSlide]   = useState(0);
  const [authMode, setAuthMode]         = useState('login');
  const [loginForm, setLoginForm]       = useState({ email: '', password: '' });
  const [loginError, setLoginError]     = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regForm, setRegForm]   = useState({ first_name: '', last_name: '', email: '', password: '', password_confirmation: '' });
  const [regErrors, setRegErrors]   = useState({});
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setActiveSlide(Math.round(el.scrollTop / el.clientHeight));
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (idx) => {
    containerRef.current?.scrollTo({ top: idx * containerRef.current.clientHeight, behavior: 'smooth' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const user = await login(loginForm.email, loginForm.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'instructor') navigate('/instructor');
      else navigate('/student');
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegErrors({});
    setRegLoading(true);
    try {
      await register(regForm);
      setRegSuccess(true);
    } catch (err) {
      if (err.response?.data?.errors) setRegErrors(err.response.data.errors);
      else setRegErrors({ general: [err.response?.data?.message || 'Registration failed.'] });
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif", fontSize: '16px', lineHeight: '1.5' }}>
      <style>{`
        .ll-scroll::-webkit-scrollbar { display: none; }
        .ll-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .ll-slide { scroll-snap-align: start; min-height: 100vh; width: 100vw; }

        .ll-feat { transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s; cursor: default; }
        .ll-feat:hover { transform: translateY(-8px) !important; box-shadow: 0 16px 40px rgba(23,56,97,0.14) !important; }

        .ll-up { animation: llUp 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .ll-d1 { animation-delay: 0.10s; }
        .ll-d2 { animation-delay: 0.20s; }
        .ll-d3 { animation-delay: 0.30s; }
        @keyframes llUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

        .ll-nav-link { transition: color 0.18s; }
        .ll-nav-link:hover { color: #173861 !important; }
        .ll-signin { transition: background 0.2s, transform 0.15s, box-shadow 0.2s; }
        .ll-signin:hover { background: #0f2a4a !important; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(23,56,97,0.35) !important; }

        .ll-searchbar { transition: box-shadow 0.2s; }
        .ll-searchbar:focus-within { box-shadow: 0 6px 32px rgba(0,0,0,0.25) !important; }
        .ll-sinput { flex: 1; border: none; outline: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; color: #64748b; background: transparent; padding: 16px 0; }
        .ll-sinput::placeholder { color: #94a3b8; }

        .ll-finput { flex: 1; padding: 13px 10px 13px 0; border: none; background: transparent; font-size: 14px; color: #0f172a; outline: none; font-family: 'DM Sans', sans-serif; }
        .ll-finput::placeholder { color: #94a3b8; }

        @keyframes floatImg { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .ll-float { animation: floatImg 6s ease-in-out infinite; }

        .ll-dot { transition: all 0.3s ease; border: none; cursor: pointer; padding: 0; }
        .ll-dot:hover { background: #173861 !important; }

        .feat-img-box { width: 100%; background: #dce8f5; border-radius: 12px 12px 0 0; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 0; height: 180px; position: relative; flex-shrink: 0; }
        .feat-img-box img { width: 100%; height: 100%; object-fit: contain; padding: 20px 16px; }
        .feat-img-placeholder { display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 10px; color: #6b8fa8; text-align: center; padding: 8px; }

        .feat-icon-circle { width: 56px; height: 56px; border-radius: 50%; background: #173861; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(23,56,97,0.40); margin-top: -28px; margin-bottom: 14px; z-index: 2; flex-shrink: 0; }

        .ll-input-wrap { display: flex; align-items: center; border: 1.5px solid #dde3ed; border-radius: 10px; background: #f8fafc; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; }
        .ll-input-wrap:focus-within { border-color: #173861; box-shadow: 0 0 0 3px rgba(23,56,97,0.08); background: #fff; }

        .ll-submit-btn { width: 100%; background: #173861; color: white; border: none; border-radius: 10px; padding: 14px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: 0.01em; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; box-shadow: 0 4px 16px rgba(23,56,97,0.28); }
        .ll-submit-btn:hover:not(:disabled) { background: #0f2a4a; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(23,56,97,0.38); }
        .ll-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 68, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(203,213,225,0.5)', boxShadow: '0 1px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', padding: '0 48px', boxSizing: 'border-box' }}>
        <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logo} alt="IntelliLearn" style={{ height: 40, width: 'auto', objectFit: 'contain', cursor: 'pointer' }}
            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }} />
          <div style={{ display: 'none', width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#173861,#2563eb)', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: 'white' }}>IL</div>
        </div>
        {['HOME', 'BLOGS', 'ABOUT US', 'ONBOARDING'].map(label => (
          <button key={label} className="ll-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b', padding: '0 26px', letterSpacing: '0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</button>
        ))}
        <button className="ll-signin" onClick={() => { scrollTo(2); setAuthMode('signup'); }} style={{ background: '#173861', color: 'white', border: 'none', borderRadius: 30, padding: '10px 30px', marginLeft: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 14px rgba(23,56,97,0.3)' }}>SIGN UP</button>
      </nav>

      {/* SCROLL CONTAINER */}
      <div ref={containerRef} className="ll-scroll" style={{ width: '100vw', height: '100vh', overflowY: 'scroll', overflowX: 'hidden', scrollSnapType: 'y mandatory' }}>

        {/* SLIDE 1 - Hero */}
        <div className="ll-slide" style={{ background: '#eaeff5', display: 'flex', flexDirection: 'column', padding: '80px 44px 40px', boxSizing: 'border-box' }}>
          <div style={{ flex: 1, background: '#173861', borderRadius: 28, display: 'flex', alignItems: 'center', padding: '0 70px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', right: 100, transform: 'translateY(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '20%', right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ position: 'absolute', left: 60 + (i % 3) * 20, top: 28 + Math.floor(i / 3) * 20, width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', pointerEvents: 'none' }} />
            ))}
            <div className={activeSlide === 0 ? 'll-up' : ''} style={{ flex: 1, zIndex: 2, maxWidth: 580 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 2, background: 'rgba(255,255,255,0.4)', borderRadius: 2 }} />
                <p style={{ fontSize: 17, fontWeight: 800, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.14em', margin: 0, textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>INTELLILEARN</p>
                <div style={{ width: 32, height: 2, background: 'rgba(255,255,255,0.4)', borderRadius: 2 }} />
              </div>
              <h2 style={{ fontSize: 62, fontWeight: 900, color: 'white', lineHeight: 1.04, margin: '0 0 22px', letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Learning That<br />Adapts to You.
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.68)', lineHeight: 1.85, maxWidth: 440, marginBottom: 38, fontFamily: "'DM Sans', sans-serif" }}>
                Traditional LMS platforms stop at content delivery. IntelliLearn goes further — using AI to personalize learning, provide instant feedback, and support students in real time.
              </p>
              <div className="ll-searchbar" style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: 14, maxWidth: 420, boxShadow: '0 6px 28px rgba(0,0,0,0.22)', overflow: 'hidden' }}>
                <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input type="text" placeholder="Search Courses" className="ll-sinput" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderLeft: '1.5px solid #e2e8f0', padding: '0 18px', minHeight: 52, fontSize: 14, fontWeight: 700, color: '#334155', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Courses
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </div>
            </div>
            <div className={`${activeSlide === 0 ? 'll-up ll-d1' : ''} ll-float`} style={{ position: 'absolute', right: 0, bottom: 0, height: '100%', display: 'flex', alignItems: 'flex-end', zIndex: 3 }}>
              <img src={heroImg} alt="Student" style={{ height: '96%', objectFit: 'contain', objectPosition: 'bottom' }} />
            </div>
            <svg style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1, opacity: 0.22 }} width="240" height="120" viewBox="0 0 240 120" fill="none">
              <path d="M10 100 Q100 20 230 60" stroke="#7eb3f5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M10 112 Q110 32 230 72" stroke="#7eb3f5" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M10 88 Q90 10 230 48" stroke="#7eb3f5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
            <svg style={{ position: 'absolute', bottom: 28, left: 60, zIndex: 1, opacity: 0.18 }} width="60" height="60" viewBox="0 0 60 60" fill="none">
              {[0, 1, 2].map(r => [0, 1, 2].map(c => (
                <circle key={`${r}${c}`} cx={10 + c * 20} cy={10 + r * 20} r="3.5" fill="white" />
              )))}
            </svg>
          </div>
        </div>

        {/* SLIDE 2 - Features */}
        <div className="ll-slide" style={{ background: '#f0f4f8', display: 'flex', flexDirection: 'column', paddingTop: 68, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '36px 64px 20px' }}>
            <h1 className={activeSlide === 1 ? 'll-up' : ''} style={{ fontSize: 54, fontWeight: 900, color: '#173861', lineHeight: 1.06, margin: 0, letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Smart Features.<br />Real Impact.
            </h1>
            <p className={activeSlide === 1 ? 'll-up ll-d1' : ''} style={{ flex: '0 0 340px', fontSize: 15, color: '#173861', lineHeight: 1.8, margin: 0, textAlign: 'right', paddingTop: 10, fontFamily: "'DM Sans', sans-serif" }}>
              IntelliLearn integrates artificial intelligence to improve how students learn and how instructors teach.
            </p>
          </div>
          <div className={activeSlide === 1 ? 'll-up ll-d2' : ''} style={{ display: 'flex', gap: 16, padding: '0 64px 40px', flex: 1, alignItems: 'stretch' }}>
            {features.map((f, idx) => (
              <div key={f.title} className="ll-feat" style={{ flex: 1, background: 'white', borderRadius: 20, padding: '0 0 24px 0', boxShadow: '0 2px 12px rgba(23,56,97,0.08)', border: '1px solid rgba(203,213,225,0.55)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', overflow: 'hidden', animationDelay: `${idx * 0.08}s`, justifyContent: 'space-between' }}>
                <div className="feat-img-box">
                  <img src={f.img} alt={f.title} onError={e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
                  <div className="feat-img-placeholder">Add image:<br />{f.img}</div>
                </div>
                <div className="feat-icon-circle">{f.muiIcon}</div>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#173861', margin: '0 16px 10px', lineHeight: 1.35, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</p>
                <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.65, margin: '0 18px', fontFamily: "'DM Sans', sans-serif", flex: 1, display: 'flex', alignItems: 'center' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SLIDE 3 - Login / Sign Up */}
        <div className="ll-slide" style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', display: 'flex', alignItems: 'center', padding: '68px 0 0 0', boxSizing: 'border-box', position: 'relative' }}>

          {/* LEFT - Form panel */}
          <div className={activeSlide === 2 ? 'll-up' : ''} style={{ flex: '0 0 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 64px', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', maxWidth: 420 }}>

              {authMode === 'login' ? (
                <>
                  <h2 style={{ fontSize: 36, fontWeight: 900, color: '#173861', margin: '0 0 6px', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.01em' }}>LOGIN</h2>
                  <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 28, fontFamily: "'DM Sans', sans-serif" }}>
                    Welcome back! Please log in to continue.
                  </p>
                  {loginError && (
                    <div style={{ background: '#FEF2F2', color: '#DC2626', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 16, border: '1px solid #FECACA', fontFamily: "'DM Sans', sans-serif" }}>
                      {loginError}
                    </div>
                  )}
                  <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={S.lbl}>Email Address</label>
                      <div className="ll-input-wrap">
                        <span style={S.ico}><EmailOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></span>
                        <input type="email" className="ll-finput" placeholder="abc@xyz.com" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} required />
                      </div>
                    </div>
                    <div>
                      <label style={S.lbl}>Password</label>
                      <div className="ll-input-wrap">
                        <span style={S.ico}><LockOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></span>
                        <input type={showPassword ? 'text' : 'password'} className="ll-finput" placeholder="••••••••••••••" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} required />
                        <button type="button" onClick={() => setShowPassword(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px', display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
                          {showPassword ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#64748b', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                        <input type="checkbox" style={{ accentColor: '#173861', width: 15, height: 15 }} /> Remember me
                      </label>
                      <Link to="/forgot-password" style={{ color: '#173861', fontWeight: 700, textDecoration: 'none', fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Forgot password?</Link>
                    </div>
                    <button type="submit" disabled={loginLoading} className="ll-submit-btn">
                      {loginLoading ? 'Logging in...' : 'Log in'}
                    </button>
                  </form>
                  <div style={{ borderTop: '1px solid #e8edf4', marginTop: 22, paddingTop: 18, textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                      {"Don't have an account? "}
                      <button onClick={() => setAuthMode('signup')} style={S.linkBtn}>Sign up</button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ fontSize: 36, fontWeight: 900, color: '#173861', margin: '0 0 6px', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.01em' }}>SIGN UP</h2>
                  <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>
                    Join the Community Now!
                  </p>

                  {regSuccess ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <div style={{ fontSize: '3rem', marginBottom: 16 }}>📧</div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#173861', marginBottom: 8 }}>Check your email!</h3>
                      <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
                        We sent a verification link to your email address. Click the link to activate your account before logging in.
                      </p>
                      <button onClick={() => { setRegSuccess(false); setAuthMode('login'); }} style={{ background: '#173861', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                        Go to Login
                      </button>
                    </div>
                  ) : (
                    <>
                      {regErrors.general && (
                        <div style={{ background: '#FEF2F2', color: '#DC2626', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 16, border: '1px solid #FECACA', fontFamily: "'DM Sans', sans-serif" }}>
                          {regErrors.general[0]}
                        </div>
                      )}
                      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label style={S.lbl}>First Name</label>
                            <div className="ll-input-wrap">
                              <span style={S.ico}><PersonOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></span>
                              <input type="text" className="ll-finput" placeholder="Juan" value={regForm.first_name} onChange={e => setRegForm({ ...regForm, first_name: e.target.value })} required />
                            </div>
                            {regErrors.first_name && <p style={S.ferr}>{regErrors.first_name[0]}</p>}
                          </div>
                          <div>
                            <label style={S.lbl}>Last Name</label>
                            <div className="ll-input-wrap">
                              <span style={S.ico}><PersonOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></span>
                              <input type="text" className="ll-finput" placeholder="Dela Cruz" value={regForm.last_name} onChange={e => setRegForm({ ...regForm, last_name: e.target.value })} required />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label style={S.lbl}>Email Address</label>
                          <div className="ll-input-wrap">
                            <span style={S.ico}><EmailOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></span>
                            <input type="email" className="ll-finput" placeholder="abc@xyz.com" value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} required />
                          </div>
                          {regErrors.email && <p style={S.ferr}>{regErrors.email[0]}</p>}
                        </div>
                        <div>
                          <label style={S.lbl}>Password</label>
                          <div className="ll-input-wrap">
                            <span style={S.ico}><LockOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></span>
                            <input type={showRegPassword ? 'text' : 'password'} className="ll-finput" placeholder="••••••••••••••" value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} required />
                            <button type="button" onClick={() => setShowRegPassword(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px', display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
                              {showRegPassword ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                            </button>
                          </div>
                          {regErrors.password && <p style={S.ferr}>{regErrors.password[0]}</p>}
                        </div>
                        <div>
                          <label style={S.lbl}>Confirm Password</label>
                          <div className="ll-input-wrap">
                            <span style={S.ico}><LockOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></span>
                            <input type={showRegPassword ? 'text' : 'password'} className="ll-finput" placeholder="••••••••••••••" value={regForm.password_confirmation} onChange={e => setRegForm({ ...regForm, password_confirmation: e.target.value })} required />
                          </div>
                          {regErrors.password_confirmation && <p style={S.ferr}>{regErrors.password_confirmation[0]}</p>}
                        </div>
                        <button type="submit" disabled={regLoading} className="ll-submit-btn" style={{ marginTop: 4 }}>
                          {regLoading ? 'Creating account...' : 'Sign Up'}
                        </button>
                      </form>
                      <div style={{ borderTop: '1px solid #e8edf4', marginTop: 18, paddingTop: 16, textAlign: 'center' }}>
                        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                          {'Already have an account? '}
                          <button onClick={() => setAuthMode('login')} style={S.linkBtn}>Log in</button>
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT - Tagline panel */}
          <div className={activeSlide === 2 ? 'll-up ll-d1' : ''} style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 80px 40px 40px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <img src={logo} alt="IntelliLearn" style={{ height: 44, width: 'auto', objectFit: 'contain' }} onError={e => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <h2 style={{ fontSize: 52, fontWeight: 900, color: '#173861', lineHeight: 1.08, margin: '0 0 18px', letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Smarter Learning.<br />
              <span style={{ color: '#173861' }}>Better Results.</span>
            </h2>
            <div style={{ width: 60, height: 4, background: 'linear-gradient(90deg,#173861,#60a5fa)', borderRadius: 2, marginBottom: 24 }} />
            <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.9, maxWidth: 440, marginBottom: 36, fontFamily: "'DM Sans', sans-serif", textAlign: 'justify' }}>
              IntelliLearn uses AI to personalize your learning experience, giving you the right content, feedback, and support exactly when you need it.
            </p>
            <button onClick={() => scrollTo(0)} style={{ background: '#173861', color: 'white', border: 'none', borderRadius: 30, padding: '14px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 22px rgba(23,56,97,0.32)', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'background 0.2s, transform 0.15s', display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 9, zIndex: 400 }}>
        {[0, 1, 2].map(i => (
          <button key={i} className="ll-dot" onClick={() => scrollTo(i)} style={{ width: 9, height: i === activeSlide ? 28 : 9, borderRadius: 6, background: i === activeSlide ? '#173861' : 'rgba(23,56,97,0.18)' }} />
        ))}
      </div>
    </div>
  );
}
