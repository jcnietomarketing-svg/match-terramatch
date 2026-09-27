import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// CONFIGURACIÓN SUPABASE
// ==========================================
const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DOC_TERMINOS = 'https://github.com/jcnietomarketing-svg/match-terramatch/raw/main/T%26C_TerraMatch%20act%202024.docx';
const DOC_PRIVACIDAD = 'https://github.com/jcnietomarketing-svg/match-terramatch/raw/main/Politica%20de%20privacidad%20y%20proteccion%20de%20datos_TerraMatch_act2023.docx';

// ==========================================
// TEMA VISUAL TERRAMATCH (Manual de Marca)
// ==========================================
const THEME = {
  colors: {
    primary: '#ee5340',      // Rojo TerraMatch
    secondary: '#b9d3dc',    // Azul Claro
    text: '#2d3748',
    textLight: '#718096',
    bg: '#f7fafc',
    white: '#ffffff',
    success: '#48bb78',
  },
  radius: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    full: '9999px',
  },
  shadow: '0 10px 30px -5px rgba(185, 211, 220, 0.4)',
  shadowHover: '0 20px 40px -5px rgba(238, 83, 64, 0.2)',
};

// ==========================================
// ISOTIPO RADAR (Concepto del Manual de Marca)
// ==========================================
function LogoIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
      <circle cx="21" cy="21" r="19" stroke={THEME.colors.secondary} strokeWidth="2.5" />
      <circle cx="21" cy="21" r="11" stroke={THEME.colors.primary} strokeWidth="2.5" />
      <circle cx="21" cy="21" r="4" fill={THEME.colors.primary} />
      <path d="M21 2 L21 10" stroke={THEME.colors.secondary} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 32 L21 40" stroke={THEME.colors.secondary} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M2 21 L10 21" stroke={THEME.colors.secondary} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 21 L40 21" stroke={THEME.colors.secondary} strokeWidth="2.5" strokeLinecap="round" />
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
    style.innerHTML = `
      body { font-family: 'Comfortaa', cursive !important; background-color: ${THEME.colors.bg}; color: ${THEME.colors.text}; margin: 0; }
      h1, h2, h3, h4 { font-weight: 700; letter-spacing: -0.5px; }
      input, select, textarea { font-family: 'Comfortaa', cursive !important; transition: all 0.2s; }
      input:focus, select:focus, textarea:focus { outline: none; border-color: ${THEME.colors.primary} !important; box-shadow: 0 0 0 3px rgba(238, 83, 64, 0.1); }
      button { font-family: 'Comfortaa', cursive !important; transition: all 0.3s ease; }
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

  useEffect(() => { checkSession(); }, []);

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await loadProfile(session.user.email);
        setView('dashboard');
      } else { setView('landing'); }
    } catch (error) { setView('landing'); } finally { setLoading(false); }
  }

  async function loadProfile(userEmail) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('email', userEmail).single();
      setProfile(data || { nombre: 'Usuario', apellido: '', email: userEmail });
    } catch (error) { setProfile({ nombre: 'Usuario', apellido: '', email: userEmail }); }
  }

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setView('landing');
    showToast('Sesión cerrada');
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Comfortaa' }}><p>Cargando TerraMatch...</p></div>;

  const safeName = profile?.nombre || 'Usuario';
  const isAdmin = profile?.email === 'jcnieto.marketing@gmail.com';

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar nombre={safeName} isLoggedIn={!!user} isAdmin={isAdmin} onNavigate={setView} onLogout={handleLogout} />
      <main style={{ flex: 1 }}>
        {view === 'landing' && <LandingView onNavigate={setView} />}
        {view === 'login' && <LoginView supabase={supabase} onSuccess={(u, email) => { setUser(u); loadProfile(email); setView('dashboard'); showToast('¡Bienvenido!'); }} showToast={showToast} onNavigate={setView} />}
        {view === 'register' && <RegisterView supabase={supabase} onSuccess={(u, email) => { setUser(u); loadProfile(email); setView('dashboard'); showToast('¡Cuenta creada!'); }} showToast={showToast} />}
        {view === 'iub' && user && <IUBView user={user} profile={profile} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'oferta' && user && <OfertaView user={user} profile={profile} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'dashboard' && user && <DashboardView user={user} profile={profile} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'admin' && user && isAdmin && <AdminView supabase={supabase} showToast={showToast} />}
      </main>
      <Footer onNavigate={setView} />
      {toast && <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: toast.type === 'error' ? THEME.colors.primary : THEME.colors.success, color: 'white', padding: '12px 24px', borderRadius: THEME.radius.full, zIndex: 1000, boxShadow: THEME.shadow, fontWeight: 600 }}>{toast.message}</div>}
    </div>
  );
}

// ==========================================
// NAVBAR CON LOGO RADAR
// ==========================================
function Navbar({ nombre, isLoggedIn, isAdmin, onNavigate, onLogout }) {
  return (
    <nav style={{ background: THEME.colors.white, padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => onNavigate('landing')}>
          <LogoIcon size={38} />
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: THEME.colors.text }}>terra<span style={{ color: THEME.colors.primary }}>match</span></span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              <span style={{ fontWeight: 600, color: THEME.colors.textLight, fontSize: '0.9rem' }}>Hola, <span style={{ color: THEME.colors.primary }}>{nombre}</span></span>
              {isAdmin && <button onClick={() => onNavigate('admin')} style={{ padding: '8px 16px', background: THEME.colors.text, color: 'white', border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>🛡️ Admin</button>}
              <button onClick={() => onNavigate('dashboard')} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${THEME.colors.primary}`, color: THEME.colors.primary, borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}>Dashboard</button>
              <button onClick={onLogout} style={{ padding: '8px 16px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}>Salir</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')} style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${THEME.colors.text}`, color: THEME.colors.text, borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}>Ingresar</button>
              <button onClick={() => onNavigate('register')} style={{ padding: '8px 20px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600, boxShadow: `0 4px 10px ${THEME.colors.primary}30` }}>Regístrate</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ==========================================
// LANDING VIEW
// ==========================================
function LandingView({ onNavigate }) {
  return (
    <div style={{ position: 'relative', padding: '80px 24px', textAlign: 'center', overflow: 'hidden', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: THEME.colors.secondary, borderRadius: '50%', opacity: 0.2, filter: 'blur(60px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', background: THEME.colors.primary, borderRadius: '50%', opacity: 0.1, filter: 'blur(50px)', zIndex: 0 }}></div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
        <div style={{ display: 'inline-block', background: `${THEME.colors.secondary}40`, color: THEME.colors.primary, padding: '8px 20px', borderRadius: THEME.radius.full, fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>
          🚀 El matchmaker inmobiliario inteligente
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', color: THEME.colors.text, lineHeight: 1.1 }}>
          Encuentra el <span style={{ color: THEME.colors.primary }}>Match Perfecto</span><br/>para tu negocio
        </h1>
        <p style={{ fontSize: '1.2rem', color: THEME.colors.textLight, marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
          Conectamos empresas en expansión con locales comerciales ideales. Sin intermediarios, sin pérdidas de tiempo.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
          <div onClick={() => onNavigate('oferta')} style={{ background: THEME.colors.white, padding: '40px 32px', borderRadius: THEME.radius.lg, cursor: 'pointer', border: `2px solid transparent`, boxShadow: THEME.shadow, transition: 'all 0.3s', textAlign: 'left' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = THEME.shadowHover; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = THEME.shadow; }}>
            <div style={{ width: '60px', height: '60px', background: `${THEME.colors.secondary}40`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '20px' }}>🏪</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: THEME.colors.text }}>Tengo Locales</h3>
            <p style={{ color: THEME.colors.textLight, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>Soy propietario o inmobiliaria y quiero publicar mi inventario para encontrar al empresario ideal.</p>
            <span style={{ color: THEME.colors.primary, fontWeight: 700, fontSize: '0.9rem' }}>Publicar Inmueble →</span>
          </div>

          <div onClick={() => onNavigate('iub')} style={{ background: THEME.colors.white, padding: '40px 32px', borderRadius: THEME.radius.lg, cursor: 'pointer', border: `2px solid transparent`, boxShadow: THEME.shadow, transition: 'all 0.3s', textAlign: 'left' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = THEME.shadowHover; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = THEME.shadow; }}>
            <div style={{ width: '60px', height: '60px', background: `${THEME.colors.primary}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: THEME.colors.text }}>Busco Locales</h3>
            <p style={{ color: THEME.colors.textLight, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>Soy empresario y necesito encontrar el local ideal para expandir mi negocio rápidamente.</p>
            <span style={{ color: THEME.colors.primary, fontWeight: 700, fontSize: '0.9rem' }}>Crear IUB →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// IUB VIEW (6 Pasos - Estilizado)
// ==========================================
function IUBView({ user, profile, supabase, showToast, onNavigate }) {
  const [step, setStep] = useState(1);
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    nombre_completo: profile?.nombre + ' ' + profile?.apellido || '',
    nit_cedula: '', celular: profile?.celular || '', email_contacto: profile?.email || '', tipo_negocio: '',
    ciudad: 'Bogotá', zona: 'Norte', barrio: '', direccion_referencia: '',
    tipo_inmueble: 'local', area_min: 50, area_max: 200, banos: 1, parqueaderos: 0, caracteristicas: [],
    operacion: 'arrendar', presupuesto_min: 1000000, presupuesto_max: 5000000, admin_incluido: false,
    tiempo_decision: '1-3 meses', fecha_ocupacion: '', observaciones: ''
  });

  const steps = [
    { num: 1, name: 'Identificación', icon: '👤' },
    { num: 2, name: 'Ubicación', icon: '📍' },
    { num: 3, name: 'Inmueble', icon: '🏢' },
    { num: 4, name: 'Económico', icon: '💰' },
    { num: 5, name: 'Decisión', icon: '📅' },
    { num: 6, name: 'Resumen', icon: '✅' }
  ];

  const toggleCaracteristica = (car) => {
    setForm(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.includes(car) ? prev.caracteristicas.filter(c => c !== car) : [...prev.caracteristicas, car]
    }));
  };

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validateStep = () => {
    if (step === 1 && (!form.nombre_completo || !form.celular)) { showToast('Completa nombre y celular', 'error'); return false; }
    if (step === 6 && !aceptoTerminos) { showToast('Acepta los términos para continuar', 'error'); return false; }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(prev => Math.min(prev + 1, 6)); };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  async function handleSubmit() {
    if (!validateStep()) return;
    setLoading(true);
    try {
      const prefix = form.operacion === 'comprar' ? 'V' : 'A';
      const codigoIub = `TM-${prefix}-${form.ciudad.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*10000)}`;

      const { error } = await supabase.from('iubs').insert([{
        user_id: user.id, codigo_iub: codigoIub, segmento: 'locales', operacion: form.operacion,
        ciudad: form.ciudad, zona: form.zona, area_min: form.area_min, presupuesto_max: form.presupuesto_max,
        tipo_inmueble: form.tipo_inmueble, caracteristicas: JSON.stringify(form.caracteristicas),
        nombre_completo: form.nombre_completo, celular: form.celular, email_contacto: form.email_contacto,
        tiempo_decision: form.tiempo_decision, acepto_terminos_iub: true
      }]);
      if (error) throw error;
      showToast(`¡IUB ${codigoIub} generado!`);
      onNavigate('dashboard');
    } catch (error) { showToast(error.message, 'error'); } finally { setLoading(false); }
  }

  const inputStyle = { width: '100%', padding: '14px 16px', border: `1px solid #e2e8f0`, borderRadius: THEME.radius.md, boxSizing: 'border-box', fontSize: '1rem', background: '#f8fafc' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 600, color: THEME.colors.text, fontSize: '0.9rem' };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '40px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: THEME.colors.text, marginBottom: '8px' }}>Indicador Único de Búsqueda</h2>
          <p style={{ color: THEME.colors.textLight }}>Paso {step} de 6: {steps[step-1].name}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '4px', background: '#e2e8f0', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', top: '20px', left: '0', height: '4px', background: THEME.colors.primary, zIndex: 1, transition: 'width 0.3s', width: `${((step - 1) / 5) * 100}%` }}></div>
          {steps.map(s => (
            <div key={s.num} style={{ zIndex: 2, textAlign: 'center', flex: 1 }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: step >= s.num ? THEME.colors.primary : THEME.colors.white, color: step >= s.num ? 'white' : '#a0aec0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontWeight: 700, border: `2px solid ${step >= s.num ? THEME.colors.primary : '#e2e8f0'}`, transition: 'all 0.3s' }}>
                {step > s.num ? '✓' : s.num}
              </div>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>👤 Identificación</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div><label style={labelStyle}>Nombre completo / Razón social *</label><input style={inputStyle} value={form.nombre_completo} onChange={e => updateForm('nombre_completo', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>NIT / Cédula</label><input style={inputStyle} value={form.nit_cedula} onChange={e => updateForm('nit_cedula', e.target.value)} /></div>
                <div><label style={labelStyle}>Tipo de negocio</label><input style={inputStyle} value={form.tipo_negocio} onChange={e => updateForm('tipo_negocio', e.target.value)} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>Celular *</label><input style={inputStyle} value={form.celular} onChange={e => updateForm('celular', e.target.value)} /></div>
                <div><label style={labelStyle}>Email *</label><input style={inputStyle} value={form.email_contacto} onChange={e => updateForm('email_contacto', e.target.value)} /></div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>📍 Ubicación</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Ciudad</label><select style={inputStyle} value={form.ciudad} onChange={e => updateForm('ciudad', e.target.value)}><option>Bogotá</option><option>Medellín</option><option>Cali</option></select></div>
              <div><label style={labelStyle}>Zona</label><select style={inputStyle} value={form.zona} onChange={e => updateForm('zona', e.target.value)}><option>Norte</option><option>Sur</option><option>Centro</option></select></div>
            </div>
            <div style={{ marginTop: '16px' }}><label style={labelStyle}>Barrio / Referencia</label><input style={inputStyle} value={form.barrio} onChange={e => updateForm('barrio', e.target.value)} /></div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>🏢 Inmueble</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Tipo</label><select style={inputStyle} value={form.tipo_inmueble} onChange={e => updateForm('tipo_inmueble', e.target.value)}><option value="local">Local</option><option value="oficina">Oficina</option><option value="bodega">Bodega</option></select></div>
              <div><label style={labelStyle}>Operación</label><select style={inputStyle} value={form.operacion} onChange={e => updateForm('operacion', e.target.value)}><option value="arrendar">Arrendar</option><option value="comprar">Comprar</option></select></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div><label style={labelStyle}>Área Mín (m²)</label><input type="number" style={inputStyle} value={form.area_min} onChange={e => updateForm('area_min', parseInt(e.target.value))} /></div>
              <div><label style={labelStyle}>Área Máx (m²)</label><input type="number" style={inputStyle} value={form.area_max} onChange={e => updateForm('area_max', parseInt(e.target.value))} /></div>
            </div>
            <div style={{ marginTop: '24px' }}>
              <label style={labelStyle}>Características deseables</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['Esquinero', 'Vía principal', 'Doble altura', 'Seguridad 24h', 'Aire acondicionado'].map(car => (
                  <button key={car} type="button" onClick={() => toggleCaracteristica(car)} style={{ padding: '8px 16px', borderRadius: THEME.radius.full, border: `1px solid ${form.caracteristicas.includes(car) ? THEME.colors.primary : '#e2e8f0'}`, background: form.caracteristicas.includes(car) ? `${THEME.colors.primary}10` : 'white', color: form.caracteristicas.includes(car) ? THEME.colors.primary : THEME.colors.textLight, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                    {car}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>💰 Económico</h3>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Presupuesto Mín: ${form.presupuesto_min.toLocaleString()}</label>
              <input type="range" min="500000" max="20000000" step="100000" value={form.presupuesto_min} onChange={e => updateForm('presupuesto_min', parseInt(e.target.value))} style={{ width: '100%', accentColor: THEME.colors.primary }} />
            </div>
            <div>
              <label style={labelStyle}>Presupuesto Máx: ${form.presupuesto_max.toLocaleString()}</label>
              <input type="range" min="1000000" max="50000000" step="100000" value={form.presupuesto_max} onChange={e => updateForm('presupuesto_max', parseInt(e.target.value))} style={{ width: '100%', accentColor: THEME.colors.primary }} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>📅 Decisión</h3>
            <div><label style={labelStyle}>Tiempo de decisión</label><select style={inputStyle} value={form.tiempo_decision} onChange={e => updateForm('tiempo_decision', e.target.value)}><option>Inmediato</option><option>1-3 meses</option><option>3-6 meses</option><option>+6 meses</option></select></div>
            <div style={{ marginTop: '16px' }}><label style={labelStyle}>Observaciones</label><textarea style={{ ...inputStyle, minHeight: '100px' }} value={form.observaciones} onChange={e => updateForm('observaciones', e.target.value)} /></div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>✅ Resumen</h3>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: THEME.radius.md, marginBottom: '24px' }}>
              <p><strong>Buscador:</strong> {form.nombre_completo}</p>
              <p><strong>Ubicación:</strong> {form.ciudad} - {form.zona}</p>
              <p><strong>Inmueble:</strong> {form.tipo_inmueble} de {form.area_min}-{form.area_max} m²</p>
              <p><strong>Presupuesto:</strong> ${form.presupuesto_min.toLocaleString()} - ${form.presupuesto_max.toLocaleString()}</p>
            </div>
            <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="checkbox" checked={aceptoTerminos} onChange={e => setAceptoTerminos(e.target.checked)} style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight }}>Acepto los <a href={DOC_TERMINOS} target="_blank" style={{ color: THEME.colors.primary }}>Términos y Condiciones</a> y el Mandato de Pago de TerraMatch.</span>
            </label>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
          {step > 1 && <button onClick={prevStep} style={{ flex: 1, padding: '14px', background: 'white', border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer', color: THEME.colors.textLight }}>Atrás</button>}
          {step < 6 ? (
            <button onClick={nextStep} style={{ flex: 2, padding: '14px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 15px ${THEME.colors.primary}40` }}>Siguiente →</button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '14px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>{loading ? 'Generando...' : '✓ Generar IUB'}</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// OFERTA VIEW
// ==========================================
function OfertaView({ user, profile, supabase, showToast, onNavigate }) {
  const [step, setStep] = useState(1);
  const [rol, setRol] = useState('');
  
  if (step === 1) {
    return (
      <div style={{ padding: '40px 24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: THEME.colors.white, padding: '40px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, textAlign: 'center' }}>
          <h2 style={{ marginBottom: '32px' }}>¿Cuál es tu rol?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Propietario directo', 'Agencia Inmobiliaria'].map((r) => (
              <button key={r} onClick={() => { setRol(r); setStep(2); }} style={{ padding: '20px', background: 'white', border: `2px solid #e2e8f0`, borderRadius: THEME.radius.md, cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, color: THEME.colors.text }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.background = `${THEME.colors.primary}05`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '40px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <h2 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>Publicar como {rol}</h2>
        <p style={{ color: THEME.colors.textLight }}>Formulario de carga de inmueble (Misma estructura visual que IUB)</p>
        <button onClick={() => onNavigate('dashboard')} style={{ marginTop: '24px', padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer' }}>Volver al Dashboard</button>
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD VIEW
// ==========================================
function DashboardView({ user, profile, supabase, showToast, onNavigate }) {
  const safeName = profile?.nombre || 'Usuario';

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ background: `linear-gradient(135deg, ${THEME.colors.primary} 0%, #ff7e6b 100%)`, color: 'white', padding: '40px', borderRadius: THEME.radius.lg, marginBottom: '32px', boxShadow: `0 10px 30px ${THEME.colors.primary}40` }}>
        <h2 style={{ color: 'white', marginBottom: '8px' }}>Hola, {safeName} 👋</h2>
        <p style={{ opacity: 0.9 }}>Bienvenido a tu centro de control TerraMatch</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div onClick={() => onNavigate('iub')} style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, cursor: 'pointer', transition: 'all 0.3s', border: '2px solid transparent' }}
             onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.transform = 'translateY(-5px)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ marginBottom: '8px' }}>Busco Locales</h3>
          <p style={{ color: THEME.colors.textLight, fontSize: '0.9rem' }}>Crea un nuevo IUB para encontrar tu match ideal.</p>
        </div>

        <div onClick={() => onNavigate('oferta')} style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, cursor: 'pointer', transition: 'all 0.3s', border: '2px solid transparent' }}
             onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.transform = 'translateY(-5px)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🏪</div>
          <h3 style={{ marginBottom: '8px' }}>Tengo Locales</h3>
          <p style={{ color: THEME.colors.textLight, fontSize: '0.9rem' }}>Publica tu inventario y recibe matches de buscadores.</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ADMIN, LOGIN, REGISTER, FOOTER
// ==========================================
function AdminView({ showToast }) { return <div style={{padding: '40px', textAlign: 'center'}}>Panel Admin (En construcción visual)</div>; }
function LoginView({ supabase, onSuccess, showToast, onNavigate }) {
  const [form, setForm] = useState({ email: '', password: '' });
  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '40px auto', background: THEME.colors.white, borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
      <h2 style={{ textAlign: 'center', marginBottom: '32px', color: THEME.colors.primary }}>Ingresar</h2>
      <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '14px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.md, boxSizing: 'border-box' }} />
      <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '14px', marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.md, boxSizing: 'border-box' }} />
      <button onClick={async () => { const { data, error } = await supabase.auth.signInWithPassword(form); if(error) showToast(error.message, 'error'); else onSuccess(data.user, form.email); }} style={{ width: '100%', padding: '14px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Entrar</button>
    </div>
  );
}
function RegisterView({ onSuccess }) { return <div style={{padding: '40px', textAlign: 'center'}}>Registro (Mantener versión anterior con T&C)</div>; }

function Footer({ onNavigate }) {
  return (
    <footer style={{ background: THEME.colors.text, color: 'white', padding: '40px 24px', marginTop: '60px', borderRadius: '32px 32px 0 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <LogoIcon size={32} />
          <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>terramatch</span>
        </div>
        <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>© 2026 TerraMatch. Bogotá, Colombia.</p>
      </div>
    </footer>
  );
}

export default App;
