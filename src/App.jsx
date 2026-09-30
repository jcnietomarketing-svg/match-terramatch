import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import emailjs from '@emailjs/browser';

const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const EMAILJS_SERVICE_ID = 'service_ttphx4p';
const EMAILJS_TEMPLATE_ID = 'template_niyhgdg';
const EMAILJS_PUBLIC_KEY = 'xUhjgFvO907Lhhq0M';

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
      const { data } = await supabase.from('notificaciones').select('*').eq('user_id', user.id).order('creado_en', { ascending: false }).limit(20);
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.leida).length);
    } catch (error) { console.error('Error cargando notificaciones:', error); }
  }

  async function markAsRead(id) {
    try {
      await supabase.from('notificaciones').update({ leida: true }).eq('id', id);
      loadNotifications();
    } catch (error) { console.error('Error:', error); }
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
              {isAdmin && <button onClick={() => setView('admin')} style={{ padding: '8px 20px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>🛡️ Admin</button>}
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
                <li style={{ marginBottom: '12px' }}><a href="/documentos-legales/terminos-y-condiciones.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '0.9rem' }}>Términos y Condiciones</a></li>
                <li style={{ marginBottom: '12px' }}><a href="/documentos-legales/politica-privacidad.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '0.9rem' }}>Política de Privacidad</a></li>
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

function RegisterView({ supabase, category, onSuccess, onNavigate }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', cedula: '', email: '', celular: '', password: '' });
  const [acepta, setAcepta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const categoriaLabels = { locales: 'Locales', bodegas: 'Bodegas', oficinas: 'Oficinas' };
  
  const handleRegister = async () => {
    if (!acepta) { setError('Debes aceptar los Términos y Condiciones, incluyendo la Cláusula de Mandato.'); return; }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    
    setLoading(true); setError('');
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password });
      if (authError) throw authError;
      
      await supabase.from('profiles').insert([{ 
        id: authData.user.id, nombre: form.nombre, apellido: form.apellido, email: form.email, celular: form.celular, categoria_preferida: category, acepto_terminos: true 
      }]);

      const templateParams = { to_name: form.nombre, to_email: form.email };
      try { await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY); } 
      catch (emailError) { console.error('Error email:', emailError); }

      onSuccess(authData.user);
    } catch (err) { setError(err.message || 'Error al crear cuenta.'); } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '14px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box', fontSize: '1rem' };
  
  return (
    <div style={{ padding: '60px 32px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}><Logo size={140} /></div>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: THEME.colors.text }}>Crear Cuenta</h2>
        <p style={{ textAlign: 'center', color: THEME.colors.primary, marginBottom: '32px', fontWeight: 600 }}>Categoría: {categoriaLabels[category] || 'Locales'}</p>
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
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Contraseña *</label>
        <input type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} />
        <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px', cursor: 'pointer' }}>
          <input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)} style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
          <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight, lineHeight: 1.4 }}>
            He leído y acepto los <a href="/documentos-legales/terminos-y-condiciones.pdf" target="_blank" rel="noopener noreferrer" style={{ color: THEME.colors.primary, fontWeight: 700, textDecoration: 'underline' }}>Términos y Condiciones</a>, incluyendo la <strong>Cláusula de Mandato</strong> que establece a TerraMatch como intermediario autorizado.
          </span>
        </label>
        <button onClick={handleRegister} disabled={loading} style={{ width: '100%', padding: '16px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>{loading ? 'Creando cuenta...' : 'CONTINUAR'}</button>
        <p style={{ textAlign: 'center', color: THEME.colors.textLight, fontSize: '0.9rem' }}>¿Ya tienes cuenta? <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', fontWeight: 700, padding: 0 }}>INGRESAR</button></p>
      </div>
    </div>
  );
}

function HomeView({ onNavigate, selectedCategory, setSelectedCategory }) {
  const [trm, setTrm] = useState('$3.341 COP/USD');
  const [climaBogota, setClimaBogota] = useState('18°C');
  const [climaMedellin, setClimaMedellin] = useState('24°C');

  // Obtener TRM real desde API gratuita
  useEffect(() => {
    const fetchTRM = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        if (data && data.rates && data.rates.COP) {
          const trmValor = Math.round(data.rates.COP);
          setTrm(`$${trmValor.toLocaleString()} COP/USD`);
        }
      } catch (error) {
        console.error('Error cargando TRM:', error);
        setTrm('$3.341 COP/USD');
      }
    };
    fetchTRM();
    const interval = setInterval(fetchTRM, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Obtener clima real desde Open-Meteo (API gratuita sin key)
  useEffect(() => {
    const fetchClima = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=4.7110,6.2442&longitude=-74.0721,-75.5906&current_weather=true');
        const data = await response.json();
        if (data && data.length === 2) {
          setClimaBogota(`${Math.round(data[0].current_weather.temperature)}°C`);
          setClimaMedellin(`${Math.round(data[1].current_weather.temperature)}°C`);
        }
      } catch (error) {
        console.error('Error cargando clima:', error);
      }
    };
    fetchClima();
    const interval = setInterval(fetchClima, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const categorias = [
    { id: 'locales', icon: '🏪', titulo: 'Busco/Tengo Locales', desc: 'Locales comerciales para retail, restaurantes y servicios', color: THEME.colors.primary, disponible: true },
    { id: 'bodegas', icon: '🏭', titulo: 'Busco/Tengo Bodegas', desc: 'Bodegas industriales y centros de distribución', color: THEME.colors.warning, disponible: false },
    { id: 'oficinas', icon: '🏢', titulo: 'Busco/Tengo Oficinas', desc: 'Oficinas corporativas y centros de negocios', color: THEME.colors.info, disponible: false },
  ];
  const handleCategoriaClick = (cat) => { setSelectedCategory(cat.id); if (cat.disponible) onNavigate('register'); else onNavigate('proximamente'); };

  return (
    <div>
      {/* 🎬 TICKER MARQUESINA INFINITA */}
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-container {
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        }
        .ticker-content {
          display: inline-flex;
          animation: ticker-scroll 60s linear infinite;
        }
        .ticker-content:hover {
          animation-play-state: paused;
        }
        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 32px;
          font-size: 0.85rem;
        }
      `}</style>
      
      <div style={{ background: THEME.colors.dark, color: 'white', padding: '10px 0', minHeight: '38px', display: 'flex', alignItems: 'center' }}>
        <div className="ticker-container" style={{ width: '100%' }}>
          <div className="ticker-content">
            {[...Array(2)].map((_, dupIndex) => (
              <div key={dupIndex} style={{ display: 'inline-flex' }}>
                <div className="ticker-item">
                  <span>🔥</span>
                  <span style={{ fontWeight: 600, color: THEME.colors.success }}>TERRAMATCH ·</span>
                  <span>3 nuevos matches en Bogotá hace 5 min</span>
                </div>
                <div className="ticker-item">
                  <span></span>
                  <span style={{ fontWeight: 600, color: THEME.colors.success }}>TERRAMATCH ·</span>
                  <span>Local en Chapinero arrendado en 48h</span>
                </div>
                <div className="ticker-item">
                  <span>🌤️</span>
                  <span style={{ fontWeight: 600, color: THEME.colors.secondary }}>CLIMA ·</span>
                  <span>Bogotá: {climaBogota} · Parcialmente nublado</span>
                </div>
                <div className="ticker-item">
                  <span>💱</span>
                  <span style={{ fontWeight: 600, color: THEME.colors.secondary }}>TRM HOY ·</span>
                  <span>{trm}</span>
                </div>
                <div className="ticker-item">
                  <span>📈</span>
                  <span style={{ fontWeight: 600, color: THEME.colors.success }}>TERRAMATCH ·</span>
                  <span>142 empresas buscando locales esta semana</span>
                </div>
                <div className="ticker-item">
                  <span>🏢</span>
                  <span style={{ fontWeight: 600, color: THEME.colors.warning }}>PRÓXIMAMENTE ·</span>
                  <span>Bodegas y Oficinas en TerraMatch</span>
                </div>
                <div className="ticker-item">
                  <span>️</span>
                  <span style={{ fontWeight: 600, color: THEME.colors.secondary }}>CLIMA ·</span>
                  <span>Medellín: {climaMedellin} · Lluvia ligera</span>
                </div>
                <div className="ticker-item">
                  <span>📰</span>
                  <span style={{ fontWeight: 600, color: THEME.colors.warning }}>NOTICIA ·</span>
                  <span>Sector inmobiliario crece 8% en 2026</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80') center/cover`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.4 }}></div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 32px', textAlign: 'center', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'inline-block', background: `${THEME.colors.primary}15`, color: THEME.colors.primary, padding: '8px 20px', borderRadius: THEME.radius.full, fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>La mayor comunidad de búsqueda inteligente</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', lineHeight: 1.1, margin: '0 0 24px 0', color: THEME.colors.text }}>Hagamos Match entre tu<br/><span style={{ color: THEME.colors.primary }}>Inmueble y el Negocio Perfecto</span></h1>
          <p style={{ fontSize: '1.1rem', color: THEME.colors.textLight, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>Deja de buscar. Empieza a encontrar. Nuestro algoritmo conecta empresas en expansión con inmuebles comerciales ideales en tiempo real.</p>
          <button onClick={() => onNavigate('register')} style={{ padding: '16px 40px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(233,84,66,0.3)' }}>Regístrate gratis y empieza →</button>
        </div>
      </div>

      {/* CATEGORÍAS */}
      <div style={{ padding: '80px 32px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: THEME.colors.text }}>¿Qué tipo de inmueble necesitas?</h2>
        <p style={{ fontSize: '1.1rem', color: THEME.colors.textLight, marginBottom: '60px' }}>Elige tu categoría y deja que nuestro algoritmo haga el resto.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {categorias.map((cat) => (
            <div key={cat.id} onClick={() => handleCategoriaClick(cat)} style={{ background: THEME.colors.white, padding: '40px 32px', borderRadius: THEME.radius.lg, cursor: 'pointer', border: `2px solid ${selectedCategory === cat.id ? cat.color : 'transparent'}`, boxShadow: THEME.shadow, transition: 'all 0.3s', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
                 onMouseEnter={(e) => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-8px)'; }}
                 onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedCategory === cat.id ? cat.color : 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              {!cat.disponible && <div style={{ position: 'absolute', top: '16px', right: '16px', background: THEME.colors.warning, color: 'white', padding: '4px 12px', borderRadius: THEME.radius.full, fontSize: '0.75rem', fontWeight: 700 }}>PRÓXIMAMENTE</div>}
              <div style={{ width: '70px', height: '70px', background: `${cat.color}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>{cat.icon}</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: THEME.colors.text }}>{cat.titulo}</h3>
              <p style={{ color: THEME.colors.textLight, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>{cat.desc}</p>
              <button style={{ padding: '12px 24px', background: cat.color, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '0.9rem' }}>{cat.disponible ? 'EMPEZAR →' : 'MÁS INFORMACIÓN →'}</button>
            </div>
          ))}
        </div>
      </div>

      {/* CÓMO FUNCIONA */}
      <div style={{ padding: '80px 32px', background: THEME.colors.white }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: THEME.colors.text }}>¿Cómo funciona la <span style={{ color: THEME.colors.primary }}>TerraMagia</span>?</h2>
            <p style={{ fontSize: '1.1rem', color: THEME.colors.textLight, maxWidth: '600px', margin: '0 auto' }}>Nuestro motor de matching trabaja 24/7 para cruzar oferta y demanda.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {[
              { icon: '📝', title: '1. Crea tu IUB', desc: 'Define tu búsqueda ideal (ubicación, área, presupuesto) y genera tu Indicador Único de Búsqueda.', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80' },
              { icon: '', title: '2. El Algoritmo Busca', desc: 'Nuestro motor cruza tu IUB con miles de inmuebles en tiempo real, filtrando duplicados y ruido.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' },
              { icon: '🤝', title: '3. Match y Cierre', desc: 'Recibe notificaciones de matches compatibles. Acepta, agenda visita y cierra el negocio.', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80' }
            ].map((step, i) => (
              <div key={i} style={{ background: THEME.colors.bg, borderRadius: THEME.radius.lg, overflow: 'hidden', boxShadow: THEME.shadow, transition: 'transform 0.3s' }}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: '200px', background: `url(${step.img}) center/cover`, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '20px', left: '20px', width: '60px', height: '60px', background: THEME.colors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>{step.icon}</div>
                </div>
                <div style={{ padding: '32px' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1.3rem', color: THEME.colors.text }}>{step.title}</h3>
                  <p style={{ color: THEME.colors.textLight, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProximamenteView({ category, onNavigate }) {
  return (
    <div style={{ padding: '60px 32px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: THEME.colors.text }}>🏗️ Próximamente</h1>
      <p style={{ fontSize: '1.2rem', color: THEME.colors.textLight, marginBottom: '32px' }}>Estamos preparando esta categoría con campos específicos para ti.</p>
      <button onClick={() => onNavigate('home')} style={{ padding: '14px 32px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>← Volver al Inicio</button>
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

function DashboardView({ user, profile, supabase, onNavigate, setSelectedItem, setSelectedCategory }) {
  const [tab, setTab] = useState('iubs');
  const [iubs, setIubs] = useState([]);
  const [locales, setLocales] = useState([]);
  const [matchCounts, setMatchCounts] = useState({ iubs: {}, props: {} });
  const [loading, setLoading] = useState(true);
  useEffect(() => { loadData(); }, [user]);
  async function loadData() {
    try {
      setLoading(true);
      const { data: iubsData } = await supabase.from('iubs').select('*').eq('user_id', user.id).order('creado_en', { ascending: false });
      setIubs(iubsData || []);
      const { data: propsData } = await supabase.from('propiedades').select('*').eq('user_id', user.id).order('creado_en', { ascending: false });
      setLocales(propsData || []);
      const { data: matchesData } = await supabase.from('matches').select('iub_id, propiedad_id');
      const iubCounts = {}; const propCounts = {};
      if (matchesData) { matchesData.forEach(m => { iubCounts[m.iub_id] = (iubCounts[m.iub_id] || 0) + 1; propCounts[m.propiedad_id] = (propCounts[m.propiedad_id] || 0) + 1; }); }
      setMatchCounts({ iubs: iubCounts, props: propCounts });
    } catch (error) { console.error('Error loading data:', error); } finally { setLoading(false); }
  }
  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div><h2 style={{ margin: 0, color: THEME.colors.text }}>Hola, {profile?.nombre} 👋</h2><p style={{ margin: '8px 0 0 0', color: THEME.colors.textLight }}>Bienvenido a tu centro de control TerraMatch</p></div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => { setSelectedCategory('locales'); onNavigate('iub-wizard'); }} style={{ padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>+ Crear IUB</button>
          <button onClick={() => { setSelectedCategory('locales'); onNavigate('oferta-wizard'); }} style={{ padding: '12px 24px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>+ Cargar Local</button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => setTab('iubs')} style={{ padding: '12px 24px', background: tab === 'iubs' ? THEME.colors.primary : THEME.colors.white, color: tab === 'iubs' ? 'white' : THEME.colors.text, border: tab === 'iubs' ? 'none' : `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Mis IUBs ({iubs.length})</button>
        <button onClick={() => setTab('locales')} style={{ padding: '12px 24px', background: tab === 'locales' ? THEME.colors.primary : THEME.colors.white, color: tab === 'locales' ? 'white' : THEME.colors.text, border: tab === 'locales' ? 'none' : `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Mis Locales ({locales.length})</button>
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: '60px', color: THEME.colors.textLight }}>Cargando...</div> : tab === 'iubs' ? (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          {iubs.length === 0 ? <div style={{ padding: '60px', textAlign: 'center', color: THEME.colors.textLight }}><div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div><h3>Aún no tienes IUBs</h3><button onClick={() => onNavigate('iub-wizard')} style={{ marginTop: '20px', padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Crear mi primer IUB</button></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead><tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>IUB</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>MATCHES</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACCIÓN</th></tr></thead>
              <tbody>{iubs.map((iub) => (<tr key={iub.id} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem(iub); onNavigate('iub-detail'); }}><td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{iub.codigo_iub}</td><td style={{ padding: '16px' }}>{iub.area_min} m²</td><td style={{ padding: '16px' }}>{iub.ciudad}</td><td style={{ padding: '16px' }}><Badge color="primary">{matchCounts.iubs[iub.id] || 0}</Badge></td><td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer' }}>Ver Matches →</button></td></tr>))}</tbody>
            </table>
          )}
        </div>
      ) : (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          {locales.length === 0 ? <div style={{ padding: '60px', textAlign: 'center', color: THEME.colors.textLight }}><div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏪</div><h3>Aún no has publicado locales</h3><button onClick={() => onNavigate('oferta-wizard')} style={{ marginTop: '20px', padding: '12px 24px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Publicar mi primer local</button></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead><tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CÓDIGO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TÍTULO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>MATCHES</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACCIÓN</th></tr></thead>
              <tbody>{locales.map((local) => (<tr key={local.id} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem(local); onNavigate('local-detail'); }}><td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{local.codigo_propiedad || 'SIN ID'}</td><td style={{ padding: '16px', fontWeight: 600 }}>{local.titulo || 'Sin título'}</td><td style={{ padding: '16px' }}>{local.ciudad}</td><td style={{ padding: '16px' }}><Badge color="primary">{matchCounts.props[local.id] || 0}</Badge></td><td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer' }}>Ver IUBs →</button></td></tr>))}</tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function IUBWizard({ user, profile, supabase, category, onNavigate }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: profile?.nombre || '', cedula: '', matricula: '', email: profile?.email || '', celular: profile?.celular || '', ciudad: 'Bogotá', zona: 'Norte', barrio: '', tipo_negocio: 'Arriendo', uso_suelo: 'Comercial', area_total: '', caracteristicas: [], canon_arriendo: '', presupuesto_compra: '', horizonte: 'Corto (1-3 meses)', actividad: '' });
  const categoriaLabels = { locales: 'Locales', bodegas: 'Bodegas', oficinas: 'Oficinas' };
  const toggleCar = (c) => setForm(prev => ({ ...prev, caracteristicas: prev.caracteristicas.includes(c) ? prev.caracteristicas.filter(x => x !== c) : [...prev.caracteristicas, c] }));
  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const codigoIub = `IUB${Math.floor(Math.random() * 900000) + 100000}`;
      const area = form.area_total ? parseFloat(form.area_total) : null;
      const { error } = await supabase.from('iubs').insert([{ user_id: user.id, codigo_iub: codigoIub, segmentos: categoriaLabels[category] || 'Locales', nombre_completo: form.nombre, nit_cedula: form.cedula, matricula_inmobiliaria: form.matricula || null, email_contacto: form.email, celular: form.celular, ciudad: form.ciudad, zona: form.zona, barrio: form.barrio, tipo_negocio: form.tipo_negocio, uso_suelo: form.uso_suelo, area_min: area, area_max: area, canon_arriendo: form.canon_arriendo ? parseFloat(form.canon_arriendo) : null, presupuesto_compra: form.presupuesto_compra ? parseFloat(form.presupuesto_compra) : null, caracteristicas: JSON.stringify(form.caracteristicas), horizonte: form.horizonte, estado: 'activo', cantidad_locales: 1, actividad: form.actividad }]);
      if (error) throw error;
      alert(`¡IUB ${codigoIub} creado!`);
      onNavigate('dashboard');
    } catch (err) { alert('Error: ' + err.message); } finally { setLoading(false); }
  };
  const inputStyle = { width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box', fontSize: '1rem', fontFamily: 'Comfortaa', marginBottom: '16px' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: THEME.colors.text };
  const areaNum = parseFloat(form.area_total) || 0;
  return (
    <div style={{ padding: '40px 32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}><button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Dashboard</button><span style={{ margin: '0 8px' }}>&gt;</span><span>Crear IUB - {categoriaLabels[category]} (Paso {step} de 3)</span></div>
        <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Indicador Único de Búsqueda</h2>
        {step === 1 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}> 1. Identificación</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Nombre / Empresa *</label><input value={form.nombre} onChange={e => update('nombre', e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Identificación (C.C. / NIT) *</label><input value={form.cedula} onChange={e => update('cedula', e.target.value)} style={inputStyle} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Matrícula Inmobiliaria</label><input type="text" placeholder="Ej: 50S-91817" value={form.matricula} onChange={e => update('matricula', e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Ciudad Principal</label><select value={form.ciudad} onChange={e => update('ciudad', e.target.value)} style={inputStyle}><option>Bogotá</option><option>Medellín</option><option>Cali</option></select></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Email *</label><input type="email" value={form.email} onChange={e => update('email', e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Teléfono / WhatsApp *</label><input value={form.celular} onChange={e => update('celular', e.target.value)} style={inputStyle} /></div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>📍 2. Ubicación y Área</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Barrio / Zona preferida</label><input value={form.barrio} onChange={e => update('barrio', e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Zona</label><select value={form.zona} onChange={e => update('zona', e.target.value)} style={inputStyle}><option>Norte</option><option>Sur</option><option>Centro</option></select></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Tipo de Negocio</label><select value={form.tipo_negocio} onChange={e => update('tipo_negocio', e.target.value)} style={inputStyle}><option>Arriendo</option><option>Venta</option></select></div>
            </div>
            <label style={labelStyle}>Área aproximada (m²) *</label>
            <input type="number" value={form.area_total} onChange={e => update('area_total', e.target.value)} style={inputStyle} placeholder="Ej: 100" />
            <p style={{ fontSize: '0.85rem', color: THEME.colors.textLight, marginTop: '-8px', marginBottom: '16px' }}>💡 Buscaremos inmuebles entre {Math.round(areaNum * 0.9)} y {Math.round(areaNum * 1.1)} m²</p>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>💰 3. Económico y Horizonte</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Canon mensual máximo de Arriendo ($)</label><input type="number" value={form.canon_arriendo} onChange={e => update('canon_arriendo', e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Presupuesto máximo de Compra ($)</label><input type="number" value={form.presupuesto_compra} onChange={e => update('presupuesto_compra', e.target.value)} style={inputStyle} /></div>
            </div>
            <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '16px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight }}>Acepto los términos y condiciones de TerraMatch</span>
            </label>
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          {step > 1 && <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: '14px', background: 'white', border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 600, color: THEME.colors.text }}>ATRÁS</button>}
          {step < 3 ? (<button onClick={() => setStep(step + 1)} style={{ flex: 2, padding: '14px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>SIGUIENTE →</button>) : (<button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '14px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>{loading ? 'Creando...' : '✓ CREAR IUB'}</button>)}
        </div>
      </div>
    </div>
  );
}

function OfertaWizard({ user, profile, supabase, category, onNavigate }) {
  const [form, setForm] = useState({ titulo: '', ciudad: 'Bogotá', direccion: '', barrio: '', zona: '', matricula: '', tipo: ['Arriendo'], valorCanon: '', valorVenta: '', area: '', usoSuelo: 'Comercial' });
  const [loading, setLoading] = useState(false);
  const categoriaLabels = { locales: 'Local', bodegas: 'Bodega', oficinas: 'Oficina' };
  const handleDireccionChange = (direccion) => { setForm({...form, direccion, barrio: 'Chapinero', zona: 'Norte'}); };
  const toggleTipo = (t) => setForm(prev => ({ ...prev, tipo: prev.tipo.includes(t) ? prev.tipo.filter(x => x !== t) : [...prev.tipo, t] }));
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const codigoProp = `LOC${Math.floor(Math.random() * 900000) + 100000}`;
      const { error } = await supabase.from('propiedades').insert([{ user_id: user.id, codigo_propiedad: codigoProp, titulo: form.titulo, ciudad: form.ciudad, zona: form.zona, direccion: form.direccion, barrio: form.barrio, segmento: category || 'locales', tipo_inmueble: categoriaLabels[category] || 'local', operacion: form.tipo.includes('Arriendo') ? 'arrendar' : 'vender', area_total: form.area ? parseFloat(form.area) : 0, precio: form.tipo.includes('Arriendo') ? (parseFloat(form.valorCanon) || 0) : (parseFloat(form.valorVenta) || 0), matricula_inmobiliaria: form.matricula || null, disponible: true, estado: 'activo' }]);
      if (error) throw error;
      alert(`¡${categoriaLabels[category]} publicado! Código: ${codigoProp}`);
      onNavigate('dashboard');
    } catch (err) { alert('Error: ' + err.message); } finally { setLoading(false); }
  };
  const inputStyle = { width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box', fontSize: '1rem', fontFamily: 'Comfortaa', marginBottom: '16px' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: THEME.colors.text };
  return (
    <div style={{ padding: '40px 32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}><button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Dashboard</button><span style={{ margin: '0 8px' }}>&gt;</span><span>Cargar {categoriaLabels[category]}</span></div>
        <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Indicador Único de Propiedad</h2>
        <label style={labelStyle}>Nombre / Título *</label>
        <input placeholder={`${categoriaLabels[category]} en Chapinero`} value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} style={inputStyle} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={labelStyle}>Selecciona ciudad *</label><select value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} style={inputStyle}><option>Bogotá</option><option>Medellín</option><option>Cali</option></select></div>
          <div><label style={labelStyle}>Dirección *</label><input placeholder="Calle 85 # 15-30" value={form.direccion} onChange={e => handleDireccionChange(e.target.value)} style={inputStyle} /></div>
        </div>
        <label style={labelStyle}>Matrícula Inmobiliaria *</label>
        <input type="text" placeholder="Ej: 50S-91817" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} style={inputStyle} />
        <label style={labelStyle}>Tipo de negocio *</label>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 20px', border: `2px solid ${form.tipo.includes('Arriendo') ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: form.tipo.includes('Arriendo') ? `${THEME.colors.primary}10` : 'white' }}><input type="checkbox" checked={form.tipo.includes('Arriendo')} onChange={() => toggleTipo('Arriendo')} /> Arriendo</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 20px', border: `2px solid ${form.tipo.includes('Venta') ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: form.tipo.includes('Venta') ? `${THEME.colors.primary}10` : 'white' }}><input type="checkbox" checked={form.tipo.includes('Venta')} onChange={() => toggleTipo('Venta')} /> Venta</label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={labelStyle}>Valor canon mensual ($)</label><input type="number" placeholder="Ingresa valor" value={form.valorCanon} onChange={e => setForm({...form, valorCanon: e.target.value})} style={inputStyle} /></div>
          <div><label style={labelStyle}>Área Total (m²) *</label><input type="number" value={form.area} onChange={e => setForm({...form, area: e.target.value})} style={inputStyle} /></div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button onClick={() => onNavigate('dashboard')} style={{ flex: 1, padding: '14px', background: 'white', border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 600, color: THEME.colors.text }}>CANCELAR</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '14px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>{loading ? 'Publicando...' : `✓ PUBLICAR ${categoriaLabels[category].toUpperCase()}`}</button>
        </div>
      </div>
    </div>
  );
}

function MasivaWizard({ onNavigate }) {
  return (
    <div style={{ padding: '60px 32px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '16px' }}>📊 Carga Masiva</h2>
      <p style={{ color: THEME.colors.textLight, marginBottom: '32px' }}>Función disponible próximamente para usuarios verificados.</p>
      <button onClick={() => onNavigate('dashboard')} style={{ padding: '14px 32px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>← Volver al Dashboard</button>
    </div>
  );
}

function IUBDetailView({ item, supabase, profile, onNavigate }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { 
    supabase.from('matches').select('*, propiedades(*)').eq('iub_id', item.id).then(({ data }) => setMatches(data || [])).finally(() => setLoading(false)); 
  }, [item]);

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0, marginBottom: '24px' }}>← Volver al Dashboard</button>
      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text }}>Detalles de tu IUB: <span style={{ color: THEME.colors.primary }}>{item.codigo_iub}</span></h2>
        <p style={{ color: THEME.colors.textLight }}>{item.ciudad} · {item.area_min} m² · {item.tipo_negocio}</p>
      </div>
      <h3 style={{ color: THEME.colors.text, marginBottom: '24px' }}>Matches encontrados: {matches.length}</h3>
      {loading ? <div style={{ textAlign: 'center', padding: '40px' }}>Cargando...</div> : matches.length === 0 ? (
        <div style={{ background: THEME.colors.white, padding: '60px', borderRadius: THEME.radius.lg, textAlign: 'center', boxShadow: THEME.shadow }}><h3>Aún no hay matches</h3></div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {matches.map(match => (
            <div key={match.id} style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: THEME.colors.text }}>{match.propiedades?.titulo}</h4>
              <p style={{ color: THEME.colors.textLight, fontSize: '0.9rem' }}> {match.propiedades?.ciudad} ·  {match.propiedades?.area_total} m² · 💰 ${match.propiedades?.precio?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LocalDetailView({ item, supabase, profile, onNavigate }) {
  const [iubsInteresados, setIubsInteresados] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { 
    supabase.from('matches').select('*, iubs(*)').eq('propiedad_id', item.id).then(({ data }) => setIubsInteresados(data || [])).finally(() => setLoading(false)); 
  }, [item]);

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0, marginBottom: '24px' }}>← Volver al Dashboard</button>
      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text }}>{item.titulo}</h2>
        <p style={{ color: THEME.colors.textLight }}>📍 {item.ciudad} · 📐 {item.area_total} m² · 💰 ${item.precio?.toLocaleString()}</p>
      </div>
      <h3 style={{ color: THEME.colors.text, marginBottom: '24px' }}>IUBs interesados: {iubsInteresados.length}</h3>
      {loading ? <div style={{ textAlign: 'center', padding: '40px' }}>Cargando...</div> : iubsInteresados.length === 0 ? (
        <div style={{ background: THEME.colors.white, padding: '60px', borderRadius: THEME.radius.lg, textAlign: 'center', boxShadow: THEME.shadow }}><h3>Aún no hay interesados</h3></div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {iubsInteresados.map(match => (
            <div key={match.id} style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: THEME.colors.text }}>{match.iubs?.codigo_iub} - {match.iubs?.nombre_completo}</h4>
              <p style={{ color: THEME.colors.textLight, fontSize: '0.9rem' }}>📍 {match.iubs?.ciudad} · 📐 {match.iubs?.area_min} m²</p>
              <p style={{ marginTop: '12px', fontSize: '0.85rem', color: THEME.colors.textLight, fontStyle: 'italic' }}> Contacto protegido. Solicita una cita para conocer al interesado.</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminPanel({ supabase, onNavigate }) {
  const [tab, setTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [iubs, setIubs] = useState([]);
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setLoading(true);
      const { data: usersData } = await supabase.from('profiles').select('*').order('creado_en', { ascending: false });
      setUsuarios(usersData || []);
      const { data: iubsData } = await supabase.from('iubs').select('*').order('creado_en', { ascending: false });
      setIubs(iubsData || []);
      const { data: propsData } = await supabase.from('propiedades').select('*').order('creado_en', { ascending: false });
      setLocales(propsData || []);
    } catch (error) { console.error('Error loading admin data:', error); } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.dark, color: 'white', padding: '32px', borderRadius: THEME.radius.lg, marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0' }}>️ Torre de Control (Admin)</h2>
        <p style={{ margin: 0, opacity: 0.8 }}>Gestión global de Usuarios, IUBs y Locales</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button onClick={() => setTab('usuarios')} style={{ padding: '12px 24px', background: tab === 'usuarios' ? THEME.colors.primary : THEME.colors.white, color: tab === 'usuarios' ? 'white' : THEME.colors.text, border: tab === 'usuarios' ? 'none' : `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>👥 Usuarios ({usuarios.length})</button>
        <button onClick={() => setTab('iubs')} style={{ padding: '12px 24px', background: tab === 'iubs' ? THEME.colors.primary : THEME.colors.white, color: tab === 'iubs' ? 'white' : THEME.colors.text, border: tab === 'iubs' ? 'none' : `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>IUBs ({iubs.length})</button>
        <button onClick={() => setTab('locales')} style={{ padding: '12px 24px', background: tab === 'locales' ? THEME.colors.primary : THEME.colors.white, color: tab === 'locales' ? 'white' : THEME.colors.text, border: tab === 'locales' ? 'none' : `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Locales ({locales.length})</button>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: '60px', color: THEME.colors.textLight }}>Cargando...</div> : (
        tab === 'usuarios' ? (
          <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
            {usuarios.length === 0 ? <div style={{ padding: '60px', textAlign: 'center' }}>No hay usuarios registrados aún</div> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead><tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>NOMBRE</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>EMAIL</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CELULAR</th>
                  <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CATEGORÍA</th>
                </tr></thead>
                <tbody>{usuarios.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{u.nombre} {u.apellido}</td>
                    <td style={{ padding: '16px', color: THEME.colors.textLight }}>{u.email}</td>
                    <td style={{ padding: '16px' }}>{u.celular}</td>
                    <td style={{ padding: '16px' }}><Badge color="info">{u.categoria_preferida || 'No definida'}</Badge></td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        ) : tab === 'iubs' ? (
          <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
            {iubs.length === 0 ? <div style={{ padding: '60px', textAlign: 'center' }}>No hay IUBs registrados</div> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead><tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>IUB</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th></tr></thead>
                <tbody>{iubs.map((iub) => (<tr key={iub.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{iub.codigo_iub}</td><td style={{ padding: '16px' }}>{iub.area_min} m²</td><td style={{ padding: '16px' }}>{iub.ciudad}</td></tr>))}</tbody>
              </table>
            )}
          </div>
        ) : (
          <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
            {locales.length === 0 ? <div style={{ padding: '60px', textAlign: 'center' }}>No hay locales registrados</div> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead><tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CÓDIGO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TÍTULO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th></tr></thead>
                <tbody>{locales.map((local) => (<tr key={local.id} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{local.codigo_propiedad || 'SIN ID'}</td><td style={{ padding: '16px', fontWeight: 600 }}>{local.titulo || 'Sin título'}</td><td style={{ padding: '16px' }}>{local.ciudad}</td></tr>))}</tbody>
              </table>
            )}
          </div>
        )
      )}
    </div>
  );
}
