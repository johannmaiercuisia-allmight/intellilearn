import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import heroImg from '../../assets/hero.png';

// HOW TO ADD FEATURE IMAGES:
// 1. Create folder: frontend/public/icons/
// 2. Add PNG files named exactly:
//    - feature-learning-path.png  (illustration shown in card top area)
//    - feature-feedback.png
//    - feature-analytics.png
//    - feature-chatbot.png
//    - feature-lms.png
//    - icon-learning-path.png     (small icon shown in dark circle)
//    - icon-feedback.png
//    - icon-analytics.png
//    - icon-chatbot.png
//    - icon-lms.png
// 3. Save and refresh the page.

const features = [
  { img: '/icons/feature-learning-path.png', circleIcon: '/icons/icon-learning-path.png', title: 'Personalized Learning Path', desc: 'The system analyzes your quiz results and automatically recommends materials to help you improve on weak areas.' },
  { img: '/icons/feature-feedback.png', circleIcon: '/icons/icon-feedback.png', title: 'Instant Feedback System', desc: 'Quizzes and essays are checked automatically using AI, giving immediate feedback to guide your learning.' },
  { img: '/icons/feature-analytics.png', circleIcon: '/icons/icon-analytics.png', title: 'Predictive Analytics', desc: 'The system detects students at risk based on performance and activity, helping instructors take early action.' },
  { img: '/icons/feature-chatbot.png', circleIcon: '/icons/icon-chatbot.png', title: 'AI Chatbot Assistant', desc: 'Ask questions anytime. The AI chatbot provides answers based on course content even outside class hours.' },
  { img: '/icons/feature-lms.png', circleIcon: '/icons/icon-lms.png', title: 'Complete LMS Tools', desc: 'Everything in one platform. Course management, Assignments and quizzes, Progress tracking, Announcements.' },
];

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [authMode, setAuthMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [regForm, setRegForm] = useState({ first_name: '', last_name: '', email: '', password: '', password_confirmation: '' });
  const [regErrors, setRegErrors] = useState({});
  const [regLoading, setRegLoading] = useState(false);

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
      navigate('/student');
    } catch (err) {
      if (err.response?.data?.errors) setRegErrors(err.response.data.errors);
      else setRegErrors({ general: [err.response?.data?.message || 'Registration failed.'] });
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        .ll-scroll::-webkit-scrollbar { display: none; }
        .ll-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .ll-slide { scroll-snap-align: start; min-height: 100vh; width: 100vw; }
        .ll-feat { transition: transform 0.25s, box-shadow 0.25s; }
        .ll-feat:hover { transform: translateY(-8px) !important; box-shadow: 0 16px 40px rgba(30,58,138,0.14) !important; }
        .ll-up { animation: llUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .ll-d1 { animation-delay: 0.15s; }
        .ll-d2 { animation-delay: 0.28s; }
        @keyframes llUp { from { opacity:0; transform:translateY(44px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Navbar */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, height:60, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(203,213,225,0.4)', display:'flex', alignItems:'center', padding:'0 40px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginRight:'auto' }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#1e3a8a,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:900, color:'white' }}>IL</div>
          <span style={{ fontSize:'1rem', fontWeight:800, color:'#1e3a8a', letterSpacing:'0.04em' }}>INTELLILEARN</span>
        </div>
        {['HOME', 'BLOGS', 'ABOUT US', 'ONBOARDING'].map(l => (
          <button key={l} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'0.8rem', fontWeight:600, color:'#64748b', padding:'0 18px', letterSpacing:'0.03em' }}>{l}</button>
        ))}
        <button onClick={() => { scrollTo(2); setAuthMode('login'); }}
          style={{ background:'#1e3a8a', color:'white', border:'none', borderRadius:24, padding:'9px 22px', marginLeft:16, fontSize:'0.8rem', fontWeight:700, cursor:'pointer' }}>
          SIGN IN
        </button>
      </nav>

      {/* Scroll container */}
      <div ref={containerRef} className="ll-scroll" style={{ width:'100vw', height:'100vh', overflowY:'scroll', overflowX:'hidden', scrollSnapType:'y mandatory' }}>

        {/* SLIDE 1 - Hero Banner */}
        <div className="ll-slide" style={{ background:'#f0f4ff', display:'flex', flexDirection:'column', padding:'70px 40px 40px' }}>
          <div style={{ flex:1, background:'#1e3a8a', borderRadius:24, display:'flex', alignItems:'center', padding:'0 60px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-80, right:180, width:350, height:350, borderRadius:'50%', background:'rgba(96,165,250,0.1)', pointerEvents:'none' }} />
            <div style={{ flex:1, zIndex:1 }} className={activeSlide === 0 ? 'll-up' : ''}>
              <p style={{ fontSize:'0.9rem', fontWeight:800, color:'rgba(255,255,255,0.6)', letterSpacing:'0.06em', margin:'0 0 10px' }}>INTELLILEARN</p>
              <h2 style={{ fontSize:'3.6rem', fontWeight:900, color:'white', lineHeight:1.05, margin:'0 0 18px', letterSpacing:'-0.02em' }}>Learning That<br />Adapts to You.</h2>
              <p style={{ fontSize:'0.9rem', color:'rgba(255,255,255,0.65)', lineHeight:1.75, maxWidth:420, marginBottom:32 }}>
                Traditional LMS platforms stop at content delivery.
                IntelliLearn goes further using AI to personalize learning, provide instant feedback, and support students in real time.
              </p>
              <div style={{ display:'flex', alignItems:'center', background:'white', borderRadius:12, padding:'13px 18px', maxWidth:380, boxShadow:'0 4px 20px rgba(0,0,0,0.15)', gap:10 }}>
                <span style={{ color:'#94a3b8' }}>Search</span>
                <span style={{ flex:1, fontSize:'0.88rem', color:'#94a3b8' }}>Search Courses</span>
                <span style={{ borderLeft:'1px solid #e2e8f0', paddingLeft:12, fontSize:'0.82rem', color:'#64748b', fontWeight:600 }}>Courses v</span>
              </div>
            </div>
            <div className={activeSlide === 0 ? 'll-up ll-d1' : ''} style={{ position:'absolute', right:0, bottom:0, height:'100%', display:'flex', alignItems:'flex-end' }}>
              <img src={heroImg} alt="Student" style={{ height:'95%', objectFit:'contain', objectPosition:'bottom' }} />
            </div>
          </div>
        </div>

        {/* SLIDE 2 - Features */}
        <div className="ll-slide" style={{ background:'#f0f4ff', display:'flex', flexDirection:'column', paddingTop:60 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'36px 60px 16px' }}>
            <h1 className={activeSlide === 1 ? 'll-up' : ''} style={{ fontSize:'3.8rem', fontWeight:900, color:'#0f172a', lineHeight:1.05, margin:0, letterSpacing:'-0.03em' }}>
              Smart Features.<br />Real Impact.
            </h1>
            <p className={activeSlide === 1 ? 'll-up ll-d1' : ''} style={{ flex:'0 0 340px', fontSize:'1rem', color:'#475569', lineHeight:1.75, margin:0, textAlign:'right', paddingTop:10 }}>
              IntelliLearn integrates artificial intelligence to improve how students learn and how instructors teach.
            </p>
          </div>

          <div className={activeSlide === 1 ? 'll-up ll-d2' : ''} style={{ display:'flex', gap:14, padding:'0 60px 36px', flex:1, alignItems:'stretch' }}>
            {features.map(f => (
              <div key={f.title} className="ll-feat" style={{ flex:1, background:'white', borderRadius:18, padding:'0 0 18px 0', boxShadow:'0 4px 16px rgba(30,58,138,0.07)', border:'1px solid rgba(203,213,225,0.6)', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', overflow:'hidden' }}>

                {/* Illustration area - light blue bg */}
                <div style={{ width:'100%', background:'linear-gradient(135deg,#e8f0fe,#dbeafe)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px 16px 28px', position:'relative', minHeight:140 }}>
                  <img
                    src={f.img}
                    alt={f.title}
                    style={{ width:'80%', maxHeight:100, objectFit:'contain' }}
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.parentNode.querySelector('.placeholder').style.display = 'flex';
                    }}
                  />
                  <div className="placeholder" style={{ display:'none', width:'80%', height:80, alignItems:'center', justifyContent:'center', color:'#94a3b8', fontSize:'0.65rem', border:'2px dashed #cbd5e1', borderRadius:10, textAlign:'center', padding:8 }}>
                    Add: public/icons/{f.img.split('/').pop()}
                  </div>
                </div>

                {/* Dark navy circle icon overlapping illustration */}
                <div style={{ width:50, height:50, borderRadius:'50%', background:'linear-gradient(135deg,#1e3a8a,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(30,58,138,0.35)', marginTop:-25, marginBottom:12, zIndex:1, flexShrink:0 }}>
                  <img
                    src={f.circleIcon}
                    alt=""
                    style={{ width:26, height:26, objectFit:'contain', filter:'brightness(0) invert(1)' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>

                <p style={{ fontSize:'0.88rem', fontWeight:800, color:'#1e3a8a', margin:'0 12px 8px', lineHeight:1.3 }}>{f.title}</p>
                <p style={{ fontSize:'0.74rem', color:'#64748b', lineHeight:1.6, margin:'0 14px' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SLIDE 3 - Login / Signup */}
        <div className="ll-slide" style={{ background:'linear-gradient(160deg,#f0f4ff 0%,#e8f0fe 50%,#f8faff 100%)', display:'flex', alignItems:'center', padding:'60px 80px 40px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-120, top:'50%', transform:'translateY(-50%)', width:550, height:550, borderRadius:'50%', background:'rgba(37,99,235,0.06)', pointerEvents:'none' }} />
          {[...Array(16)].map((_, i) => (
            <div key={i} style={{ position:'absolute', left:`${(i % 4) * 22 + 2}%`, top:`${Math.floor(i / 4) * 28 + 10}%`, width:5, height:5, borderRadius:'50%', background:'rgba(37,99,235,0.1)', pointerEvents:'none' }} />
          ))}

          {/* Form panel */}
          <div className={activeSlide === 2 ? 'll-up' : ''} style={{ flex:'0 0 370px', zIndex:1 }}>
            <div style={{ background:'white', borderRadius:20, padding:'36px 32px', boxShadow:'0 8px 40px rgba(30,58,138,0.1)', border:'1px solid rgba(203,213,225,0.4)' }}>
              {authMode === 'login' ? (
                <>
                  <h2 style={{ fontSize:'1.75rem', fontWeight:900, color:'#0f172a', margin:'0 0 4px', textAlign:'center' }}>LOGIN</h2>
                  <p style={{ color:'#94a3b8', fontSize:'0.8rem', textAlign:'center', marginBottom:22 }}>Welcome back! Please log in to continue.</p>
                  {loginError && <div style={errBox}>{loginError}</div>}
                  <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:13 }}>
                    <div>
                      <label style={lbl}>Email Address</label>
                      <div style={wrap}><span style={ico}>@</span><input type="email" style={inp} placeholder="abc@xyz.com" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} required /></div>
                    </div>
                    <div>
                      <label style={lbl}>Password</label>
                      <div style={wrap}><span style={ico}>*</span><input type="password" style={inp} placeholder="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} required /></div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:'0.78rem' }}>
                      <label style={{ display:'flex', alignItems:'center', gap:6, color:'#64748b', cursor:'pointer' }}><input type="checkbox" /> Remember me</label>
                      <Link to="/forgot-password" style={{ color:'#2563eb', fontWeight:600, textDecoration:'none' }}>Forgot password?</Link>
                    </div>
                    <button type="submit" disabled={loginLoading} style={submitBtn}>{loginLoading ? 'Logging in...' : 'Log In'}</button>
                  </form>
                  <div style={{ borderTop:'1px solid #e2e8f0', marginTop:18, paddingTop:14, textAlign:'center' }}>
                    <p style={{ fontSize:'0.78rem', color:'#94a3b8', margin:0 }}>
                      {"Don't have an account? "}<button onClick={() => setAuthMode('signup')} style={linkBtn}>Sign up</button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ fontSize:'1.75rem', fontWeight:900, color:'#0f172a', margin:'0 0 4px', textAlign:'center' }}>SIGN UP</h2>
                  <p style={{ color:'#94a3b8', fontSize:'0.8rem', textAlign:'center', marginBottom:18 }}>Join the Community Now!</p>
                  {regErrors.general && <div style={errBox}>{regErrors.general[0]}</div>}
                  <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:11 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                      <div>
                        <label style={lbl}>First Name</label>
                        <div style={wrap}><span style={ico}>@</span><input type="text" style={inp} placeholder="Juan" value={regForm.first_name} onChange={e => setRegForm({ ...regForm, first_name: e.target.value })} required /></div>
                        {regErrors.first_name && <p style={ferr}>{regErrors.first_name[0]}</p>}
                      </div>
                      <div>
                        <label style={lbl}>Last Name</label>
                        <div style={wrap}><span style={ico}>@</span><input type="text" style={inp} placeholder="Dela Cruz" value={regForm.last_name} onChange={e => setRegForm({ ...regForm, last_name: e.target.value })} required /></div>
                      </div>
                    </div>
                    <div>
                      <label style={lbl}>Email Address</label>
                      <div style={wrap}><span style={ico}>@</span><input type="email" style={inp} placeholder="abc@xyz.com" value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} required /></div>
                      {regErrors.email && <p style={ferr}>{regErrors.email[0]}</p>}
                    </div>
                    <div>
                      <label style={lbl}>Password</label>
                      <div style={wrap}><span style={ico}>*</span><input type="password" style={inp} placeholder="password" value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} required /></div>
                      {regErrors.password && <p style={ferr}>{regErrors.password[0]}</p>}
                    </div>
                    <button type="submit" disabled={regLoading} style={{ ...submitBtn, marginTop:4 }}>{regLoading ? 'Creating account...' : 'Sign Up'}</button>
                  </form>
                  <div style={{ borderTop:'1px solid #e2e8f0', marginTop:14, paddingTop:12, textAlign:'center' }}>
                    <p style={{ fontSize:'0.78rem', color:'#94a3b8', margin:0 }}>
                      {'Already have an account? '}<button onClick={() => setAuthMode('login')} style={linkBtn}>Log in</button>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right tagline */}
          <div className={activeSlide === 2 ? 'll-up ll-d1' : ''} style={{ flex:1, paddingLeft:72, zIndex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:'linear-gradient(135deg,#1e3a8a,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.55rem', fontWeight:900, color:'white' }}>IL</div>
              <span style={{ fontSize:'0.75rem', fontWeight:800, color:'#1e3a8a', letterSpacing:'0.08em' }}>INTELLILEARN</span>
            </div>
            <h2 style={{ fontSize:'3rem', fontWeight:900, color:'#0f172a', lineHeight:1.1, margin:'0 0 14px', letterSpacing:'-0.02em' }}>
              Smarter Learning.<br /><span style={{ color:'#1e3a8a' }}>Better Results.</span>
            </h2>
            <div style={{ width:52, height:4, background:'linear-gradient(90deg,#1e3a8a,#60a5fa)', borderRadius:2, marginBottom:22 }} />
            <p style={{ fontSize:'0.95rem', color:'#475569', lineHeight:1.8, maxWidth:400, marginBottom:28 }}>
              IntelliLearn uses AI to personalize your learning experience, giving you the right content, feedback, and support exactly when you need it.
            </p>
            <button onClick={() => scrollTo(0)} style={{ background:'#1e3a8a', color:'white', border:'none', borderRadius:28, padding:'12px 30px', fontSize:'0.88rem', fontWeight:700, cursor:'pointer', boxShadow:'0 6px 20px rgba(30,58,138,0.3)' }}>
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ position:'fixed', right:20, top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', gap:8, zIndex:300 }}>
        {[0, 1, 2].map(i => (
          <button key={i} onClick={() => scrollTo(i)} style={{ width:9, height:i === activeSlide ? 26 : 9, borderRadius:5, background:i === activeSlide ? '#1e3a8a' : 'rgba(30,58,138,0.2)', border:'none', cursor:'pointer', transition:'all 0.3s ease', padding:0 }} />
        ))}
      </div>
    </div>
  );
}

const lbl = { display:'block', fontSize:'0.78rem', fontWeight:600, color:'#374151', marginBottom:4 };
const wrap = { display:'flex', alignItems:'center', border:'1.5px solid #e2e8f0', borderRadius:10, background:'#f8fafc', overflow:'hidden' };
const ico = { padding:'0 12px', fontSize:'0.82rem', color:'#94a3b8', flexShrink:0, fontWeight:600 };
const inp = { flex:1, padding:'10px 10px 10px 0', border:'none', background:'transparent', fontSize:'0.83rem', color:'#0f172a', outline:'none' };
const submitBtn = { width:'100%', background:'#1e3a8a', color:'white', border:'none', borderRadius:10, padding:'12px', fontSize:'0.92rem', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(30,58,138,0.3)' };
const errBox = { background:'#FEF2F2', color:'#DC2626', fontSize:'0.78rem', padding:'9px 12px', borderRadius:8, marginBottom:12, border:'1px solid #FECACA' };
const ferr = { color:'#DC2626', fontSize:'0.7rem', marginTop:3 };
const linkBtn = { background:'none', border:'none', color:'#2563eb', fontWeight:700, cursor:'pointer', fontSize:'0.78rem' };
