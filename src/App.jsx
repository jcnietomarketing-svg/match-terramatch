import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import emailjs from '@emailjs/browser'; // <-- NUEVO: Importar EmailJS

const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ⚠️ REEMPLAZA ESTOS VALORES CON LOS TUYOS DE EMAILJS
const EMAILJS_SERVICE_ID = 'TU_SERVICE_ID'; 
const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'TU_PUBLIC_KEY';

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

// ... (Mantén HomeView, ProximamenteView, LoginView, DashboardView, IUBWizard, OfertaWizard, MasivaWizard, IUBDetailView, LocalDetailView, AdminPanel exactamente igual que en la versión anterior) ...
// Para ahorrar espacio, aquí solo muestro la RegisterView actualizada. 
// Asegúrate de que el resto de funciones estén en tu archivo.

function RegisterView({ supabase, category, onSuccess, onNavigate }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', cedula: '', email: '', celular: '' });
  const [acepta, setAcepta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const categoriaLabels = { locales: 'Locales', bodegas: 'Bodegas', oficinas: 'Oficinas' };
  
  const handleRegister = async () => {
    if (!acepta) { setError('Debes aceptar los Términos y Condiciones, incluyendo la Cláusula de Mandato.'); return; }
    setLoading(true); setError('');
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: form.email, password: 'TerraMatch2026!' });
      if (authError) throw authError;
      
      await supabase.from('profiles').insert([{ 
        id: authData.user.id, 
        nombre: form.nombre, 
        apellido: form.apellido, 
        email: form.email, 
        celular: form.celular, 
        categoria_preferida: category, 
        acepto_terminos: true 
      }]);

      // 📧 ENVIAR CORREO DE BIENVENIDA CON EMAILJS
      const templateParams = {
        to_name: form.nombre,
        to_email: form.email,
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
        console.log('Correo de bienvenida enviado exitosamente');
      } catch (emailError) {
        console.error('Error enviando correo:', emailError);
        // No bloqueamos el registro si falla el correo, pero lo registramos
      }

      onSuccess(authData.user);
    } catch (err) { 
      setError(err.message || 'Error al crear cuenta. Es posible que el correo ya esté registrado.'); 
    } finally { 
      setLoading(false); 
    }
  };

  const inputStyle = { width: '100%', padding: '14px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box', fontSize: '1rem' };
  
  return (
    <div style={{ padding: '60px 32px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}><Logo size={140} /></div>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: THEME.colors.text }}>Crear Cuenta</h2>
        <p style={{ textAlign: 'center', color: THEME.colors.primary, marginBottom: '32px', fontWeight: 600 }}>Categoría seleccionada: {categoriaLabels[category] || 'Locales'}</p>
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
        
        {/* ✅ CHECKBOX ACTUALIZADO CON ENLACE A TÉRMINOS */}
        <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px', cursor: 'pointer' }}>
          <input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)} style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
          <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight, lineHeight: 1.4 }}>
            He leído y acepto los <a href="/documentos-legales/terminos-y-condiciones.pdf" target="_blank" rel="noopener noreferrer" style={{ color: THEME.colors.primary, fontWeight: 700, textDecoration: 'underline' }}>Términos y Condiciones</a>, 
            incluyendo la <strong>Cláusula de Mandato</strong> que establece a TerraMatch como intermediario autorizado para la gestión de contactos y citas.
          </span>
        </label>

        <button onClick={handleRegister} disabled={loading} style={{ width: '100%', padding: '16px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>{loading ? 'Creando cuenta y enviando correo...' : 'CONTINUAR'}</button>
        <p style={{ textAlign: 'center', color: THEME.colors.textLight, fontSize: '0.9rem' }}>¿Ya tienes cuenta? <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', fontWeight: 700, padding: 0 }}>INGRESAR</button></p>
      </div>
    </div>
  );
}
