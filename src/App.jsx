import { useState, useEffect } from 'react';

// ==========================================
// TEMA VISUAL - MANUAL DE MARCA TERRAMATCH
// ==========================================
const THEME = {
  colors: {
    primary: '#e95442',      // Rojo real del logo
    secondary: '#b9d3dc',    // Azul claro del manual
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
  shadowHover: '0 20px 50px -10px rgba(233, 84, 66, 0.25)',
};

// ==========================================
// LOGO SVG REAL (Isotipo Radar + Texto)
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
          <span style={{ fontFamily: 'Comfortaa, cursive', fontSize: size * 0.18, fontWeight: 700, color: THEME.colors.primary, letterSpacing: '-0.5px' }}>terra</span>
          <span style={{ fontFamily: 'Comfortaa, cursive', fontSize: size * 0.18, fontWeight: 700, color: THEME.colors.primary, letterSpacing: '-0.5px' }}>match</span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// CARGAR FUENTE COMFORTAA
// ==========================================
function useBrandFont() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.innerHTML = `
      * { box-sizing: border-box; }
      body { font-family: 'Comfortaa', cursive !important; background-color: ${THEME.colors.bg}; color: ${THEME.colors.text}; margin: 0; }
      h1, h2, h3, h4 { font-weight: 700; letter-spacing: -0.5px; }
      input, select, textarea, button { font-family: 'Comfortaa', cursive !important; transition: all 0.2s; }
      input:focus, select:focus, textarea:focus { outline: none; border-color: ${THEME.colors.primary} !important; box-shadow: 0 0 0 3px rgba(233, 84, 66, 0.1); }
      button { cursor: pointer; }
    `;
    document.head.appendChild(style);
  }, []);
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function App() {
  useBrandFont();
  const [view, setView] = useState('home');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* NAVBAR */}
      <nav style={{ background: THEME.colors.white, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => setView('home')} style={{ cursor: 'pointer' }}><Logo size={140} /></div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', fontWeight: 600, color: THEME.colors.text, padding: '8px 16px' }}>Inicio</button>
          <button onClick={() => setView('register')} style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${THEME.colors.primary}`, color: THEME.colors.primary, borderRadius: THEME.radius.full, fontWeight: 700 }}>Regístrate</button>
          <button onClick={() => setView('login')} style={{ padding: '8px 20px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Ya soy usuario</button>
        </div>
      </nav>

      {/* CONTENIDO DINÁMICO */}
      <main style={{ flex: 1 }}>
        {view === 'home' && <HomeView onNavigate={setView} />}
        {view === 'register' && <RegisterView onNavigate={setView} />}
        {view === 'login' && <LoginView onNavigate={setView} />}
        {view === 'wizard' && <WizardView onNavigate={setView} />}
        {view === 'searches' && <SearchesView onNavigate={setView} />}
        {view === 'search-detail' && <SearchDetailView onNavigate={setView} />}
      </main>

      {/* FOOTER */}
      <footer style={{ background: THEME.colors.dark, color: 'white', padding: '40px 32px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          <div>
            <Logo size={120} />
            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '16px' }}>La mayor comunidad de búsqueda inteligente de locales comerciales.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '16px' }}>Secciones</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, padding: 0 }}>Inicio</button></li>
              <li style={{ marginBottom: '8px' }}><button onClick={() => setView('searches')} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, padding: 0 }}>Busco locales</button></li>
              <li style={{ marginBottom: '8px' }}><button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, padding: 0 }}>Soy Propietario</button></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '16px' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, padding: 0 }}>Condiciones de uso</button></li>
              <li style={{ marginBottom: '8px' }}><button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7, padding: 0 }}>Política de privacidad</button></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '32px', paddingTop: '24px', textAlign: 'center', fontSize: '0.8rem', opacity: 0.6 }}>
          © 2026 TerraMatch · NIT 901.612.770-8 · Bogotá, Colombia
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// VISTA 1: HOME (Pantallazo 1)
// ==========================================
function HomeView({ onNavigate }) {
  return (
    <div style={{ position: 'relative', padding: '80px 32px', textAlign: 'center', overflow: 'hidden' }}>
      {/* Elementos Radar de Fondo */}
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.3 }}></div>
      <div style={{ position: 'absolute', top: '15%', right: '0%', width: '300px', height: '300px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.4 }}></div>
      <div style={{ position: 'absolute', top: '20%', right: '5%', width: '200px', height: '200px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.5 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '350px', height: '350px', background: THEME.colors.primary, borderRadius: '50%', opacity: 0.05, filter: 'blur(60px)' }}></div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: `${THEME.colors.secondary}30`, color: THEME.colors.primary, padding: '8px 24px', borderRadius: THEME.radius.full, fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>
          🎯 La mayor comunidad de búsqueda inteligente
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', color: THEME.colors.text, lineHeight: 1.1 }}>
          Hagamos Match entre tu<br/><span style={{ color: THEME.colors.primary }}>Local y el Negocio Perfecto</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: THEME.colors.textLight, marginBottom: '60px', maxWidth: '700px', margin: '0 auto 60px' }}>
          Busca, valida y encuentra el local ideal para tu negocio. Sin duplicados, sin intermediarios.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          <div onClick={() => onNavigate('wizard')} style={{ background: THEME.colors.white, padding: '40px 32px', borderRadius: THEME.radius.lg, cursor: 'pointer', border: `2px solid transparent`, boxShadow: THEME.shadow, transition: 'all 0.3s', textAlign: 'left' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = THEME.shadowHover; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = THEME.shadow; }}>
            <div style={{ width: '70px', height: '70px', background: `${THEME.colors.primary}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: THEME.colors.text }}>¿Buscas locales?</h3>
            <ul style={{ color: THEME.colors.textLight, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '24px', paddingLeft: '20px', margin: '0 0 24px 0' }}>
              <li>Podrás comprar o arrendar locales que se ajusten a tus necesidades</li>
              <li>Podrás guardar tus búsquedas para recibir avisos</li>
            </ul>
            <button style={{ padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '0.9rem' }}>SÍ, QUIERO BUSCAR →</button>
          </div>

          <div style={{ background: THEME.colors.white, padding: '40px 32px', borderRadius: THEME.radius.lg, cursor: 'pointer', border: `2px solid transparent`, boxShadow: THEME.shadow, transition: 'all 0.3s', textAlign: 'left' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = THEME.shadowHover; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = THEME.shadow; }}>
            <div style={{ width: '70px', height: '70px', background: `${THEME.colors.secondary}30`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>🏪</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: THEME.colors.text }}>¿Tienes locales?</h3>
            <ul style={{ color: THEME.colors.textLight, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '24px', paddingLeft: '20px', margin: '0 0 24px 0' }}>
              <li>Podrás ofertar todos tus locales de una sola vez</li>
              <li>Podrás etiquetar tus locales para que aparezcan en las búsquedas</li>
            </ul>
            <button style={{ padding: '12px 24px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '0.9rem' }}>SÍ, QUIERO OFERTAR →</button>
          </div>
        </div>

        {/* Testimonios */}
        <div style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '32px' }}>Opiniones</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { name: 'Juanita Acosta', text: 'En solo 3 días mi local de 120m² se alquiló a una multinacional por 5 años' },
              { name: 'Carlos Mendoza', text: 'Gracias TerraMatch, ya he podido comprar 5 de los 8 locales que requería mi empresa' },
              { name: 'Ana Rodríguez', text: 'Lo que parecía imposible, lo logré! Necesitaba 100 locales en distintas ciudades' }
            ].map((t, i) => (
              <div key={i} style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, textAlign: 'left' }}>
                <p style={{ fontStyle: 'italic', color: THEME.colors.text, marginBottom: '16px', lineHeight: 1.6 }}>"{t.text}"</p>
                <strong style={{ color: THEME.colors.primary }}>{t.name}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VISTA 2: REGISTRO (Pantallazo 2)
// ==========================================
function RegisterView({ onNavigate }) {
  return (
    <div style={{ padding: '60px 32px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}><Logo size={140} /></div>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', color: THEME.colors.text }}>Crear Cuenta</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Nombres *</label>
            <input placeholder="Escribe tu nombre" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Apellidos *</label>
            <input placeholder="Escribe tu apellido" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Cédula *</label>
          <input placeholder="Escribe tu número de identificación" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Email *</label>
            <input type="email" placeholder="Escribe tu correo" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Celular *</label>
            <input placeholder="Escribe tu número" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>NIT (opcional)</label>
            <input placeholder="NIT de tu empresa" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Razón Social</label>
            <input placeholder="Nombre de tu empresa" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Mensaje descriptivo</label>
          <textarea placeholder="Cuéntanos sobre tu necesidad..." rows="3" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box', resize: 'vertical' }} />
        </div>

        <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px', cursor: 'pointer' }}>
          <input type="checkbox" style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
          <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight }}>He leído y acepto la <a href="#" style={{ color: THEME.colors.primary, fontWeight: 600 }}>política de privacidad</a></span>
        </label>

        <button onClick={() => onNavigate('wizard')} style={{ width: '100%', padding: '16px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>CONTINUAR</button>
        
        <p style={{ textAlign: 'center', color: THEME.colors.textLight, fontSize: '0.9rem' }}>
          ¿Ya tienes cuenta? <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', fontWeight: 700, padding: 0 }}>INGRESAR</button>
        </p>
      </div>
    </div>
  );
}

// ==========================================
// VISTA 3: LOGIN
// ==========================================
function LoginView({ onNavigate }) {
  return (
    <div style={{ padding: '60px 32px', maxWidth: '450px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}><Logo size={140} /></div>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', color: THEME.colors.text }}>Ingresar</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Correo electrónico</label>
          <input type="email" placeholder="tu@email.com" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Contraseña</label>
          <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer', fontSize: '0.9rem', color: THEME.colors.textLight }}>
          <input type="checkbox" /> Recuérdame
        </label>

        <button onClick={() => onNavigate('searches')} style={{ width: '100%', padding: '16px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>INGRESAR</button>
        
        <p style={{ textAlign: 'center' }}>
          <button style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', fontWeight: 600, padding: 0, fontSize: '0.9rem' }}>¿Has olvidado tu contraseña?</button>
        </p>
        <p style={{ textAlign: 'center', color: THEME.colors.textLight, fontSize: '0.9rem', marginTop: '16px' }}>
          ¿No tienes cuenta? <button onClick={() => onNavigate('register')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', fontWeight: 700, padding: 0 }}>REGISTRARME</button>
        </p>
      </div>
    </div>
  );
}

// ==========================================
// VISTA 4: WIZARD BÚSQUEDA (Pantallazos 3, 4)
// ==========================================
function WizardView({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState('arrendar');
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [usoSuelo, setUsoSuelo] = useState('Comercial');

  const toggleCar = (c) => {
    setCaracteristicas(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  return (
    <div style={{ padding: '60px 32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.white, padding: '48px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
          <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Inicio</button>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span style={{ color: THEME.colors.text }}>Crear búsqueda</span>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Cuéntanos tu necesidad</h2>
        <p style={{ textAlign: 'center', color: THEME.colors.textLight, marginBottom: '32px' }}>Paso {step} de 3</p>

        {/* Barra de progreso */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '6px', borderRadius: '3px', background: s <= step ? THEME.colors.primary : '#e2e8f0' }}></div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>¿Cuántos locales necesitas?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Cantidad</label>
                <input type="number" defaultValue="10" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Ciudad</label>
                <select defaultValue="Bogotá" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }}>
                  <option>Bogotá</option><option>Medellín</option><option>Cali</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Zona</label>
                <select defaultValue="Norte" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }}>
                  <option>Norte</option><option>Sur</option><option>Centro</option>
                </select>
              </div>
            </div>

            <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}>Tipo de negocio</h4>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 20px', border: `2px solid ${tipo === 'comprar' ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: tipo === 'comprar' ? `${THEME.colors.primary}10` : 'white' }}>
                <input type="radio" name="tipo" checked={tipo === 'comprar'} onChange={() => setTipo('comprar')} /> Comprar
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 20px', border: `2px solid ${tipo === 'arrendar' ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: tipo === 'arrendar' ? `${THEME.colors.primary}10` : 'white' }}>
                <input type="radio" name="tipo" checked={tipo === 'arrendar'} onChange={() => setTipo('arrendar')} /> Arrendar
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Área aproximada</label>
                <input type="number" defaultValue="1000" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
                <span style={{ fontSize: '0.85rem', color: THEME.colors.textLight }}>m²</span>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
                  {tipo === 'arrendar' ? 'Dispuesto a pagar hasta' : 'Presupuesto máximo'}
                </label>
                <input type="number" defaultValue={tipo === 'arrendar' ? 120000 : 9000000} style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }} />
                <span style={{ fontSize: '0.85rem', color: THEME.colors.textLight }}>{tipo === 'arrendar' ? 'COP/m²' : 'COP'}</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>Características especiales</h3>
            <p style={{ color: THEME.colors.textLight, marginBottom: '24px' }}>Selecciona todas las que apliquen</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px' }}>
              {['Esquinero', 'Vía Principal', 'Centro comercial', 'Doble altura', 'Permiso de construcción'].map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', border: `2px solid ${caracteristicas.includes(c) ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.sm, cursor: 'pointer', background: caracteristicas.includes(c) ? `${THEME.colors.primary}10` : 'white' }}>
                  <input type="checkbox" checked={caracteristicas.includes(c)} onChange={() => toggleCar(c)} />
                  <span style={{ fontWeight: 600 }}>{c}</span>
                </label>
              ))}
            </div>

            <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}>Uso del suelo</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['Mixto', 'Comercial', 'Exclusivo'].map(u => (
                <button key={u} onClick={() => setUsoSuelo(u)} style={{ padding: '10px 20px', border: `2px solid ${usoSuelo === u ? THEME.colors.primary : '#e2e8f0'}`, borderRadius: THEME.radius.full, background: usoSuelo === u ? THEME.colors.primary : 'white', color: usoSuelo === u ? 'white' : THEME.colors.text, fontWeight: 600 }}>{u}</button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ color: THEME.colors.primary, marginBottom: '24px' }}>Tiempo de contrato</h3>
            <div style={{ marginBottom: '32px' }}>
              <select defaultValue="5" style={{ width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: THEME.radius.sm, boxSizing: 'border-box' }}>
                <option>1 año</option><option>3 años</option><option value="5">5 años</option><option>10 años</option><option>Más de 10</option>
              </select>
            </div>

            <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: THEME.radius.md, marginBottom: '24px' }}>
              <h4 style={{ marginTop: 0, color: THEME.colors.text }}>Resumen de tu búsqueda</h4>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Cantidad:</strong> 10 locales</p>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Ubicación:</strong> Bogotá - Zona Norte</p>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Tipo:</strong> {tipo === 'arrendar' ? 'Arriendo' : 'Compra'}</p>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Área:</strong> 1000 m²</p>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Características:</strong> {caracteristicas.join(', ') || 'Ninguna'}</p>
              <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Uso del suelo:</strong> {usoSuelo}</p>
            </div>

            <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
              <span style={{ fontSize: '0.9rem', color: THEME.colors.textLight }}>Acepto los términos y condiciones de TerraMatch</span>
            </label>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: '14px', background: 'white', border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 600, color: THEME.colors.text }}>CANCELAR</button>
          )}
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} style={{ flex: 2, padding: '14px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>GUARDAR Y CONTINUAR →</button>
          ) : (
            <button onClick={() => onNavigate('searches')} style={{ flex: 2, padding: '14px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>✓ CREAR BÚSQUEDA</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VISTA 5: MIS BÚSQUEDAS (Pantallazos 7, 8)
// ==========================================
function SearchesView({ onNavigate }) {
  const [searches] = useState([
    { id: 'IUB141211', fecha: '29/04/2023 - 09:02', area: 1000, matches: 6, ciudad: 'Bogotá', tipo: 'Arriendo', estado: 'Activo' },
    { id: 'IUB112223', fecha: '27/04/2023 - 09:02', area: 120, matches: 16, ciudad: 'Bogotá', tipo: 'Compra', estado: 'Activo' },
    { id: 'IUB112423', fecha: '27/04/2023 - 09:02', area: 30, matches: 16, ciudad: 'Bogotá', tipo: 'Arriendo', estado: 'Activo' },
    { id: 'IUB112523', fecha: '27/04/2023 - 09:02', area: 70, matches: 2, ciudad: 'Cali', tipo: 'Arriendo', estado: 'Inactivo' },
  ]);

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '8px' }}>
            <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Inicio</button>
            <span style={{ margin: '0 8px' }}>&gt;</span>
            <span>Mis búsquedas</span>
          </div>
          <h2 style={{ margin: 0 }}>Mis Búsquedas</h2>
        </div>
        <button onClick={() => onNavigate('wizard')} style={{ padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>+ Nueva Búsqueda</button>
      </div>

      <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>IUB</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA (M²)</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>N° MATCHES</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>FECHA</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TIPO</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {searches.map((s, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => onNavigate('search-detail')}>
                <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{s.id}</td>
                <td style={{ padding: '16px' }}>{s.area}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ background: `${THEME.colors.primary}15`, color: THEME.colors.primary, padding: '4px 12px', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '0.85rem' }}>{s.matches}</span>
                </td>
                <td style={{ padding: '16px', color: THEME.colors.textLight, fontSize: '0.9rem' }}>{s.fecha}</td>
                <td style={{ padding: '16px' }}>{s.ciudad}</td>
                <td style={{ padding: '16px' }}>{s.tipo}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ background: s.estado === 'Activo' ? THEME.colors.success : '#e2e8f0', color: s.estado === 'Activo' ? 'white' : THEME.colors.textLight, padding: '4px 12px', borderRadius: THEME.radius.full, fontSize: '0.75rem', fontWeight: 700 }}>{s.estado.toUpperCase()}</span>
                </td>
                <td style={{ padding: '16px' }}>
                  <button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Ver Matches →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// VISTA 6: DETALLE BÚSQUEDA + MATCHES (Pantallazo 9)
// ==========================================
function SearchDetailView({ onNavigate }) {
  const [matches, setMatches] = useState([
    { id: 1, titulo: 'Excelente local en Pontevedra', area: 994, precioM2: 150000, estado: 'Nuevo', direccion: 'Calle 145 # 34-45', ciudad: 'Bogotá zona Norte', precioTotal: '$150.000.000/mes', caracteristicas: ['Esquinero', 'Vía Principal', 'Permiso de Construcción', 'Uso comercial exclusivo'] },
    { id: 2, titulo: 'Local sobre vía principal', area: 1025, precioM2: 90000, estado: 'Favorito', direccion: 'Cra 15 # 85-20', ciudad: 'Bogotá zona Norte', precioTotal: '$92.250.000/mes', caracteristicas: ['Vía Principal', 'Doble Altura'] },
    { id: 3, titulo: 'Local esquinero amplio', area: 1150, precioM2: 95000, estado: 'Favorito', direccion: 'Calle 100 # 19-61', ciudad: 'Bogotá zona Norte', precioTotal: '$109.250.000/mes', caracteristicas: ['Esquinero', 'Mezzanine'] },
    { id: 4, titulo: 'Local en centro comercial', area: 956, precioM2: 80000, estado: 'Favorito', direccion: 'CC Andino', ciudad: 'Bogotá zona Norte', precioTotal: '$76.480.000/mes', caracteristicas: ['Centro comercial', 'Seguridad 24h'] },
    { id: 5, titulo: 'Local premium Suba', area: 880, precioM2: 160000, estado: 'Favorito', direccion: 'Cra 119 # 140-20', ciudad: 'Bogotá zona Norte', precioTotal: '$140.800.000/mes', caracteristicas: ['Doble Altura', 'Parqueaderos'] },
    { id: 6, titulo: 'Local grande Usaquén', area: 1350, precioM2: 78000, estado: 'Descartado', direccion: 'Calle 170 # 15-30', ciudad: 'Bogotá zona Norte', precioTotal: '$105.300.000/mes', caracteristicas: ['Esquinero'] },
  ]);

  const updateEstado = (id, nuevoEstado) => {
    setMatches(matches.map(m => m.id === id ? { ...m, estado: nuevoEstado } : m));
  };

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
        <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Inicio</button>
        <span style={{ margin: '0 8px' }}>&gt;</span>
        <button onClick={() => onNavigate('searches')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Búsquedas</button>
        <span style={{ margin: '0 8px' }}>&gt;</span>
        <span style={{ color: THEME.colors.text, fontWeight: 600 }}>IUB141211</span>
      </div>

      {/* Header del IUB */}
      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px', borderLeft: `6px solid ${THEME.colors.primary}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <span style={{ background: `${THEME.colors.primary}15`, color: THEME.colors.primary, padding: '6px 14px', borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 700 }}>Arriendo</span>
              <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: THEME.colors.primary, fontWeight: 700 }}>IUB141211</span>
            </div>
            <p style={{ margin: '0 0 8px 0', color: THEME.colors.textLight, fontSize: '0.9rem' }}>29/04/2023 - 09:02</p>
            <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.5rem' }}>10 Locales en Bogotá zona Norte</h2>
            <p style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>1000 m² por $120.000/m² aprox <strong>$120.000.000/mes</strong></p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Esquinero', 'Vía Principal', 'Permiso de Construcción', 'Uso comercial exclusivo'].map((c, i) => (
                <span key={i} style={{ padding: '6px 14px', background: `${THEME.colors.secondary}30`, color: THEME.colors.text, borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 600 }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Matches */}
      <h3 style={{ color: THEME.colors.text, marginBottom: '24px' }}>Esta búsqueda tiene {matches.length} Matches</h3>
      <div style={{ display: 'grid', gap: '16px' }}>
        {matches.map(match => (
          <div key={match.id} style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', border: `2px solid ${match.estado === 'Favorito' ? THEME.colors.success : match.estado === 'Descartado' ? '#e2e8f0' : 'transparent'}` }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>{match.titulo}</h4>
              <div style={{ display: 'flex', gap: '16px', color: THEME.colors.textLight, fontSize: '0.9rem', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span>📍 {match.ciudad}</span>
                <span>📐 {match.area} m²</span>
                <span>💰 ${match.precioM2.toLocaleString()}/m²</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: THEME.colors.textLight, marginBottom: '12px' }}>{match.direccion}</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {match.caracteristicas.map((c, i) => (
                  <span key={i} style={{ padding: '4px 10px', background: '#f8f9fa', border: `1px solid ${THEME.colors.secondary}`, borderRadius: THEME.radius.full, fontSize: '0.75rem', color: THEME.colors.text }}>{c}</span>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ 
                background: match.estado === 'Favorito' ? `${THEME.colors.success}20` : match.estado === 'Descartado' ? '#e2e8f0' : `${THEME.colors.primary}15`, 
                color: match.estado === 'Favorito' ? THEME.colors.success : match.estado === 'Descartado' ? THEME.colors.textLight : THEME.colors.primary, 
                padding: '8px 16px', borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 700 
              }}>
                {match.estado}
              </span>
              <button onClick={() => updateEstado(match.id, 'Descartado')} style={{ padding: '10px 20px', background: match.estado === 'Descartado' ? '#e2e8f0' : 'white', color: THEME.colors.textLight, border: `1px solid #e2e8f0`, borderRadius: THEME.radius.full, fontWeight: 700 }}>Descartar</button>
              <button onClick={() => updateEstado(match.id, 'Favorito')} style={{ padding: '10px 20px', background: match.estado === 'Favorito' ? THEME.colors.success : 'white', color: match.estado === 'Favorito' ? 'white' : THEME.colors.success, border: `1px solid ${match.estado === 'Favorito' ? 'transparent' : THEME.colors.success}`, borderRadius: THEME.radius.full, fontWeight: 700 }}>Favorito</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
