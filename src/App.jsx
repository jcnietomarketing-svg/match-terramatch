import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DOC_TERMINOS = 'https://github.com/jcnietomarketing-svg/match-terramatch/raw/main/T%26C_TerraMatch%20act%202024.docx';

const THEME = {
  colors: { primary: '#ee5340', secondary: '#b9d3dc', text: '#2d3748', textLight: '#718096', bg: '#f7fafc', white: '#ffffff', success: '#48bb78', warning: '#ed8936' },
  radius: { sm: '8px', md: '16px', lg: '24px', full: '9999px' },
  shadow: '0 10px 30px -5px rgba(185, 211, 220, 0.4)',
};

function LogoIcon({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
      <circle cx="21" cy="21" r="19" stroke={THEME.colors.secondary} strokeWidth="2.5" />
      <circle cx="21" cy="21" r="11" stroke={THEME.colors.primary} strokeWidth="2.5" />
      <circle cx="21" cy="21" r="4" fill={THEME.colors.primary} />
    </svg>
  );
}

function useComfortaaFont() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.innerHTML = `body { font-family: 'Comfortaa', cursive !important; background-color: ${THEME.colors.bg}; color: ${THEME.colors.text}; margin: 0; } input, select, textarea, button { font-family: 'Comfortaa', cursive !important; }`;
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
    try {
      const { data } = await supabase.from('profiles').select('*').eq('email', userEmail).single();
      setProfile(data || { nombre: 'Usuario', email: userEmail });
    } catch (error) { setProfile({ nombre: 'Usuario', email: userEmail }); }
  }

  async function loadNotificaciones(userId) {
    try {
      const { data } = await supabase.from('notificaciones').select('*').eq('user_id', userId).order('creado_en', { ascending: false }).limit(20);
      setNotificaciones(data || []);
    } catch (error) { console.error('Error loading notificaciones:', error); }
  }

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setNotificaciones([]); setView('landing');
  }

  const unreadCount = notificaciones.filter(n => !n.leida).length;
  const isAdmin = profile?.email === 'jcnieto.marketing@gmail.com';

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando TerraMatch...</div>;

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: THEME.colors.white, padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setView('landing')}>
            <LogoIcon size={38} />
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>terra<span style={{ color: THEME.colors.primary }}>match</span></span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Hola, <span style={{ color: THEME.colors.primary }}>{profile?.nombre}</span></span>
                
                {/* Campanita de Notificaciones */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowNotifs(!showNotifs)} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.3rem', position: 'relative' }}>
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
                      {notificaciones.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: THEME.colors.textLight }}>Sin notificaciones</div>
                      ) : (
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
              <button onClick={() => setView('login')} style={{ padding: '8px 20px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}>Ingresar</button>
            )}
          </div>
        </div>
      </nav>
      
      <main style={{ flex: 1 }}>
        {view === 'landing' && <LandingView onNavigate={setView} />}
        {view === 'login' && <LoginView supabase={supabase} onSuccess={(u) => { setUser(u); loadProfile(u.email); loadNotificaciones(u.id); setView('dashboard'); }} />}
        {view === 'iub' && user && <IUBView user={user} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'oferta' && user && <OfertaView user={user} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'dashboard' && user && <DashboardView user={user} profile={profile} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'admin' && user && isAdmin && <AdminView supabase={supabase} showToast={showToast} />}
      </main>

      <footer style={{ background: THEME.colors.text, color: 'white', padding: '30px 24px', marginTop: '60px', borderRadius: '32px 32px 0 0', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}><LogoIcon size={28} /><span style={{ fontSize: '1.2rem', fontWeight: 700 }}>terramatch</span></div>
        <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>© 2026 TerraMatch · NIT 901.612.770-8 · Bogotá, Colombia</p>
      </footer>

      {toast && <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: toast.type === 'error' ? THEME.colors.primary : THEME.colors.success, color: 'white', padding: '12px 24px', borderRadius: THEME.radius.full, zIndex: 1000, fontWeight: 600 }}>{toast.message}</div>}
    </div>
  );
}

function LandingView({ onNavigate }) {
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '24px' }}>Encuentra el <span style={{ color: THEME.colors.primary }}>Match Perfecto</span></h1>
      <p style={{ fontSize: '1.2rem', color: THEME.colors.textLight, marginBottom: '48px', maxWidth: '600px' }}>Conectamos empresas en expansión con locales comerciales ideales.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '800px' }}>
        <div onClick={() => onNavigate('oferta')} style={{ background: THEME.colors.white, padding: '40px', borderRadius: THEME.radius.lg, cursor: 'pointer', boxShadow: THEME.shadow }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏪</div>
          <h3>Tengo Locales</h3>
          <p style={{ color: THEME.colors.textLight }}>Publica tu inventario o haz carga masiva.</p>
        </div>
        <div onClick={() => onNavigate('iub')} style={{ background: THEME.colors.white, padding: '40px', borderRadius: THEME.radius.lg, cursor: 'pointer', boxShadow: THEME.shadow }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <h3>Busco Locales</h3>
          <p style={{ color: THEME.colors.textLight }}>Crea tu IUB y recibe matches inteligentes.</p>
        </div>
      </div>
    </div>
  );
}

function LoginView({ supabase, onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword(form);
    if (error) alert(error.message); else onSuccess(data.user);
  };
  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '40px auto', background: THEME.colors.white, borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
      <h2 style={{ textAlign: 'center', marginBottom: '32px', color: THEME.colors.primary }}>Ingresar</h2>
      <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '14px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.md, boxSizing: 'border-box' }} />
      <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '14px', marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.md, boxSizing: 'border-box' }} />
      <button onClick={handleLogin} style={{ width: '100%', padding: '14px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Entrar</button>
    </div>
  );
}

// ==========================================
// DASHBOARD CON EMBUDO DE CONVERSIÓN
// ==========================================
function DashboardView({ user, profile, supabase, showToast, onNavigate }) {
  const [iubs, setIubs] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCitaModal, setShowCitaModal] = useState(false);
  const [matchSeleccionado, setMatchSeleccionado] = useState(null);

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
    try {
      await supabase.from('matches').update({ estado: 'aceptado' }).eq('id', matchId);
      showToast('¡Match Aceptado! Ahora puedes agendar una cita.');
      loadData();
    } catch (error) { showToast('Error al aceptar match', 'error'); }
  }

  async function rechazarMatch(matchId) {
    try {
      await supabase.from('matches').update({ estado: 'rechazado' }).eq('id', matchId);
      showToast('Match Rechazado');
      loadData();
    } catch (error) { showToast('Error al rechazar match', 'error'); }
  }

  const matchesAceptados = matches.filter(m => m.estado === 'aceptado').length;
  const matchesPendientes = matches.filter(m => m.estado === 'pendiente').length;

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando Dashboard...</div>;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Banner de Bienvenida */}
      <div style={{ background: `linear-gradient(135deg, ${THEME.colors.primary} 0%, #ff7e6b 100%)`, color: 'white', padding: '40px', borderRadius: THEME.radius.lg, marginBottom: '32px' }}>
        <h2 style={{ color: 'white', margin: '0 0 8px 0' }}>Hola, {profile?.nombre} 👋</h2>
        <p style={{ opacity: 0.9, margin: 0 }}>Bienvenido a tu centro de control TerraMatch</p>
      </div>

      {/* Embudo de Conversión */}
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

      {/* Acciones Rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div onClick={() => onNavigate('iub')} style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, cursor: 'pointer', transition: 'all 0.3s' }}
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}></div>
          <h3 style={{ marginBottom: '8px' }}>Busco Locales</h3>
          <p style={{ color: THEME.colors.textLight, margin: 0 }}>Crear nuevo IUB</p>
        </div>
        <div onClick={() => onNavigate('oferta')} style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, cursor: 'pointer', transition: 'all 0.3s' }}
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🏪</div>
          <h3 style={{ marginBottom: '8px' }}>Tengo Locales</h3>
          <p style={{ color: THEME.colors.textLight, margin: 0 }}>Publicar inmueble</p>
        </div>
      </div>

      {/* Lista de Matches */}
      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <h3 style={{ marginBottom: '24px' }}>🎯 Tus Matches</h3>
        {matches.length === 0 ? (
          <p style={{ color: THEME.colors.textLight, textAlign: 'center', padding: '40px' }}>Aún no tienes matches. Crea un IUB para empezar.</p>
        ) : (
          matches.map(match => (
            <div key={match.id} style={{ background: '#f8fafc', padding: '20px', borderRadius: THEME.radius.md, marginBottom: '16px', border: `2px solid ${match.estado === 'aceptado' ? THEME.colors.success : match.estado === 'rechazado' ? '#e2e8f0' : THEME.colors.primary}20` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', textTransform: 'capitalize' }}>{match.propiedades?.tipo_inmueble || 'Inmueble'} en {match.propiedades?.zona}</h4>
                  <p style={{ margin: 0, color: THEME.colors.textLight, fontSize: '0.9rem' }}>{match.propiedades?.area} m² · ${match.propiedades?.precio?.toLocaleString('es-CO')}</p>
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
                    <button onClick={() => rechazarMatch(match.id)} style={{ flex: 1, padding: '10px', background: 'white', color: THEME.colors.textLight, border: '1px solid #e2e8f0', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>✗ Rechazar</button>
                  </>
                )}
                {match.estado === 'aceptado' && (
                  <button onClick={() => { setMatchSeleccionado(match); setShowCitaModal(true); }} style={{ flex: 1, padding: '10px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>📅 Agendar Cita</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Cita */}
      {showCitaModal && matchSeleccionado && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, maxWidth: '500px', width: '90%' }}>
            <h3 style={{ marginBottom: '16px' }}>📅 Agendar Visita al Inmueble</h3>
            <p style={{ color: THEME.colors.textLight, marginBottom: '24px' }}>
              Inmueble: {matchSeleccionado.propiedades?.tipo_inmueble} en {matchSeleccionado.propiedades?.zona}
            </p>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Fecha propuesta</label>
            <input type="date" style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, marginBottom: '16px', boxSizing: 'border-box' }} />
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Hora</label>
            <input type="time" style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, marginBottom: '24px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowCitaModal(false)} style={{ flex: 1, padding: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={() => { showToast('Cita agendada. TerraMatch contactará al propietario.'); setShowCitaModal(false); }} style={{ flex: 1, padding: '12px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>Confirmar Cita</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ADMIN VIEW CON EMBUDO COMPLETO
// ==========================================
function AdminView({ supabase, showToast }) {
  const [stats, setStats] = useState({ users: 0, iubs: 0, matches: 0, aceptados: 0, propiedades: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: iubsCount } = await supabase.from('iubs').select('*', { count: 'exact', head: true });
      const { count: matchesCount } = await supabase.from('matches').select('*', { count: 'exact', head: true });
      const { count: aceptadosCount } = await supabase.from('matches').select('*', { count: 'exact', head: true }).eq('estado', 'aceptado');
      const { count: propCount } = await supabase.from('propiedades').select('*', { count: 'exact', head: true });

      setStats({
        users: usersCount || 0,
        iubs: iubsCount || 0,
        matches: matchesCount || 0,
        aceptados: aceptadosCount || 0,
        propiedades: propCount || 0
      });
    } catch (error) { console.error('Error loading stats:', error); } finally { setLoading(false); }
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando Panel de Administración...</div>;

  const tasaConversion = stats.matches > 0 ? ((stats.aceptados / stats.matches) * 100).toFixed(1) : 0;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.text, color: 'white', padding: '30px', borderRadius: THEME.radius.lg, marginBottom: '30px' }}>
        <h2 style={{ color: 'white', margin: '0 0 8px 0' }}>🛡️ Panel de Administrador</h2>
        <p style={{ opacity: 0.8, margin: 0 }}>Embudo de Conversión TerraMatch</p>
      </div>

      {/* Embudo de Conversión */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid ${THEME.colors.primary}` }}>
          <div style={{ color: THEME.colors.textLight, fontSize: '0.85rem', marginBottom: '8px' }}>USUARIOS</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.users}</div>
        </div>
        <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid ${THEME.colors.secondary}` }}>
          <div style={{ color: THEME.colors.textLight, fontSize: '0.85rem', marginBottom: '8px' }}>IUBs CREADOS</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.iubs}</div>
        </div>
        <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid ${THEME.colors.warning}` }}>
          <div style={{ color: THEME.colors.textLight, fontSize: '0.85rem', marginBottom: '8px' }}>MATCHES GENERADOS</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.matches}</div>
        </div>
        <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid ${THEME.colors.success}` }}>
          <div style={{ color: THEME.colors.textLight, fontSize: '0.85rem', marginBottom: '8px' }}>MATCHES ACEPTADOS</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.aceptados}</div>
          <div style={{ fontSize: '0.85rem', color: THEME.colors.success, marginTop: '8px' }}>{tasaConversion}% conversión</div>
        </div>
        <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, borderLeft: `4px solid #9f7aea` }}>
          <div style={{ color: THEME.colors.textLight, fontSize: '0.85rem', marginBottom: '8px' }}>PROPIEDADES</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.propiedades}</div>
        </div>
      </div>

      {/* Visualización del Embudo */}
      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <h3 style={{ marginBottom: '24px' }}>📊 Embudo de Conversión</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600 }}>IUBs Creados</span>
              <span>{stats.iubs}</span>
            </div>
            <div style={{ height: '32px', background: THEME.colors.primary, borderRadius: THEME.radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
              {stats.iubs} usuarios buscando
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600 }}>Matches Generados</span>
              <span>{stats.matches}</span>
            </div>
            <div style={{ height: '32px', background: THEME.colors.warning, borderRadius: THEME.radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, width: `${Math.min(100, (stats.matches / Math.max(stats.iubs, 1)) * 100)}%` }}>
              {stats.matches} matches encontrados
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600 }}>Matches Aceptados</span>
              <span>{stats.aceptados}</span>
            </div>
            <div style={{ height: '32px', background: THEME.colors.success, borderRadius: THEME.radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, width: `${Math.min(100, (stats.aceptados / Math.max(stats.matches, 1)) * 100)}%` }}>
              {stats.aceptados} aceptados ({tasaConversion}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// IUB VIEW (Mantener versión anterior)
// ==========================================
function IUBView({ user, supabase, showToast, onNavigate }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    segmentos: [], actividad: '', nombre: '', id: '', contacto: '', email: '', ciudad: '', cantidad_locales: 1,
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
        user_id: user.id,
        codigo_iub: codigoIub,
        segmentos: form.segmentos.join(','),
        ciudad: form.ciudad,
        barrio: form.barrio,
        tipo_negocio: form.tipo_negocio,
        uso_suelo: form.uso_suelo,
        area_min: parseFloat(form.area_total) || null,
        area_max: parseFloat(form.area_construida) || null,
        canon_arriendo: form.canon_arriendo || null,
        presupuesto_compra: form.presupuesto_compra || null,
        caracteristicas: JSON.stringify(form.caracteristicas),
        horizonte: form.horizonte,
        estado: 'activo'
      }]);
      if (error) throw error;
      showToast(`¡IUB ${codigoIub} generado! Buscando matches...`);
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
              <div><label style={labelStyle}>Contacto / Teléfono</label><input style={inputStyle} value={form.contacto} onChange={e => update('contacto', e.target.value)} /></div>
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
            <h3 style={{ color: THEME.colors.primary }}>🏢 3. Características</h3>
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
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: THEME.radius.md, marginBottom: '24px' }}>
              <p><strong>Segmentos:</strong> {form.segmentos.join(', ')}</p>
              <p><strong>Ubicación:</strong> {form.ciudad} - {form.barrio}</p>
              <p><strong>Área:</strong> {form.area_total} - {form.area_construida} m²</p>
              <p><strong>Presupuesto:</strong> ${form.canon_arriendo}</p>
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

// ==========================================
// OFERTA VIEW (Mantener versión anterior)
// ==========================================
function OfertaView({ user, supabase, showToast, onNavigate }) {
  const [form, setForm] = useState({
    segmentos: [], rol: 'Propietario', nombre: '', id: '', contacto: '', email: '', ciudad: '',
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
        disponible: true,
        estado: 'activo'
      }]);
      if (error) throw error;
      showToast('¡Inmueble publicado! Buscando IUBs compatibles...');
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
