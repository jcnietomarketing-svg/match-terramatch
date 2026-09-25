import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// CONFIGURACIÓN SUPABASE
// ==========================================
const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
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
      } else {
        setView('landing');
      }
    } catch (error) {
      console.error('Error session:', error);
      setView('landing');
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile(userEmail) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('email', userEmail).single();
      if (data) setProfile(data);
      else setProfile({ nombre: 'Usuario', apellido: '' });
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile({ nombre: 'Usuario', apellido: '' });
    }
  }

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setView('landing');
    showToast('Sesión cerrada');
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p>Cargando TerraMatch...</p></div>;
  }

  const safeName = profile?.nombre || 'Usuario';

  return (
    <div className="app">
      <Navbar nombre={safeName} isLoggedIn={!!user} onNavigate={setView} onLogout={handleLogout} />
      
      {view === 'landing' && <LandingView onNavigate={setView} />}
      {view === 'login' && <LoginView supabase={supabase} onSuccess={(u, email) => { setUser(u); loadProfile(email); setView('dashboard'); showToast('¡Bienvenido de vuelta!'); }} showToast={showToast} />}
      {view === 'iub' && user && <IUBView user={user} supabase={supabase} showToast={showToast} onNavigate={setView} />}
      {view === 'dashboard' && user && <DashboardView user={user} profile={profile} supabase={supabase} showToast={showToast} onNavigate={setView} />}
      
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}

// ==========================================
// NAVBAR
// ==========================================
function Navbar({ nombre, isLoggedIn, onNavigate, onLogout }) {
  return (
    <nav style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #ECF0F1', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onNavigate('landing')}>
          <div style={{ width: '40px', height: '40px', background: '#E74C3C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>TM</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: '#E74C3C' }}>terramatch</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              <span style={{ fontWeight: 600, color: '#2C3E50' }}>Hola, {nombre}</span>
              <button className="btn btn-outline" onClick={() => onNavigate('dashboard')}>Dashboard</button>
              <button className="btn btn-primary" onClick={onLogout}>Salir</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => onNavigate('login')}>Ingresar</button>
              <button className="btn btn-primary" onClick={() => onNavigate('register')}>Regístrate</button>
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
    <div style={{ padding: '100px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #D4E6F1 0%, white 100%)' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '20px' }}>Hagamos Match entre tu <span style={{ color: '#E74C3C' }}>Inmueble</span> y el <span style={{ color: '#E74C3C' }}>Negocio Perfecto</span></h1>
      <p style={{ fontSize: '1.2rem', color: '#4A5568', marginBottom: '32px' }}>Locales · Vivienda · Oficinas · Industrial · Lujo.</p>
      <button className="btn btn-primary" onClick={() => onNavigate('login')} style={{ padding: '14px 32px', fontSize: '1rem' }}>Comenzar Ahora →</button>
    </div>
  );
}

// ==========================================
// LOGIN VIEW
// ==========================================
function LoginView({ supabase, onSuccess, showToast }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) throw error;
      onSuccess(data.user, form.email);
    } catch (error) {
      showToast(error.message || 'Credenciales incorrectas', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '40px auto', background: 'white', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-input" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{marginBottom: '16px'}} />
        <input className="form-input" type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{marginBottom: '16px'}} />
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '14px' }}>{loading ? 'Entrando...' : 'Ingresar'}</button>
      </form>
    </div>
  );
}

// ==========================================
// IUB VIEW (LÓGICA COMPLETA)
// ==========================================
function IUBView({ user, supabase, showToast, onNavigate }) {
  const [form, setForm] = useState({ operacion: 'arrendar', ciudad: 'Bogotá', zona: 'Norte', tipo_inmueble: 'local', area: 100, presupuesto: 5000000 });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Generar código único IUB
      const prefix = form.operacion === 'comprar' ? 'V' : 'A';
      const codigoIub = `TM-${prefix}-LOC-${form.ciudad.substring(0,3).toUpperCase()}-${form.zona.substring(0,3).toUpperCase()}-${Math.floor(form.area/10)}-${Math.floor(form.presupuesto/1000)}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;

      // 2. Guardar IUB en la base de datos
      const { data: iub, error: iubError } = await supabase.from('iubs').insert([{
        user_id: user.id,
        codigo_iub: codigoIub,
        segmento: 'locales',
        operacion: form.operacion,
        ciudad: form.ciudad,
        zona: form.zona,
        area_min: form.area,
        presupuesto_max: form.presupuesto,
        tipo_inmueble: form.tipo_inmueble
      }]).select().single();

      if (iubError) throw iubError;

      // 3. Buscar propiedades que hagan match (Motor de Matching)
      const { data: propiedades, error: propError } = await supabase.from('propiedades')
        .select('*')
        .eq('segmento', 'locales')
        .eq('operacion', form.operacion)
        .eq('disponible', true)
        .eq('ciudad', form.ciudad);

      if (propError) throw propError;

      // 4. Crear registros de Match con score aleatorio (70% - 99%) para el MVP
      if (propiedades && propiedades.length > 0) {
        const matches = propiedades.map(prop => ({
          iub_id: iub.id,
          propiedad_id: prop.id,
          user_id: user.id,
          score: Math.floor(Math.random() * 30) + 70,
          estado: 'pendiente'
        }));
        await supabase.from('matches').insert(matches);
        showToast(`¡IUB creado! Se encontraron ${matches.length} matches potenciales.`);
      } else {
        showToast('IUB creado, pero no hay propiedades disponibles con esos criterios aún.', 'success');
      }

      onNavigate('dashboard');
    } catch (error) {
      console.error('Error creando IUB:', error);
      showToast(error.message || 'Error al crear IUB', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Configura tu IUB</h2>
        <p style={{ textAlign: 'center', color: '#7F8C8D', marginBottom: '32px' }}>Indicador Único de Búsqueda</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Operación *</label>
              <select className="form-select" value={form.operacion} onChange={e => setForm({...form, operacion: e.target.value})}>
                <option value="arrendar">Arrendar</option>
                <option value="comprar">Comprar</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ciudad *</label>
              <select className="form-select" value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})}>
                <option value="Bogotá">Bogotá</option>
                <option value="Medellín">Medellín</option>
                <option value="Cali">Cali</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{marginBottom: '16px'}}>
            <label className="form-label">Zona *</label>
            <select className="form-select" value={form.zona} onChange={e => setForm({...form, zona: e.target.value})}>
              <option value="Norte">Norte</option>
              <option value="Sur">Sur</option>
              <option value="Centro">Centro</option>
            </select>
          </div>
          <div className="slider-group" style={{marginBottom: '24px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span>Área mínima (m²)</span>
              <span style={{fontWeight: 'bold'}}>{form.area} m²</span>
            </div>
            <input type="range" min="20" max="2000" step="10" value={form.area} onChange={e => setForm({...form, area: parseInt(e.target.value)})} style={{width: '100%'}} />
          </div>
          <div className="slider-group" style={{marginBottom: '32px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span>Presupuesto máximo</span>
              <span style={{fontWeight: 'bold'}}>${form.presupuesto.toLocaleString('es-CO')} COP</span>
            </div>
            <input type="range" min="500000" max="50000000" step="500000" value={form.presupuesto} onChange={e => setForm({...form, presupuesto: parseInt(e.target.value)})} style={{width: '100%'}} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '14px' }}>
            {loading ? 'Generando y Buscando...' : 'Generar IUB y Buscar Matches'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD VIEW (LÓGICA COMPLETA)
// ==========================================
function DashboardView({ user, profile, supabase, showToast, onNavigate }) {
  const [iubs, setIubs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const safeName = profile?.nombre || 'Usuario';

  useEffect(() => { if (user) loadData(); }, [user]);

  async function loadData() {
    try {
      setLoading(true);
      // Cargar IUBs del usuario
      const { data: iubsData } = await supabase.from('iubs').select('*').eq('user_id', user.id).order('creado_en', { ascending: false });
      setIubs(iubsData || []);

      // Cargar Matches del usuario con los datos de la propiedad
      const { data: matchesData } = await supabase.from('matches')
        .select('*, propiedades(*)')
        .eq('user_id', user.id)
        .order('creado_en', { ascending: false });
      setMatches(matchesData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateMatchStatus(matchId, estado) {
    try {
      await supabase.from('matches').update({ estado }).eq('id', matchId);
      showToast(`Match ${estado === 'aceptado' ? 'Aceptado' : 'Rechazado'}`);
      loadData(); // Recargar para ver el cambio
    } catch (error) {
      showToast('Error actualizando match', 'error');
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}><p>Cargando Dashboard...</p></div>;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Banner de Bienvenida */}
      <div style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)', color: 'white', padding: '40px', borderRadius: '20px', marginBottom: '32px' }}>
        <h2 style={{ color: 'white', marginBottom: '8px' }}>Hola, {safeName} 👋</h2>
        <p style={{ opacity: 0.9 }}>Bienvenido a tu panel de control TerraMatch</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700 }}>{iubs.length}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>IUBs Activos</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700 }}>{matches.length}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Matches Totales</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700 }}>{matches.filter(m => m.estado === 'aceptado').length}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Aceptados</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Columna 1: Tus IUBs */}
        <div style={{ background: 'white', padding: '28px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Tus IUBs</h3>
            <button className="btn btn-primary" onClick={() => onNavigate('iub')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>+ Nuevo IUB</button>
          </div>
          {iubs.length === 0 ? (
            <p style={{ color: '#7F8C8D', textAlign: 'center', padding: '20px' }}>Aún no tienes IUBs. Crea el primero para comenzar a recibir matches.</p>
          ) : (
            iubs.map(iub => (
              <div key={iub.id} style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #FF6B6B 100%)', color: 'white', padding: '20px', borderRadius: '12px', marginBottom: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{iub.segmento} · {iub.operacion}</div>
                <div style={{ fontFamily: 'Courier New, monospace', fontSize: '1.2rem', fontWeight: 800, margin: '12px 0', background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>{iub.codigo_iub}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{iub.ciudad}, {iub.zona} · {iub.area_min}m²</div>
              </div>
            ))
          )}
        </div>

        {/* Columna 2: Matches Recientes */}
        <div style={{ background: 'white', padding: '28px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: '20px' }}>Matches Recientes</h3>
          {matches.length === 0 ? (
            <p style={{ color: '#7F8C8D', textAlign: 'center', padding: '20px' }}>Configura un IUB para comenzar a recibir matches.</p>
          ) : (
            matches.map(match => (
              <div key={match.id} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '2px solid #ECF0F1', marginBottom: '12px', display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: match.score >= 85 ? '#27ae60' : '#f39c12', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                  {match.score}%
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '4px', textTransform: 'capitalize' }}>{match.propiedades?.tipo_inmueble || 'Inmueble'} en {match.propiedades?.zona}</h4>
                  <p style={{ color: '#7F8C8D', fontSize: '0.85rem' }}>{match.propiedades?.area} m² · ${match.propiedades?.precio?.toLocaleString('es-CO')}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {match.estado === 'pendiente' ? (
                    <>
                      <button className="btn btn-primary" onClick={() => updateMatchStatus(match.id, 'aceptado')} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Aceptar</button>
                      <button className="btn btn-outline" onClick={() => updateMatchStatus(match.id, 'rechazado')} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Rechazar</button>
                    </>
                  ) : (
                    <span style={{ color: match.estado === 'aceptado' ? '#27ae60' : '#e74c3c', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      {match.estado === 'aceptado' ? '✓ Aceptado' : '✗ Rechazado'}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
