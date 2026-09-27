import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// CONFIGURACIÓN SUPABASE (Tu cerebro real)
// ==========================================
const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// TEMA VISUAL - MANUAL DE MARCA
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
// LOGO SVG REAL
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
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-float { animation: float 4s ease-in-out infinite; }
      .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
    `;
    document.head.appendChild(style);
  }, []);
}

// ==========================================
// APP PRINCIPAL CON AUTENTICACIÓN REAL
// ==========================================
export default function App() {
  useBrandFont();
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkSession(); }, []);

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await loadProfile(session.user.email);
        setView('dashboard'); // Si está logueado, va al dashboard
      } else {
        setView('home');
      }
    } catch (error) { console.error('Error session:', error); setView('home'); } 
    finally { setLoading(false); }
  }

  async function loadProfile(userEmail) {
    try { 
      const { data } = await supabase.from('profiles').select('*').eq('email', userEmail).single(); 
      setProfile(data || { nombre: 'Usuario', email: userEmail }); 
    } catch (error) { setProfile({ nombre: 'Usuario', email: userEmail }); }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setView('home');
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
              <button onClick={() => setView('dashboard')} style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${THEME.colors.primary}`, color: THEME.colors.primary, borderRadius: THEME.radius.full, fontWeight: 700 }}>Dashboard</button>
              <button onClick={handleLogout} style={{ padding: '8px 20px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Salir</button>
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
        {view === 'dashboard' && user && <DashboardView profile={profile} onNavigate={setView} />}
      </main>

      <footer style={{ background: THEME.colors.dark, color: 'white', padding: '40px 32px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <Logo size={120} />
          <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '16px' }}>© 2026 TerraMatch · NIT 901.612.770-8 · Bogotá, Colombia</p>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// HOME VIEW (Mantenemos el diseño que te gustó)
// ==========================================
function HomeView({ onNavigate }) {
  const [simCity, setSimCity] = useState('Bogotá');
  const [simArea, setSimArea] = useState('100');
  const [isScanning, setIsScanning] = useState(false);
  const [simResult, setSimResult] = useState(null);

  const handleSimulate = () => {
    setIsScanning(true); setSimResult(null);
    setTimeout(() => { setIsScanning(false); setSimResult(Math.floor(Math.random() * 20) + 5); }, 2000);
  };

  return (
    <div>
      <div style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80') center/cover`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.4 }}></div>
        <div style={{ position: 'absolute', top: '15%', right: '15%', width: '200px', height: '200px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.6 }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="animate-slide-up">
            <div style={{ display: 'inline-block', background: `${THEME.colors.primary}15`, color: THEME.colors.primary, padding: '8px 20px', borderRadius: THEME.radius.full, fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>La mayor comunidad de búsqueda inteligente</div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', lineHeight: 1.1, margin: '0 0 24px 0', color: THEME.colors.text }}>Hagamos Match entre tu<br/><span style={{ color: THEME.colors.primary }}>Local y el Negocio Perfecto</span></h1>
            <p style={{ fontSize: '1.1rem', color: THEME.colors.textLight, marginBottom: '32px', maxWidth: '500px', lineHeight: 1.6 }}>Deja de buscar. Empieza a encontrar. Nuestro algoritmo conecta empresas en expansión con locales comerciales ideales en tiempo real.</p>
            <button onClick={() => onNavigate('register')} style={{ padding: '16px 32px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(233,84,66,0.3)', marginBottom: '20px' }}>Regístrate gratis y empieza →</button>
            <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', color: THEME.colors.textLight }}><span>✅ Sin duplicados</span><span>✅ Match 100% real</span></div>
          </div>

          <div className="animate-float" style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, border: '1px solid #e2e8f0', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.3rem', color: THEME.colors.text }}> Prueba nuestro Radar</h3>
            <p style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>Simula una búsqueda y mira cuántos matches encontramos.</p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: THEME.colors.text }}>Ciudad</label>
              <select value={simCity} onChange={(e) => setSimCity(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: THEME.radius.sm, border: '1px solid #e2e8f0', fontSize: '1rem', fontFamily: 'Comfortaa', background: '#f8f9fa' }}>
                <option value="Bogotá">Bogotá</option><option value="Medellín">Medellín</option><option value="Cali">Cali</option>
              </select>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: THEME.colors.text }}>Área mínima (m²)</label>
              <input type="number" value={simArea} onChange={(e) => setSimArea(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: THEME.radius.sm, border: '1px solid #e2e8f0', fontSize: '1rem', fontFamily: 'Comfortaa', background: '#f8f9fa' }} />
            </div>
            <button onClick={handleSimulate} disabled={isScanning} style={{ width: '100%', padding: '16px', background: isScanning ? THEME.colors.textLight : THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              {isScanning ? (<><div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>Escaneando...</>) : '🔍 ESCANEAR MATCHES'}
            </button>
            {simResult !== null && (
              <div className="animate-slide-up" style={{ marginTop: '24px', padding: '20px', background: `${THEME.colors.success}15`, borderRadius: THEME.radius.md, textAlign: 'center', border: `1px solid ${THEME.colors.success}` }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: THEME.colors.success }}>{simResult}</div>
                <div style={{ fontSize: '0.9rem', color: THEME.colors.text, fontWeight: 600 }}>¡Locales compatibles en {simCity}!</div>
                <button onClick={() => onNavigate('register')} style={{ marginTop: '12px', padding: '8px 20px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '0.85rem' }}>Ver estos locales →</button>
              </div>
            )}
          </div>
        </div>
      </div>

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
// REGISTRO REAL (Conectado a Supabase + Estilo PDF)
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
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: form.email, password: 'TerraMatch2026!' }); // Password temporal para MVP
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

// ==========================================
// LOGIN REAL (Conectado a Supabase + Estilo PDF)
// ==========================================
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
    } catch (err) { setError('Credenciales incorrectas o usuario no encontrado'); } finally { setLoading(false); }
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

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer', fontSize: '0.9rem', color: THEME.colors.textLight }}>
          <input type="checkbox" /> Recuérdame
        </label>

        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '16px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>{loading ? 'Entrando...' : 'INGRESAR'}</button>
        
        <p style={{ textAlign: 'center' }}><button style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', fontWeight: 600, padding: 0, fontSize: '0.9rem' }}>¿Has olvidado tu contraseña?</button></p>
        <p style={{ textAlign: 'center', color: THEME.colors.textLight, fontSize: '0.9rem', marginTop: '16px' }}>¿No tienes cuenta? <button onClick={() => onNavigate('register')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', fontWeight: 700, padding: 0 }}>REGISTRARME</button></p>
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD BÁSICO (Placeholder para la siguiente fase)
// ==========================================
function DashboardView({ profile, onNavigate }) {
  return (
    <div style={{ padding: '60px 32px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: THEME.colors.text }}>¡Bienvenido, {profile?.nombre}!</h1>
      <p style={{ color: THEME.colors.textLight, marginBottom: '32px' }}>Has iniciado sesión correctamente en TerraMatch.</p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={() => onNavigate('home')} style={{ padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Volver al Inicio</button>
      </div>
      <p style={{ marginTop: '40px', fontSize: '0.9rem', color: THEME.colors.textLight }}>En el siguiente paso conectaremos aquí tus tablas de "Mis IUBs" y "Mis Locales" reales.</p>
    </div>
  );
}
