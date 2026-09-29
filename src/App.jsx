import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const THEME = {
  colors: { primary: '#e95442', secondary: '#b9d3dc', text: '#2d3748', textLight: '#718096', bg: '#fafafa', white: '#ffffff', success: '#48bb78', warning: '#ed8936', dark: '#1a202c', info: '#4299e1' },
  radius: { sm: '12px', md: '20px', lg: '32px', full: '9999px' },
  shadow: '0 10px 40px -10px rgba(233, 84, 66, 0.15)',
};

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
    style.innerHTML = `* { box-sizing: border-box; } body { font-family: 'Comfortaa', cursive !important; background-color: ${THEME.colors.bg}; color: ${THEME.colors.text}; margin: 0; scroll-behavior: smooth; } h1, h2, h3, h4 { font-weight: 700; letter-spacing: -0.5px; } input, select, textarea, button { font-family: 'Comfortaa', cursive !important; transition: all 0.2s; } button { cursor: pointer; } input:focus, select:focus, textarea:focus { outline: none; border-color: ${THEME.colors.primary} !important; box-shadow: 0 0 0 3px rgba(233, 84, 66, 0.1); } @keyframes fade-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } } .ticker-item { animation: fade-in 0.5s ease-out; } @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } } .pulse-animation { animation: pulse 2s ease-in-out infinite; }`;
    document.head.appendChild(style);
  }, []);
}

function Badge({ children, color = 'primary' }) {
  const colors = { primary: { bg: `${THEME.colors.primary}15`, text: THEME.colors.primary }, success: { bg: `${THEME.colors.success}20`, text: THEME.colors.success }, warning: { bg: `${THEME.colors.warning}20`, text: THEME.colors.warning }, gray: { bg: '#e2e8f0', text: THEME.colors.textLight }, info: { bg: `${THEME.colors.info}20`, text: THEME.colors.info } };
  return <span style={{ background: colors[color].bg, color: colors[color].text, padding: '6px 14px', borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 700, display: 'inline-block' }}>{children}</span>;
}

export default function App() {
  useBrandFont();
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('locales');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);

  const isAdmin = profile?.email === 'jcnieto.marketing@gmail.com';

  useEffect(() => { checkSession(); }, []);
  useEffect(() => { if (user) loadNotifications(); }, [user]);

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { setUser(session.user); await loadProfile(session.user.email); setView('dashboard'); } 
      else { setView('home'); }
    } catch (error) { setView('home'); } finally { setLoading(false); }
  }

  async function loadProfile(userEmail) {
    try { const { data } = await supabase.from('profiles').select('*').eq('email', userEmail).single(); setProfile(data || { nombre: 'Usuario', email: userEmail }); } 
    catch (error) { setProfile({ nombre: 'Usuario', email: userEmail }); }
  }

  async function loadNotifications() {
    if (!user) return;
    try {
      const { data } = await supabase.from('notificaciones').select('*').eq('user_id', user.id).order('creado_en', { ascending: false }).limit(10);
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.leida).length);
    } catch (error) { console.error('Error cargando notificaciones:', error); }
  }

  async function markAsRead(id) {
    try {
      await supabase.from('notificaciones').update({ leida: true }).eq('id', id);
      loadNotifications();
    } catch (error) { console.error('Error actualizando:', error); }
  }

  async function handleLogout() { await supabase.auth.signOut(); setUser(null); setProfile(null); setView('home'); setNotifications([]); setUnreadCount(0); }

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
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowNotifs(!showNotifs)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', padding: '8px', position: 'relative', cursor: 'pointer' }}>
                  🔔
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '0', right: '0', background: THEME.colors.primary, color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: THEME.radius.full, minWidth: '18px' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifs && (
                  <div style={{ position: 'absolute', top: '40px', right: '0', background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 200, border: '1px solid #e2e8f0' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Notificaciones</span>
                      {unreadCount > 0 && <span style={{ fontSize: '0.8rem', color: THEME.colors.primary }}>{unreadCount} nuevas</span>}
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: THEME.colors.textLight }}>No tienes notificaciones</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} onClick={() => markAsRead(n.id)} style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', background: n.leida ? 'white' : '#fff5f5', cursor: 'pointer', transition: 'background 0.2s' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', color: THEME.colors.text }}>{n.titulo}</div>
                          <div style={{ fontSize: '0.8rem', color: THEME.colors.textLight }}>{n.mensaje}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <button onClick={() => setView('dashboard')} style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${THEME.colors.primary}`, color: THEME.colors.primary, borderRadius: THEME.radius.full, fontWeight: 700 }}>Dashboard</button>
              {isAdmin && <button onClick={() => setView('admin')} style={{ padding: '8px 20px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>️ Admin</button>}
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
        {view === 'home' && <HomeView onNavigate={setView} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
        {view === 'register' && <RegisterView supabase={supabase} category={selectedCategory} onSuccess={(u) => { setUser(u); loadProfile(u.email); setView('dashboard'); }} onNavigate={setView} />}
        {view === 'login' && <LoginView supabase={supabase} onSuccess={(u) => { setUser(u); loadProfile(u.email); setView('dashboard'); }} onNavigate={setView} />}
        {view === 'dashboard' && user && <DashboardView user={user} profile={profile} supabase={supabase} onNavigate={setView} setSelectedItem={setSelectedItem} setSelectedCategory={setSelectedCategory} />}
        {view === 'iub-wizard' && user && <IUBWizard user={user} profile={profile} supabase={supabase} category={selectedCategory} onNavigate={setView} />}
        {view === 'oferta-wizard' && user && <OfertaWizard user={user} profile={profile} supabase={supabase} category={selectedCategory} onNavigate={setView} />}
        {view === 'masiva-wizard' && user && <MasivaWizard user={user} profile={profile} supabase={supabase} category={selectedCategory} onNavigate={setView} />}
        {view === 'iub-detail' && user && selectedItem && <IUBDetailView item={selectedItem} supabase={supabase} profile={profile} onNavigate={setView} />}
        {view === 'local-detail' && user && selectedItem && <LocalDetailView item={selectedItem} supabase={supabase} profile={profile} onNavigate={setView} />}
        {view === 'admin' && user && isAdmin && <AdminPanel supabase={supabase} onNavigate={setView} setSelectedItem={setSelectedItem} />}
        {view === 'proximamente' && <ProximamenteView category={selectedCategory} onNavigate={setView} supabase={supabase} user={user} />}
      </main>

      <footer style={{ background: THEME.colors.dark, color: 'white', padding: '60px 32px 30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div>
              <Logo size={140} />
              <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '16px', lineHeight: 1.6 }}>La mayor comunidad de búsqueda inteligente de inmuebles comerciales en LATAM.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: THEME.colors.secondary }}>Plataforma</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px' }}><button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Inicio</button></li>
                <li style={{ marginBottom: '12px' }}><button onClick={() => { setSelectedCategory('locales'); setView('register'); }} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Busco Locales</button></li>
                <li style={{ marginBottom: '12px' }}><button onClick={() => { setSelectedCategory('bodegas'); setView('proximamente'); }} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Busco Bodegas</button></li>
                <li style={{ marginBottom: '12px' }}><button onClick={() => { setSelectedCategory('oficinas'); setView('proximamente'); }} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Busco Oficinas</button></li>
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
                <li style={{ marginBottom: '12px', fontSize: '0.9rem', opacity: 0.7 }}>✉️ contacto@terramatch.net</li>
                <li style={{ marginBottom: '12px', fontSize: '0.9rem', opacity: 0.7 }}>📱 +57 300 000 0000</li>
                <li style={{ marginBottom: '12px', fontSize: '0.9rem', opacity: 0.7 }}>📍 Bogotá, Colombia</li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: 0 }}>© 2026 TerraMatch · NIT 901.612.770-8 · Todos los derechos reservados</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '1.2rem' }}>📘</a>
              <a href="#" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '1.2rem' }}>📸</a>
              <a href="#" style={{ color: 'white', opacity: 0.6, textDecoration: 'none', fontSize: '1.2rem' }}>💼</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ... (mantener HomeView, ProximamenteView, RegisterView, LoginView, DashboardView, IUBWizard, OfertaWizard, MasivaWizard, AdminPanel igual que antes) ...

function IUBDetailView({ item, supabase, profile, onNavigate }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ fecha: '', hora: '', notas: '' });
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => { loadMatches(); }, [item]);
  async function loadMatches() {
    try {
      setLoading(true);
      const { data } = await supabase.from('matches').select('*, propiedades(*), iubs(*)').eq('iub_id', item.id).order('score', { ascending: false });
      setMatches(data || []);
    } catch (error) { console.error('Error loading matches:', error); } finally { setLoading(false); }
  }

  const updateEstado = async (matchId, estado) => {
    try { await supabase.from('matches').update({ estado }).eq('id', matchId); loadMatches(); } 
    catch (error) { alert('Error: ' + error.message); }
  };

  const handleSchedule = async () => {
    if (!selectedMatch || !scheduleForm.fecha || !scheduleForm.hora) {
      alert('Por favor completa fecha y hora');
      return;
    }
    setScheduling(true);
    try {
      const { error } = await supabase.from('reuniones').insert([{
        match_id: selectedMatch.id,
        iub_id: item.id,
        propiedad_id: selectedMatch.propiedad_id,
        user_iub: item.user_id,
        user_prop: selectedMatch.propiedades?.user_id,
        fecha_propuesta: scheduleForm.fecha,
        hora_propuesta: scheduleForm.hora,
        estado: 'pendiente',
        notas: scheduleForm.notas
      }]);
      if (error) throw error;
      
      // Enviar notificación al propietario
      await supabase.from('notificaciones').insert([{
        user_id: selectedMatch.propiedades?.user_id,
        titulo: '📅 Solicitud de reunión',
        mensaje: `El usuario ${profile?.nombre} quiere agendar una reunión para el ${scheduleForm.fecha} a las ${scheduleForm.hora}`,
        tipo: 'reunion'
      }]);
      
      alert('✅ Reunión agendada. El propietario recibirá una notificación.');
      setShowScheduleModal(false);
      setScheduleForm({ fecha: '', hora: '', notas: '' });
    } catch (err) { alert('Error: ' + err.message); } finally { setScheduling(false); }
  };

  const safeParseJSON = (str) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  };

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
        <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Dashboard</button>
        <span style={{ margin: '0 8px' }}>&gt;</span><span style={{ color: THEME.colors.text, fontWeight: 600 }}>{item.codigo_iub}</span>
      </div>

      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px', borderLeft: `6px solid ${THEME.colors.primary}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <Badge color="warning">{item.tipo_negocio}</Badge>
          <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: THEME.colors.primary, fontWeight: 700 }}>{item.codigo_iub}</span>
        </div>
        <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.5rem' }}>{item.cantidad_locales || 1} {item.segmentos || 'Locales'} en {item.ciudad} zona {item.zona}</h2>
        <p style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>{item.area_min} m² · <strong>${(item.canon_arriendo || 0).toLocaleString()}/mes</strong></p>
        {item.caracteristicas && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {safeParseJSON(item.caracteristicas).map((c, i) => (<span key={i} style={{ padding: '6px 14px', background: `${THEME.colors.secondary}30`, color: THEME.colors.text, borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 600 }}>{c}</span>))}
          </div>
        )}
      </div>

      <h3 style={{ color: THEME.colors.text, marginBottom: '24px' }}>Esta búsqueda tiene {matches.length} Matches</h3>
      {loading ? <div style={{ textAlign: 'center', padding: '40px', color: THEME.colors.textLight }}>Cargando...</div> : matches.length === 0 ? (
        <div style={{ background: THEME.colors.white, padding: '60px', borderRadius: THEME.radius.lg, textAlign: 'center', boxShadow: THEME.shadow }}><div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div><h3>Aún no hay matches</h3></div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {matches.map(match => (
            <div key={match.id} style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', border: `2px solid ${match.estado === 'favorito' ? THEME.colors.success : match.estado === 'descartado' ? '#e2e8f0' : 'transparent'}` }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>{match.propiedades?.titulo || 'Inmueble'}</h4>
                <div style={{ display: 'flex', gap: '16px', color: THEME.colors.textLight, fontSize: '0.9rem', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span> {match.propiedades?.ciudad} - {match.propiedades?.zona}</span>
                  <span>📐 {match.propiedades?.area_total} m²</span>
                  <span>💰 ${match.propiedades?.precio?.toLocaleString()}/mes</span>
                </div>
                
                {/* Botón para ver contacto */}
                {showContact === match.id ? (
                  <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: THEME.radius.sm, marginTop: '12px', border: `1px solid ${THEME.colors.primary}30` }}>
                    <h5 style={{ margin: '0 0 8px 0', color: THEME.colors.primary }}>🔒 Contacto del Propietario</h5>
                    <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Nombre:</strong> {match.propiedades?.user_id ? 'Ver en perfil' : 'No disponible'}</p>
                    <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Email:</strong> {match.propiedades?.email_contacto || 'contacto@ejemplo.com'}</p>
                    <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Teléfono:</strong> {match.propiedades?.telefono || '+57 300 000 0000'}</p>
                    <button onClick={() => setShowContact(null)} style={{ marginTop: '8px', padding: '6px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: THEME.radius.full, fontSize: '0.85rem', cursor: 'pointer' }}>Ocultar</button>
                  </div>
                ) : (
                  <button onClick={() => setShowContact(match.id)} style={{ marginTop: '12px', padding: '8px 16px', background: THEME.colors.info, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    👁️ Ver contacto
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Badge color={match.estado === 'favorito' ? 'success' : match.estado === 'descartado' ? 'gray' : 'warning'}>{match.estado || 'nuevo'}</Badge>
                {match.estado === 'favorito' && (
                  <button onClick={() => { setSelectedMatch(match); setShowScheduleModal(true); }} style={{ padding: '10px 20px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>
                    📅 Agendar
                  </button>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '16px', color: THEME.colors.text }}>📅 Agendar Reunión</h3>
            <p style={{ color: THEME.colors.textLight, marginBottom: '24px', fontSize: '0.9rem' }}>
              Inmueble: <strong>{selectedMatch.propiedades?.titulo}</strong><br/>
              Código: <strong>{selectedMatch.propiedades?.codigo_propiedad}</strong>
            </p>
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Fecha propuesta *</label>
            <input type="date" value={scheduleForm.fecha} onChange={(e) => setScheduleForm({...scheduleForm, fecha: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, marginBottom: '16px', boxSizing: 'border-box', fontSize: '1rem' }} />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Hora propuesta *</label>
            <input type="time" value={scheduleForm.hora} onChange={(e) => setScheduleForm({...scheduleForm, hora: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, marginBottom: '16px', boxSizing: 'border-box', fontSize: '1rem' }} />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Notas adicionales</label>
            <textarea value={scheduleForm.notas} onChange={(e) => setScheduleForm({...scheduleForm, notas: e.target.value})} rows="3" placeholder="Ej: Quiero visitar el local en la mañana..." style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, marginBottom: '24px', boxSizing: 'border-box', fontSize: '1rem', resize: 'vertical', fontFamily: 'Comfortaa' }} />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowScheduleModal(false)} style={{ flex: 1, padding: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSchedule} disabled={scheduling} style={{ flex: 2, padding: '12px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: scheduling ? 'not-allowed' : 'pointer', opacity: scheduling ? 0.7 : 1 }}>
                {scheduling ? 'Agendando...' : 'Confirmar Reunión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LocalDetailView({ item, supabase, profile, onNavigate }) {
  const [iubsInteresados, setIubsInteresados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedIUB, setSelectedIUB] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ fecha: '', hora: '', notas: '' });
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => { loadIUBs(); }, [item]);
  async function loadIUBs() {
    try {
      setLoading(true);
      const { data } = await supabase.from('matches').select('*, iubs(*)').eq('propiedad_id', item.id);
      setIubsInteresados(data || []);
    } catch (error) { console.error('Error loading IUBs:', error); } finally { setLoading(false); }
  }

  const handleSchedule = async () => {
    if (!selectedIUB || !scheduleForm.fecha || !scheduleForm.hora) {
      alert('Por favor completa fecha y hora');
      return;
    }
    setScheduling(true);
    try {
      const match = iubsInteresados.find(m => m.iubs?.id === selectedIUB.id);
      const { error } = await supabase.from('reuniones').insert([{
        match_id: match?.id,
        iub_id: selectedIUB.id,
        propiedad_id: item.id,
        user_iub: selectedIUB.user_id,
        user_prop: item.user_id,
        fecha_propuesta: scheduleForm.fecha,
        hora_propuesta: scheduleForm.hora,
        estado: 'pendiente',
        notas: scheduleForm.notas
      }]);
      if (error) throw error;
      
      // Enviar notificación al buscador
      await supabase.from('notificaciones').insert([{
        user_id: selectedIUB.user_id,
        titulo: '📅 Solicitud de reunión',
        mensaje: `El propietario de ${item.titulo} quiere agendar una reunión para el ${scheduleForm.fecha} a las ${scheduleForm.hora}`,
        tipo: 'reunion'
      }]);
      
      alert('✅ Reunión agendada. El buscador recibirá una notificación.');
      setShowScheduleModal(false);
      setScheduleForm({ fecha: '', hora: '', notas: '' });
    } catch (err) { alert('Error: ' + err.message); } finally { setScheduling(false); }
  };

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
        <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Dashboard</button>
        <span style={{ margin: '0 8px' }}>&gt;</span><span style={{ color: THEME.colors.text, fontWeight: 600 }}>{item.codigo_propiedad || item.titulo}</span>
      </div>

      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Badge color="primary">{item.codigo_propiedad || 'SIN ID'}</Badge>
              <Badge color="success">{item.operacion}</Badge>
            </div>
            <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.5rem' }}>{item.titulo}</h2>
            <p style={{ margin: '0 0 8px 0', color: THEME.colors.text, fontSize: '1.1rem' }}><strong>${item.precio?.toLocaleString()}</strong> /mes</p>
            <p style={{ margin: '0', color: THEME.colors.textLight }}>{item.direccion} · {item.ciudad}</p>
          </div>
          <div style={{ background: '#fff5f5', padding: '24px', borderRadius: THEME.radius.md, border: `1px solid ${THEME.colors.primary}30` }}>
            <h4 style={{ color: THEME.colors.primary, marginTop: 0, marginBottom: '16px' }}>🔒 Contacto Propietario</h4>
            <p style={{ margin: '8px 0', fontWeight: 700, color: THEME.colors.text }}>{profile?.nombre}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>📞 {profile?.celular}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>✉️ {profile?.email}</p>
            {item.matricula_inmobiliaria && <p style={{ margin: '8px 0', color: THEME.colors.textLight, fontSize: '0.85rem' }}>Matrícula: {item.matricula_inmobiliaria}</p>}
          </div>
        </div>
      </div>

      <h3 style={{ color: THEME.colors.text, marginBottom: '24px' }}>Este local tiene {iubsInteresados.length} Matches (IUBs interesados)</h3>
      {loading ? <div style={{ textAlign: 'center', padding: '40px', color: THEME.colors.textLight }}>Cargando...</div> : iubsInteresados.length === 0 ? (
        <div style={{ background: THEME.colors.white, padding: '60px', borderRadius: THEME.radius.lg, textAlign: 'center', boxShadow: THEME.shadow }}><div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div><h3>Aún no hay IUBs interesados</h3></div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {iubsInteresados.map(match => (
            <div key={match.id} style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `2px solid ${match.estado === 'favorito' ? THEME.colors.success : 'transparent'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>
                    <span style={{ fontFamily: 'monospace', color: THEME.colors.primary, fontWeight: 700 }}>{match.iubs?.codigo_iub}</span>
                    {' - '}{match.iubs?.nombre_completo || 'Usuario'}
                  </h4>
                  <div style={{ display: 'flex', gap: '16px', color: THEME.colors.textLight, fontSize: '0.9rem', flexWrap: 'wrap' }}>
                    <span> {match.iubs?.ciudad} - {match.iubs?.zona}</span>
                    <span>📐 {match.iubs?.area_min} m²</span>
                    <span>💰 ${match.iubs?.canon_arriendo?.toLocaleString()}/mes</span>
                  </div>
                  
                  {showContact === match.id ? (
                    <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: THEME.radius.sm, marginTop: '12px', border: `1px solid ${THEME.colors.primary}30` }}>
                      <h5 style={{ margin: '0 0 8px 0', color: THEME.colors.primary }}>🔒 Contacto del Buscador</h5>
                      <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Nombre:</strong> {match.iubs?.nombre_completo}</p>
                      <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Email:</strong> {match.iubs?.email_contacto}</p>
                      <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Teléfono:</strong> {match.iubs?.celular}</p>
                      <button onClick={() => setShowContact(null)} style={{ marginTop: '8px', padding: '6px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: THEME.radius.full, fontSize: '0.85rem', cursor: 'pointer' }}>Ocultar</button>
                    </div>
                  ) : (
                    <button onClick={() => setShowContact(match.id)} style={{ marginTop: '12px', padding: '8px 16px', background: THEME.colors.info, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                      👁️ Ver contacto
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Badge color={match.estado === 'favorito' ? 'success' : match.estado === 'descartado' ? 'gray' : 'warning'}>{match.estado || 'nuevo'}</Badge>
                  {match.estado === 'favorito' && (
                    <button onClick={() => { setSelectedIUB(match.iubs); setShowScheduleModal(true); }} style={{ padding: '10px 20px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>
                      📅 Agendar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Agendamiento */}
      {showScheduleModal && selectedIUB && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '16px', color: THEME.colors.text }}>📅 Agendar Reunión</h3>
            <p style={{ color: THEME.colors.textLight, marginBottom: '24px', fontSize: '0.9rem' }}>
              Buscador: <strong>{selectedIUB.nombre_completo}</strong><br/>
              Código IUB: <strong>{selectedIUB.codigo_iub}</strong>
            </p>
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Fecha propuesta *</label>
            <input type="date" value={scheduleForm.fecha} onChange={(e) => setScheduleForm({...scheduleForm, fecha: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, marginBottom: '16px', boxSizing: 'border-box', fontSize: '1rem' }} />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Hora propuesta *</label>
            <input type="time" value={scheduleForm.hora} onChange={(e) => setScheduleForm({...scheduleForm, hora: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, marginBottom: '16px', boxSizing: 'border-box', fontSize: '1rem' }} />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Notas adicionales</label>
            <textarea value={scheduleForm.notas} onChange={(e) => setScheduleForm({...scheduleForm, notas: e.target.value})} rows="3" placeholder="Ej: Quiero mostrar el local en la mañana..." style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, marginBottom: '24px', boxSizing: 'border-box', fontSize: '1rem', resize: 'vertical', fontFamily: 'Comfortaa' }} />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowScheduleModal(false)} style={{ flex: 1, padding: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSchedule} disabled={scheduling} style={{ flex: 2, padding: '12px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: scheduling ? 'not-allowed' : 'pointer', opacity: scheduling ? 0.7 : 1 }}>
                {scheduling ? 'Agendando...' : 'Confirmar Reunión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
