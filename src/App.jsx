import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DOC_TERMINOS = 'https://github.com/jcnietomarketing-svg/match-terramatch/raw/main/T%26C_TerraMatch%20act%202024.docx';

const THEME = {
  colors: { primary: '#ee5340', secondary: '#b9d3dc', text: '#2d3748', textLight: '#718096', bg: '#f7fafc', white: '#ffffff', success: '#48bb78' },
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

  useEffect(() => { checkSession(); }, []);
  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { setUser(session.user); await loadProfile(session.user.email); setView('dashboard'); } 
      else { setView('landing'); }
    } catch (error) { setView('landing'); } finally { setLoading(false); }
  }
  async function loadProfile(userEmail) {
    try { const { data } = await supabase.from('profiles').select('*').eq('email', userEmail).single(); setProfile(data || { nombre: 'Usuario', email: userEmail }); } 
    catch (error) { setProfile({ nombre: 'Usuario', email: userEmail }); }
  }
  function showToast(message, type = 'success') { setToast({ message, type }); setTimeout(() => setToast(null), 4000); }
  async function handleLogout() { await supabase.auth.signOut(); setUser(null); setProfile(null); setView('landing'); }

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
        {view === 'login' && <LoginView supabase={supabase} onSuccess={(u) => { setUser(u); loadProfile(u.email); setView('dashboard'); }} />}
        {view === 'iub' && user && <IUBView user={user} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'oferta' && user && <OfertaView user={user} supabase={supabase} showToast={showToast} onNavigate={setView} />}
        {view === 'dashboard' && user && <DashboardView user={user} profile={profile} onNavigate={setView} />}
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
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}></div>
          <h3>Tengo Locales</h3>
          <p style={{ color: THEME.colors.textLight }}>Publica tu inventario o haz carga masiva.</p>
        </div>
        <div onClick={() => onNavigate('iub')} style={{ background: THEME.colors.white, padding: '40px', borderRadius: THEME.radius.lg, cursor: 'pointer', boxShadow: THEME.shadow }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}></div>
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

function DashboardView({ profile, onNavigate }) {
  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ background: `linear-gradient(135deg, ${THEME.colors.primary} 0%, #ff7e6b 100%)`, color: 'white', padding: '40px', borderRadius: THEME.radius.lg, marginBottom: '32px' }}>
        <h2 style={{ color: 'white', margin: '0 0 8px 0' }}>Hola, {profile?.nombre} 👋</h2>
        <p style={{ opacity: 0.9, margin: 0 }}>Bienvenido a tu centro de control TerraMatch</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div onClick={() => onNavigate('iub')} style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, cursor: 'pointer' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}></div>
          <h3>Busco Locales</h3>
          <p style={{ color: THEME.colors.textLight }}>Crear nuevo IUB</p>
        </div>
        <div onClick={() => onNavigate('oferta')} style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, cursor: 'pointer' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🏪</div>
          <h3>Tengo Locales</h3>
          <p style={{ color: THEME.colors.textLight }}>Publicar inmueble o carga masiva</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// IUB VIEW (BUSCO LOCALES) - BASADO EN EXCEL
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

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '40px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: THEME.colors.text, margin: '0 0 8px 0' }}>Indicador Único de Búsqueda (IUB)</h2>
          <p style={{ color: THEME.colors.textLight, margin: 0 }}>Paso {step} de 6: {['Identificación', 'Ubicación', 'Características', 'Económico', 'Horizonte', 'Resumen'][step-1]}</p>
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
              <div><label style={labelStyle}>Cantidad de Locales Requeridos</label><input type="number" style={inputStyle} value={form.cantidad_locales} onChange={e => update('cantidad_locales', e.target.value)} /></div>
            </div>
            <label style={labelStyle}>Actividad / Uso del Negocio</label>
            <input style={inputStyle} placeholder="Ej: Restaurante, Boutique, Oficina..." value={form.actividad} onChange={e => update('actividad', e.target.value)} />
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>📍 2. Especificaciones de Ubicación</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Ciudad / Municipio</label><input style={inputStyle} value={form.ciudad} onChange={e => update('ciudad', e.target.value)} /></div>
              <div><label style={labelStyle}>Barrio / Zona preferida</label><input style={inputStyle} value={form.barrio} onChange={e => update('barrio', e.target.value)} /></div>
            </div>
            <label style={labelStyle}>Zonas / Sectores aceptables</label>
            <input style={inputStyle} value={form.zonas_ok} onChange={e => update('zonas_ok', e.target.value)} />
            <label style={labelStyle}>Sectores NO aceptados</label>
            <input style={inputStyle} value={form.zonas_no} onChange={e => update('zonas_no', e.target.value)} />
            <label style={labelStyle}>Accesos requeridos</label>
            <div style={{ marginBottom: '16px' }}>
              {['Vía principal', 'Doble calzada', 'Centro Comercial', 'Isla', 'Plazoleta de comidas'].map(acc => (
                <Chip key={acc} label={acc} active={form.accesos.includes(acc)} onClick={() => toggleArray('accesos', acc)} />
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}> 3. Características del Inmueble</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Tipo de Negocio</label>
                <select style={inputStyle} value={form.tipo_negocio} onChange={e => update('tipo_negocio', e.target.value)}>
                  <option>Arriendo</option><option>Venta</option><option>Leasing comercial</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Uso del Suelo</label>
                <select style={inputStyle} value={form.uso_suelo} onChange={e => update('uso_suelo', e.target.value)}>
                  <option>Mixto</option><option>Comercial</option><option>Industrial</option><option>Residencial</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Área Total (m²)</label><input type="number" style={inputStyle} value={form.area_total} onChange={e => update('area_total', e.target.value)} /></div>
              <div><label style={labelStyle}>Área Construida (m²)</label><input type="number" style={inputStyle} value={form.area_construida} onChange={e => update('area_construida', e.target.value)} /></div>
              <div><label style={labelStyle}>Altura Libre Mín (m)</label><input type="number" style={inputStyle} value={form.altura} onChange={e => update('altura', e.target.value)} /></div>
            </div>
            <div><label style={labelStyle}>Parqueaderos mínimos</label><input type="number" style={inputStyle} value={form.parqueaderos} onChange={e => update('parqueaderos', e.target.value)} /></div>
            
            <label style={labelStyle}>Características Especiales</label>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '0.8rem', color: THEME.colors.textLight, marginTop: 0 }}>Acceso / Visibilidad:</p>
              {['Esquinero', 'Vía Principal', 'Vía Secundaria', 'Doble Frente'].map(c => <Chip key={c} label={c} active={form.caracteristicas.includes(c)} onClick={() => toggleArray('caracteristicas', c)} />)}
              <p style={{ fontSize: '0.8rem', color: THEME.colors.textLight }}>Configuración:</p>
              {['Doble Altura', 'Mezzanine', 'Sótano', 'Terraza / Patio'].map(c => <Chip key={c} label={c} active={form.caracteristicas.includes(c)} onClick={() => toggleArray('caracteristicas', c)} />)}
              <p style={{ fontSize: '0.8rem', color: THEME.colors.textLight }}>Instalaciones:</p>
              {['Extracción', 'Cocina industrial', 'Refrigeración', 'Carga eléctrica reforzada'].map(c => <Chip key={c} label={c} active={form.caracteristicas.includes(c)} onClick={() => toggleArray('caracteristicas', c)} />)}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>💰 4. Condiciones Económicas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Presupuesto máx. Compra ($)</label><input type="number" style={inputStyle} value={form.presupuesto_compra} onChange={e => update('presupuesto_compra', e.target.value)} /></div>
              <div><label style={labelStyle}>Canon máx. Arriendo ($)</label><input type="number" style={inputStyle} value={form.canon_arriendo} onChange={e => update('canon_arriendo', e.target.value)} /></div>
            </div>
            <div><label style={labelStyle}>Administración mensual máxima ($)</label><input type="number" style={inputStyle} value={form.admin} onChange={e => update('admin', e.target.value)} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Financiación</label>
                <select style={inputStyle} value={form.financiacion} onChange={e => update('financiacion', e.target.value)}>
                  <option>Ya aprobada</option><option>En trámite</option><option>No requiere</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Plazo del Contrato</label>
                <select style={inputStyle} value={form.plazo} onChange={e => update('plazo', e.target.value)}>
                  <option>3 años</option><option>5 años</option><option>10 años</option><option>Más de 10</option><option>Negociación abierta</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>⚑ 5. Horizonte de Decisión</h3>
            <label style={labelStyle}>Plazo para tomar la decisión</label>
            <select style={inputStyle} value={form.horizonte} onChange={e => update('horizonte', e.target.value)}>
              <option>Inmediato (0-1 mes)</option><option>Corto (1-3 meses)</option><option>Mediano (3-6 meses)</option><option>Largo (+6 meses)</option>
            </select>
            <label style={labelStyle}>Fecha estimada de cierre</label>
            <input type="date" style={inputStyle} value={form.fecha_cierre} onChange={e => update('fecha_cierre', e.target.value)} />
            <label style={labelStyle}>¿Qué condición aceleraría la decisión?</label>
            <input style={inputStyle} value={form.acelera} onChange={e => update('acelera', e.target.value)} />
            <label style={labelStyle}>¿Qué podría retrasar o cancelar la búsqueda?</label>
            <input style={inputStyle} value={form.retrasa} onChange={e => update('retrasa', e.target.value)} />
            <label style={labelStyle}>¿Revisa otras opciones en paralelo?</label>
            <select style={inputStyle} value={form.exclusiva} onChange={e => update('exclusiva', e.target.value)}>
              <option>No, gestión exclusiva Terramatch</option><option>Sí, con otros gestores</option><option>Sí, directamente con propietarios</option>
            </select>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>✍ 6. Resumen y Aceptación</h3>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: THEME.radius.md, marginBottom: '24px' }}>
              <p><strong>Segmentos:</strong> {form.segmentos.join(', ') || 'No seleccionados'}</p>
              <p><strong>Ubicación:</strong> {form.ciudad} - {form.barrio}</p>
              <p><strong>Inmueble:</strong> {form.tipo_negocio} | Uso: {form.uso_suelo} | Área: {form.area_total} m²</p>
              <p><strong>Presupuesto Arriendo:</strong> ${form.canon_arriendo} | <strong>Horizonte:</strong> {form.horizonte}</p>
            </div>
            <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight }}>Acepto los <a href={DOC_TERMINOS} target="_blank" style={{ color: THEME.colors.primary }}>Términos y Condiciones</a> y el Mandato de Pago de TerraMatch (30% comisión en cierre).</span>
            </label>
            <label style={labelStyle}>Observaciones adicionales</label>
            <textarea style={{ ...inputStyle, minHeight: '80px' }} value={form.observaciones} onChange={e => update('observaciones', e.target.value)} />
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
          {step > 1 && <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: '14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>Atrás</button>}
          {step < 6 ? (
            <button onClick={() => setStep(step + 1)} style={{ flex: 2, padding: '14px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Siguiente →</button>
          ) : (
            <button onClick={() => { showToast('¡IUB Generado! Buscando matches...'); onNavigate('dashboard'); }} style={{ flex: 2, padding: '14px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>✓ Generar IUB</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// OFERTA VIEW (TENGO LOCALES) - BASADO EN EXCEL
// ==========================================
function OfertaView({ user, supabase, showToast, onNavigate }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    segmentos: [], rol: '', nombre: '', id: '', contacto: '', email: '', ciudad: '',
    barrio: '', direccion: '', permiso: 'No cuenta',
    tipo_negocio: 'Arriendo', uso_suelo: 'Comercial', area_total: '', area_construida: '', altura: '', parqueaderos: '',
    caracteristicas: [], precio_venta: '', canon: '', admin: '', plazo: 'Negociación abierta',
    horizonte: 'Corto (1-3 meses)', fecha_cierre: '', acelera: '', retrasa: '', observaciones: ''
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

  const Dropzone = ({ title, subtitle }) => (
    <div style={{ border: '2px dashed #e2e8f0', borderRadius: THEME.radius.md, padding: '32px', textAlign: 'center', background: '#f8fafc', marginBottom: '16px', cursor: 'pointer' }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div>
      <h4 style={{ margin: '0 0 4px 0', color: THEME.colors.text }}>{title}</h4>
      <p style={{ margin: 0, color: THEME.colors.textLight, fontSize: '0.85rem' }}>{subtitle}</p>
    </div>
  );

  return (
    <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '40px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: THEME.colors.text, margin: '0 0 8px 0' }}>Indicador Único de Propiedad (IUP)</h2>
          <p style={{ color: THEME.colors.textLight, margin: 0 }}>Paso {step} de 6: {['Identificación', 'Ubicación', 'Características', 'Económico y Documentos', 'Horizonte', 'Resumen'][step-1]}</p>
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>👤 1. Identificación y Segmentos</h3>
            <Dropzone title="Carga Masiva de Inventario (Excel/CSV)" subtitle="Arrastra tu archivo aquí o haz clic para subir (Ideal para Inmobiliarias)" />
            <p style={{ textAlign: 'center', color: THEME.colors.textLight, margin: '24px 0' }}>- o completa el formulario manual -</p>
            
            <label style={labelStyle}>¿Qué segmentos manejas?</label>
            <div style={{ marginBottom: '24px' }}>
              {['Locales Comerciales', 'Bodegas', 'Oficinas'].map(seg => (
                <Chip key={seg} label={seg} active={form.segmentos.includes(seg)} onClick={() => toggleArray('segmentos', seg)} />
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Rol</label><select style={inputStyle} value={form.rol} onChange={e => update('rol', e.target.value)}><option>Propietario</option><option>Inmobiliaria</option><option>Agente Independiente</option></select></div>
              <div><label style={labelStyle}>Nombre / Empresa</label><input style={inputStyle} value={form.nombre} onChange={e => update('nombre', e.target.value)} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>ID (CC / NIT)</label><input style={inputStyle} value={form.id} onChange={e => update('id', e.target.value)} /></div>
              <div><label style={labelStyle}>Matrícula Inmobiliaria</label><input style={inputStyle} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Contacto / Teléfono</label><input style={inputStyle} value={form.contacto} onChange={e => update('contacto', e.target.value)} /></div>
              <div><label style={labelStyle}>Email</label><input style={inputStyle} value={form.email} onChange={e => update('email', e.target.value)} /></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>📍 2. Ubicación del Inmueble</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Ciudad / Municipio</label><input style={inputStyle} value={form.ciudad} onChange={e => update('ciudad', e.target.value)} /></div>
              <div><label style={labelStyle}>Barrio / Zona</label><input style={inputStyle} value={form.barrio} onChange={e => update('barrio', e.target.value)} /></div>
            </div>
            <label style={labelStyle}>Dirección del Inmueble</label>
            <input style={inputStyle} value={form.direccion} onChange={e => update('direccion', e.target.value)} />
            <label style={labelStyle}>Permiso de Construcción / Uso de Suelos</label>
            <select style={inputStyle} value={form.permiso} onChange={e => update('permiso', e.target.value)}>
              <option>Sí cuenta</option><option>No cuenta</option><option>En trámite</option>
            </select>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>🏢 3. Características del Inmueble</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Tipo de Negocio</label><select style={inputStyle} value={form.tipo_negocio} onChange={e => update('tipo_negocio', e.target.value)}><option>Arriendo</option><option>Venta</option><option>Leasing comercial</option></select></div>
              <div><label style={labelStyle}>Uso del Suelo</label><select style={inputStyle} value={form.uso_suelo} onChange={e => update('uso_suelo', e.target.value)}><option>Mixto</option><option>Comercial</option><option>Industrial</option><option>Residencial</option></select></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Área Total (m²)</label><input type="number" style={inputStyle} value={form.area_total} onChange={e => update('area_total', e.target.value)} /></div>
              <div><label style={labelStyle}>Área Construida (m²)</label><input type="number" style={inputStyle} value={form.area_construida} onChange={e => update('area_construida', e.target.value)} /></div>
              <div><label style={labelStyle}>Altura Libre (m)</label><input type="number" style={inputStyle} value={form.altura} onChange={e => update('altura', e.target.value)} /></div>
            </div>
            <div><label style={labelStyle}>Parqueaderos</label><input type="number" style={inputStyle} value={form.parqueaderos} onChange={e => update('parqueaderos', e.target.value)} /></div>
            
            <label style={labelStyle}>Características Especiales</label>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '0.8rem', color: THEME.colors.textLight, marginTop: 0 }}>Acceso / Visibilidad:</p>
              {['Esquinero', 'Vía Principal', 'Vía Secundaria', 'Doble Frente'].map(c => <Chip key={c} label={c} active={form.caracteristicas.includes(c)} onClick={() => toggleArray('caracteristicas', c)} />)}
              <p style={{ fontSize: '0.8rem', color: THEME.colors.textLight }}>Configuración:</p>
              {['Doble Altura', 'Mezzanine', 'Sótano', 'Terraza / Patio'].map(c => <Chip key={c} label={c} active={form.caracteristicas.includes(c)} onClick={() => toggleArray('caracteristicas', c)} />)}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>💰 4. Económico y Documentos</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Precio de Venta ($) o Precio/m²</label><input type="number" style={inputStyle} value={form.precio_venta} onChange={e => update('precio_venta', e.target.value)} /></div>
              <div><label style={labelStyle}>Canon de Arriendo mensual ($)</label><input type="number" style={inputStyle} value={form.canon} onChange={e => update('canon', e.target.value)} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Administración mensual ($)</label><input type="number" style={inputStyle} value={form.admin} onChange={e => update('admin', e.target.value)} /></div>
              <div><label style={labelStyle}>Plazo del Contrato</label><select style={inputStyle} value={form.plazo} onChange={e => update('plazo', e.target.value)}><option>3 años</option><option>5 años</option><option>10 años</option><option>Más de 10</option><option>Negociación abierta</option></select></div>
            </div>
            
            <h4 style={{ color: THEME.colors.text, marginTop: '24px' }}>📄 Documentos Disponibles</h4>
            <Dropzone title="Subir Planos del Local" subtitle="Formatos: Foto, PDF, JPG, DWG / CAD" />
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>⚑ 5. Horizonte de Decisión</h3>
            <label style={labelStyle}>Plazo para tomar la decisión</label>
            <select style={inputStyle} value={form.horizonte} onChange={e => update('horizonte', e.target.value)}>
              <option>Inmediato (0-1 mes)</option><option>Corto (1-3 meses)</option><option>Mediano (3-6 meses)</option><option>Largo (+6 meses)</option>
            </select>
            <label style={labelStyle}>Fecha estimada de cierre</label>
            <input type="date" style={inputStyle} value={form.fecha_cierre} onChange={e => update('fecha_cierre', e.target.value)} />
            <label style={labelStyle}>¿Qué condición aceleraría la decisión?</label>
            <input style={inputStyle} value={form.acelera} onChange={e => update('acelera', e.target.value)} />
            <label style={labelStyle}>¿Qué podría retrasar o cancelar?</label>
            <input style={inputStyle} value={form.retrasa} onChange={e => update('retrasa', e.target.value)} />
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 style={{ color: THEME.colors.primary }}>✍ 6. Resumen y Aceptación</h3>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: THEME.radius.md, marginBottom: '24px' }}>
              <p><strong>Segmentos:</strong> {form.segmentos.join(', ') || 'No seleccionados'}</p>
              <p><strong>Ubicación:</strong> {form.ciudad} - {form.barrio} ({form.direccion})</p>
              <p><strong>Inmueble:</strong> {form.tipo_negocio} | Uso: {form.uso_suelo} | Área: {form.area_total} m²</p>
              <p><strong>Canon Arriendo:</strong> ${form.canon} | <strong>Horizonte:</strong> {form.horizonte}</p>
            </div>
            <label style={labelStyle}>Observaciones adicionales</label>
            <textarea style={{ ...inputStyle, minHeight: '80px' }} value={form.observaciones} onChange={e => update('observaciones', e.target.value)} />
            <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer', marginTop: '16px' }}>
              <input type="checkbox" defaultChecked style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight }}>Acepto los Términos y Condiciones y autorizo a TerraMatch a gestionar mi inmueble.</span>
            </label>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
          {step > 1 && <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: '14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: THEME.radius.full, fontWeight: 600, cursor: 'pointer' }}>Atrás</button>}
          {step < 6 ? (
            <button onClick={() => setStep(step + 1)} style={{ flex: 2, padding: '14px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Siguiente →</button>
          ) : (
            <button onClick={() => { showToast('¡Inmueble Publicado!'); onNavigate('dashboard'); }} style={{ flex: 2, padding: '14px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>✓ Publicar Inmueble</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
