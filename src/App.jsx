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
      else setProfile({ nombre: 'Usuario', apellido: '', email: userEmail });
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile({ nombre: 'Usuario', apellido: '', email: userEmail });
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

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p>Cargando TerraMatch...</p></div>;

  const safeName = profile?.nombre || 'Usuario';
  const isAdmin = profile?.email === 'jcnieto.marketing@gmail.com';

  return (
    <div className="app">
      <Navbar nombre={safeName} isLoggedIn={!!user} isAdmin={isAdmin} onNavigate={setView} onLogout={handleLogout} />
      
      {view === 'landing' && <LandingView onNavigate={setView} />}
      {view === 'login' && <LoginView supabase={supabase} onSuccess={(u, email) => { setUser(u); loadProfile(email); setView('dashboard'); showToast('¡Bienvenido de vuelta!'); }} showToast={showToast} />}
      {view === 'iub' && user && <IUBView user={user} supabase={supabase} showToast={showToast} onNavigate={setView} />}
      {view === 'dashboard' && user && <DashboardView user={user} profile={profile} supabase={supabase} showToast={showToast} onNavigate={setView} />}
      {view === 'admin' && user && isAdmin && <AdminView supabase={supabase} showToast={showToast} />}
      
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
    <div style={{ padding: '100px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #D4E6F1 0%, white 100%)', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '20px', color: '#1a202c' }}>Hagamos Match entre tu <span style={{ color: '#E74C3C' }}>Inmueble</span> y el <span style={{ color: '#E74C3C' }}>Negocio Perfecto</span></h1>
      <p style={{ fontSize: '1.2rem', color: '#4A5568', marginBottom: '32px', maxWidth: '600px' }}>Locales · Vivienda · Oficinas · Industrial · Lujo.</p>
      <button onClick={() => onNavigate('login')} style={{ padding: '14px 32px', fontSize: '1rem', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Comenzar Ahora →</button>
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
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>{loading ? 'Entrando...' : 'Ingresar'}</button>
      </form>
    </div>
  );
}

// ==========================================
// IUB VIEW (Usuario)
// ==========================================
function IUBView({ user, supabase, showToast, onNavigate }) {
  const [form, setForm] = useState({ operacion: 'arrendar', ciudad: 'Bogotá', zona: 'Norte', tipo_inmueble: 'local', area: 100, presupuesto: 5000000 });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
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
      } else {
        showToast('IUB creado, pero no hay propiedades disponibles aún.');
      }
      onNavigate('dashboard');
    } catch (error) {
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
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Operación</label>
              <select value={form.operacion} onChange={e => setForm({...form, operacion: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <option value="arrendar">Arrendar</option><option value="comprar">Comprar</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Ciudad</label>
              <select value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <option value="Bogotá">Bogotá</option><option value="Medellín">Medellín</option><option value="Cali">Cali</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Zona</label>
            <select value={form.zona} onChange={e => setForm({...form, zona: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <option value="Norte">Norte</option><option value="Sur">Sur</option><option value="Centro">Centro</option>
            </select>
          </div>
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
// DASHBOARD VIEW (Usuario)
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
      const { data: iubsData } = await supabase.from('iubs').select('*').eq('user_id', user.id).order('creado_en', { ascending: false });
      setIubs(iubsData || []);
      const { data: matchesData } = await supabase.from('matches').select('*, propiedades(*)').eq('user_id', user.id).order('creado_en', { ascending: false });
      setMatches(matchesData || []);
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
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}><div style={{ fontSize: '2.2rem', fontWeight: 700 }}>{matches.length}</div><div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Matches Totales</div></div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}><div style={{ fontSize: '2.2rem', fontWeight: 700 }}>{matches.filter(m => m.estado === 'aceptado').length}</div><div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Aceptados</div></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'white', padding: '28px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Tus IUBs</h3>
            <button onClick={() => onNavigate('iub')} style={{ padding: '8px 16px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Nuevo IUB</button>
          </div>
          {iubs.length === 0 ? <p style={{ color: '#7F8C8D', textAlign: 'center', padding: '20px' }}>Aún no tienes IUBs.</p> : iubs.map(iub => (
            <div key={iub.id} style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #FF6B6B 100%)', color: 'white', padding: '20px', borderRadius: '12px', marginBottom: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{iub.segmento} · {iub.operacion}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800, margin: '12px 0', background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>{iub.codigo_iub}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{iub.ciudad}, {iub.zona} · {iub.area_min}m²</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', padding: '28px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
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
// ADMIN VIEW (Solo para jcnieto.marketing@gmail.com)
// ==========================================
function AdminView({ supabase, showToast }) {
  const [stats, setStats] = useState({ users: 0, iubs: 0, matches: 0, properties: 0 });
  const [users, setUsers] = useState([]);
  const [iubs, setIubs] = useState([]);
  const [properties, setProperties] = useState([]);
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

      const { data: iubsData } = await supabase.from('iubs').select('*').order('creado_en', { ascending: false });
      setIubs(iubsData || []);

      const { data: propData } = await supabase.from('propiedades').select('*').order('creado_en', { ascending: false });
      setProperties(propData || []);
    } catch (error) {
      console.error('Admin load error:', error);
      showToast('Error cargando datos de admin', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando Panel de Administración...</div>;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ background: '#1a202c', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
        <h2 style={{ color: 'white', marginBottom: '8px' }}>️ Panel de Administrador</h2>
        <p style={{ opacity: 0.8, margin: 0 }}>Gestión global de la plataforma TerraMatch</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #E74C3C' }}>
          <div style={{ color: '#7F8C8D', fontSize: '0.85rem', marginBottom: '8px' }}>USUARIOS TOTALES</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a202c' }}>{stats.users}</div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #3498db' }}>
          <div style={{ color: '#7F8C8D', fontSize: '0.85rem', marginBottom: '8px' }}>IUBs CREADOS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a202c' }}>{stats.iubs}</div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #27ae60' }}>
          <div style={{ color: '#7F8C8D', fontSize: '0.85rem', marginBottom: '8px' }}>MATCHES GENERADOS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a202c' }}>{stats.matches}</div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #f39c12' }}>
          <div style={{ color: '#7F8C8D', fontSize: '0.85rem', marginBottom: '8px' }}>PROPIEDADES ACTIVAS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a202c' }}>{stats.properties}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ECF0F1', paddingBottom: '10px' }}>
        <button onClick={() => setTab('overview')} style={{ padding: '10px 20px', background: tab === 'overview' ? '#1a202c' : 'white', color: tab === 'overview' ? 'white' : '#1a202c', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Resumen</button>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', background: tab === 'users' ? '#1a202c' : 'white', color: tab === 'users' ? 'white' : '#1a202c', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Usuarios</button>
        <button onClick={() => setTab('iubs')} style={{ padding: '10px 20px', background: tab === 'iubs' ? '#1a202c' : 'white', color: tab === 'iubs' ? 'white' : '#1a202c', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>IUBs</button>
        <button onClick={() => setTab('properties')} style={{ padding: '10px 20px', background: tab === 'properties' ? '#1a202c' : 'white', color: tab === 'properties' ? 'white' : '#1a202c', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Propiedades</button>
      </div>

      {/* Content */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {tab === 'overview' && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Actividad Reciente</h3>
            <p style={{ color: '#7F8C8D' }}>Bienvenido al panel de control. Aquí podrás gestionar todos los aspectos de TerraMatch.</p>
            <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ marginTop: 0 }}>📊 Métricas Clave</h4>
              <p>Tasa de conversión (IUBs a Matches): {stats.iubs > 0 ? ((stats.matches / stats.iubs) * 100).toFixed(1) : 0}%</p>
              <p>Promedio de matches por IUB: {stats.iubs > 0 ? (stats.matches / stats.iubs).toFixed(1) : 0}</p>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Usuarios Registrados ({users.length})</h3>
            {users.length === 0 ? <p>No hay usuarios registrados.</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '2px solid #ECF0F1', textAlign: 'left' }}><th style={{ padding: '12px' }}>Nombre</th><th style={{ padding: '12px' }}>Email</th><th style={{ padding: '12px' }}>Tipo</th><th style={{ padding: '12px' }}>Segmento</th></tr></thead>
                <tbody>{users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #ECF0F1' }}>
                    <td style={{ padding: '12px' }}>{u.nombre} {u.apellido}</td>
                    <td style={{ padding: '12px' }}>{u.email}</td>
                    <td style={{ padding: '12px' }}><span style={{ background: '#E74C3C', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>{u.tipo_usuario}</span></td>
                    <td style={{ padding: '12px', textTransform: 'capitalize' }}>{u.segmento_preferido}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'iubs' && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>IUBs Creados ({iubs.length})</h3>
            {iubs.length === 0 ? <p>No hay IUBs creados.</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '2px solid #ECF0F1', textAlign: 'left' }}><th style={{ padding: '12px' }}>Código IUB</th><th style={{ padding: '12px' }}>Ciudad</th><th style={{ padding: '12px' }}>Operación</th><th style={{ padding: '12px' }}>Área</th><th style={{ padding: '12px' }}>Presupuesto</th></tr></thead>
                <tbody>{iubs.map(i => (
                  <tr key={i.id} style={{ borderBottom: '1px solid #ECF0F1' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 600 }}>{i.codigo_iub}</td>
                    <td style={{ padding: '12px' }}>{i.ciudad} - {i.zona}</td>
                    <td style={{ padding: '12px', textTransform: 'capitalize' }}>{i.operacion}</td>
                    <td style={{ padding: '12px' }}>{i.area_min} m²</td>
                    <td style={{ padding: '12px' }}>${i.presupuesto_max?.toLocaleString('es-CO')}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'properties' && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Inventario de Propiedades ({properties.length})</h3>
            {properties.length === 0 ? <p>No hay propiedades en el inventario.</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '2px solid #ECF0F1', textAlign: 'left' }}><th style={{ padding: '12px' }}>Título</th><th style={{ padding: '12px' }}>Tipo</th><th style={{ padding: '12px' }}>Ciudad</th><th style={{ padding: '12px' }}>Área</th><th style={{ padding: '12px' }}>Precio</th><th style={{ padding: '12px' }}>Estado</th></tr></thead>
                <tbody>{properties.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #ECF0F1' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{p.titulo}</td>
                    <td style={{ padding: '12px', textTransform: 'capitalize' }}>{p.tipo_inmueble}</td>
                    <td style={{ padding: '12px' }}>{p.ciudad} - {p.zona}</td>
                    <td style={{ padding: '12px' }}>{p.area} m²</td>
                    <td style={{ padding: '12px' }}>${p.precio?.toLocaleString('es-CO')}</td>
                    <td style={{ padding: '12px' }}><span style={{ background: p.disponible ? '#27ae60' : '#e74c3c', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>{p.disponible ? 'Disponible' : 'No disponible'}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
