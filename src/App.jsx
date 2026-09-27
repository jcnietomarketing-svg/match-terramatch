import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// CONFIGURACIÓN SUPABASE
// ==========================================
const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// TEMA VISUAL
// ==========================================
const THEME = {
  colors: {
    primary: '#e95442',
    secondary: '#b9d3dc',
    text: '#2d3748',
    textLight: '#718096',
    bg: '#fafafa',
    white: '#ffffff',
    success: '#48bb78',
    warning: '#ed8936',
    dark: '#1a202c'
  },
  radius: { sm: '12px', md: '20px', lg: '32px', full: '9999px' },
  shadow: '0 10px 40px -10px rgba(233, 84, 66, 0.15)',
};

// ==========================================
// LOGO SVG
// ==========================================
function Logo({ size = 160, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 281.78 281.78">
        <circle cx="140.89" cy="140.89" r="140.89" fill="#e95442" />
        <circle cx="140.89" cy="140.89" r="8" fill="#fff" />
        <path d="M200,220c-45,27.85-109.74,12.24-133-48.28a78,78,0,0,1-.58-53.7c24.05-68.59,103-82.32,148.33-39.07a89.59,89.59,0,0,1,16.58,108.19" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="15" />
        <path d="M188,201c-34.07,20.89-83,8.72-100-37.62a56,56,0,0,1-1.05-35.66c16.61-54.33,77.59-65.77,112.34-32.64a67.19,67.19,0,0,1,12.56,80.92" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="15" />
        <path d="M176,182c-23.51,14.17-57.42,4.91-67.51-28.6a32.86,32.86,0,0,1-.41-17.46c9.71-38.75,51.93-47.4,75.72-24.73a44.81,44.81,0,0,1,8.53,53.66" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="15" />
        <rect x="138.17" y="0" width="5.26" height="281.78" fill="#fff" />
        <rect x="0" y="138.17" width="281.78" height="5.26" fill="#fff" />
      </svg>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.95 }}>
          <span style={{ fontFamily: 'Comfortaa, cursive', fontSize: size * 0.18, fontWeight: 700, color: THEME.colors.primary }}>terra</span>
          <span style={{ fontFamily: 'Comfortaa, cursive', fontSize: size * 0.18, fontWeight: 700, color: THEME.colors.primary }}>match</span>
        </div>
      )}
    </div>
  );
}

function useBrandFont() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.innerHTML = `
      * { box-sizing: border-box; }
      body { font-family: 'Comfortaa', cursive !important; background-color: ${THEME.colors.bg}; color: ${THEME.colors.text}; margin: 0; scroll-behavior: smooth; }
      h1, h2, h3, h4 { font-weight: 700; letter-spacing: -0.5px; }
      input, select, textarea, button { font-family: 'Comfortaa', cursive !important; transition: all 0.2s; }
      button { cursor: pointer; }
      input:focus, select:focus, textarea:focus { outline: none; border-color: ${THEME.colors.primary} !important; box-shadow: 0 0 0 3px rgba(233, 84, 66, 0.1); }
      @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
      @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-float { animation: float 4s ease-in-out infinite; }
      .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
    `;
    document.head.appendChild(style);
  }, []);
}

function Badge({ children, color = 'primary' }) {
  const colors = {
    primary: { bg: `${THEME.colors.primary}15`, text: THEME.colors.primary },
    success: { bg: `${THEME.colors.success}20`, text: THEME.colors.success },
    warning: { bg: `${THEME.colors.warning}20`, text: THEME.colors.warning },
    gray: { bg: '#e2e8f0', text: THEME.colors.textLight }
  };
  return (
    <span style={{ background: colors[color].bg, color: colors[color].text, padding: '6px 14px', borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 700, display: 'inline-block' }}>
      {children}
    </span>
  );
}

// ==========================================
// APP PRINCIPAL
// ==========================================
export default function App() {
  useBrandFont();
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);

  const isAdmin = profile?.email === 'jcnieto.marketing@gmail.com';

  useEffect(() => { checkSession(); }, []);
  useEffect(() => { if (user) loadNotifications(); }, [user]);

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await loadProfile(session.user.email);
        setView('dashboard');
      } else { setView('home'); }
    } catch (error) { setView('home'); } finally { setLoading(false); }
  }

  async function loadProfile(userEmail) {
    try { 
      const { data } = await supabase.from('profiles').select('*').eq('email', userEmail).single(); 
      setProfile(data || { nombre: 'Usuario', email: userEmail }); 
    } catch (error) { setProfile({ nombre: 'Usuario', email: userEmail }); }
  }

  async function loadNotifications() {
    try {
      const { data } = await supabase.from('notificaciones').select('*').eq('user_id', user.id).order('creado_en', { ascending: false }).limit(20);
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.leida).length);
    } catch (error) { console.error('Error loading notifications:', error); }
  }

  async function markNotificationAsRead(id) {
    try {
      await supabase.from('notificaciones').update({ leida: true }).eq('id', id);
      loadNotifications();
    } catch (error) { console.error('Error marking as read:', error); }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setNotifications([]); setUnreadCount(0); setView('home');
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Logo size={120} /></div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => setView('home')} style={{ cursor: 'pointer' }}><Logo size={140} /></div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', fontWeight: 600, color: THEME.colors.text, padding: '8px 16px' }}>Inicio</button>
          {user ? (
            <>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Hola, <span style={{ color: THEME.colors.primary }}>{profile?.nombre}</span></span>
              
              {/* Campana de Notificaciones */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowNotifs(!showNotifs)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', padding: '8px', position: 'relative' }}>
                  🔔
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '0', right: '0', background: THEME.colors.primary, color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: THEME.radius.full, minWidth: '18px' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifs && (
                  <div style={{ position: 'absolute', top: '40px', right: '0', background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 200 }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>Notificaciones</div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: THEME.colors.textLight }}>Sin notificaciones</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', background: n.leida ? 'white' : '#fff5f5', cursor: 'pointer' }} onClick={() => markNotificationAsRead(n.id)}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>{n.titulo}</div>
                          <div style={{ fontSize: '0.8rem', color: THEME.colors.textLight }}>{n.mensaje}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <button onClick={() => setView('dashboard')} style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${THEME.colors.primary}`, color: THEME.colors.primary, borderRadius: THEME.radius.full, fontWeight: 700 }}>Dashboard</button>
              {isAdmin && (
                <button onClick={() => setView('admin')} style={{ padding: '8px 20px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>🛡️ Admin</button>
              )}
              <button onClick={handleLogout} style={{ padding: '8px 20px', background: THEME.colors.textLight, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Salir</button>
            </>
          ) : (
            <>
              <button onClick={() => setView('login')} style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${THEME.colors.text}`, color: THEME.colors.text, borderRadius: THEME.radius.full, fontWeight: 700 }}>Ingresar</button>
              <button onClick={() => setView('register')} style={{ padding: '8px 20px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Regístrate</button>
            </>
          )}
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        {view === 'home' && <HomeView onNavigate={setView} />}
        {view === 'register' && <RegisterView supabase={supabase} onSuccess={(u) => { setUser(u); loadProfile(u.email); setView('dashboard'); }} onNavigate={setView} />}
        {view === 'login' && <LoginView supabase={supabase} onSuccess={(u) => { setUser(u); loadProfile(u.email); setView('dashboard'); }} onNavigate={setView} />}
        {view === 'dashboard' && user && <DashboardView user={user} profile={profile} supabase={supabase} onNavigate={setView} setSelectedItem={setSelectedItem} />}
        {view === 'iub-wizard' && user && <IUBWizard user={user} supabase={supabase} onNavigate={setView} />}
        {view === 'oferta-wizard' && user && <OfertaWizard user={user} supabase={supabase} onNavigate={setView} />}
        {view === 'iub-detail' && user && selectedItem && <IUBDetailView item={selectedItem} supabase={supabase} onNavigate={setView} isAdmin={isAdmin} />}
        {view === 'local-detail' && user && selectedItem && <LocalDetailView item={selectedItem} supabase={supabase} profile={profile} onNavigate={setView} isAdmin={isAdmin} />}
        {view === 'admin' && user && isAdmin && <AdminPanel supabase={supabase} onNavigate={setView} setSelectedItem={setSelectedItem} />}
        {/* CORRECCIÓN: Pasamos profile a AdminDetailView */}
        {view === 'admin-detail' && user && isAdmin && selectedItem && <AdminDetailView item={selectedItem} type={selectedItem.tipo || 'iub'} supabase={supabase} profile={profile} onNavigate={setView} />}
      </main>

      <footer style={{ background: THEME.colors.dark, color: 'white', padding: '60px 32px 30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div>
              <Logo size={140} />
              <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '16px', lineHeight: 1.6 }}>
                La mayor comunidad de búsqueda inteligente de locales comerciales en LATAM.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: THEME.colors.secondary }}>Plataforma</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px' }}><button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Inicio</button></li>
                <li style={{ marginBottom: '12px' }}><button onClick={() => setView('register')} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Busco locales</button></li>
                <li style={{ marginBottom: '12px' }}><button onClick={() => setView('register')} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Tengo locales</button></li>
                <li style={{ marginBottom: '12px' }}><button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Sobre TerraMatch</button></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: THEME.colors.secondary }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px' }}><button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Términos y Condiciones</button></li>
                <li style={{ marginBottom: '12px' }}><button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Política de Privacidad</button></li>
                <li style={{ marginBottom: '12px' }}><button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Política de Cookies</button></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: THEME.colors.secondary }}>Contacto</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px', fontSize: '0.9rem', opacity: 0.7 }}> contacto@terramatch.net</li>
                <li style={{ marginBottom: '12px', fontSize: '0.9rem', opacity: 0.7 }}>📱 +57 300 000 0000</li>
                <li style={{ marginBottom: '12px', fontSize: '0.9rem', opacity: 0.7 }}>📍 Bogotá, Colombia</li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: 0 }}>© 2026 TerraMatch · NIT 901.612.770-8 · Todos los derechos reservados</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '1.2rem' }}>📘</a>
              <a href="#" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '1.2rem' }}></a>
              <a href="#" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '1.2rem' }}>💼</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// HOME VIEW CON TICKER
// ==========================================
function HomeView({ onNavigate }) {
  return (
    <div>
      {/* TICKER SUPERIOR */}
      <div style={{ background: THEME.colors.dark, color: 'white', padding: '10px 0', overflow: 'hidden', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '40px', animation: 'slide-up 0.5s ease-out' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '32px' }}>
            <span style={{ color: THEME.colors.success }}>●</span> 🔥 3 nuevos matches en Bogotá hace 5 min
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: THEME.colors.success }}>●</span> 🏪 Local en Chapinero arrendado en 48h
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: THEME.colors.success }}>●</span> 📈 142 empresas buscando locales esta semana
          </span>
        </div>
      </div>

      {/* HERO SECTION */}
      <div style={{ 
        position: 'relative', 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center',
        background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80') center/cover`,
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.4 }}></div>
        <div style={{ position: 'absolute', top: '15%', right: '15%', width: '200px', height: '200px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.6 }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 32px', textAlign: 'center', position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="animate-slide-up">
            <div style={{ display: 'inline-block', background: `${THEME.colors.primary}15`, color: THEME.colors.primary, padding: '8px 20px', borderRadius: THEME.radius.full, fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>
              La mayor comunidad de búsqueda inteligente
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', lineHeight: 1.1, margin: '0 0 24px 0', color: THEME.colors.text }}>
              Hagamos Match entre tu<br/>
              <span style={{ color: THEME.colors.primary }}>Local y el Negocio Perfecto</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: THEME.colors.textLight, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
              Deja de buscar. Empieza a encontrar. Nuestro algoritmo conecta empresas en expansión con locales comerciales ideales en tiempo real.
            </p>
            <button onClick={() => onNavigate('register')} style={{ padding: '16px 40px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(233,84,66,0.3)' }}>
              Regístrate gratis y empieza →
            </button>
            <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', color: THEME.colors.textLight, justifyContent: 'center', marginTop: '24px' }}>
              <span>✅ Sin duplicados</span>
              <span>✅ Match 100% real</span>
              <span>✅ Curación de contenido</span>
            </div>
          </div>
        </div>
      </div>

      {/* TARJETAS BUSCO/TENGO LOCALES */}
      <div style={{ padding: '80px 32px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: THEME.colors.text }}>¿Cómo quieres usar TerraMatch?</h2>
        <p style={{ fontSize: '1.1rem', color: THEME.colors.textLight, marginBottom: '60px' }}>Elige tu camino y deja que nuestro algoritmo haga el resto.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          <div onClick={() => onNavigate('register')} style={{ background: THEME.colors.white, padding: '40px 32px', borderRadius: THEME.radius.lg, cursor: 'pointer', border: `2px solid transparent`, boxShadow: THEME.shadow, transition: 'all 0.3s', textAlign: 'left' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.transform = 'translateY(-8px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ width: '70px', height: '70px', background: `${THEME.colors.primary}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '20px' }}></div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: THEME.colors.text }}>Busco locales</h3>
            <p style={{ color: THEME.colors.textLight, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>Podrás comprar o arrendar locales que se ajusten a tus necesidades. Guarda tus búsquedas (IUB) y recibe avisos de nuevos matches.</p>
            <button style={{ padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '0.9rem' }}>SÍ, QUIERO BUSCAR →</button>
          </div>
          <div onClick={() => onNavigate('register')} style={{ background: THEME.colors.white, padding: '40px 32px', borderRadius: THEME.radius.lg, cursor: 'pointer', border: `2px solid transparent`, boxShadow: THEME.shadow, transition: 'all 0.3s', textAlign: 'left' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.transform = 'translateY(-8px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ width: '70px', height: '70px', background: `${THEME.colors.secondary}30`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>🏪</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: THEME.colors.text }}>Tengo locales</h3>
            <p style={{ color: THEME.colors.textLight, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>Podrás ofertar todos tus locales a la vez. Etiqueta tus locales para que aparezcan en las búsquedas de tus clientes potenciales.</p>
            <button style={{ padding: '12px 24px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '0.9rem' }}>SÍ, QUIERO OFERTAR →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// REGISTRO Y LOGIN
// ==========================================
function RegisterView({ supabase, onSuccess, onNavigate }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', cedula: '', email: '', celular: '', nit: '', razonSocial: '', mensaje: '' });
  const [acepta, setAcepta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!acepta) { setError('Debes aceptar la política de privacidad'); return; }
    setLoading(true); setError('');
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: form.email, password: 'TerraMatch2026!' });
      if (authError) throw authError;
      await supabase.from('profiles').insert([{
        id: authData.user.id, nombre: form.nombre, apellido: form.apellido, email: form.email, 
        celular: form.celular, tipo_usuario: 'buscador', segmento_preferido: 'locales',
        acepto_terminos: true, acepto_privacidad: true, autorizo_datos: true, fecha_aceptacion: new Date().toISOString()
      }]);
      onSuccess(authData.user);
    } catch (err) { setError(err.message || 'Error al crear cuenta'); } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '14px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box', fontSize: '1rem' };

  return (
    <div style={{ padding: '60px 32px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}><Logo size={140} /></div>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', color: THEME.colors.text }}>Crear Cuenta</h2>
        {error && <div style={{ background: '#fff5f5', color: THEME.colors.primary, padding: '12px', borderRadius: THEME.radius.sm, marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Nombres *</label><input placeholder="Escribe tu nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} style={inputStyle} /></div>
          <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Apellidos *</label><input placeholder="Escribe tu apellido" value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} style={inputStyle} /></div>
        </div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Cédula *</label>
        <input placeholder="Escribe tu n° de identificacion" value={form.cedula} onChange={e => setForm({...form, cedula: e.target.value})} style={inputStyle} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Email *</label><input type="email" placeholder="Escribe tu correo" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} /></div>
          <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Celular *</label><input placeholder="Escribe tu n° de celular" value={form.celular} onChange={e => setForm({...form, celular: e.target.value})} style={inputStyle} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>NIT (Opcional)</label><input placeholder="NIT de tu empresa" value={form.nit} onChange={e => setForm({...form, nit: e.target.value})} style={inputStyle} /></div>
          <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Razón Social</label><input placeholder="Nombre de tu empresa" value={form.razonSocial} onChange={e => setForm({...form, razonSocial: e.target.value})} style={inputStyle} /></div>
        </div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Mensaje descriptivo</label>
        <textarea placeholder="Cuéntanos sobre tu necesidad..." rows="3" value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} style={{ ...inputStyle, resize: 'vertical' }} />
        <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px', cursor: 'pointer' }}>
          <input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)} style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
          <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight }}>He leído y acepto la <a href="#" style={{ color: THEME.colors.primary, fontWeight: 600 }}>política de privacidad</a></span>
        </label>
        <button onClick={handleRegister} disabled={loading} style={{ width: '100%', padding: '16px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>{loading ? 'Creando cuenta...' : 'CONTINUAR'}</button>
        <p style={{ textAlign: 'center', color: THEME.colors.textLight, fontSize: '0.9rem' }}>¿Ya tienes cuenta? <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', fontWeight: 700, padding: 0 }}>INGRESAR</button></p>
      </div>
    </div>
  );
}

function LoginView({ supabase, onSuccess, onNavigate }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true); setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (authError) throw authError;
      onSuccess(data.user);
    } catch (err) { setError('Credenciales incorrectas'); } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: '60px 32px', maxWidth: '450px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}><Logo size={140} /></div>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', color: THEME.colors.text }}>Ingresar</h2>
        {error && <div style={{ background: '#fff5f5', color: THEME.colors.primary, padding: '12px', borderRadius: THEME.radius.sm, marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Correo electrónico</label>
        <input type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '14px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Contraseña</label>
        <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '14px', marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '16px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>{loading ? 'Entrando...' : 'INGRESAR'}</button>
        <p style={{ textAlign: 'center', color: THEME.colors.textLight, fontSize: '0.9rem' }}>¿No tienes cuenta? <button onClick={() => onNavigate('register')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', fontWeight: 700, padding: 0 }}>REGISTRARME</button></p>
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD REAL CON TABS
// ==========================================
function DashboardView({ user, profile, supabase, onNavigate, setSelectedItem }) {
  const [tab, setTab] = useState('iubs');
  const [iubs, setIubs] = useState([]);
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [user]);

  async function loadData() {
    try {
      setLoading(true);
      const { data: iubsData } = await supabase.from('iubs').select('*').eq('user_id', user.id).order('creado_en', { ascending: false });
      setIubs(iubsData || []);
      const { data: propsData } = await supabase.from('propiedades').select('*').eq('user_id', user.id).order('creado_en', { ascending: false });
      setLocales(propsData || []);
    } catch (error) { console.error('Error loading data:', error); } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: 0, color: THEME.colors.text }}>Hola, {profile?.nombre} 👋</h2>
          <p style={{ margin: '8px 0 0 0', color: THEME.colors.textLight }}>Bienvenido a tu centro de control TerraMatch</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => onNavigate('iub-wizard')} style={{ padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>+ Crear IUB</button>
          <button onClick={() => onNavigate('oferta-wizard')} style={{ padding: '12px 24px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>+ Cargar Local</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => setTab('iubs')} style={{ padding: '12px 24px', background: tab === 'iubs' ? THEME.colors.primary : THEME.colors.white, color: tab === 'iubs' ? 'white' : THEME.colors.text, border: tab === 'iubs' ? 'none' : `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Mis IUBs ({iubs.length})</button>
        <button onClick={() => setTab('locales')} style={{ padding: '12px 24px', background: tab === 'locales' ? THEME.colors.primary : THEME.colors.white, color: tab === 'locales' ? 'white' : THEME.colors.text, border: tab === 'locales' ? 'none' : `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Mis Locales ({locales.length})</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: THEME.colors.textLight }}>Cargando...</div>
      ) : tab === 'iubs' ? (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          {iubs.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: THEME.colors.textLight }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ color: THEME.colors.text }}>Aún no tienes IUBs</h3>
              <p>Crea tu primer Indicador Único de Búsqueda para encontrar el local perfecto</p>
              <button onClick={() => onNavigate('iub-wizard')} style={{ marginTop: '20px', padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Crear mi primer IUB</button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>IUB</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA (M²)</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TIPO</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {iubs.map((iub, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem(iub); onNavigate('iub-detail'); }}>
                    <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{iub.codigo_iub}</td>
                    <td style={{ padding: '16px' }}>{iub.area_min}-{iub.area_max} m²</td>
                    <td style={{ padding: '16px' }}>{iub.ciudad}</td>
                    <td style={{ padding: '16px' }}>{iub.tipo_negocio}</td>
                    <td style={{ padding: '16px' }}><Badge color={iub.estado === 'activo' ? 'success' : 'gray'}>{iub.estado}</Badge></td>
                    <td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer' }}>Ver Matches →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          {locales.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: THEME.colors.textLight }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏪</div>
              <h3 style={{ color: THEME.colors.text }}>Aún no has publicado locales</h3>
              <p>Publica tu primer local para recibir matches de buscadores interesados</p>
              <button onClick={() => onNavigate('oferta-wizard')} style={{ marginTop: '20px', padding: '12px 24px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Publicar mi primer local</button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TÍTULO</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA (M²)</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>PRECIO</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {locales.map((local, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem(local); onNavigate('local-detail'); }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{local.titulo || 'Sin título'}</td>
                    <td style={{ padding: '16px' }}>{local.ciudad}</td>
                    <td style={{ padding: '16px' }}>{local.area_total} m²</td>
                    <td style={{ padding: '16px' }}>${local.precio?.toLocaleString()}</td>
                    <td style={{ padding: '16px' }}><Badge color={local.disponible ? 'success' : 'gray'}>{local.disponible ? 'Disponible' : 'No disponible'}</Badge></td>
                    <td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer' }}>Ver IUBs →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// WIZARD IUB REAL
// ==========================================
function IUBWizard({ user, supabase, onNavigate }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    cantidad: 10, ciudad: 'Bogotá', zona: 'Norte', tipo: 'arrendar',
    area: 1000, precioM2: 120000,
    caracteristicas: [], usoSuelo: 'Comercial',
    tiempoContrato: 5
  });

  const toggleCar = (c) => {
    setForm(prev => ({ ...prev, caracteristicas: prev.caracteristicas.includes(c) ? prev.caracteristicas.filter(x => x !== c) : [...prev.caracteristicas, c] }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const codigoIub = `IUB${Math.floor(Math.random() * 900000) + 100000}`;
      const { error } = await supabase.from('iubs').insert([{
        user_id: user.id,
        codigo_iub: codigoIub,
        segmentos: 'Locales Comerciales',
        ciudad: form.ciudad,
        zona: form.zona,
        tipo_negocio: form.tipo === 'arrendar' ? 'Arriendo' : 'Compra',
        uso_suelo: form.usoSuelo,
        area_min: form.area * 0.9,
        area_max: form.area * 1.1,
        canon_arriendo: form.tipo === 'arrendar' ? form.precioM2 * form.area : null,
        presupuesto_compra: form.tipo === 'comprar' ? form.precioM2 * form.area : null,
        caracteristicas: JSON.stringify(form.caracteristicas),
        horizonte: `${form.tiempoContrato} años`,
        estado: 'activo',
        cantidad_locales: form.cantidad
      }]);
      if (error) throw error;
      alert(`¡IUB ${codigoIub} creado exitosamente!`);
      onNavigate('dashboard');
    } catch (err) { alert('Error: ' + err.message); } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box', fontSize: '1rem', fontFamily: 'Comfortaa' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: THEME.colors.text };

  return (
    <div style={{ padding: '40px 32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
          <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Dashboard</button>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span>Crear IUB</span>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Cuéntanos tu necesidad</h2>
        <p style={{ textAlign: 'center', color: THEME.colors.textLight, marginBottom: '32px' }}>Paso {step} de 3</p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '6px', borderRadius: '3px', background: s <= step ? THEME.colors.primary : '#e2e8f0' }}></div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>¿Cuántos locales necesitas?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div><label style={labelStyle}>Cantidad</label><input type="number" value={form.cantidad} onChange={e => setForm({...form, cantidad: parseInt(e.target.value)})} style={inputStyle} /></div>
              <div><label style={labelStyle}>Ciudad</label><select value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} style={inputStyle}><option>Bogotá</option><option>Medellín</option><option>Cali</option></select></div>
              <div><label style={labelStyle}>Zona</label><select value={form.zona} onChange={e => setForm({...form, zona: e.target.value})} style={inputStyle}><option>Norte</option><option>Sur</option><option>Centro</option></select></div>
            </div>
            <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}>Tipo de negocio</h4>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 20px', border: `2px solid ${form.tipo === 'comprar' ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: form.tipo === 'comprar' ? `${THEME.colors.primary}10` : 'white' }}>
                <input type="radio" name="tipo" checked={form.tipo === 'comprar'} onChange={() => setForm({...form, tipo: 'comprar'})} /> Comprar
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 20px', border: `2px solid ${form.tipo === 'arrendar' ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: form.tipo === 'arrendar' ? `${THEME.colors.primary}10` : 'white' }}>
                <input type="radio" name="tipo" checked={form.tipo === 'arrendar'} onChange={() => setForm({...form, tipo: 'arrendar'})} /> Arrendar
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div><label style={labelStyle}>Área aproximada (m²)</label><input type="number" value={form.area} onChange={e => setForm({...form, area: parseInt(e.target.value)})} style={inputStyle} /></div>
              <div><label style={labelStyle}>{form.tipo === 'arrendar' ? 'Dispuesto a pagar hasta COP/m²' : 'Presupuesto máximo COP/m²'}</label><input type="number" value={form.precioM2} onChange={e => setForm({...form, precioM2: parseInt(e.target.value)})} style={inputStyle} /></div>
            </div>
            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: THEME.radius.sm, textAlign: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight }}>Aproximado: </span>
              <strong style={{ color: THEME.colors.primary, fontSize: '1.1rem' }}>COP ${(form.precioM2 * form.area).toLocaleString()}{form.tipo === 'arrendar' ? '/mes' : ''}</strong>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>Características especiales</h3>
            <p style={{ color: THEME.colors.textLight, marginBottom: '24px' }}>Selecciona todas las que apliquen</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px' }}>
              {['Esquinero', 'Vía Principal', 'Centro comercial', 'Doble altura', 'Permiso de construcción'].map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', border: `2px solid ${form.caracteristicas.includes(c) ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.sm, cursor: 'pointer', background: form.caracteristicas.includes(c) ? `${THEME.colors.primary}10` : 'white' }}>
                  <input type="checkbox" checked={form.caracteristicas.includes(c)} onChange={() => toggleCar(c)} />
                  <span style={{ fontWeight: 600 }}>{c}</span>
                </label>
              ))}
            </div>
            <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}>Uso del suelo</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['Mixto', 'Comercial', 'Exclusivo'].map(u => (
                <button key={u} onClick={() => setForm({...form, usoSuelo: u})} style={{ padding: '10px 20px', border: `2px solid ${form.usoSuelo === u ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: form.usoSuelo === u ? THEME.colors.primary : 'white', color: form.usoSuelo === u ? 'white' : THEME.colors.text, fontWeight: 600 }}>{u}</button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>Tiempo de contrato</h3>
            <div style={{ marginBottom: '32px' }}>
              <select value={form.tiempoContrato} onChange={e => setForm({...form, tiempoContrato: parseInt(e.target.value)})} style={inputStyle}>
                <option value={1}>1 año</option><option value={3}>3 años</option><option value={5}>5 años</option><option value={10}>10 años</option><option value={15}>Más de 10</option>
              </select>
            </div>
            <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: THEME.radius.md, marginBottom: '24px' }}>
              <h4 style={{ marginTop: 0, color: THEME.colors.text }}>Resumen de tu búsqueda</h4>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Cantidad:</strong> {form.cantidad} locales</p>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Ubicación:</strong> {form.ciudad} - {form.zona}</p>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Tipo:</strong> {form.tipo === 'arrendar' ? 'Arriendo' : 'Compra'}</p>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Área:</strong> {form.area} m²</p>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Características:</strong> {form.caracteristicas.join(', ') || 'Ninguna'}</p>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Uso del suelo:</strong> {form.usoSuelo}</p>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Tiempo:</strong> {form.tiempoContrato} años</p>
            </div>
            <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight }}>Acepto los términos y condiciones de TerraMatch</span>
            </label>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          {step > 1 && <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: '14px', background: 'white', border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 600, color: THEME.colors.text }}>CANCELAR</button>}
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} style={{ flex: 2, padding: '14px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>GUARDAR Y CONTINUAR →</button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '14px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>{loading ? 'Creando...' : '✓ CREAR IUB'}</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// WIZARD OFERTA REAL
// ==========================================
function OfertaWizard({ user, supabase, onNavigate }) {
  const [form, setForm] = useState({
    titulo: '', ciudad: 'Bogotá', direccion: '', barrio: '', zona: '', codigoPostal: '',
    matricula: '', tipo: ['arrendar'], valorCanon: '', valorVenta: '', tiempoContrato: 5,
    area: 79, caracteristicas: [], usoSuelo: 'Comercial', fotos: []
  });
  const [loading, setLoading] = useState(false);

  const handleDireccionChange = (direccion) => {
    setForm({...form, direccion, barrio: 'Pontevedra', zona: 'Norte', codigoPostal: '111121'});
  };

  const toggleTipo = (t) => {
    setForm(prev => ({ ...prev, tipo: prev.tipo.includes(t) ? prev.tipo.filter(x => x !== t) : [...prev.tipo, t] }));
  };

  const toggleCar = (c) => {
    setForm(prev => ({ ...prev, caracteristicas: prev.caracteristicas.includes(c) ? prev.caracteristicas.filter(x => x !== c) : [...prev.caracteristicas, c] }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('propiedades').insert([{
        user_id: user.id,
        titulo: form.titulo,
        ciudad: form.ciudad,
        zona: form.zona,
        direccion: form.direccion,
        barrio: form.barrio,
        segmento: 'locales',
        tipo_inmueble: 'local',
        operacion: form.tipo.includes('arrendar') ? 'arrendar' : 'vender',
        area_total: form.area,
        precio: form.tipo.includes('arrendar') ? parseInt(form.valorCanon) : parseInt(form.valorVenta),
        caracteristicas: JSON.stringify(form.caracteristicas),
        matricula_inmobiliaria: form.matricula,
        disponible: true,
        estado: 'activo'
      }]);
      if (error) throw error;
      alert('¡Local publicado exitosamente!');
      onNavigate('dashboard');
    } catch (err) { alert('Error: ' + err.message); } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box', fontSize: '1rem', fontFamily: 'Comfortaa', marginBottom: '16px' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: THEME.colors.text };

  return (
    <div style={{ padding: '40px 32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
          <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Dashboard</button>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span>Cargar Local</span>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Carga un local</h2>

        <label style={labelStyle}>Nombre / Título *</label>
        <input placeholder="Local esquinero en Pontevedra" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} style={inputStyle} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Selecciona ciudad *</label>
            <select value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} style={inputStyle}>
              <option>Bogotá</option><option>Medellín</option><option>Cali</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Dirección *</label>
            <input placeholder="Calle 98 # 70 91" value={form.direccion} onChange={e => handleDireccionChange(e.target.value)} style={inputStyle} />
          </div>
        </div>

        {form.barrio && (
          <div style={{ background: `${THEME.colors.secondary}20`, padding: '16px', borderRadius: THEME.radius.sm, marginBottom: '16px', fontSize: '0.9rem' }}>
            <strong>De acuerdo con la dirección ingresada, los siguientes datos han sido calculados:</strong><br/>
            Barrio: {form.barrio} · Zona: {form.zona} · Código Postal: {form.codigoPostal}
          </div>
        )}

        <label style={labelStyle}>Matrícula inmobiliaria *</label>
        <input placeholder="C50668973" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} style={inputStyle} />

        <label style={labelStyle}>Tipo de negocio (activa al menos una opción) *</label>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 20px', border: `2px solid ${form.tipo.includes('arrendar') ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: form.tipo.includes('arrendar') ? `${THEME.colors.primary}10` : 'white' }}>
            <input type="checkbox" checked={form.tipo.includes('arrendar')} onChange={() => toggleTipo('arrendar')} /> Arrendar
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 20px', border: `2px solid ${form.tipo.includes('vender') ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: form.tipo.includes('vender') ? `${THEME.colors.primary}10` : 'white' }}>
            <input type="checkbox" checked={form.tipo.includes('vender')} onChange={() => toggleTipo('vender')} /> Vender
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Valor canon *</label>
            <input type="number" placeholder="Ingresa valor" value={form.valorCanon} onChange={e => setForm({...form, valorCanon: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Valor venta mínimo</label>
            <input type="number" placeholder="Ingresa valor" value={form.valorVenta} onChange={e => setForm({...form, valorVenta: e.target.value})} style={inputStyle} />
          </div>
        </div>

        <label style={labelStyle}>Tiempo mínimo de contrato (en años)</label>
        <select value={form.tiempoContrato} onChange={e => setForm({...form, tiempoContrato: parseInt(e.target.value)})} style={inputStyle}>
          <option value={1}>1 año</option><option value={3}>3 años</option><option value={5}>5 años</option><option value={10}>10 años</option>
        </select>

        <label style={labelStyle}>Área (m²) *</label>
        <input type="number" value={form.area} onChange={e => setForm({...form, area: parseInt(e.target.value)})} style={inputStyle} />

        <label style={labelStyle}>Características especiales (selecciona todas las que apliquen)</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {['Esquinero', 'Vía Principal', 'Centro comercial', 'Doble altura', 'Permiso de construcción'].map(c => (
            <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', border: `2px solid ${form.caracteristicas.includes(c) ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.sm, cursor: 'pointer', background: form.caracteristicas.includes(c) ? `${THEME.colors.primary}10` : 'white' }}>
              <input type="checkbox" checked={form.caracteristicas.includes(c)} onChange={() => toggleCar(c)} />
              <span style={{ fontWeight: 600 }}>{c}</span>
            </label>
          ))}
        </div>

        <label style={labelStyle}>Uso del suelo</label>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['Mixto', 'Comercial', 'Exclusivo'].map(u => (
            <button key={u} onClick={() => setForm({...form, usoSuelo: u})} style={{ padding: '10px 20px', border: `2px solid ${form.usoSuelo === u ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: form.usoSuelo === u ? THEME.colors.primary : 'white', color: form.usoSuelo === u ? 'white' : THEME.colors.text, fontWeight: 600 }}>{u}</button>
          ))}
        </div>

        <label style={labelStyle}>Fotos/Planos</label>
        <div style={{ border: '2px dashed #e2e8f0', borderRadius: THEME.radius.md, padding: '32px', textAlign: 'center', marginBottom: '24px', cursor: 'pointer', background: '#f8f9fa' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Arrastra fotos o planos aquí</p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: THEME.colors.textLight }}>o haz clic para seleccionar archivos</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button onClick={() => onNavigate('dashboard')} style={{ flex: 1, padding: '14px', background: 'white', border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 600, color: THEME.colors.text }}>CANCELAR</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '14px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>{loading ? 'Publicando...' : '✓ PUBLICAR LOCAL'}</button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// IUB DETAIL VIEW REAL
// ==========================================
function IUBDetailView({ item, supabase, onNavigate, isAdmin }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => { loadMatches(); }, [item]);

  async function loadMatches() {
    try {
      setLoading(true);
      const { data } = await supabase.from('matches').select('*, propiedades(*)').eq('iub_id', item.id).order('score', { ascending: false });
      setMatches(data || []);
    } catch (error) { console.error('Error loading matches:', error); } finally { setLoading(false); }
  }

  const updateEstado = async (matchId, estado) => {
    try {
      await supabase.from('matches').update({ estado }).eq('id', matchId);
      loadMatches();
    } catch (error) { alert('Error: ' + error.message); }
  };

  const handleSchedule = (match) => {
    setSelectedMatch(match);
    setShowScheduleModal(true);
  };

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
        <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Dashboard</button>
        <span style={{ margin: '0 8px' }}>&gt;</span>
        <span style={{ color: THEME.colors.text, fontWeight: 600 }}>{item.codigo_iub}</span>
      </div>

      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px', borderLeft: `6px solid ${THEME.colors.primary}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <Badge color="warning">{item.tipo_negocio}</Badge>
          <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: THEME.colors.primary, fontWeight: 700 }}>{item.codigo_iub}</span>
        </div>
        <p style={{ margin: '0 0 8px 0', color: THEME.colors.textLight, fontSize: '0.9rem' }}>{new Date(item.creado_en).toLocaleString('es-CO')}</p>
        <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.5rem' }}>{item.cantidad_locales || 10} Locales en {item.ciudad} zona {item.zona}</h2>
        <p style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>{item.area_min}-{item.area_max} m² por $120.000/m² aprox <strong>${(item.canon_arriendo || 120000000).toLocaleString()}/mes</strong></p>
        {item.caracteristicas && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {JSON.parse(item.caracteristicas).map((c, i) => (
              <span key={i} style={{ padding: '6px 14px', background: `${THEME.colors.secondary}30`, color: THEME.colors.text, borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 600 }}>{c}</span>
            ))}
          </div>
        )}
      </div>

      <h3 style={{ color: THEME.colors.text, marginBottom: '24px' }}>Esta búsqueda tiene {matches.length} Matches</h3>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: THEME.colors.textLight }}>Cargando matches...</div>
      ) : matches.length === 0 ? (
        <div style={{ background: THEME.colors.white, padding: '60px', borderRadius: THEME.radius.lg, textAlign: 'center', boxShadow: THEME.shadow }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}></div>
          <h3 style={{ color: THEME.colors.text }}>Aún no hay matches</h3>
          <p style={{ color: THEME.colors.textLight }}>El sistema buscará propiedades compatibles con tu IUB</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {matches.map(match => (
            <div key={match.id} style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', border: `2px solid ${match.estado === 'favorito' ? THEME.colors.success : match.estado === 'descartado' ? '#e2e8f0' : 'transparent'}` }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>{match.propiedades?.titulo || 'Inmueble en ' + match.propiedades?.zona}</h4>
                <div style={{ display: 'flex', gap: '16px', color: THEME.colors.textLight, fontSize: '0.9rem', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span>📍 {match.propiedades?.ciudad} - {match.propiedades?.zona}</span>
                  <span> {match.propiedades?.area_total} m²</span>
                  <span>💰 ${match.propiedades?.precio?.toLocaleString()}/mes</span>
                </div>
                {match.propiedades?.caracteristicas && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {JSON.parse(match.propiedades.caracteristicas).map((c, i) => (
                      <span key={i} style={{ padding: '4px 10px', background: '#f8f9fa', border: `1px solid ${THEME.colors.secondary}`, borderRadius: THEME.radius.full, fontSize: '0.75rem', color: THEME.colors.text }}>{c}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Badge color={match.estado === 'favorito' ? 'success' : match.estado === 'descartado' ? 'gray' : 'warning'}>{match.estado || 'nuevo'}</Badge>
                {match.estado === 'favorito' && (
                  <button onClick={() => handleSchedule(match)} style={{ padding: '10px 20px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>📅 Agendar</button>
                )}
                {match.estado !== 'favorito' && (
                  <button onClick={() => updateEstado(match.id, 'favorito')} style={{ padding: '10px 20px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Favorito</button>
                )}
                {match.estado !== 'descartado' && (
                  <button onClick={() => updateEstado(match.id, 'descartado')} style={{ padding: '10px 20px', background: 'white', color: THEME.colors.textLight, border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700 }}>Descartar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Agendamiento */}
      {showScheduleModal && selectedMatch && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, maxWidth: '500px', width: '90%' }}>
            <h3 style={{ marginBottom: '16px' }}>📅 Agendar Visita</h3>
            <p style={{ color: THEME.colors.textLight, marginBottom: '24px' }}>Inmueble: {selectedMatch.propiedades?.titulo}</p>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Fecha propuesta</label>
            <input type="date" style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, marginBottom: '16px', boxSizing: 'border-box' }} />
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Hora</label>
            <input type="time" style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, marginBottom: '24px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowScheduleModal(false)} style={{ flex: 1, padding: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={() => { alert('Cita agendada. TerraMatch contactará a ambas partes.'); setShowScheduleModal(false); }} style={{ flex: 1, padding: '12px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>Confirmar Cita</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// LOCAL DETAIL VIEW REAL
// ==========================================
function LocalDetailView({ item, supabase, profile, onNavigate, isAdmin }) {
  const [iubsInteresados, setIubsInteresados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadIUBs(); }, [item]);

  async function loadIUBs() {
    try {
      setLoading(true);
      const { data } = await supabase.from('matches').select('*, iubs(*)').eq('propiedad_id', item.id);
      setIubsInteresados(data || []);
    } catch (error) { console.error('Error loading IUBs:', error); } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
        <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Dashboard</button>
        <span style={{ margin: '0 8px' }}>&gt;</span>
        <span style={{ color: THEME.colors.text, fontWeight: 600 }}>{item.titulo}</span>
      </div>

      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div>
            <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.5rem' }}>{item.titulo}</h2>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <Badge color="primary">{item.ciudad}</Badge>
              <Badge color="success">{item.operacion}</Badge>
            </div>
            <p style={{ margin: '0 0 8px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>
              <strong>${item.precio?.toLocaleString()}</strong> /mes
            </p>
            <p style={{ margin: '0', color: THEME.colors.textLight }}>{item.direccion} · Código Postal: {item.barrio}</p>
          </div>
          <div style={{ background: '#fff5f5', padding: '24px', borderRadius: THEME.radius.md, border: `1px solid ${THEME.colors.primary}30` }}>
            <h4 style={{ color: THEME.colors.primary, marginTop: 0, marginBottom: '16px' }}> Contacto Propietario</h4>
            <p style={{ margin: '8px 0', fontWeight: 700, color: THEME.colors.text }}>{profile?.nombre}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>📞 {profile?.celular}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>✉️ {profile?.email}</p>
            {item.matricula_inmobiliaria && <p style={{ margin: '8px 0', color: THEME.colors.textLight, fontSize: '0.85rem' }}>Matrícula: {item.matricula_inmobiliaria}</p>}
          </div>
        </div>
      </div>

      <h3 style={{ color: THEME.colors.text, marginBottom: '24px' }}>Este local tiene {iubsInteresados.length} Matches (IUBs interesados)</h3>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: THEME.colors.textLight }}>Cargando...</div>
      ) : iubsInteresados.length === 0 ? (
        <div style={{ background: THEME.colors.white, padding: '60px', borderRadius: THEME.radius.lg, textAlign: 'center', boxShadow: THEME.shadow }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}></div>
          <h3 style={{ color: THEME.colors.text }}>Aún no hay IUBs interesados</h3>
          <p style={{ color: THEME.colors.textLight }}>Cuando un buscador cree un IUB compatible, aparecerá aquí</p>
        </div>
      ) : (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>IUB</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CONTACTO</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {iubsInteresados.map((match, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{match.iubs?.codigo_iub}</td>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{match.iubs?.nombre_completo || 'Usuario'}</td>
                  <td style={{ padding: '16px' }}>{match.iubs?.ciudad}</td>
                  <td style={{ padding: '16px' }}>{match.iubs?.area_min}-{match.iubs?.area_max} m²</td>
                  <td style={{ padding: '16px' }}><Badge color={match.estado === 'favorito' ? 'success' : match.estado === 'descartado' ? 'gray' : 'warning'}>{match.estado || 'nuevo'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ADMIN PANEL (TORRE DE CONTROL)
// ==========================================
function AdminPanel({ supabase, onNavigate, setSelectedItem }) {
  const [tab, setTab] = useState('iubs');
  const [iubs, setIubs] = useState([]);
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setLoading(true);
      const { data: iubsData } = await supabase.from('iubs').select('*').order('creado_en', { ascending: false });
      setIubs(iubsData || []);
      const { data: propsData } = await supabase.from('propiedades').select('*').order('creado_en', { ascending: false });
      setLocales(propsData || []);
    } catch (error) { console.error('Error loading admin data:', error); } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.dark, color: 'white', padding: '32px', borderRadius: THEME.radius.lg, marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0' }}>🛡️ Torre de Control (Admin)</h2>
        <p style={{ margin: 0, opacity: 0.8 }}>Gestión global de IUBs, Locales y Matches</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => setTab('iubs')} style={{ padding: '12px 24px', background: tab === 'iubs' ? THEME.colors.primary : THEME.colors.white, color: tab === 'iubs' ? 'white' : THEME.colors.text, border: tab === 'iubs' ? 'none' : `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Gestión de IUBs ({iubs.length})</button>
        <button onClick={() => setTab('locales')} style={{ padding: '12px 24px', background: tab === 'locales' ? THEME.colors.primary : THEME.colors.white, color: tab === 'locales' ? 'white' : THEME.colors.text, border: tab === 'locales' ? 'none' : `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Gestión de Locales ({locales.length})</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: THEME.colors.textLight }}>Cargando...</div>
      ) : tab === 'iubs' ? (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>IUB</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA (M²)</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>MATCHES</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>FECHA</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TIPO</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {iubs.map((iub, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem({...iub, tipo: 'iub'}); onNavigate('admin-detail'); }}>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{iub.codigo_iub}</td>
                  <td style={{ padding: '16px' }}>{iub.area_min}-{iub.area_max} m²</td>
                  <td style={{ padding: '16px' }}><Badge color="primary">16</Badge></td>
                  <td style={{ padding: '16px', fontSize: '0.9rem', color: THEME.colors.textLight }}>{new Date(iub.creado_en).toLocaleDateString('es-CO')}</td>
                  <td style={{ padding: '16px' }}>{iub.ciudad}</td>
                  <td style={{ padding: '16px' }}>{iub.tipo_negocio}</td>
                  <td style={{ padding: '16px' }}><Badge color={iub.estado === 'activo' ? 'success' : 'gray'}>{iub.estado}</Badge></td>
                  <td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer' }}>Ver detalles →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TÍTULO</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CÓDIGO POSTAL</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA (M²)</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>MATCHES</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {locales.map((local, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem({...local, tipo: 'local'}); onNavigate('admin-detail'); }}>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{local.titulo || 'Sin título'}</td>
                  <td style={{ padding: '16px' }}>{local.ciudad}</td>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '0.9rem' }}>{local.barrio || '110141'}</td>
                  <td style={{ padding: '16px' }}>{local.area_total} m²</td>
                  <td style={{ padding: '16px' }}><Badge color="primary">16</Badge></td>
                  <td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer' }}>Ver detalles →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ADMIN DETAIL VIEW (CONFIDENCIAL) - CORREGIDO
// ==========================================
function AdminDetailView({ item, type, supabase, profile, onNavigate }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMatches(); }, [item]);

  async function loadMatches() {
    try {
      setLoading(true);
      let query;
      if (type === 'iub') {
        query = supabase.from('matches').select('*, propiedades(*)').eq('iub_id', item.id);
      } else {
        query = supabase.from('matches').select('*, iubs(*)').eq('propiedad_id', item.id);
      }
      const { data } = await query.order('score', { ascending: false });
      setMatches(data || []);
    } catch (error) { console.error('Error loading matches:', error); } finally { setLoading(false); }
  }

  const updateEstado = async (matchId, estado) => {
    try {
      await supabase.from('matches').update({ estado }).eq('id', matchId);
      loadMatches();
    } catch (error) { alert('Error: ' + error.message); }
  };

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
        <button onClick={() => onNavigate('admin')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Admin</button>
        <span style={{ margin: '0 8px' }}>&gt;</span>
        <span style={{ color: THEME.colors.text, fontWeight: 600 }}>{type === 'iub' ? item.codigo_iub : item.titulo}</span>
      </div>

      {/* Header con Info Confidencial */}
      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Badge color="warning">{type === 'iub' ? item.tipo_negocio : item.operacion}</Badge>
              <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: THEME.colors.primary, fontWeight: 700 }}>{type === 'iub' ? item.codigo_iub : item.matricula_inmobiliaria}</span>
            </div>
            <p style={{ margin: '0 0 8px 0', color: THEME.colors.textLight, fontSize: '0.9rem' }}>{new Date(item.creado_en).toLocaleString('es-CO')}</p>
            <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.5rem' }}>
              {type === 'iub' 
                ? `${item.cantidad_locales || 10} Locales en ${item.ciudad} zona ${item.zona}`
                : item.titulo}
            </h2>
            <p style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>
              {type === 'iub'
                ? `${item.area_min}-${item.area_max} m² por $120.000/m² aprox $${(item.canon_arriendo || 120000000).toLocaleString()}/mes`
                : `$${item.precio?.toLocaleString()} /mes`}
            </p>
            {item.caracteristicas && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {JSON.parse(item.caracteristicas).map((c, i) => (
                  <span key={i} style={{ padding: '6px 14px', background: `${THEME.colors.secondary}30`, color: THEME.colors.text, borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 600 }}>{c}</span>
                ))}
              </div>
            )}
          </div>

          {/* Caja Confidencial Solo para Admin */}
          <div style={{ background: '#fff5f5', padding: '24px', borderRadius: THEME.radius.md, border: `1px solid ${THEME.colors.primary}30` }}>
            <h4 style={{ color: THEME.colors.primary, marginTop: 0, marginBottom: '16px' }}>🔒 Contacto Confidencial</h4>
            <p style={{ margin: '8px 0', fontWeight: 700, color: THEME.colors.text }}>
              {type === 'iub' ? 'Colliers Agregador' : profile?.nombre}
            </p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>📞 {type === 'iub' ? '322 695 9898' : profile?.celular}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>✉️ {type === 'iub' ? 'ventas@colliers.com' : profile?.email}</p>
            {type === 'local' && item.matricula_inmobiliaria && (
              <p style={{ margin: '8px 0', color: THEME.colors.textLight, fontSize: '0.85rem' }}>Matrícula: {item.matricula_inmobiliaria}</p>
            )}
            <button style={{ marginTop: '16px', width: '100%', padding: '12px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>📅 Agendar Presentación</button>
          </div>
        </div>
      </div>

      {/* Tabla de Matches */}
      <h3 style={{ color: THEME.colors.text, marginBottom: '24px' }}>
        {type === 'iub' ? `Esta búsqueda tiene ${matches.length} Matches` : `Este local tiene ${matches.length} Matches (IUBs interesados)`}
      </h3>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: THEME.colors.textLight }}>Cargando...</div>
      ) : matches.length === 0 ? (
        <div style={{ background: THEME.colors.white, padding: '60px', borderRadius: THEME.radius.lg, textAlign: 'center', boxShadow: THEME.shadow }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
          <h3 style={{ color: THEME.colors.text }}>Aún no hay matches</h3>
        </div>
      ) : (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
                {type === 'iub' ? (
                  <>
                    <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TÍTULO</th>
                    <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA (M²)</th>
                    <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>PRECIO/m²</th>
                    <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>IUB</th>
                    <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CONTACTO</th>
                    <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th>
                    <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA</th>
                    <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {matches.map((match, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  {type === 'iub' ? (
                    <>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{match.propiedades?.titulo || 'Inmueble'}</td>
                      <td style={{ padding: '16px' }}>{match.propiedades?.area_total} m²</td>
                      <td style={{ padding: '16px' }}>${match.propiedades?.precio?.toLocaleString()}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Badge color={match.estado === 'favorito' ? 'success' : match.estado === 'descartado' ? 'gray' : 'warning'}>{match.estado || 'nuevo'}</Badge>
                          {match.estado !== 'favorito' && (
                            <button onClick={() => updateEstado(match.id, 'favorito')} style={{ background: 'none', border: 'none', color: THEME.colors.success, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Favorito</button>
                          )}
                          {match.estado !== 'descartado' && (
                            <button onClick={() => updateEstado(match.id, 'descartado')} style={{ background: 'none', border: 'none', color: THEME.colors.textLight, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Descartar</button>
                          )}
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{match.iubs?.codigo_iub}</td>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{match.iubs?.nombre_completo || 'Usuario'}</td>
                      <td style={{ padding: '16px' }}>{match.iubs?.ciudad}</td>
                      <td style={{ padding: '16px' }}>{match.iubs?.area_min}-{match.iubs?.area_max} m²</td>
                      <td style={{ padding: '16px' }}><Badge color={match.estado === 'favorito' ? 'success' : match.estado === 'descartado' ? 'gray' : 'warning'}>{match.estado || 'nuevo'}</Badge></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
