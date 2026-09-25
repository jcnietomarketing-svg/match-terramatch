import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .single();
      
      if (data) {
        setProfile(data);
      } else {
        setProfile({ nombre: 'Usuario', apellido: '' });
      }
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
      <nav style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #ECF0F1', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setView('landing')}>
            <div style={{ width: '40px', height: '40px', background: '#E74C3C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>TM</div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: '#E74C3C' }}>terramatch</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ fontWeight: 600, color: '#2C3E50' }}>Hola, {safeName}</span>
                <button className="btn btn-outline" onClick={() => setView('dashboard')}>Dashboard</button>
                <button className="btn btn-primary" onClick={handleLogout}>Salir</button>
              </>
            ) : (
              <>
                <button className="btn btn-outline" onClick={() => setView('login')}>Ingresar</button>
                <button className="btn btn-primary" onClick={() => setView('register')}>Regístrate</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {view === 'landing' && (
        <div style={{ padding: '100px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #D4E6F1 0%, white 100%)' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Hagamos Match entre tu <span style={{ color: '#E74C3C' }}>Inmueble</span> y el <span style={{ color: '#E74C3C' }}>Negocio Perfecto</span></h1>
          <p style={{ fontSize: '1.2rem', color: '#4A5568', marginBottom: '32px' }}>Locales · Vivienda · Oficinas · Industrial · Lujo.</p>
          <button className="btn btn-primary" onClick={() => setView('login')} style={{ padding: '14px 32px', fontSize: '1rem' }}>Comenzar Ahora →</button>
        </div>
      )}
      
      {view === 'login' && (
        <div style={{ padding: '50px', maxWidth: '400px', margin: '40px auto', background: 'white', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Iniciar Sesión</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) { showToast(error.message, 'error'); } 
            else { 
              setUser(data.user); 
              await loadProfile(email); 
              setView('dashboard'); 
              showToast(`¡Bienvenido, ${profile?.nombre || 'Usuario'}!`);
            }
          }}>
            <input name="email" placeholder="Email" required style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '8px' }} />
            <input name="password" type="password" placeholder="Contraseña" required style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '8px' }} />
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Ingresar</button>
          </form>
        </div>
      )}

      {view === 'dashboard' && (
        <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)', color: 'white', padding: '40px', borderRadius: '20px', marginBottom: '32px' }}>
            <h2 style={{ color: 'white', marginBottom: '8px' }}>Hola, {safeName} 👋</h2>
            <p style={{ opacity: 0.9 }}>Bienvenido a tu panel de control TerraMatch</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700 }}>0</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>IUBs Activos</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700 }}>0</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Matches</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '28px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '20px' }}>¡Tu perfil está conectado exitosamente!</h3>
            <p style={{ color: '#7F8C8D', marginBottom: '24px' }}>Ahora puedes comenzar a crear tu primer Indicador Único de Búsqueda (IUB).</p>
            <button className="btn btn-primary" onClick={() => setView('iub')} style={{ padding: '12px 24px', fontSize: '1rem' }}>+ Crear mi primer IUB</button>
          </div>
        </div>
      )}

      {view === 'iub' && (
        <div style={{ padding: '40px 24px', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Configura tu IUB</h2>
            <p style={{ textAlign: 'center', color: '#7F8C8D', marginBottom: '32px' }}>Indicador Único de Búsqueda</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              showToast('¡Funcionalidad de IUB en desarrollo! (Pero tu login funciona perfecto 🎉)', 'success');
              setTimeout(() => setView('dashboard'), 2000);
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Operación *</label>
                  <select style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <option>Arrendar</option>
                    <option>Comprar</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Ciudad *</label>
                  <select style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <option>Bogotá</option>
                    <option>Medellín</option>
                    <option>Cali</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', background: '#E74C3C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Generar IUB y Buscar Matches
              </button>
            </form>
          </div>
        </div>
      )}
      
      {toast && <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: toast.type === 'error' ? '#e74c3c' : '#27ae60', color: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>{toast.message}</div>}
    </div>
  );
}

export default App;
