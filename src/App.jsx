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
        await loadProfile(session.user.id);
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

  async function loadProfile(userId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email;
      console.log("🔍 1. Email que vamos a buscar:", userEmail);
      
      if (!userEmail) {
        console.log("⚠️ 2. No hay email, usando fallback");
        setProfile({ nombre: 'Usuario', apellido: '' });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .single();
      
      console.log("📦 3. Respuesta de Supabase:", { data, error });

      if (data) {
        console.log("✅ 4. ¡Perfil encontrado! Nombre:", data.nombre);
        setProfile(data);
      } else {
        console.log("❌ 4. Perfil no encontrado. Error:", error);
        setProfile({ nombre: 'Usuario', apellido: '' });
      }
    } catch (error) {
      console.error("💥 5. Error catastrófico:", error);
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
  }

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Cargando TerraMatch...</div>;

  const safeName = profile?.nombre || 'Usuario';

  return (
    <div className="app">
      <nav style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #ECF0F1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, color: '#E74C3C', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setView('landing')}>terramatch</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontWeight: 600 }}>Hola, {safeName} (Debug Activo)</span>
              <button onClick={() => setView('dashboard')}>Dashboard</button>
              <button onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <button onClick={() => setView('login')}>Ingresar</button>
              <button onClick={() => setView('register')}>Regístrate</button>
            </>
          )}
        </div>
      </nav>

      {view === 'landing' && <div style={{padding: '50px', textAlign: 'center'}}><h1>Bienvenido a TerraMatch</h1><button onClick={() => setView('login')} style={{padding: '10px 20px', marginTop: '20px'}}>Ir a Ingresar</button></div>}
      
      {view === 'login' && (
        <div style={{padding: '50px', maxWidth: '400px', margin: '0 auto'}}>
          <h2>Iniciar Sesión</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) { alert(error.message); } 
            else { setUser(data.user); await loadProfile(data.user.id); setView('dashboard'); }
          }}>
            <input name="email" placeholder="Email" required style={{width: '100%', padding: '10px', marginBottom: '10px'}} />
            <input name="password" type="password" placeholder="Contraseña" required style={{width: '100%', padding: '10px', marginBottom: '10px'}} />
            <button type="submit" style={{width: '100%', padding: '10px', background: '#E74C3C', color: 'white'}}>Ingresar</button>
          </form>
        </div>
      )}

      {view === 'dashboard' && (
        <div style={{padding: '50px', maxWidth: '800px', margin: '0 auto'}}>
          <h2>Dashboard de {safeName}</h2>
          <p>Si ves tu nombre aquí, ¡lo logramos!</p>
          <div style={{background: '#f0f0f0', padding: '20px', borderRadius: '8px', marginTop: '20px'}}>
            <h3>Datos crudos del perfil:</h3>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        </div>
      )}
      
      {toast && <div style={{position: 'fixed', bottom: '20px', right: '20px', background: '#333', color: 'white', padding: '10px 20px', borderRadius: '5px'}}>{toast.message}</div>}
    </div>
  );
}

export default App;
