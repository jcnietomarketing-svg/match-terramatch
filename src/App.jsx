import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DOC_TERMINOS = 'https://github.com/jcnietomarketing-svg/match-terramatch/raw/main/T%26C_TerraMatch%20act%202024.docx';

// ==========================================
// TEMA VISUAL TERRAMATCH (Actualizado con color real del logo)
// ==========================================
const THEME = {
  colors: { 
    primary: '#e95442',      // Rojo REAL del logo SVG
    secondary: '#b9d3dc',    // Azul claro del manual
    text: '#2d3748', 
    textLight: '#718096', 
    bg: '#fafafa', 
    white: '#ffffff', 
    success: '#48bb78', 
    warning: '#ed8936' 
  },
  radius: { sm: '12px', md: '20px', lg: '32px', full: '9999px' },
  shadow: '0 10px 40px -10px rgba(233, 84, 66, 0.15)',
  shadowHover: '0 20px 50px -10px rgba(233, 84, 66, 0.25)',
};

// ==========================================
// LOGO SVG REAL DE TERRAMATCH
// ==========================================
function LogoTerraMatch({ size = 180, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 281.78 281.78" xmlns="http://www.w3.org/2000/svg">
        <circle cx="140.89" cy="140.89" r="140.89" fill="#e95442" />
        <path d="M140.89,281.78A140.89,140.89,0,0,0,281.78,140.89L140.89,140.89Z" fill="#e95442" />
        <circle cx="140.89" cy="140.89" r="8" fill="#fff" />
        <path d="M200,220c-45,27.85-109.74,12.24-133-48.28a78,78,0,0,1-.58-53.7c24.05-68.59,103-82.32,148.33-39.07a89.59,89.59,0,0,1,16.58,108.19" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="15" />
        <path d="M188,201c-34.07,20.89-83,8.72-100-37.62a56,56,0,0,1-1.05-35.66c16.61-54.33,77.59-65.77,112.34-32.64a67.19,67.19,0,0,1,12.56,80.92" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="15" />
        <path d="M176,182c-23.51,14.17-57.42,4.91-67.51-28.6a32.86,32.86,0,0,1-.41-17.46c9.71-38.75,51.93-47.4,75.72-24.73a44.81,44.81,0,0,1,8.53,53.66" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="15" />
        <rect x="138.17" y="0" width="5.26" height="281.78" fill="#fff" />
        <rect x="0" y="138.17" width="281.78" height="5.26" fill="#fff" />
      </svg>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.9 }}>
          <span style={{ fontFamily: 'Comfortaa, cursive', fontSize: size * 0.22, fontWeight: 700, color: THEME.colors.primary, letterSpacing: '-1px' }}>terra</span>
          <span style={{ fontFamily: 'Comfortaa, cursive', fontSize: size * 0.22, fontWeight: 700, color: THEME.colors.primary, letterSpacing: '-1px' }}>match</span>
        </div>
      )}
    </div>
  );
}

function useComfortaaFont() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.innerHTML = `
      * { box-sizing: border-box; }
      body { font-family: 'Comfortaa', cursive !important; background-color: ${THEME.colors.bg}; color: ${THEME.colors.text}; margin: 0; }
      h1, h2, h3, h4 { font-weight: 700; letter-spacing: -0.5px; }
      input, select, textarea, button { font-family: 'Comfortaa', cursive !important; }
      input:focus, select:focus, textarea:focus { outline: none; border-color: ${THEME.colors.primary} !important; box-shadow: 0 0 0 3px rgba(233, 84, 66, 0.1); }
    `;
    document.head.appendChild(style);
  }, []);
}

function App() {
  useComfortaaFont();
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => { checkSession(); }, []);

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await loadProfile(session.user.email);
        await loadNotificaciones(session.user.id);
        setView('dashboard');
      } else { setView('landing'); }
    } catch (error) { setView('landing'); } finally { setLoading(false); }
  }

  async function loadProfile(userEmail) {
    try { const { data } = await supabase.from('profiles').select('*').eq('email', userEmail).single(); setProfile(data || { nombre: 'Usuario', email: userEmail }); } 
    catch (error) { setProfile({ nombre: 'Usuario', email: userEmail }); }
  }

  async function loadNotificaciones(userId) {
    try {
      const { data } = await supabase.from('notificaciones').select('*').eq('user_id', userId).order('creado_en', { ascending: false }).limit(20);
      setNotificaciones(data || []);
    } catch (error) { console.error('Error loading notificaciones:', error); }
  }

  function showToast(message, type = 'success') { setToast({ message, type }); setTimeout(() => setToast(null), 4000); }
  async function handleLogout() { await supabase.auth.signOut(); setUser(null); setProfile(null); setNotificaciones([]); setView('landing'); }

  const unreadCount = notificaciones.filter(n => !n.leida).length;
  const isAdmin = profile?.email === 'jcnieto.marketing@gmail.com';

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Comfortaa' }}><LogoTerraMatch size={120} /></div>;

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: THEME.colors.white, padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => setView('landing')}>
            <LogoTerraMatch size={100} />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Hola, <span style={{ color: THEME.colors.primary }}>{profile?.nombre}</span></span>
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowNotifs(!showNotifs)} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.3rem', position: 'relative' }}>
                    🔔
                    {unreadCount > 0 && <span style={{ position: 'absolute', top: '0', right: '0', background: THEME.colors.primary, color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: THEME.radius.full, minWidth: '18px' }}>{unreadCount}</span>}
                  </button>
                  {showNotifs && (
                    <div style={{ position: 'absolute', top: '40px', right: '0', background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 200 }}>
                      <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>Notificaciones</div>
                      {notificaciones.length === 0 ? <div style={{ padding: '24px', textAlign: 'center', color: THEME.colors.textLight }}>Sin notificaciones</div> : (
                        notificaciones.map(n => (
                          <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', background: n.leida ? 'white' : '#fff5f5', cursor: 'pointer' }} onClick={async () => {
                            await supabase.from('notificaciones').update({ leida: true }).eq('id', n.id);
                            loadNotificaciones(user.id);
                          }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>{n.titulo}</div>
                            <div style={{ fontSize: '0.8rem', color: THEME.colors.textLight }}>{n.mensaje}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                {isAdmin && <button onClick={() => setView('admin')} style={{ padding: '8px 16px', background: THEME.colors.text, color: 'white', border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>🛡️ Admin</button>}
                <button onClick={() => setView('dashboard')} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${THEME.colors.primary}`, color: THEME.colors.primary, borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}>Dashboard</button>
                <button onClick={handleLogout} style={{ padding: '8px 16px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}>Salir</button>
              </>
            ) : (
              <>
                <button onClick={() => setView('login')} style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${THEME.colors.primary}`, color: THEME.colors.primary, borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}>Ingresar</button>
                <button onClick={() => setView('register')} style={{ padding: '8px 20px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}>Regístrate</button>
              </>
            )}
          </div>
        </div>
      </nav>
      
      <main style={{ flex: 1 }}>
        {view === 'landing' && <LandingView onNavigate={setView} />}
        {view === 'login' && <LoginView supabase={supabase} onSuccess={(u) => { setUser(u); loadProfile(u.email); loadNotificaciones(u.id); setView('dashboard'); }} onNavigate={setView} />}
        {view === 'register' && <RegisterView supabase={supabase} onSuccess={(u) => { setUser(u); loadProfile(u.email); setView('dashboard'); }} onNavigate={setView} />}
        {view === 'iub' && user && <IUBView user={user} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'oferta' && user && <OfertaView user={user} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'dashboard' && user && <DashboardView user={user} profile={profile} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'admin' && user && isAdmin && <AdminView supabase={supabase} showToast={showToast} />}
      </main>

      <footer style={{ background: THEME.colors.text, color: 'white', padding: '40px 24px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <LogoTerraMatch size={80} />
          </div>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: 0 }}>© 2026 TerraMatch · NIT 901.612.770-8 · Bogotá, Colombia</p>
        </div>
      </footer>

      {toast && <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: toast.type === 'error' ? THEME.colors.primary : THEME.colors.success, color: 'white', padding: '12px 24px', borderRadius: THEME.radius.full, zIndex: 1000, fontWeight: 600, boxShadow: THEME.shadow }}>{toast.message}</div>}
    </div>
  );
}

// ==========================================
// LANDING VIEW CON ELEMENTOS DE RADAR
// ==========================================
function LandingView({ onNavigate }) {
  return (
    <div style={{ position: 'relative', padding: '60px 24px', textAlign: 'center', overflow: 'hidden', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {/* Elementos decorativos de radar */}
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.3 }}></div>
      <div style={{ position: 'absolute', top: '15%', right: '0%', width: '300px', height: '300px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.4 }}></div>
      <div style={{ position: 'absolute', top: '20%', right: '5%', width: '200px', height: '200px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.5 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '350px', height: '350px', background: THEME.colors.primary, borderRadius: '50%', opacity: 0.05, filter: 'blur(60px)' }}></div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
        <div style={{ display: 'inline-block', background: `${THEME.colors.secondary}30`, color: THEME.colors.primary, padding: '8px 20px', borderRadius: THEME.radius.full, fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>
          🎯 La mayor comunidad de búsqueda inteligente
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', color: THEME.colors.text, lineHeight: 1.1 }}>
          Hagamos Match entre tu<br/><span style={{ color: THEME.colors.primary }}>Local y el Negocio Perfecto</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: THEME.colors.textLight, marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
          Busca, valida y encuentra el local ideal para tu negocio. Sin duplicados, sin intermediarios.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
          {/* Tarjeta Busco Locales */}
          <div onClick={() => onNavigate('iub')} style={{ background: THEME.colors.white, padding: '40px 32px', borderRadius: THEME.radius.lg, cursor: 'pointer', border: `2px solid transparent`, boxShadow: THEME.shadow, transition: 'all 0.3s', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = THEME.shadowHover; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = THEME.shadow; }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', border: `3px solid ${THEME.colors.primary}`, borderRadius: '50%', opacity: 0.1 }}></div>
            <div style={{ width: '70px', height: '70px', background: `${THEME.colors.primary}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: THEME.colors.text }}>¿Buscas locales?</h3>
            <p style={{ color: THEME.colors.textLight, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>Podrás comprar o arrendar locales que se ajusten a tus necesidades. Guarda tus búsquedas y recibe avisos.</p>
            <button style={{ padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>SÍ, QUIERO BUSCAR →</button>
          </div>

          {/* Tarjeta Tengo Locales */}
          <div onClick={() => onNavigate('oferta')} style={{ background: THEME.colors.white, padding: '40px 32px', borderRadius: THEME.radius.lg, cursor: 'pointer', border: `2px solid transparent`, boxShadow: THEME.shadow, transition: 'all 0.3s', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = THEME.shadowHover; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = THEME.shadow; }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', border: `3px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.2 }}></div>
            <div style={{ width: '70px', height: '70px', background: `${THEME.colors.secondary}30`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>🏪</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: THEME.colors.text }}>¿Tienes locales?</h3>
            <p style={{ color: THEME.colors.textLight, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>Podrás ofertar todos tus locales a la vez sin publicar de uno en uno. Etiqueta tus locales para que aparezcan en las búsquedas.</p>
            <button style={{ padding: '12px 24px', background: THEME.colors.text, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>SÍ, QUIERO OFERTAR →</button>
          </div>
        </div>

        {/* Testimonios */}
        <div style={{ marginTop: '80px', padding: '40px', background: THEME.colors.white, borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
          <h3 style={{ marginBottom: '32px', color: THEME.colors.text }}>Opiniones</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: THEME.radius.md }}>
              <p style={{ fontStyle: 'italic', marginBottom: '16px' }}>"En solo 3 días mi local de 120m² se alquiló a una multinacional por 5 años"</p>
              <strong style={{ color: THEME.colors.primary }}>Juanita Acosta</strong>
            </div>
            <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: THEME.radius.md }}>
              <p style={{ fontStyle: 'italic', marginBottom: '16px' }}>"Gracias TerraMatch, ya he podido comprar 5 de los 8 locales que requería mi empresa"</p>
              <strong style={{ color: THEME.colors.primary }}>Carlos Mendoza</strong>
            </div>
            <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: THEME.radius.md }}>
              <p style={{ fontStyle: 'italic', marginBottom: '16px' }}>"Lo que parecía imposible, lo logré! Necesitaba 100 locales en distintas ciudades"</p>
              <strong style={{ color: THEME.colors.primary }}>Ana Rodríguez</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginView({ supabase, onSuccess, onNavigate }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword(form);
    if (error) alert(error.message); else onSuccess(data.user);
  };
  return (
    <div style={{ padding: '50px', maxWidth: '420px', margin: '40px auto', background: THEME.colors.white, borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}><LogoTerraMatch size={120} /></div>
      <h2 style={{ textAlign: 'center', marginBottom: '32px', color: THEME.colors.text }}>Ingresar</h2>
      <input placeholder="Correo electrónico" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '14px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
      <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '14px', marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
      <button onClick={handleLogin} style={{ width: '100%', padding: '14px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer', marginBottom: '16px' }}>INGRESAR</button>
      <p style={{ textAlign: 'center', color: THEME.colors.textLight, fontSize: '0.9rem' }}>
        ¿No tienes cuenta? <button onClick={() => onNavigate('register')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', fontWeight: 700, padding: 0 }}>REGISTRARME</button>
      </p>
    </div>
  );
}

function RegisterView({ supabase, onSuccess, onNavigate }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', celular: '', tipo_usuario: 'buscador', password: '' });
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const handleRegister = async () => {
    if (!aceptaTerminos) { alert('Debes aceptar los términos'); return; }
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error) alert(error.message); else onSuccess(data.user);
  };
  return (
    <div style={{ padding: '50px', maxWidth: '500px', margin: '40px auto', background: THEME.colors.white, borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}><LogoTerraMatch size={120} /></div>
      <h2 style={{ textAlign: 'center', marginBottom: '32px', color: THEME.colors.text }}>Crear Cuenta</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <input placeholder="Nombres *" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
        <input placeholder="Apellidos *" value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
      </div>
      <input placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '14px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
      <input placeholder="Celular *" value={form.celular} onChange={e => setForm({...form, celular: e.target.value})} style={{ width: '100%', padding: '14px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
      <input type="password" placeholder="Contraseña *" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '14px', marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
      <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px', cursor: 'pointer' }}>
        <input type="checkbox" checked={aceptaTerminos} onChange={e => setAceptaTerminos(e.target.checked)} style={{ marginTop: '4px' }} />
        <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight }}>He leído y acepto la <a href={DOC_TERMINOS} target="_blank" style={{ color: THEME.colors.primary }}>política de privacidad</a></span>
      </label>
      <button onClick={handleRegister} style={{ width: '100%', padding: '14px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer', marginBottom: '16px' }}>CONTINUAR</button>
      <p style={{ textAlign: 'center', color: THEME.colors.textLight, fontSize: '0.9rem' }}>
        ¿Ya tienes cuenta? <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', fontWeight: 700, padding: 0 }}>INGRESAR</button>
      </p>
    </div>
  );
}

function DashboardView({ user, profile, supabase, showToast, onNavigate }) {
  const [iubs, setIubs] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadData(); }, [user]);

  async function loadData() {
    try {
      setLoading(true);
      const { data: iubsData } = await supabase.from('iubs').select('*').eq('user_id', user.id).order('creado_en', { ascending: false });
      setIubs(iubsData || []);
      const { data: propsData } = await supabase.from('propiedades').select('*').eq('user_id', user.id).order('creado_en', { ascending: false });
      setPropiedades(propsData || []);
      const { data: matchesData } = await supabase.from('matches').select('*, propiedades(*)').eq('user_id', user.id).order('creado_en', { ascending: false });
      setMatches(matchesData || []);
    } catch (error) { console.error('Error loading dashboard:', error); } finally { setLoading(false); }
  }

  async function aceptarMatch(matchId) {
    try { await supabase.from('matches').update({ estado: 'aceptado' }).eq('id', matchId); showToast('¡Match Aceptado!'); loadData(); } catch (error) { showToast('Error', 'error'); }
  }
  async function rechazarMatch(matchId) {
    try { await supabase.from('matches').update({ estado: 'rechazado' }).eq('id', matchId); showToast('Match Rechazado'); loadData(); } catch (error) { showToast('Error', 'error'); }
  }

  const matchesAceptados = matches.filter(m => m.estado === 'aceptado').length;
  const matchesPendientes = matches.filter(m => m.estado === 'pendiente').length;

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando Dashboard...</div>;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ background: `linear-gradient(135deg, ${THEME.colors.primary} 0%, #ff7e6b 100%)`, color: 'white', padding: '40px', borderRadius: THEME.radius.lg, marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', border: '3px solid rgba(255,255,255,0.2)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%' }}></div>
        <h2 style={{ color: 'white', margin: '0 0 8px 0', position: 'relative', zIndex: 1 }}>Hola, {profile?.nombre} 👋</h2>
        <p style={{ opacity: 0.9, margin: 0, position: 'relative', zIndex: 1 }}>Bienvenido a tu centro de control TerraMatch</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid ${THEME.colors.primary}` }}>
          <div style={{ color: THEME.colors.textLight, fontSize: '0.85rem', marginBottom: '8px' }}>IUBs Activos</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{iubs.length}</div>
        </div>
        <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid ${THEME.colors.warning}` }}>
          <div style={{ color: THEME.colors.textLight, fontSize: '0.85rem', marginBottom: '8px' }}>Matches Pendientes</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{matchesPendientes}</div>
        </div>
        <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid ${THEME.colors.success}` }}>
          <div style={{ color: THEME.colors.textLight, fontSize: '0.85rem', marginBottom: '8px' }}>Matches Aceptados</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{matchesAceptados}</div>
        </div>
        <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid ${THEME.colors.secondary}` }}>
          <div style={{ color: THEME.colors.textLight, fontSize: '0.85rem', marginBottom: '8px' }}>Mis Propiedades</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{propiedades.length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div onClick={() => onNavigate('iub')} style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, cursor: 'pointer', transition: 'all 0.3s' }}
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔍</div>
          <h3>Busco Locales</h3><p style={{ color: THEME.colors.textLight }}>Crear nuevo IUB</p>
        </div>
        <div onClick={() => onNavigate('oferta')} style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, cursor: 'pointer', transition: 'all 0.3s' }}
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🏪</div>
          <h3>Tengo Locales</h3><p style={{ color: THEME.colors.textLight }}>Publicar inmueble</p>
        </div>
      </div>

      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <h3 style={{ marginBottom: '24px' }}>🎯 Tus Matches</h3>
        {matches.length === 0 ? <p style={{ color: THEME.colors.textLight, textAlign: 'center', padding: '40px' }}>Aún no tienes matches. Crea un IUB para empezar.</p> : (
          matches.map(match => (
            <div key={match.id} style={{ background: '#f8f9fa', padding: '20px', borderRadius: THEME.radius.md, marginBottom: '16px', border: `2px solid ${match.estado === 'aceptado' ? THEME.colors.success : THEME.colors.primary}20` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', textTransform: 'capitalize' }}>{match.propiedades?.tipo_inmueble || 'Inmueble'} en {match.propiedades?.zona}</h4>
                  <p style={{ margin: 0, color: THEME.colors.textLight, fontSize: '0.9rem' }}>{match.propiedades?.area_total} m² · ${match.propiedades?.precio?.toLocaleString('es-CO')}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: THEME.colors.primary }}>{match.score}%</div>
                  <div style={{ fontSize: '0.75rem', color: THEME.colors.textLight, textTransform: 'uppercase' }}>{match.estado}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {match.estado === 'pendiente' && (
                  <>
                    <button onClick={() => aceptarMatch(match.id)} style={{ flex: 1, padding: '10px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>✓ Aceptar</button>
                    <button onClick={() => rechazarMatch(match.id)} style={{ flex: 1, padding: '10px', background: 'white', color: THEME.colors.textLight, border: '1px solid #e2e8f0', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}> Rechazar</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AdminView({ supabase, showToast }) {
  const [stats, setStats] = useState({ users: 0, iubs: 0, matches: 0, aceptados: 0, propiedades: 0 });
  const [duplicados, setDuplicados] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { if (tab === 'duplicados') loadDuplicados(); }, [tab]);

  async function loadStats() {
    try {
      setLoading(true);
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: iubsCount } = await supabase.from('iubs').select('*', { count: 'exact', head: true });
      const { count: matchesCount } = await supabase.from('matches').select('*', { count: 'exact', head: true });
      const { count: aceptadosCount } = await supabase.from('matches').select('*', { count: 'exact', head: true }).eq('estado', 'aceptado');
      const { count: propCount } = await supabase.from('propiedades').select('*', { count: 'exact', head: true });
      setStats({ users: usersCount || 0, iubs: iubsCount || 0, matches: matchesCount || 0, aceptados: aceptadosCount || 0, propiedades: propCount || 0 });
    } catch (error) { console.error('Error loading stats:', error); } finally { setLoading(false); }
  }

  async function loadDuplicados() {
    try {
      const { data } = await supabase.from('propiedades').select('*').eq('es_duplicado', true).order('creado_en', { ascending: false });
      setDuplicados(data || []);
    } catch (error) { console.error('Error loading duplicados:', error); }
  }

  async function resolverDuplicado(propiedadId, accion) {
    try {
      if (accion === 'aprobar') { await supabase.from('propiedades').update({ estado_curacion: 'aprobado', es_duplicado: false }).eq('id', propiedadId); showToast('Aprobado'); } 
      else if (accion === 'rechazar') { await supabase.from('propiedades').update({ estado_curacion: 'rechazado', disponible: false }).eq('id', propiedadId); showToast('Rechazado'); }
      loadDuplicados();
    } catch (error) { showToast('Error', 'error'); }
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando Panel...</div>;
  const tasaConversion = stats.matches > 0 ? ((stats.aceptados / stats.matches) * 100).toFixed(1) : 0;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.text, color: 'white', padding: '30px', borderRadius: THEME.radius.lg, marginBottom: '30px' }}>
        <h2 style={{ color: 'white', margin: '0 0 8px 0' }}>🛡️ Panel de Administrador</h2>
        <p style={{ opacity: 0.8, margin: 0 }}>Embudo de Conversión y Curación de Contenido</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button onClick={() => setTab('overview')} style={{ padding: '10px 20px', background: tab === 'overview' ? THEME.colors.text : 'white', color: tab === 'overview' ? 'white' : THEME.colors.text, border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}> Resumen</button>
        <button onClick={() => setTab('duplicados')} style={{ padding: '10px 20px', background: tab === 'duplicados' ? THEME.colors.text : 'white', color: tab === 'duplicados' ? 'white' : THEME.colors.text, border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}>🛡️ Duplicados ({duplicados.length})</button>
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid ${THEME.colors.primary}` }}><div style={{ color: THEME.colors.textLight, fontSize: '0.85rem' }}>USUARIOS</div><div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.users}</div></div>
          <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid ${THEME.colors.secondary}` }}><div style={{ color: THEME.colors.textLight, fontSize: '0.85rem' }}>IUBs CREADOS</div><div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.iubs}</div></div>
          <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid ${THEME.colors.warning}` }}><div style={{ color: THEME.colors.textLight, fontSize: '0.85rem' }}>MATCHES</div><div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.matches}</div></div>
          <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid ${THEME.colors.success}` }}><div style={{ color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACEPTADOS</div><div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.aceptados}</div><div style={{ fontSize: '0.85rem', color: THEME.colors.success }}>{tasaConversion}% conversión</div></div>
        </div>
      )}

      {tab === 'duplicados' && (
        <div>
          <h3 style={{ marginBottom: '24px' }}>Propiedades Duplicadas ({duplicados.length})</h3>
          {duplicados.length === 0 ? <div style={{ background: THEME.colors.white, padding: '60px', borderRadius: THEME.radius.lg, textAlign: 'center' }}><div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div><h3 style={{ color: THEME.colors.success }}>¡Excelente curación!</h3></div> : (
            duplicados.map(prop => (
              <div key={prop.id} style={{ background: '#fff5f5', padding: '20px', borderRadius: THEME.radius.md, marginBottom: '16px', border: `2px solid ${THEME.colors.primary}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0' }}>{prop.titulo || 'Sin título'}</h4>
                    <p style={{ margin: '0 0 4px 0', color: THEME.colors.textLight, fontSize: '0.9rem' }}>{prop.ciudad} · {prop.zona} · {prop.area_total} m² · ${prop.precio?.toLocaleString()}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: THEME.colors.primary, fontFamily: 'monospace' }}>Matrícula: {prop.matricula_inmobiliaria || 'N/A'}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => resolverDuplicado(prop.id, 'aprobar')} style={{ padding: '8px 16px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>✓ Aprobar</button>
                    <button onClick={() => resolverDuplicado(prop.id, 'rechazar')} style={{ padding: '8px 16px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>✗ Rechazar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function IUBView({ user, supabase, showToast, onNavigate }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    segmentos: [], actividad: '', nombre: '', id: '', matricula: '', contacto: '', email: '', ciudad: '', cantidad_locales: 1,
    barrio: '', zonas_ok: '', zonas_no: '', accesos: [],
    tipo_negocio: 'Arriendo', uso_suelo: 'Comercial', area_total: '', area_construida: '', altura: '', parqueaderos: '',
    caracteristicas: [], presupuesto_compra: '', canon_arriendo: '', admin: '', financiacion: 'No requiere', plazo: 'Negociación abierta',
    horizonte: 'Corto (1-3 meses)', fecha_cierre: '', acelera: '', retrasa: '', exclusiva: 'No, gestión exclusiva Terramatch', observaciones: ''
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleArray = (field, item) => {
    setForm(prev => ({ ...prev, [field]: prev[field].includes(item) ? prev[field].filter(i => i !== item) : [...prev[field], item] }));
  };

  const Chip = ({ label, active, onClick }) => (
    <button type="button" onClick={onClick} style={{ padding: '8px 16px', borderRadius: THEME.radius.full, border: `1px solid ${active ? THEME.colors.primary : '#e2e8f0'}`, background: active ? `${THEME.colors.primary}15` : 'white', color: active ? THEME.colors.primary : THEME.colors.textLight, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', marginRight: '8px', marginBottom: '8px' }}>
      {label}
    </button>
  );

  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box', marginBottom: '16px', fontSize: '0.95rem' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 600, color: THEME.colors.text, fontSize: '0.9rem' };

  async function handleSubmit() {
    try {
      const codigoIub = `TM-${form.ciudad.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*10000)}`;
      const { error } = await supabase.from('iubs').insert([{
        user_id: user.id, codigo_iub: codigoIub, segmentos: form.segmentos.join(','), ciudad: form.ciudad, barrio: form.barrio,
        tipo_negocio: form.tipo_negocio, uso_suelo: form.uso_suelo, area_min: parseFloat(form.area_total) || null, area_max: parseFloat(form.area_construida) || null,
        canon_arriendo: form.canon_arriendo || null, presupuesto_compra: form.presupuesto_compra || null,
        caracteristicas: JSON.stringify(form.caracteristicas), horizonte: form.horizonte, estado: 'activo',
        matricula_inmobiliaria: form.matricula || null
      }]);
      if (error) throw error;
      showToast(`¡IUB ${codigoIub} generado!`);
      onNavigate('dashboard');
    } catch (error) { showToast(error.message, 'error'); }
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '40px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: THEME.colors.text, margin: '0 0 8px 0' }}>Indicador Único de Búsqueda (IUB)</h2>
          <p style={{ color: THEME.colors.textLight, margin: 0 }}>Paso {step} de 6</p>
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>👤 1. Identificación y Segmentos</h3>
            <label style={labelStyle}>¿Qué segmentos te interesan? *</label>
            <div style={{ marginBottom: '24px' }}>
              {['Locales Comerciales', 'Bodegas', 'Oficinas'].map(seg => (
                <Chip key={seg} label={seg} active={form.segmentos.includes(seg)} onClick={() => toggleArray('segmentos', seg)} />
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Nombre / Empresa *</label><input style={inputStyle} value={form.nombre} onChange={e => update('nombre', e.target.value)} /></div>
              <div><label style={labelStyle}>ID (CC / NIT)</label><input style={inputStyle} value={form.id} onChange={e => update('id', e.target.value)} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Matrícula Inmobiliaria</label><input style={inputStyle} value={form.matricula} onChange={e => update('matricula', e.target.value)} placeholder="Ej: 123456" /></div>
              <div><label style={labelStyle}>Email *</label><input style={inputStyle} value={form.email} onChange={e => update('email', e.target.value)} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Ciudad Principal</label><input style={inputStyle} value={form.ciudad} onChange={e => update('ciudad', e.target.value)} /></div>
              <div><label style={labelStyle}>Cantidad de Locales</label><input type="number" style={inputStyle} value={form.cantidad_locales} onChange={e => update('cantidad_locales', e.target.value)} /></div>
            </div>
            <label style={labelStyle}>Actividad / Uso del Negocio</label>
            <input style={inputStyle} placeholder="Ej: Restaurante, Boutique..." value={form.actividad} onChange={e => update('actividad', e.target.value)} />
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>📍 2. Ubicación</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Ciudad</label><input style={inputStyle} value={form.ciudad} onChange={e => update('ciudad', e.target.value)} /></div>
              <div><label style={labelStyle}>Barrio / Zona</label><input style={inputStyle} value={form.barrio} onChange={e => update('barrio', e.target.value)} /></div>
            </div>
            <label style={labelStyle}>Zonas aceptables</label>
            <input style={inputStyle} value={form.zonas_ok} onChange={e => update('zonas_ok', e.target.value)} />
            <label style={labelStyle}>Zonas NO aceptadas</label>
            <input style={inputStyle} value={form.zonas_no} onChange={e => update('zonas_no', e.target.value)} />
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}> 3. Características</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Tipo de Negocio</label><select style={inputStyle} value={form.tipo_negocio} onChange={e => update('tipo_negocio', e.target.value)}><option>Arriendo</option><option>Venta</option></select></div>
              <div><label style={labelStyle}>Uso del Suelo</label><select style={inputStyle} value={form.uso_suelo} onChange={e => update('uso_suelo', e.target.value)}><option>Mixto</option><option>Comercial</option><option>Industrial</option></select></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Área Total (m²)</label><input type="number" style={inputStyle} value={form.area_total} onChange={e => update('area_total', e.target.value)} /></div>
              <div><label style={labelStyle}>Área Construida (m²)</label><input type="number" style={inputStyle} value={form.area_construida} onChange={e => update('area_construida', e.target.value)} /></div>
            </div>
            <label style={labelStyle}>Características Especiales</label>
            <div style={{ marginBottom: '16px' }}>
              {['Esquinero', 'Vía Principal', 'Doble Altura', 'Mezzanine', 'Extracción', 'Cocina industrial'].map(c => (
                <Chip key={c} label={c} active={form.caracteristicas.includes(c)} onClick={() => toggleArray('caracteristicas', c)} />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>💰 4. Económico</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Presupuesto Compra ($)</label><input type="number" style={inputStyle} value={form.presupuesto_compra} onChange={e => update('presupuesto_compra', e.target.value)} /></div>
              <div><label style={labelStyle}>Canon Arriendo ($)</label><input type="number" style={inputStyle} value={form.canon_arriendo} onChange={e => update('canon_arriendo', e.target.value)} /></div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>⚑ 5. Horizonte de Decisión</h3>
            <label style={labelStyle}>Plazo para decidir</label>
            <select style={inputStyle} value={form.horizonte} onChange={e => update('horizonte', e.target.value)}>
              <option>Inmediato (0-1 mes)</option><option>Corto (1-3 meses)</option><option>Mediano (3-6 meses)</option><option>Largo (+6 meses)</option>
            </select>
            <label style={labelStyle}>Observaciones</label>
            <textarea style={{ ...inputStyle, minHeight: '80px' }} value={form.observaciones} onChange={e => update('observaciones', e.target.value)} />
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>✍ 6. Resumen</h3>
            <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: THEME.radius.md, marginBottom: '24px' }}>
              <p><strong>Segmentos:</strong> {form.segmentos.join(', ')}</p>
              <p><strong>Ubicación:</strong> {form.ciudad} - {form.barrio}</p>
              <p><strong>Área:</strong> {form.area_total} - {form.area_construida} m²</p>
              <p><strong>Presupuesto:</strong> ${form.canon_arriendo}</p>
              {form.matricula && <p><strong>Matrícula Inmobiliaria:</strong> {form.matricula}</p>}
            </div>
            <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ marginTop: '4px' }} />
              <span style={{ fontSize: '0.9rem' }}>Acepto T&C y Mandato de Pago (30% comisión en cierre).</span>
            </label>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
          {step > 1 && <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: '14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>Atrás</button>}
          {step < 6 ? (
            <button onClick={() => setStep(step + 1)} style={{ flex: 2, padding: '14px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Siguiente →</button>
          ) : (
            <button onClick={handleSubmit} style={{ flex: 2, padding: '14px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>✓ Generar IUB</button>
          )}
        </div>
      </div>
    </div>
  );
}

function OfertaView({ user, supabase, showToast, onNavigate }) {
  const [form, setForm] = useState({
    segmentos: [], rol: 'Propietario', nombre: '', id: '', matricula: '', contacto: '', email: '', ciudad: '',
    barrio: '', direccion: '', tipo_negocio: 'Arriendo', uso_suelo: 'Comercial',
    area_total: '', area_construida: '', altura: '', parqueaderos: '',
    caracteristicas: [], precio_venta: '', canon: '', admin: '', plazo: 'Negociación abierta',
    horizonte: 'Corto (1-3 meses)', observaciones: ''
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleArray = (field, item) => {
    setForm(prev => ({ ...prev, [field]: prev[field].includes(item) ? prev[field].filter(i => i !== item) : [...prev[field], item] }));
  };

  const Chip = ({ label, active, onClick }) => (
    <button type="button" onClick={onClick} style={{ padding: '8px 16px', borderRadius: THEME.radius.full, border: `1px solid ${active ? THEME.colors.primary : '#e2e8f0'}`, background: active ? `${THEME.colors.primary}15` : 'white', color: active ? THEME.colors.primary : THEME.colors.textLight, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', marginRight: '8px', marginBottom: '8px' }}>
      {label}
    </button>
  );

  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box', marginBottom: '16px', fontSize: '0.95rem' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 600, color: THEME.colors.text, fontSize: '0.9rem' };

  async function handleSubmit() {
    try {
      const { data: duplicados, error: dupError } = await supabase.rpc('verificar_duplicados', {
        p_direccion: form.direccion,
        p_ciudad: form.ciudad,
        p_area: parseFloat(form.area_total) || 0,
        p_precio: parseFloat(form.canon) || parseFloat(form.precio_venta) || 0,
        p_propietario_id: form.id
      });

      if (dupError) throw dupError;

      if (duplicados && duplicados.length > 0) {
        const confirmar = window.confirm(
          `⚠️ Ya existe ${duplicados.length} propiedad similar en nuestra base de datos:\n\n` +
          duplicados.map(d => `• ${d.titulo} (${d.razon})`).join('\n') +
          `\n\n¿Deseas publicar de todas formas? (Será marcada como posible duplicado)`
        );
        if (!confirmar) { showToast('Publicación cancelada.', 'error'); return; }
      }

      const { error } = await supabase.from('propiedades').insert([{
        user_id: user.id,
        segmento: form.segmentos[0]?.toLowerCase().includes('local') ? 'locales' : form.segmentos[0]?.toLowerCase().includes('bodega') ? 'bodegas' : 'oficinas',
        tipo_inmueble: 'local',
        operacion: form.tipo_negocio === 'Arriendo' ? 'arrendar' : 'vender',
        ciudad: form.ciudad,
        zona: form.barrio,
        direccion: form.direccion,
        area_total: parseFloat(form.area_total) || 0,
        area_util: parseFloat(form.area_construida) || 0,
        precio: parseFloat(form.canon) || parseFloat(form.precio_venta) || 0,
        caracteristicas: JSON.stringify(form.caracteristicas),
        propietario_id: form.id,
        matricula_inmobiliaria: form.matricula || null,
        disponible: true,
        estado: 'activo'
      }]);
      
      if (error) throw error;
      showToast('¡Inmueble publicado!');
      onNavigate('dashboard');
    } catch (error) { showToast(error.message, 'error'); }
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '40px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <h2 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>Publicar Inmueble</h2>
        
        <label style={labelStyle}>Segmentos</label>
        <div style={{ marginBottom: '24px' }}>
          {['Locales Comerciales', 'Bodegas', 'Oficinas'].map(seg => (
            <Chip key={seg} label={seg} active={form.segmentos.includes(seg)} onClick={() => toggleArray('segmentos', seg)} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={labelStyle}>Rol</label><select style={inputStyle} value={form.rol} onChange={e => update('rol', e.target.value)}><option>Propietario</option><option>Inmobiliaria</option></select></div>
          <div><label style={labelStyle}>Nombre</label><input style={inputStyle} value={form.nombre} onChange={e => update('nombre', e.target.value)} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={labelStyle}>ID (CC/NIT)</label><input style={inputStyle} value={form.id} onChange={e => update('id', e.target.value)} /></div>
          <div><label style={labelStyle}>Matrícula Inmobiliaria</label><input style={inputStyle} value={form.matricula} onChange={e => update('matricula', e.target.value)} placeholder="Ej: 123456" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={labelStyle}>Ciudad</label><input style={inputStyle} value={form.ciudad} onChange={e => update('ciudad', e.target.value)} /></div>
          <div><label style={labelStyle}>Barrio</label><input style={inputStyle} value={form.barrio} onChange={e => update('barrio', e.target.value)} /></div>
        </div>
        <label style={labelStyle}>Dirección</label>
        <input style={inputStyle} value={form.direccion} onChange={e => update('direccion', e.target.value)} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={labelStyle}>Área Total (m²)</label><input type="number" style={inputStyle} value={form.area_total} onChange={e => update('area_total', e.target.value)} /></div>
          <div><label style={labelStyle}>Área Construida (m²)</label><input type="number" style={inputStyle} value={form.area_construida} onChange={e => update('area_construida', e.target.value)} /></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={labelStyle}>Precio Venta ($)</label><input type="number" style={inputStyle} value={form.precio_venta} onChange={e => update('precio_venta', e.target.value)} /></div>
          <div><label style={labelStyle}>Canon Arriendo ($)</label><input type="number" style={inputStyle} value={form.canon} onChange={e => update('canon', e.target.value)} /></div>
        </div>

        <label style={labelStyle}>Características</label>
        <div style={{ marginBottom: '24px' }}>
          {['Esquinero', 'Vía Principal', 'Doble Altura', 'Mezzanine'].map(c => (
            <Chip key={c} label={c} active={form.caracteristicas.includes(c)} onClick={() => toggleArray('caracteristicas', c)} />
          ))}
        </div>

        <button onClick={handleSubmit} style={{ width: '100%', padding: '14px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>✓ Publicar Inmueble</button>
      </div>
    </div>
  );
}

export default App;
