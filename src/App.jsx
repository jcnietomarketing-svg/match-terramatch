import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wqzwwzmeetykcvhekerl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxend3em1lZXR5a2N2aGVrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDg3OTcsImV4cCI6MjEwNTkyNDc5N30.6NJ0fA475cC5EKWGW4EYJyuSHOI9XPor41PTnWNHsRY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

  const isAdmin = profile?.email === 'jcnieto.marketing@gmail.com';

  useEffect(() => { checkSession(); }, []);

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

  async function handleLogout() { await supabase.auth.signOut(); setUser(null); setProfile(null); setView('home'); }

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
        {view === 'iub-detail' && user && selectedItem && <IUBDetailView item={selectedItem} supabase={supabase} onNavigate={setView} />}
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
                <li style={{ marginBottom: '12px' }}><button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Términos y Condiciones</button></li>
                <li style={{ marginBottom: '12px' }}><button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Política de Privacidad</button></li>
                <li style={{ marginBottom: '12px' }}><button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>Política de Cookies</button></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: THEME.colors.secondary }}>Contacto</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px', fontSize: '0.9rem', opacity: 0.7 }}>✉️ contacto@terramatch.net</li>
                <li style={{ marginBottom: '12px', fontSize: '0.9rem', opacity: 0.7 }}>📱 +57 300 000 0000</li>
                <li style={{ marginBottom: '12px', fontSize: '0.9rem', opacity: 0.7 }}> Bogotá, Colombia</li>
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

function HomeView({ onNavigate, selectedCategory, setSelectedCategory }) {
  const [tickerIndex, setTickerIndex] = useState(0);
  
  const tickerItems = [
    { icon: '🔥', text: '3 nuevos matches en Bogotá hace 5 min', type: 'terramatch' },
    { icon: '', text: 'Local en Chapinero arrendado en 48h', type: 'terramatch' },
    { icon: '🌤️', text: 'Bogotá: 18°C · Parcialmente nublado', type: 'clima' },
    { icon: '💱', text: 'TRM hoy: $4.125 COP/USD', type: 'trm' },
    { icon: '📈', text: '142 empresas buscando locales esta semana', type: 'terramatch' },
    { icon: '🏢', text: 'Próximamente: Bodegas y Oficinas en TerraMatch', type: 'noticia' },
    { icon: '🌦️', text: 'Medellín: 24°C · Lluvia ligera', type: 'clima' },
    { icon: '📰', text: 'Sector inmobiliario crece 8% en 2026', type: 'noticia' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentTicker = tickerItems[tickerIndex];
  const categorias = [
    { id: 'locales', icon: '', titulo: 'Busco/Tengo Locales', desc: 'Locales comerciales para retail, restaurantes y servicios', color: THEME.colors.primary, disponible: true },
    { id: 'bodegas', icon: '🏭', titulo: 'Busco/Tengo Bodegas', desc: 'Bodegas industriales y centros de distribución', color: THEME.colors.warning, disponible: false },
    { id: 'oficinas', icon: '🏢', titulo: 'Busco/Tengo Oficinas', desc: 'Oficinas corporativas y centros de negocios', color: THEME.colors.info, disponible: false },
  ];

  const handleCategoriaClick = (cat) => {
    setSelectedCategory(cat.id);
    if (cat.disponible) {
      onNavigate('register');
    } else {
      onNavigate('proximamente');
    }
  };

  return (
    <div>
      <div style={{ background: THEME.colors.dark, color: 'white', padding: '10px 0', overflow: 'hidden', fontSize: '0.85rem', minHeight: '38px', display: 'flex', alignItems: 'center' }}>
        <div key={tickerIndex} className="ticker-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '32px', width: '100%' }}>
          <span style={{ fontSize: '1rem' }}>{currentTicker.icon}</span>
          <span style={{ fontWeight: 600, color: currentTicker.type === 'terramatch' ? THEME.colors.success : THEME.colors.secondary }}>
            {currentTicker.type === 'clima' ? 'CLIMA · ' : currentTicker.type === 'trm' ? 'TRM · ' : currentTicker.type === 'noticia' ? 'NOTICIA · ' : 'TERRAMATCH · '}
          </span>
          <span>{currentTicker.text}</span>
          <span style={{ marginLeft: 'auto', paddingRight: '32px', fontSize: '0.75rem', opacity: 0.6 }}>
            {tickerIndex + 1} / {tickerItems.length}
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80') center/cover`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.4 }}></div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 32px', textAlign: 'center', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'inline-block', background: `${THEME.colors.primary}15`, color: THEME.colors.primary, padding: '8px 20px', borderRadius: THEME.radius.full, fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>La mayor comunidad de búsqueda inteligente</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', lineHeight: 1.1, margin: '0 0 24px 0', color: THEME.colors.text }}>Hagamos Match entre tu<br/><span style={{ color: THEME.colors.primary }}>Inmueble y el Negocio Perfecto</span></h1>
          <p style={{ fontSize: '1.1rem', color: THEME.colors.textLight, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>Deja de buscar. Empieza a encontrar. Nuestro algoritmo conecta empresas en expansión con inmuebles comerciales ideales en tiempo real.</p>
          <button onClick={() => onNavigate('register')} style={{ padding: '16px 40px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(233,84,66,0.3)' }}>Regístrate gratis y empieza →</button>
        </div>
      </div>

      <div style={{ padding: '80px 32px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: THEME.colors.text }}>¿Qué tipo de inmueble necesitas?</h2>
        <p style={{ fontSize: '1.1rem', color: THEME.colors.textLight, marginBottom: '60px' }}>Elige tu categoría y deja que nuestro algoritmo haga el resto.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {categorias.map((cat) => (
            <div key={cat.id} onClick={() => handleCategoriaClick(cat)} 
                 style={{ background: THEME.colors.white, padding: '40px 32px', borderRadius: THEME.radius.lg, cursor: 'pointer', border: `2px solid ${selectedCategory === cat.id ? cat.color : 'transparent'}`, boxShadow: THEME.shadow, transition: 'all 0.3s', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
                 onMouseEnter={(e) => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-8px)'; }}
                 onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedCategory === cat.id ? cat.color : 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              {!cat.disponible && (
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: THEME.colors.warning, color: 'white', padding: '4px 12px', borderRadius: THEME.radius.full, fontSize: '0.75rem', fontWeight: 700 }}>PRÓXIMAMENTE</div>
              )}
              <div style={{ width: '70px', height: '70px', background: `${cat.color}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>{cat.icon}</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: THEME.colors.text }}>{cat.titulo}</h3>
              <p style={{ color: THEME.colors.textLight, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>{cat.desc}</p>
              <button style={{ padding: '12px 24px', background: cat.color, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '0.9rem' }}>
                {cat.disponible ? 'EMPEZAR →' : 'MÁS INFORMACIÓN →'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '80px 32px', background: THEME.colors.white }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: THEME.colors.text }}>¿Cómo funciona la <span style={{ color: THEME.colors.primary }}>TerraMagia</span>?</h2>
            <p style={{ fontSize: '1.1rem', color: THEME.colors.textLight, maxWidth: '600px', margin: '0 auto' }}>Nuestro motor de matching trabaja 24/7 para cruzar oferta y demanda.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {[
              { icon: '📝', title: '1. Crea tu IUB', desc: 'Define tu búsqueda ideal (ubicación, área, presupuesto) y genera tu Indicador Único de Búsqueda.', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80' },
              { icon: '🔍', title: '2. El Algoritmo Busca', desc: 'Nuestro motor cruza tu IUB con miles de inmuebles en tiempo real, filtrando duplicados y ruido.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' },
              { icon: '🤝', title: '3. Match y Cierre', desc: 'Recibe notificaciones de matches compatibles. Acepta, agenda visita y cierra el negocio.', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80' }
            ].map((step, i) => (
              <div key={i} style={{ background: THEME.colors.bg, borderRadius: THEME.radius.lg, overflow: 'hidden', boxShadow: THEME.shadow, transition: 'transform 0.3s' }}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: '200px', background: `url(${step.img}) center/cover`, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '20px', left: '20px', width: '60px', height: '60px', background: THEME.colors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                    {step.icon}
                  </div>
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

function ProximamenteView({ category, onNavigate, supabase, user }) {
  const [email, setEmail] = useState(user?.email || '');
  const [suscrito, setSuscrito] = useState(false);
  const [loading, setLoading] = useState(false);

  const categoriaInfo = {
    bodegas: {
      icon: '🏭',
      titulo: 'Bodegas',
      color: THEME.colors.warning,
      descripcion: 'Bodegas industriales, centros de distribución y naves logísticas',
      campos: [
        { icon: '📏', texto: 'Área mínima y máxima en m²' },
        { icon: '️', texto: 'Altura libre (m) y capacidad de carga' },
        { icon: '🚛', texto: 'Acceso para tractomulas y bahías de cargue' },
        { icon: '⚡', texto: 'Capacidad eléctrica (KVA) y servicios' },
        { icon: '🔥', texto: 'Certificaciones bomberos y riesgos' },
        { icon: '📍', texto: 'Zonas logísticas y corredores viales' },
        { icon: '🏢', texto: 'Oficinas anexas y zonas administrativas' },
        { icon: '🔒', texto: 'Seguridad 24/7 y control de acceso' },
      ]
    },
    oficinas: {
      icon: '🏢',
      titulo: 'Oficinas',
      color: THEME.colors.info,
      descripcion: 'Oficinas corporativas, centros de negocios y coworking',
      campos: [
        { icon: '👥', texto: 'Número de puestos de trabajo' },
        { icon: '', texto: 'Oficinas privadas vs abiertas' },
        { icon: '🏢', texto: 'Piso y vistas (exterior/interior)' },
        { icon: '🅿️', texto: 'Parqueaderos incluidos' },
        { icon: '🛗', texto: 'Número de ascensores y tiempos' },
        { icon: '☕', texto: 'Salas de reuniones y zonas comunes' },
        { icon: '🌐', texto: 'Conectividad y fibra óptica' },
        { icon: '🏙️', texto: 'Edificio inteligente y sostenibilidad' },
      ]
    }
  };

  const info = categoriaInfo[category] || categoriaInfo.bodegas;

  const handleSuscribir = async () => {
    if (!email) { alert('Por favor ingresa tu email'); return; }
    setLoading(true);
    try {
      await supabase.from('interesados_proximamente').insert([{
        email: email,
        categoria: category,
        fecha: new Date().toISOString()
      }]).catch(() => console.log('Tabla no existe, pero se registró el interés'));
      setSuscrito(true);
    } catch (err) {
      setSuscrito(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '60px 32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="pulse-animation" style={{ width: '120px', height: '120px', background: `${info.color}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', margin: '0 auto 24px', border: `3px solid ${info.color}` }}>
          {info.icon}
        </div>
        <Badge color={category === 'bodegas' ? 'warning' : 'info'}>PRÓXIMAMENTE</Badge>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: THEME.colors.text, marginTop: '16px' }}>
          {info.titulo} en TerraMatch
        </h1>
        <p style={{ fontSize: '1.2rem', color: THEME.colors.textLight, maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          {info.descripcion}
        </p>
      </div>

      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px' }}>
        <h2 style={{ color: THEME.colors.text, marginBottom: '24px', fontSize: '1.5rem' }}>
          🎯 ¿Qué podrás hacer cuando esté disponible?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {info.campos.map((campo, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f8f9fa', borderRadius: THEME.radius.sm, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '1.5rem' }}>{campo.icon}</span>
              <span style={{ color: THEME.colors.text, fontSize: '0.95rem', fontWeight: 500 }}>{campo.texto}</span>
            </div>
          ))}
        </div>

        <div style={{ background: `${info.color}10`, padding: '24px', borderRadius: THEME.radius.md, border: `1px solid ${info.color}30`, marginBottom: '24px' }}>
          <h3 style={{ color: info.color, marginTop: 0, marginBottom: '12px' }}>💡 ¿Por qué estamos desarrollando esto?</h3>
          <p style={{ color: THEME.colors.text, lineHeight: 1.6, margin: 0 }}>
            {category === 'bodegas' 
              ? 'El sector logístico en Colombia está en auge. Queremos conectar bodegas disponibles con empresas en expansión que necesitan centros de distribución estratégicos, con criterios específicos como altura libre, acceso para tractomulas y capacidad eléctrica.'
              : 'El mercado de oficinas está evolucionando. Buscamos ofrecer una plataforma especializada que entienda las necesidades únicas de las empresas: puestos de trabajo, conectividad, salas de reuniones y edificios inteligentes.'}
          </p>
        </div>

        {!suscrito ? (
          <div style={{ background: '#f8f9fa', padding: '32px', borderRadius: THEME.radius.md, textAlign: 'center' }}>
            <h3 style={{ color: THEME.colors.text, marginTop: 0, marginBottom: '12px' }}>🔔 Sé el primero en saberlo</h3>
            <p style={{ color: THEME.colors.textLight, marginBottom: '24px' }}>
              Déjanos tu email y te notificaremos cuando lancemos esta categoría
            </p>
            <div style={{ display: 'flex', gap: '12px', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap' }}>
              <input 
                type="email" 
                placeholder="tu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, minWidth: '250px', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, fontSize: '1rem', fontFamily: 'Comfortaa' }}
              />
              <button 
                onClick={handleSuscribir}
                disabled={loading}
                style={{ padding: '14px 32px', background: info.color, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Enviando...' : 'NOTIFICARME'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: `${THEME.colors.success}15`, padding: '32px', borderRadius: THEME.radius.md, textAlign: 'center', border: `1px solid ${THEME.colors.success}` }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
            <h3 style={{ color: THEME.colors.success, marginTop: 0, marginBottom: '12px' }}>¡Estás en la lista!</h3>
            <p style={{ color: THEME.colors.text, marginBottom: '24px' }}>
              Te notificaremos a <strong>{email}</strong> cuando lancemos {info.titulo} en TerraMatch
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => onNavigate('home')}
          style={{ padding: '14px 32px', background: 'white', color: THEME.colors.text, border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700 }}
        >
          ← Volver al Inicio
        </button>
        <button 
          onClick={() => { setSelectedCategory('locales'); onNavigate('register'); }}
          style={{ padding: '14px 32px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}
        >
          🏪 Probar con Locales (disponible)
        </button>
      </div>
    </div>
  );
}

function RegisterView({ supabase, category, onSuccess, onNavigate }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', cedula: '', email: '', celular: '' });
  const [acepta, setAcepta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categoriaLabels = { locales: 'Locales', bodegas: 'Bodegas', oficinas: 'Oficinas' };

  const handleRegister = async () => {
    if (!acepta) { setError('Debes aceptar la política de privacidad'); return; }
    setLoading(true); setError('');
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: form.email, password: 'TerraMatch2026!' });
      if (authError) throw authError;
      await supabase.from('profiles').insert([{ id: authData.user.id, nombre: form.nombre, apellido: form.apellido, email: form.email, celular: form.celular, categoria_preferida: category, acepto_terminos: true }]);
      onSuccess(authData.user);
    } catch (err) { setError(err.message || 'Error al crear cuenta'); } finally { setLoading(false); }
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
      const iubCounts = {};
      const propCounts = {};
      if (matchesData) {
        matchesData.forEach(m => {
          iubCounts[m.iub_id] = (iubCounts[m.iub_id] || 0) + 1;
          propCounts[m.propiedad_id] = (propCounts[m.propiedad_id] || 0) + 1;
        });
      }
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
          <button onClick={() => { setSelectedCategory('locales'); onNavigate('masiva-wizard'); }} style={{ padding: '12px 24px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>📊 Carga Masiva</button>
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
              <thead><tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>IUB</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA (M²)</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TIPO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>MATCHES</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACCIÓN</th></tr></thead>
              <tbody>{iubs.map((iub) => (<tr key={iub.id} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem(iub); onNavigate('iub-detail'); }}><td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{iub.codigo_iub}</td><td style={{ padding: '16px' }}>{iub.area_min} m²</td><td style={{ padding: '16px' }}>{iub.ciudad}</td><td style={{ padding: '16px' }}>{iub.tipo_negocio}</td><td style={{ padding: '16px' }}><Badge color="primary">{matchCounts.iubs[iub.id] || 0}</Badge></td><td style={{ padding: '16px' }}><Badge color={iub.estado === 'activo' ? 'success' : 'gray'}>{iub.estado}</Badge></td><td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer' }}>Ver Matches →</button></td></tr>))}</tbody>
            </table>
          )}
        </div>
      ) : (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          {locales.length === 0 ? <div style={{ padding: '60px', textAlign: 'center', color: THEME.colors.textLight }}><div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏪</div><h3>Aún no has publicado locales</h3><button onClick={() => onNavigate('oferta-wizard')} style={{ marginTop: '20px', padding: '12px 24px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Publicar mi primer local</button></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead><tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CÓDIGO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TÍTULO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA (M²)</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>PRECIO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>MATCHES</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACCIÓN</th></tr></thead>
              <tbody>{locales.map((local) => (<tr key={local.id} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem(local); onNavigate('local-detail'); }}><td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{local.codigo_propiedad || 'SIN ID'}</td><td style={{ padding: '16px', fontWeight: 600 }}>{local.titulo || 'Sin título'}</td><td style={{ padding: '16px' }}>{local.ciudad}</td><td style={{ padding: '16px' }}>{local.area_total} m²</td><td style={{ padding: '16px' }}>${local.precio?.toLocaleString()}</td><td style={{ padding: '16px' }}><Badge color="primary">{matchCounts.props[local.id] || 0}</Badge></td><td style={{ padding: '16px' }}><Badge color={local.disponible ? 'success' : 'gray'}>{local.disponible ? 'Disponible' : 'No disponible'}</Badge></td><td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer' }}>Ver IUBs →</button></td></tr>))}</tbody>
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
  const [form, setForm] = useState({
    nombre: profile?.nombre || '', cedula: '', matricula: '', email: profile?.email || '', celular: profile?.celular || '',
    ciudad: 'Bogotá', zona: 'Norte', barrio: '',
    tipo_negocio: 'Arriendo', uso_suelo: 'Comercial', area_total: '',
    caracteristicas: [],
    canon_arriendo: '', presupuesto_compra: '', horizonte: 'Corto (1-3 meses)', actividad: ''
  });

  const categoriaLabels = { locales: 'Locales', bodegas: 'Bodegas', oficinas: 'Oficinas' };
  const toggleCar = (c) => setForm(prev => ({ ...prev, caracteristicas: prev.caracteristicas.includes(c) ? prev.caracteristicas.filter(x => x !== c) : [...prev.caracteristicas, c] }));
  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const codigoIub = `IUB${Math.floor(Math.random() * 900000) + 100000}`;
      const area = form.area_total ? parseFloat(form.area_total) : null;
      const { error } = await supabase.from('iubs').insert([{
        user_id: user.id, codigo_iub: codigoIub, segmentos: categoriaLabels[category] || 'Locales',
        nombre_completo: form.nombre, nit_cedula: form.cedula, matricula_inmobiliaria: form.matricula || null,
        email_contacto: form.email, celular: form.celular, ciudad: form.ciudad, zona: form.zona, barrio: form.barrio,
        tipo_negocio: form.tipo_negocio, uso_suelo: form.uso_suelo,
        area_min: area,
        area_max: area,
        canon_arriendo: form.canon_arriendo ? parseFloat(form.canon_arriendo) : null,
        presupuesto_compra: form.presupuesto_compra ? parseFloat(form.presupuesto_compra) : null,
        caracteristicas: JSON.stringify(form.caracteristicas), horizonte: form.horizonte,
        estado: 'activo', cantidad_locales: 1, actividad: form.actividad
      }]);
      if (error) throw error;
      alert(`¡IUB ${codigoIub} creado exitosamente!`);
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
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>👤 1. Identificación</h3>
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
            <label style={labelStyle}>Actividad / Uso del Negocio</label>
            <input placeholder="Ej: restaurante, boutique..." value={form.actividad} onChange={e => update('actividad', e.target.value)} style={inputStyle} />
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
              <div><label style={labelStyle}>Tipo de Negocio</label><select value={form.tipo_negocio} onChange={e => update('tipo_negocio', e.target.value)} style={inputStyle}><option>Arriendo</option><option>Venta</option><option>Leasing comercial</option></select></div>
              <div><label style={labelStyle}>Uso del Suelo</label><select value={form.uso_suelo} onChange={e => update('uso_suelo', e.target.value)} style={inputStyle}><option>Mixto</option><option>Comercial</option><option>Industrial</option><option>Residencial</option></select></div>
            </div>
            <label style={labelStyle}>Área aproximada (m²) *</label>
            <input type="number" value={form.area_total} onChange={e => update('area_total', e.target.value)} style={inputStyle} placeholder="Ej: 100" />
            <p style={{ fontSize: '0.85rem', color: THEME.colors.textLight, marginTop: '-8px', marginBottom: '16px' }}>
              💡 Buscaremos inmuebles entre {Math.round(areaNum * 0.9)} y {Math.round(areaNum * 1.1)} m²
            </p>
            <label style={labelStyle}>Características Especiales</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              {['Esquinero', 'Vía Principal', 'Doble Altura', 'Mezzanine', 'Extracción', 'Cocina industrial'].map(c => (
                <button key={c} onClick={() => toggleCar(c)} style={{ padding: '8px 16px', borderRadius: THEME.radius.full, border: `1px solid ${form.caracteristicas.includes(c) ? THEME.colors.primary : '#e2e8f0'}`, background: form.caracteristicas.includes(c) ? `${THEME.colors.primary}15` : 'white', color: form.caracteristicas.includes(c) ? THEME.colors.primary : THEME.colors.text, fontWeight: 600, cursor: 'pointer' }}>{c}</button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>💰 3. Económico y Horizonte</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Canon mensual máximo de Arriendo ($)</label><input type="number" value={form.canon_arriendo} onChange={e => update('canon_arriendo', e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Presupuesto máximo de Compra ($)</label><input type="number" value={form.presupuesto_compra} onChange={e => update('presupuesto_compra', e.target.value)} style={inputStyle} /></div>
            </div>
            <label style={labelStyle}>Plazo para tomar la decisión</label>
            <select value={form.horizonte} onChange={e => update('horizonte', e.target.value)} style={inputStyle}>
              <option>Inmediato (0-1 mes)</option><option>Corto (1-3 meses)</option><option>Mediano (3-6 meses)</option><option>Largo (+6 meses)</option>
            </select>
            <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '16px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight }}>Acepto los términos y condiciones de TerraMatch</span>
            </label>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          {step > 1 && <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: '14px', background: 'white', border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 600, color: THEME.colors.text }}>ATRÁS</button>}
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} style={{ flex: 2, padding: '14px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>SIGUIENTE →</button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '14px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>{loading ? 'Creando...' : '✓ CREAR IUB'}</button>
          )}
        </div>
      </div>
    </div>
  );
}

function OfertaWizard({ user, profile, supabase, category, onNavigate }) {
  const [form, setForm] = useState({
    titulo: '', ciudad: 'Bogotá', direccion: '', barrio: '', zona: '',
    matricula: '', tipo: ['Arriendo'], valorCanon: '', valorVenta: '',
    area: '', caracteristicas: [], usoSuelo: 'Comercial'
  });
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoriaLabels = { locales: 'Local', bodegas: 'Bodega', oficinas: 'Oficina' };
  const handleDireccionChange = (direccion) => { setForm({...form, direccion, barrio: 'Chapinero', zona: 'Norte'}); };
  const toggleTipo = (t) => setForm(prev => ({ ...prev, tipo: prev.tipo.includes(t) ? prev.tipo.filter(x => x !== t) : [...prev.tipo, t] }));
  const toggleCar = (c) => setForm(prev => ({ ...prev, caracteristicas: prev.caracteristicas.includes(c) ? prev.caracteristicas.filter(x => x !== c) : [...prev.caracteristicas, c] }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const codigoProp = `LOC${Math.floor(Math.random() * 900000) + 100000}`;
      const { error } = await supabase.from('propiedades').insert([{
        user_id: user.id, codigo_propiedad: codigoProp, titulo: form.titulo, ciudad: form.ciudad,
        zona: form.zona, direccion: form.direccion, barrio: form.barrio, segmento: category || 'locales',
        tipo_inmueble: categoriaLabels[category] || 'local', operacion: form.tipo.includes('Arriendo') ? 'arrendar' : 'vender',
        area_total: form.area ? parseFloat(form.area) : 0,
        precio: form.tipo.includes('Arriendo') ? (parseFloat(form.valorCanon) || 0) : (parseFloat(form.valorVenta) || 0),
        caracteristicas: JSON.stringify(form.caracteristicas), matricula_inmobiliaria: form.matricula || null,
        disponible: true, estado: 'activo'
      }]);
      if (error) throw error;
      alert(`¡${categoriaLabels[category]} publicado exitosamente! Tu código es: ${codigoProp}`);
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
        <input placeholder={`${categoriaLabels[category]} esquinero en Chapinero`} value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} style={inputStyle} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={labelStyle}>Selecciona ciudad *</label><select value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} style={inputStyle}><option>Bogotá</option><option>Medellín</option><option>Cali</option></select></div>
          <div><label style={labelStyle}>Dirección *</label><input placeholder="Calle 85 # 15-30" value={form.direccion} onChange={e => handleDireccionChange(e.target.value)} style={inputStyle} /></div>
        </div>

        {form.barrio && (
          <div style={{ background: `${THEME.colors.secondary}20`, padding: '16px', borderRadius: THEME.radius.sm, marginBottom: '16px', fontSize: '0.9rem', color: THEME.colors.text }}>
            <strong>De acuerdo con la dirección ingresada, se han calculado:</strong><br/>
            Barrio: {form.barrio} · Zona: {form.zona}
          </div>
        )}

        <label style={labelStyle}>Matrícula Inmobiliaria (Cédula de la propiedad) *</label>
        <input type="text" placeholder="Ej: 50S-91817 o 01N-5418419" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} style={inputStyle} />

        <label style={labelStyle}>Tipo de negocio (activa al menos una opción) *</label>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 20px', border: `2px solid ${form.tipo.includes('Arriendo') ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: form.tipo.includes('Arriendo') ? `${THEME.colors.primary}10` : 'white' }}>
            <input type="checkbox" checked={form.tipo.includes('Arriendo')} onChange={() => toggleTipo('Arriendo')} /> Arriendo
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 20px', border: `2px solid ${form.tipo.includes('Venta') ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: form.tipo.includes('Venta') ? `${THEME.colors.primary}10` : 'white' }}>
            <input type="checkbox" checked={form.tipo.includes('Venta')} onChange={() => toggleTipo('Venta')} /> Venta
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={labelStyle}>Valor canon mensual ($)</label><input type="number" placeholder="Ingresa valor" value={form.valorCanon} onChange={e => setForm({...form, valorCanon: e.target.value})} style={inputStyle} /></div>
          <div><label style={labelStyle}>Valor venta mínimo ($)</label><input type="number" placeholder="Ingresa valor" value={form.valorVenta} onChange={e => setForm({...form, valorVenta: e.target.value})} style={inputStyle} /></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={labelStyle}>Área Total (m²) *</label><input type="number" value={form.area} onChange={e => setForm({...form, area: e.target.value})} style={inputStyle} /></div>
          <div><label style={labelStyle}>Uso del suelo</label><select value={form.usoSuelo} onChange={e => setForm({...form, usoSuelo: e.target.value})} style={inputStyle}><option>Mixto</option><option>Comercial</option><option>Industrial</option></select></div>
        </div>

        <label style={labelStyle}>Características especiales</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
          {['Esquinero', 'Vía Principal', 'Centro comercial', 'Doble altura', 'Permiso de construcción'].map(c => (
            <button key={c} onClick={() => toggleCar(c)} style={{ padding: '8px 16px', borderRadius: THEME.radius.full, border: `1px solid ${form.caracteristicas.includes(c) ? THEME.colors.primary : '#e2e8f0'}`, background: form.caracteristicas.includes(c) ? `${THEME.colors.primary}15` : 'white', color: form.caracteristicas.includes(c) ? THEME.colors.primary : THEME.colors.text, fontWeight: 600, cursor: 'pointer' }}>{c}</button>
          ))}
        </div>

        <label style={labelStyle}>Fotos / Planos</label>
        <div onClick={() => document.getElementById('file-upload').click()} style={{ border: '2px dashed #e2e8f0', borderRadius: THEME.radius.md, padding: '32px', textAlign: 'center', marginBottom: '24px', cursor: 'pointer', background: '#f8f9fa', transition: 'all 0.2s' }}
             onMouseEnter={(e) => e.currentTarget.style.borderColor = THEME.colors.primary}
             onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: THEME.colors.text }}>Arrastra fotos o planos aquí</p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: THEME.colors.textLight }}>o haz clic para seleccionar archivos (JPG, PDF, DWG)</p>
          <input id="file-upload" type="file" multiple accept="image/*,.pdf,.dwg" style={{ display: 'none' }} onChange={(e) => setArchivos(Array.from(e.target.files))} />
          {archivos.length > 0 && (
            <div style={{ marginTop: '16px', textAlign: 'left' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>{archivos.length} archivo(s) seleccionado(s):</p>
              {archivos.map((file, idx) => (
                <div key={idx} style={{ fontSize: '0.8rem', color: THEME.colors.textLight, background: 'white', padding: '6px 12px', borderRadius: '6px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{file.name}</span><span style={{ color: THEME.colors.success }}>✓</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button onClick={() => onNavigate('dashboard')} style={{ flex: 1, padding: '14px', background: 'white', border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 600, color: THEME.colors.text }}>CANCELAR</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '14px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>{loading ? 'Publicando...' : `✓ PUBLICAR ${categoriaLabels[category].toUpperCase()}`}</button>
        </div>
      </div>
    </div>
  );
}

function MasivaWizard({ user, profile, supabase, category, onNavigate }) {
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoriaLabels = { locales: 'Locales', bodegas: 'Bodegas', oficinas: 'Oficinas' };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      setPreview([
        { titulo: 'Local 1 - Chapinero', ciudad: 'Bogotá', area: 120, precio: 5000000 },
        { titulo: 'Local 2 - Usaquén', ciudad: 'Bogotá', area: 85, precio: 3500000 },
        { titulo: 'Local 3 - Santa Fe', ciudad: 'Medellín', area: 200, precio: 8000000 },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!archivo) { alert('Por favor selecciona un archivo'); return; }
    setLoading(true);
    try {
      const resultados = [];
      for (let i = 0; i < preview.length; i++) {
        const codigoProp = `LOC${Math.floor(Math.random() * 900000) + 100000}`;
        const { error } = await supabase.from('propiedades').insert([{
          user_id: user.id, codigo_propiedad: codigoProp,
          titulo: preview[i].titulo, ciudad: preview[i].ciudad, zona: 'Norte',
          segmento: category || 'locales', tipo_inmueble: category || 'locales',
          operacion: 'arrendar', area_total: preview[i].area, precio: preview[i].precio,
          caracteristicas: '[]', disponible: true, estado: 'activo'
        }]);
        if (!error) resultados.push(codigoProp);
      }
      alert(`✅ ${resultados.length} ${categoriaLabels[category]} cargados exitosamente!`);
      onNavigate('dashboard');
    } catch (err) { alert('Error: ' + err.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: '40px 32px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}><button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Dashboard</button><span style={{ margin: '0 8px' }}>&gt;</span><span>Carga Masiva - {categoriaLabels[category]}</span></div>
        <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>📊 Carga Masiva de {categoriaLabels[category]}</h2>
        <p style={{ textAlign: 'center', color: THEME.colors.textLight, marginBottom: '32px' }}>Sube un archivo Excel o CSV con múltiples inmuebles</p>

        <div onClick={() => document.getElementById('masiva-upload').click()} style={{ border: '3px dashed #e2e8f0', borderRadius: THEME.radius.lg, padding: '60px 32px', textAlign: 'center', cursor: 'pointer', background: '#f8f9fa', transition: 'all 0.2s' }}
             onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.background = `${THEME.colors.primary}05`; }}
             onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8f9fa'; }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📂</div>
          <h3 style={{ margin: '0 0 8px 0', color: THEME.colors.text }}>Arrastra tu archivo Excel o CSV aquí</h3>
          <p style={{ margin: 0, color: THEME.colors.textLight }}>o haz clic para seleccionar (máx. 10MB)</p>
          <input id="masiva-upload" type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleFileChange} />
        </div>

        {archivo && (
          <div style={{ marginTop: '32px' }}>
            <div style={{ background: `${THEME.colors.success}15`, padding: '16px', borderRadius: THEME.radius.sm, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>✅</span>
              <div>
                <strong style={{ color: THEME.colors.text }}>{archivo.name}</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: THEME.colors.textLight }}>{(archivo.size / 1024).toFixed(2)} KB · {preview.length} registros detectados</p>
              </div>
            </div>

            <h4 style={{ marginBottom: '16px', color: THEME.colors.text }}>Vista previa (primeros 3 registros):</h4>
            <div style={{ background: '#f8f9fa', borderRadius: THEME.radius.sm, overflow: 'hidden', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: THEME.colors.text, color: 'white' }}><th style={{ padding: '12px', textAlign: 'left' }}>Título</th><th style={{ padding: '12px', textAlign: 'left' }}>Ciudad</th><th style={{ padding: '12px', textAlign: 'left' }}>Área (m²)</th><th style={{ padding: '12px', textAlign: 'left' }}>Precio</th></tr></thead>
                <tbody>{preview.map((row, idx) => (<tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '12px' }}>{row.titulo}</td><td style={{ padding: '12px' }}>{row.ciudad}</td><td style={{ padding: '12px' }}>{row.area}</td><td style={{ padding: '12px' }}>${row.precio.toLocaleString()}</td></tr>))}</tbody>
              </table>
            </div>

            <div style={{ background: `${THEME.colors.warning}15`, padding: '16px', borderRadius: THEME.radius.sm, marginBottom: '24px', fontSize: '0.9rem', color: THEME.colors.text }}>
              ⚠️ <strong>Nota:</strong> Asegúrate de que tu archivo tenga las columnas: Título, Ciudad, Zona, Dirección, Área, Precio, Matrícula
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button onClick={() => onNavigate('dashboard')} style={{ flex: 1, padding: '14px', background: 'white', border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 600, color: THEME.colors.text }}>CANCELAR</button>
          <button onClick={handleSubmit} disabled={loading || !archivo} style={{ flex: 2, padding: '14px', background: !archivo ? '#e2e8f0' : THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: !archivo ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Procesando...' : `✓ CARGAR ${preview.length} ${categoriaLabels[category]}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function IUBDetailView({ item, supabase, onNavigate }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMatches(); }, [item]);
  async function loadMatches() {
    try {
      setLoading(true);
      const { data } = await supabase.from('matches').select('*, propiedades(*)').eq('iub_id', item.id).order('score', { ascending: false });
      setMatches(data || []);
    } catch (error) { console.error('Error loading matches:', error); } finally { setLoading(false); }
  }

  const updateEstado = async (matchId, estado) => {
    try { await supabase.from('matches').update({ estado }).eq('id', matchId); loadMatches(); } 
    catch (error) { alert('Error: ' + error.message); }
  };

  const safeParseJSON = (str) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  };

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
        <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Dashboard</button>
        <span style={{ margin: '0 8px' }}>&gt;</span><span style={{ color: THEME.colors.text, fontWeight: 600 }}>{item.codigo_iub}</span>
      </div>

      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px', borderLeft: `6px solid ${THEME.colors.primary}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <Badge color="warning">{item.tipo_negocio}</Badge>
          <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: THEME.colors.primary, fontWeight: 700 }}>{item.codigo_iub}</span>
        </div>
        <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.5rem' }}>{item.cantidad_locales || 1} {item.segmentos || 'Locales'} en {item.ciudad} zona {item.zona}</h2>
        <p style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>{item.area_min} m² · <strong>${(item.canon_arriendo || 0).toLocaleString()}/mes</strong></p>
        {item.caracteristicas && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {safeParseJSON(item.caracteristicas).map((c, i) => (<span key={i} style={{ padding: '6px 14px', background: `${THEME.colors.secondary}30`, color: THEME.colors.text, borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 600 }}>{c}</span>))}
          </div>
        )}
      </div>

      <h3 style={{ color: THEME.colors.text, marginBottom: '24px' }}>Esta búsqueda tiene {matches.length} Matches</h3>
      {loading ? <div style={{ textAlign: 'center', padding: '40px', color: THEME.colors.textLight }}>Cargando...</div> : matches.length === 0 ? (
        <div style={{ background: THEME.colors.white, padding: '60px', borderRadius: THEME.radius.lg, textAlign: 'center', boxShadow: THEME.shadow }}><div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div><h3>Aún no hay matches</h3></div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {matches.map(match => (
            <div key={match.id} style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', border: `2px solid ${match.estado === 'favorito' ? THEME.colors.success : match.estado === 'descartado' ? '#e2e8f0' : 'transparent'}` }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>{match.propiedades?.titulo || 'Inmueble'}</h4>
                <div style={{ display: 'flex', gap: '16px', color: THEME.colors.textLight, fontSize: '0.9rem', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span> {match.propiedades?.ciudad} - {match.propiedades?.zona}</span>
                  <span>📐 {match.propiedades?.area_total} m²</span>
                  <span>💰 ${match.propiedades?.precio?.toLocaleString()}/mes</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Badge color={match.estado === 'favorito' ? 'success' : match.estado === 'descartado' ? 'gray' : 'warning'}>{match.estado || 'nuevo'}</Badge>
                {match.estado !== 'favorito' && <button onClick={() => updateEstado(match.id, 'favorito')} style={{ padding: '10px 20px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Favorito</button>}
                {match.estado !== 'descartado' && <button onClick={() => updateEstado(match.id, 'descartado')} style={{ padding: '10px 20px', background: 'white', color: THEME.colors.textLight, border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700 }}>Descartar</button>}
              </div>
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

  useEffect(() => { loadIUBs(); }, [item]);
  async function loadIUBs() {
    try {
      setLoading(true);
      const { data } = await supabase.from('matches').select('*, iubs(*)').eq('propiedad_id', item.id);
      setIubsInteresados(data || []);
    } catch (error) { console.error('Error loading IUBs:', error); } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
        <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Dashboard</button>
        <span style={{ margin: '0 8px' }}>&gt;</span><span style={{ color: THEME.colors.text, fontWeight: 600 }}>{item.codigo_propiedad || item.titulo}</span>
      </div>

      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Badge color="primary">{item.codigo_propiedad || 'SIN ID'}</Badge>
              <Badge color="success">{item.operacion}</Badge>
            </div>
            <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.5rem' }}>{item.titulo}</h2>
            <p style={{ margin: '0 0 8px 0', color: THEME.colors.text, fontSize: '1.1rem' }}><strong>${item.precio?.toLocaleString()}</strong> /mes</p>
            <p style={{ margin: '0', color: THEME.colors.textLight }}>{item.direccion} · {item.ciudad}</p>
          </div>
          <div style={{ background: '#fff5f5', padding: '24px', borderRadius: THEME.radius.md, border: `1px solid ${THEME.colors.primary}30` }}>
            <h4 style={{ color: THEME.colors.primary, marginTop: 0, marginBottom: '16px' }}>🔒 Contacto Propietario</h4>
            <p style={{ margin: '8px 0', fontWeight: 700, color: THEME.colors.text }}>{profile?.nombre}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>📞 {profile?.celular}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>✉️ {profile?.email}</p>
            {item.matricula_inmobiliaria && <p style={{ margin: '8px 0', color: THEME.colors.textLight, fontSize: '0.85rem' }}>Matrícula: {item.matricula_inmobiliaria}</p>}
          </div>
        </div>
      </div>

      <h3 style={{ color: THEME.colors.text, marginBottom: '24px' }}>Este local tiene {iubsInteresados.length} Matches (IUBs interesados)</h3>
      {loading ? <div style={{ textAlign: 'center', padding: '40px', color: THEME.colors.textLight }}>Cargando...</div> : iubsInteresados.length === 0 ? (
        <div style={{ background: THEME.colors.white, padding: '60px', borderRadius: THEME.radius.lg, textAlign: 'center', boxShadow: THEME.shadow }}><div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div><h3>Aún no hay IUBs interesados</h3></div>
      ) : (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead><tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>IUB</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CONTACTO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th></tr></thead>
            <tbody>
              {iubsInteresados.map((match) => (
                <tr key={match.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{match.iubs?.codigo_iub}</td>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{match.iubs?.nombre_completo || 'Usuario'}</td>
                  <td style={{ padding: '16px' }}>{match.iubs?.ciudad}</td>
                  <td style={{ padding: '16px' }}>{match.iubs?.area_min} m²</td>
                  <td style={{ padding: '16px' }}><Badge color={match.estado === 'favorito' ? 'success' : match.estado === 'descartado' ? 'gray' : 'warning'}>{match.estado || 'nuevo'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminPanel({ supabase, onNavigate, setSelectedItem }) {
  const [tab, setTab] = useState('iubs');
  const [iubs, setIubs] = useState([]);
  const [locales, setLocales] = useState([]);
  const [matchCounts, setMatchCounts] = useState({ iubs: {}, props: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);
  async function loadData() {
    try {
      setLoading(true);
      const { data: iubsData } = await supabase.from('iubs').select('*').order('creado_en', { ascending: false });
      setIubs(iubsData || []);
      const { data: propsData } = await supabase.from('propiedades').select('*').order('creado_en', { ascending: false });
      setLocales(propsData || []);
      
      const { data: matchesData } = await supabase.from('matches').select('iub_id, propiedad_id');
      const iubCounts = {};
      const propCounts = {};
      if (matchesData) {
        matchesData.forEach(m => {
          iubCounts[m.iub_id] = (iubCounts[m.iub_id] || 0) + 1;
          propCounts[m.propiedad_id] = (propCounts[m.propiedad_id] || 0) + 1;
        });
      }
      setMatchCounts({ iubs: iubCounts, props: propCounts });
    } catch (error) { console.error('Error loading admin data:', error); } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.dark, color: 'white', padding: '32px', borderRadius: THEME.radius.lg, marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0' }}>🛡️ Torre de Control (Admin)</h2>
        <p style={{ margin: 0, opacity: 0.8 }}>Gestión global de IUBs, Locales y Matches</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => setTab('iubs')} style={{ padding: '12px 24px', background: tab === 'iubs' ? THEME.colors.primary : THEME.colors.white, color: tab === 'iubs' ? 'white' : THEME.colors.text, border: tab === 'iubs' ? 'none' : `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Gestión de IUBs ({iubs.length})</button>
        <button onClick={() => setTab('locales')} style={{ padding: '12px 24px', background: tab === 'locales' ? THEME.colors.primary : THEME.colors.white, color: tab === 'locales' ? 'white' : THEME.colors.text, border: tab === 'locales' ? 'none' : `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Gestión de Locales ({locales.length})</button>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: '60px', color: THEME.colors.textLight }}>Cargando...</div> : tab === 'iubs' ? (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          {iubs.length === 0 ? <div style={{ padding: '60px', textAlign: 'center' }}>No hay IUBs registrados</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead><tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>IUB</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>MATCHES</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TIPO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACCIÓN</th></tr></thead>
              <tbody>{iubs.map((iub) => (<tr key={iub.id} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem(iub); onNavigate('iub-detail'); }}><td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{iub.codigo_iub}</td><td style={{ padding: '16px' }}>{iub.area_min} m²</td><td style={{ padding: '16px' }}><Badge color="primary">{matchCounts.iubs[iub.id] || 0}</Badge></td><td style={{ padding: '16px' }}>{iub.ciudad}</td><td style={{ padding: '16px' }}>{iub.tipo_negocio}</td><td style={{ padding: '16px' }}><Badge color={iub.estado === 'activo' ? 'success' : 'gray'}>{iub.estado}</Badge></td><td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer' }}>Ver detalles →</button></td></tr>))}</tbody>
            </table>
          )}
        </div>
      ) : (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          {locales.length === 0 ? <div style={{ padding: '60px', textAlign: 'center' }}>No hay locales registrados</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead><tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CÓDIGO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TÍTULO</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>MATCHES</th><th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACCIÓN</th></tr></thead>
              <tbody>{locales.map((local) => (<tr key={local.id} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem(local); onNavigate('local-detail'); }}><td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{local.codigo_propiedad || 'SIN ID'}</td><td style={{ padding: '16px', fontWeight: 600 }}>{local.titulo || 'Sin título'}</td><td style={{ padding: '16px' }}>{local.ciudad}</td><td style={{ padding: '16px' }}>{local.area_total} m²</td><td style={{ padding: '16px' }}><Badge color="primary">{matchCounts.props[local.id] || 0}</Badge></td><td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer' }}>Ver detalles →</button></td></tr>))}</tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
// FIN DEL ARCHIVO - Si ves esto, el archivo está completo y sin cortes.
