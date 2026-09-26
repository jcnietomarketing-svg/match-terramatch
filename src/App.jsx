import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DOC_TERMINOS = 'https://github.com/jcnietomarketing-svg/match-terramatch/raw/main/T%26C_TerraMatch%20act%202024.docx';
const DOC_PRIVACIDAD = 'https://github.com/jcnietomarketing-svg/match-terramatch/raw/main/Politica%20de%20privacidad%20y%20proteccion%20de%20datos_TerraMatch_act2023.docx';

function App() {
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
    } catch (error) {
      console.error('Error session:', error);
      setView('landing');
    } finally { setLoading(false); }
  }

  async function loadProfile(userEmail) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('email', userEmail).single();
      setProfile(data || { nombre: 'Usuario', apellido: '', email: userEmail });
    } catch (error) {
      setProfile({ nombre: 'Usuario', apellido: '', email: userEmail });
    }
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

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p>Cargando TerraMatch...</p></div>;

  const safeName = profile?.nombre || 'Usuario';
  const isAdmin = profile?.email === 'jcnieto.marketing@gmail.com';

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar nombre={safeName} isLoggedIn={!!user} isAdmin={isAdmin} onNavigate={setView} onLogout={handleLogout} />
      <main style={{ flex: 1 }}>
        {view === 'landing' && <LandingView onNavigate={setView} />}
        {view === 'login' && <LoginView supabase={supabase} onSuccess={(u, email) => { setUser(u); loadProfile(email); setView('dashboard'); showToast('¡Bienvenido!'); }} showToast={showToast} onNavigate={setView} />}
        {view === 'register' && <RegisterView supabase={supabase} onSuccess={(u, email) => { setUser(u); loadProfile(email); setView('dashboard'); showToast('¡Cuenta creada!'); }} showToast={showToast} />}
        {view === 'iub' && user && <IUBView user={user} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'oferta' && user && <OfertaView user={user} profile={profile} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'dashboard' && user && <DashboardView user={user} profile={profile} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'admin' && user && isAdmin && <AdminView supabase={supabase} showToast={showToast} />}
      </main>
      <Footer onNavigate={setView} />
      {toast && <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: toast.type === 'error' ? '#e74c3c' : '#27ae60', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>{toast.message}</div>}
    </div>
  );
}

// ==========================================
// NAVBAR
// ==========================================
function Navbar({ nombre, isLoggedIn, isAdmin, onNavigate, onLogout }) {
  return (
    <nav style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #ECF0F1', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onNavigate('landing')}>
          <div style={{ width: '40px', height: '40px', background: '#E74C3C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>TM</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: '#E74C3C' }}>terramatch</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              <span style={{ fontWeight: 600, color: '#2C3E50' }}>Hola, {nombre}</span>
              {isAdmin && <button onClick={() => onNavigate('admin')} style={{ padding: '8px 16px', background: '#2C3E50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>🛡️ Admin</button>}
              <button onClick={() => onNavigate('dashboard')} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #E74C3C', color: '#E74C3C', borderRadius: '6px', cursor: 'pointer' }}>Dashboard</button>
              <button onClick={onLogout} style={{ padding: '8px 16px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Salir</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #E74C3C', color: '#E74C3C', borderRadius: '6px', cursor: 'pointer' }}>Ingresar</button>
              <button onClick={() => onNavigate('register')} style={{ padding: '8px 16px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Regístrate</button>
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
    <div style={{ padding: '80px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #D4E6F1 0%, white 100%)', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '16px', color: '#1a202c' }}>Encuentra tu <span style={{ color: '#E74C3C' }}>match perfecto</span></h1>
      <p style={{ fontSize: '1.2rem', color: '#4A5568', marginBottom: '48px', maxWidth: '600px' }}>Estandarizamos los requerimientos inmobiliarios para conectar propietarios y empresarios sin intermediarios innecesarios.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '800px', width: '100%' }}>
        <div onClick={() => onNavigate('oferta')} style={{ background: 'white', padding: '40px 32px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}
             onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E74C3C'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏪</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#1a202c' }}>Tengo Locales</h3>
          <p style={{ color: '#7F8C8D', fontSize: '0.95rem', lineHeight: '1.5' }}>Soy propietario o inmobiliaria y quiero publicar un inmueble comercial para encontrar al empresario ideal.</p>
          <button style={{ marginTop: '24px', padding: '12px 24px', background: '#1a202c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>Continuar →</button>
        </div>

        <div onClick={() => onNavigate('iub')} style={{ background: 'white', padding: '40px 32px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' }}
             onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E74C3C'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#1a202c' }}>Busco Locales</h3>
          <p style={{ color: '#7F8C8D', fontSize: '0.95rem', lineHeight: '1.5' }}>Soy empresario o persona natural y necesito encontrar el local o inmueble ideal para mi negocio.</p>
          <button style={{ marginTop: '24px', padding: '12px 24px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>Continuar →</button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// OFERTA VIEW (COMPLETA Y DETALLADA)
// ==========================================
function OfertaView({ user, profile, supabase, showToast, onNavigate }) {
  const [step, setStep] = useState(1);
  const [rol, setRol] = useState('');
  const [form, setForm] = useState({ 
    tipo_inmueble: 'local', operacion: 'arrendar', ciudad: 'Bogotá', zona: 'Norte', 
    direccion: '', area: 100, area_util: 80, banos: 1, parqueaderos: 0,
    precio: 5000000, admin_incluido: false, descripcion: '',
    contacto_nombre: profile?.nombre + ' ' + profile?.apellido || '',
    contacto_celular: profile?.celular || '',
    caracteristicas: []
  });
  const [loading, setLoading] = useState(false);

  const toggleCaracteristica = (car) => {
    setForm(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.includes(car) 
        ? prev.caracteristicas.filter(c => c !== car)
        : [...prev.caracteristicas, car]
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('propiedades').insert([{
        user_id: user.id,
        segmento: 'locales',
        tipo_inmueble: form.tipo_inmueble,
        operacion: form.operacion,
        ciudad: form.ciudad,
        zona: form.zona,
        direccion: form.direccion,
        area: form.area,
        area_util: form.area_util,
        banos: form.banos,
        parqueaderos: form.parqueaderos,
        precio: form.precio,
        admin_incluido: form.admin_incluido,
        descripcion: form.descripcion,
        contacto_nombre: form.contacto_nombre,
        contacto_celular: form.contacto_celular,
        caracteristicas: JSON.stringify(form.caracteristicas),
        disponible: true,
        titulo: `${form.tipo_inmueble} en ${form.zona}, ${form.ciudad}`
      }]);

      if (error) throw error;
      showToast('¡Inmueble publicado exitosamente!');
      onNavigate('dashboard');
    } catch (error) {
      showToast(error.message || 'Error al publicar', 'error');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', marginBottom: '16px', fontSize: '1rem' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1a202c' };

  if (step === 1) {
    return (
      <div style={{ padding: '40px 24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '8px' }}>¿Cuál es tu rol?</h2>
          <p style={{ color: '#7F8C8D', marginBottom: '32px' }}>Selecciona cómo deseas publicar tu inmueble</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Propietario directo', 'Agencia Inmobiliaria', 'Constructora / Desarrollador'].map((r) => (
              <button key={r} onClick={() => { setRol(r); setStep(2); }} 
                style={{ padding: '20px', background: 'white', border: '2px solid #ECF0F1', borderRadius: '12px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, color: '#1a202c', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E74C3C'; e.currentTarget.style.background = '#FFF5F5'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ECF0F1'; e.currentTarget.style.background = 'white'; }}>
                {r}
              </button>
            ))}
          </div>
          <button onClick={() => onNavigate('landing')} style={{ marginTop: '24px', background: 'none', border: 'none', color: '#7F8C8D', cursor: 'pointer', textDecoration: 'underline' }}>← Volver al inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0 }}>Publicar Inmueble</h2>
          <span style={{ background: '#E74C3C', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>{rol}</span>
        </div>
        
        <form onSubmit={handleSubmit}>
          <h4 style={{ marginBottom: '16px', color: '#E74C3C', borderBottom: '1px solid #ECF0F1', paddingBottom: '8px' }}>1. Información Básica</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Tipo de inmueble</label>
              <select style={inputStyle} value={form.tipo_inmueble} onChange={e => setForm({...form, tipo_inmueble: e.target.value})}>
                <option value="local">Local Comercial</option>
                <option value="oficina">Oficina</option>
                <option value="bodega">Bodega</option>
                <option value="consultorio">Consultorio</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Operación</label>
              <select style={inputStyle} value={form.operacion} onChange={e => setForm({...form, operacion: e.target.value})}>
                <option value="arrendar">Arrendar</option>
                <option value="vender">Vender</option>
              </select>
            </div>
          </div>

          <h4 style={{ marginBottom: '16px', color: '#E74C3C', borderBottom: '1px solid #ECF0F1', paddingBottom: '8px', marginTop: '24px' }}>2. Ubicación y Medidas</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Ciudad</label>
              <select style={inputStyle} value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})}>
                <option value="Bogotá">Bogotá</option>
                <option value="Medellín">Medellín</option>
                <option value="Cali">Cali</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Zona / Localidad</label>
              <select style={inputStyle} value={form.zona} onChange={e => setForm({...form, zona: e.target.value})}>
                <option value="Norte">Norte</option>
                <option value="Sur">Sur</option>
                <option value="Centro">Centro</option>
                <option value="Occidente">Occidente</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Dirección exacta</label>
            <input style={inputStyle} placeholder="Ej: Calle 85 # 15-30" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Área Total (m²)</label>
              <input type="number" style={inputStyle} value={form.area} onChange={e => setForm({...form, area: parseInt(e.target.value) || 0})} required />
            </div>
            <div>
              <label style={labelStyle}>Área Útil (m²)</label>
              <input type="number" style={inputStyle} value={form.area_util} onChange={e => setForm({...form, area_util: parseInt(e.target.value) || 0})} required />
            </div>
            <div>
              <label style={labelStyle}>Baños</label>
              <input type="number" style={inputStyle} value={form.banos} onChange={e => setForm({...form, banos: parseInt(e.target.value) || 0})} required />
            </div>
            <div>
              <label style={labelStyle}>Parqueaderos</label>
              <input type="number" style={inputStyle} value={form.parqueaderos} onChange={e => setForm({...form, parqueaderos: parseInt(e.target.value) || 0})} required />
            </div>
          </div>

          <h4 style={{ marginBottom: '16px', color: '#E74C3C', borderBottom: '1px solid #ECF0F1', paddingBottom: '8px', marginTop: '24px' }}>3. Condiciones Económicas</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>Precio (COP)</label>
              <input type="number" style={inputStyle} value={form.precio} onChange={e => setForm({...form, precio: parseInt(e.target.value) || 0})} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600 }}>
                <input type="checkbox" checked={form.admin_incluido} onChange={e => setForm({...form, admin_incluido: e.target.checked})} style={{ transform: 'scale(1.2)' }} />
                Precio incluye administración
              </label>
            </div>
          </div>

          <h4 style={{ marginBottom: '16px', color: '#E74C3C', borderBottom: '1px solid #ECF0F1', paddingBottom: '8px', marginTop: '24px' }}>4. Características Destacadas</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {['Esquinero', 'Vía principal', 'Doble altura', 'Seguridad 24h', 'Muelles de carga', 'Aire acondicionado', 'Permiso de suelos'].map(car => (
              <label key={car} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', background: form.caracteristicas.includes(car) ? '#FFF5F5' : '#f8f9fa', borderRadius: '8px', border: `1px solid ${form.caracteristicas.includes(car) ? '#E74C3C' : '#ECF0F1'}` }}>
                <input type="checkbox" checked={form.caracteristicas.includes(car)} onChange={() => toggleCaracteristica(car)} />
                <span style={{ fontSize: '0.9rem' }}>{car}</span>
              </label>
            ))}
          </div>

          <h4 style={{ marginBottom: '16px', color: '#E74C3C', borderBottom: '1px solid #ECF0F1', paddingBottom: '8px', marginTop: '24px' }}>5. Descripción y Contacto</h4>
          <div>
            <label style={labelStyle}>Descripción del inmueble</label>
            <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Describe las bondades del inmueble, estado, etc." value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nombre de contacto</label>
              <input style={inputStyle} value={form.contacto_nombre} onChange={e => setForm({...form, contacto_nombre: e.target.value})} required />
            </div>
            <div>
              <label style={labelStyle}>Celular / WhatsApp</label>
              <input style={inputStyle} value={form.contacto_celular} onChange={e => setForm({...form, contacto_celular: e.target.value})} required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Atrás</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '14px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '1.05rem' }}>
              {loading ? 'Publicando...' : 'Publicar Inmueble'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// LOGIN VIEW
// ==========================================
function LoginView({ supabase, onSuccess, showToast, onNavigate }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) throw error;
      onSuccess(data.user, form.email);
    } catch (error) { showToast(error.message || 'Credenciales incorrectas', 'error'); } finally { setLoading(false); }
  }
  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '40px auto', background: 'white', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>{loading ? 'Entrando...' : 'Ingresar'}</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#7F8C8D', fontSize: '0.9rem' }}>¿No tienes cuenta? <button onClick={() => onNavigate('register')} style={{ background: 'none', border: 'none', color: '#E74C3C', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Regístrate aquí</button></p>
    </div>
  );
}

// ==========================================
// REGISTER VIEW
// ==========================================
function RegisterView({ supabase, onSuccess, showToast }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', celular: '', tipo_usuario: 'buscador', segmento_preferido: 'locales', password: '' });
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [autorizaDatos, setAutorizaDatos] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!aceptaTerminos || !aceptaPrivacidad || !autorizaDatos) {
      showToast('Debes aceptar los Términos, Políticas de Privacidad y autorizar el tratamiento de datos', 'error');
      return;
    }
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password });
      if (authError) throw authError;
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: authData.user.id, nombre: form.nombre, apellido: form.apellido, email: form.email, celular: form.celular,
        tipo_usuario: form.tipo_usuario, segmento_preferido: form.segmento_preferido,
        acepto_terminos: true, acepto_privacidad: true, autorizo_datos: true, fecha_aceptacion: new Date().toISOString()
      }]);
      if (profileError) throw profileError;
      onSuccess(authData.user, form.email);
    } catch (error) { showToast(error.message || 'Error al crear cuenta', 'error'); } finally { setLoading(false); }
  }

  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', marginBottom: '16px', fontSize: '1rem' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1a202c' };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Crear Cuenta</h2>
        <p style={{ textAlign: 'center', color: '#7F8C8D', marginBottom: '32px' }}>Únete al matchmaker inmobiliario de LATAM</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={labelStyle}>Nombres *</label><input style={inputStyle} value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></div>
            <div><label style={labelStyle}>Apellidos *</label><input style={inputStyle} value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} required /></div>
          </div>
          <label style={labelStyle}>Email *</label><input type="email" style={inputStyle} value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <label style={labelStyle}>Celular *</label><input style={inputStyle} value={form.celular} onChange={e => setForm({...form, celular: e.target.value})} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={labelStyle}>Tipo de usuario *</label><select style={inputStyle} value={form.tipo_usuario} onChange={e => setForm({...form, tipo_usuario: e.target.value})}><option value="buscador">Buscador</option><option value="propietario">Propietario</option><option value="agencia">Agencia</option></select></div>
            <div><label style={labelStyle}>Segmento *</label><select style={inputStyle} value={form.segmento_preferido} onChange={e => setForm({...form, segmento_preferido: e.target.value})}><option value="locales">Locales</option><option value="vivienda">Vivienda</option><option value="oficinas">Oficinas</option></select></div>
          </div>
          <label style={labelStyle}>Contraseña * (mínimo 6 caracteres)</label><input type="password" style={inputStyle} value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength="6" />

          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e9ecef' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#1a202c', fontSize: '1rem' }}>📄 Documentos Legales *</h4>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={aceptaTerminos} onChange={e => setAceptaTerminos(e.target.checked)} style={{ marginTop: '3px', transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '0.9rem', color: '#4A5568' }}>Acepto los <a href={DOC_TERMINOS} target="_blank" rel="noopener noreferrer" style={{ color: '#E74C3C', textDecoration: 'underline', fontWeight: 600 }}>Términos y Condiciones</a> *</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={aceptaPrivacidad} onChange={e => setAceptaPrivacidad(e.target.checked)} style={{ marginTop: '3px', transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '0.9rem', color: '#4A5568' }}>Acepto la <a href={DOC_PRIVACIDAD} target="_blank" rel="noopener noreferrer" style={{ color: '#E74C3C', textDecoration: 'underline', fontWeight: 600 }}>Política de Privacidad</a> *</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={autorizaDatos} onChange={e => setAutorizaDatos(e.target.checked)} style={{ marginTop: '3px', transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '0.9rem', color: '#4A5568' }}>Autorizo el tratamiento de mis datos (Ley 1581 de 2012) *</span>
            </label>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>{loading ? 'Creando cuenta...' : 'Crear Cuenta'}</button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// IUB VIEW (Busco Locales)
// ==========================================
function IUBView({ user, supabase, showToast, onNavigate }) {
  const [form, setForm] = useState({ operacion: 'arrendar', ciudad: 'Bogotá', zona: 'Norte', tipo_inmueble: 'local', area: 100, presupuesto: 5000000 });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true);
    try {
      const prefix = form.operacion === 'comprar' ? 'V' : 'A';
      const codigoIub = `TM-${prefix}-LOC-${form.ciudad.substring(0,3).toUpperCase()}-${form.zona.substring(0,3).toUpperCase()}-${Math.floor(form.area/10)}-${Math.floor(form.presupuesto/1000)}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;
      const { data: iub, error: iubError } = await supabase.from('iubs').insert([{
        user_id: user.id, codigo_iub: codigoIub, segmento: 'locales', operacion: form.operacion, ciudad: form.ciudad, zona: form.zona, area_min: form.area, presupuesto_max: form.presupuesto, tipo_inmueble: form.tipo_inmueble
      }]).select().single();
      if (iubError) throw iubError;

      const { data: propiedades } = await supabase.from('propiedades').select('*').eq('segmento', 'locales').eq('operacion', form.operacion).eq('disponible', true).eq('ciudad', form.ciudad);
      if (propiedades && propiedades.length > 0) {
        const matches = propiedades.map(prop => ({ iub_id: iub.id, propiedad_id: prop.id, user_id: user.id, score: Math.floor(Math.random() * 30) + 70, estado: 'pendiente' }));
        await supabase.from('matches').insert(matches);
        showToast(`¡IUB creado! Se encontraron ${matches.length} matches.`);
      } else { showToast('IUB creado, pero no hay propiedades disponibles aún.'); }
      onNavigate('dashboard');
    } catch (error) { showToast(error.message || 'Error al crear IUB', 'error'); } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Configura tu IUB</h2>
        <p style={{ textAlign: 'center', color: '#7F8C8D', marginBottom: '32px' }}>Indicador Único de Búsqueda</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Operación</label><select value={form.operacion} onChange={e => setForm({...form, operacion: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}><option value="arrendar">Arrendar</option><option value="comprar">Comprar</option></select></div>
            <div><label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Ciudad</label><select value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}><option value="Bogotá">Bogotá</option><option value="Medellín">Medellín</option><option value="Cali">Cali</option></select></div>
          </div>
          <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Zona</label><select value={form.zona} onChange={e => setForm({...form, zona: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}><option value="Norte">Norte</option><option value="Sur">Sur</option><option value="Centro">Centro</option></select></div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Área mínima (m²)</span><span style={{ fontWeight: 'bold' }}>{form.area} m²</span></div>
            <input type="range" min="20" max="2000" step="10" value={form.area} onChange={e => setForm({...form, area: parseInt(e.target.value)})} style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Presupuesto máximo</span><span style={{ fontWeight: 'bold' }}>${form.presupuesto.toLocaleString('es-CO')} COP</span></div>
            <input type="range" min="500000" max="50000000" step="500000" value={form.presupuesto} onChange={e => setForm({...form, presupuesto: parseInt(e.target.value)})} style={{ width: '100%' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>{loading ? 'Generando...' : 'Generar IUB y Buscar Matches'}</button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD VIEW
// ==========================================
function DashboardView({ user, profile, supabase, showToast, onNavigate }) {
  const [iubs, setIubs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [misPropiedades, setMisPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const safeName = profile?.nombre || 'Usuario';

  useEffect(() => { if (user) loadData(); }, [user]);

  async function loadData() {
    try {
      setLoading(true);
      const { data: iubsData } = await supabase.from('iubs').select('*').eq('user_id', user.id).order('creado_en', { ascending: false });
      setIubs(iubsData || []);
      const { data: matchesData } = await supabase.from('matches').select('*, propiedades(*)').eq('user_id', user.id).order('creado_en', { ascending: false });
      setMatches(matchesData || []);
      const { data: propsData } = await supabase.from('propiedades').select('*').eq('user_id', user.id).order('creado_en', { ascending: false });
      setMisPropiedades(propsData || []);
    } catch (error) { console.error('Error loading dashboard data:', error); } finally { setLoading(false); }
  }

  async function updateMatchStatus(matchId, estado) {
    try {
      await supabase.from('matches').update({ estado }).eq('id', matchId);
      showToast(`Match ${estado === 'aceptado' ? 'Aceptado' : 'Rechazado'}`);
      loadData();
    } catch (error) { showToast('Error actualizando match', 'error'); }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}><p>Cargando Dashboard...</p></div>;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)', color: 'white', padding: '40px', borderRadius: '20px', marginBottom: '32px' }}>
        <h2 style={{ color: 'white', marginBottom: '8px' }}>Hola, {safeName} 👋</h2>
        <p style={{ opacity: 0.9 }}>Bienvenido a tu panel de control TerraMatch</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}><div style={{ fontSize: '2.2rem', fontWeight: 700 }}>{iubs.length}</div><div style={{ fontSize: '0.85rem', opacity: 0.9 }}>IUBs Activos</div></div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}><div style={{ fontSize: '2.2rem', fontWeight: 700 }}>{misPropiedades.length}</div><div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Mis Propiedades</div></div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}><div style={{ fontSize: '2.2rem', fontWeight: 700 }}>{matches.length}</div><div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Matches</div></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'white', padding: '28px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Tus Búsquedas (IUB)</h3>
            <button onClick={() => onNavigate('iub')} style={{ padding: '8px 16px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Nuevo IUB</button>
          </div>
          {iubs.length === 0 ? <p style={{ color: '#7F8C8D', textAlign: 'center', padding: '20px' }}>Aún no tienes IUBs.</p> : iubs.map(iub => (
            <div key={iub.id} style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #FF6B6B 100%)', color: 'white', padding: '20px', borderRadius: '12px', marginBottom: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{iub.segmento} · {iub.operacion}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, margin: '12px 0', background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>{iub.codigo_iub}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{iub.ciudad}, {iub.zona} · {iub.area_min}m²</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', padding: '28px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Mis Propiedades</h3>
            <button onClick={() => onNavigate('oferta')} style={{ padding: '8px 16px', background: '#1a202c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Publicar</button>
          </div>
          {misPropiedades.length === 0 ? <p style={{ color: '#7F8C8D', textAlign: 'center', padding: '20px' }}>Aún no has publicado inmuebles.</p> : misPropiedades.map(prop => (
            <div key={prop.id} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '12px', border: '1px solid #ECF0F1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', textTransform: 'capitalize' }}>{prop.tipo_inmueble} en {prop.zona}</h4>
                  <p style={{ margin: 0, color: '#7F8C8D', fontSize: '0.9rem' }}>{prop.area} m² · ${prop.precio?.toLocaleString('es-CO')}</p>
                </div>
                <span style={{ background: prop.disponible ? '#27ae60' : '#e74c3c', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>{prop.disponible ? 'Disponible' : 'No disponible'}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', padding: '28px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: '20px' }}>Matches Recientes</h3>
          {matches.length === 0 ? <p style={{ color: '#7F8C8D', textAlign: 'center', padding: '20px' }}>Configura un IUB para recibir matches.</p> : matches.map(match => (
            <div key={match.id} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '2px solid #ECF0F1', marginBottom: '12px', display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: match.score >= 85 ? '#27ae60' : '#f39c12', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>{match.score}%</div>
              <div><h4 style={{ fontSize: '1rem', marginBottom: '4px', textTransform: 'capitalize' }}>{match.propiedades?.tipo_inmueble || 'Inmueble'} en {match.propiedades?.zona}</h4><p style={{ color: '#7F8C8D', fontSize: '0.85rem' }}>{match.propiedades?.area} m² · ${match.propiedades?.precio?.toLocaleString('es-CO')}</p></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {match.estado === 'pendiente' ? (<><button onClick={() => updateMatchStatus(match.id, 'aceptado')} style={{ padding: '6px 12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>Aceptar</button><button onClick={() => updateMatchStatus(match.id, 'rechazado')} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>Rechazar</button></>) : (<span style={{ color: match.estado === 'aceptado' ? '#27ae60' : '#e74c3c', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>{match.estado === 'aceptado' ? '✓ Aceptado' : '✗ Rechazado'}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ADMIN VIEW
// ==========================================
function AdminView({ supabase, showToast }) {
  const [stats, setStats] = useState({ users: 0, iubs: 0, matches: 0, properties: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => { loadAdminData(); }, []);
  async function loadAdminData() {
    try {
      setLoading(true);
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: iubsCount } = await supabase.from('iubs').select('*', { count: 'exact', head: true });
      const { count: matchesCount } = await supabase.from('matches').select('*', { count: 'exact', head: true });
      const { count: propCount } = await supabase.from('propiedades').select('*', { count: 'exact', head: true });
      setStats({ users: usersCount || 0, iubs: iubsCount || 0, matches: matchesCount || 0, properties: propCount || 0 });
      const { data: usersData } = await supabase.from('profiles').select('*').order('creado_en', { ascending: false });
      setUsers(usersData || []);
    } catch (error) { console.error('Admin load error:', error); showToast('Error cargando datos', 'error'); } finally { setLoading(false); }
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando Panel de Administración...</div>;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ background: '#1a202c', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
        <h2 style={{ color: 'white', marginBottom: '8px' }}>🛡️ Panel de Administrador</h2>
        <p style={{ opacity: 0.8, margin: 0 }}>Gestión global de la plataforma TerraMatch</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #E74C3C' }}><div style={{ color: '#7F8C8D', fontSize: '0.85rem', marginBottom: '8px' }}>USUARIOS TOTALES</div><div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a202c' }}>{stats.users}</div></div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #3498db' }}><div style={{ color: '#7F8C8D', fontSize: '0.85rem', marginBottom: '8px' }}>IUBs CREADOS</div><div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a202c' }}>{stats.iubs}</div></div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #27ae60' }}><div style={{ color: '#7F8C8D', fontSize: '0.85rem', marginBottom: '8px' }}>MATCHES GENERADOS</div><div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a202c' }}>{stats.matches}</div></div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #f39c12' }}><div style={{ color: '#7F8C8D', fontSize: '0.85rem', marginBottom: '8px' }}>PROPIEDADES ACTIVAS</div><div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a202c' }}>{stats.properties}</div></div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ECF0F1', paddingBottom: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => setTab('overview')} style={{ padding: '10px 20px', background: tab === 'overview' ? '#1a202c' : 'white', color: tab === 'overview' ? 'white' : '#1a202c', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Resumen</button>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', background: tab === 'users' ? '#1a202c' : 'white', color: tab === 'users' ? 'white' : '#1a202c', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Usuarios</button>
      </div>
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {tab === 'overview' && <div><h3 style={{ marginBottom: '16px' }}>Actividad Reciente</h3><p style={{ color: '#7F8C8D' }}>Bienvenido al panel de control.</p></div>}
        {tab === 'users' && <div><h3 style={{ marginBottom: '16px' }}>Usuarios Registrados ({users.length})</h3>{users.length === 0 ? <p>No hay usuarios.</p> : (<table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ borderBottom: '2px solid #ECF0F1', textAlign: 'left' }}><th style={{ padding: '12px' }}>Nombre</th><th style={{ padding: '12px' }}>Email</th><th style={{ padding: '12px' }}>Tipo</th></tr></thead><tbody>{users.map(u => (<tr key={u.id} style={{ borderBottom: '1px solid #ECF0F1' }}><td style={{ padding: '12px' }}>{u.nombre} {u.apellido}</td><td style={{ padding: '12px' }}>{u.email}</td><td style={{ padding: '12px' }}><span style={{ background: '#E74C3C', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>{u.tipo_usuario}</span></td></tr>))}</tbody></table>)}</div>}
      </div>
    </div>
  );
}

// ==========================================
// FOOTER
// ==========================================
function Footer({ onNavigate }) {
  return (
    <footer style={{ background: '#1a202c', color: '#CBD5E0', padding: '40px 24px 20px', marginTop: '60px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: '#E74C3C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>TM</div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>terramatch</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>El matchmaker inmobiliario inteligente de LATAM.</p>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1rem' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><a href={DOC_TERMINOS} target="_blank" rel="noopener noreferrer" style={{ color: '#CBD5E0', textDecoration: 'none', fontSize: '0.9rem' }}>Términos y Condiciones</a></li>
              <li style={{ marginBottom: '8px' }}><a href={DOC_PRIVACIDAD} target="_blank" rel="noopener noreferrer" style={{ color: '#CBD5E0', textDecoration: 'none', fontSize: '0.9rem' }}>Política de Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #2D3748', paddingTop: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
          <p style={{ margin: 0 }}>© 2026 TerraMatch. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default App;
