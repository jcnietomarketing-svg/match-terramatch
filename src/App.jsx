import { useState, useEffect } from 'react';

// ==========================================
// TEMA VISUAL - MANUAL DE MARCA TERRAMATCH
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
      body { font-family: 'Comfortaa', cursive !important; background-color: ${THEME.colors.bg}; color: ${THEME.colors.text}; margin: 0; }
      h1, h2, h3, h4 { font-weight: 700; letter-spacing: -0.5px; }
      input, select, textarea, button { font-family: 'Comfortaa', cursive !important; transition: all 0.2s; }
      button { cursor: pointer; }
      
      @keyframes pulse-radar { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
      @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-float { animation: float 4s ease-in-out infinite; }
      .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
    `;
    document.head.appendChild(style);
  }, []);
}

function Badge({ children, color = 'primary' }) {
  const colors = {
    primary: { bg: `${THEME.colors.primary}15`, text: THEME.colors.primary },
    success: { bg: `${THEME.colors.success}20`, text: THEME.colors.success },
    warning: { bg: `${THEME.colors.warning}20`, text: THEME.colors.warning },
    gray: { bg: '#e2e8f0', text: THEME.colors.textLight }
  };
  return (
    <span style={{ background: colors[color].bg, color: colors[color].text, padding: '6px 14px', borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 700, display: 'inline-block' }}>
      {children}
    </span>
  );
}

// ==========================================
// APP PRINCIPAL
// ==========================================
export default function App() {
  useBrandFont();
  const [view, setView] = useState('home');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => setView('home')} style={{ cursor: 'pointer' }}><Logo size={140} /></div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', fontWeight: 600, color: THEME.colors.text, padding: '8px 16px' }}>Inicio</button>
          <button onClick={() => setView('mis-locales')} style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${THEME.colors.primary}`, color: THEME.colors.primary, borderRadius: THEME.radius.full, fontWeight: 700 }}>Mis Locales</button>
          <button onClick={() => setView('admin')} style={{ padding: '8px 20px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Admin</button>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        {view === 'home' && <HomeView onNavigate={setView} />}
        {view === 'mis-locales' && <MisLocalesView onNavigate={setView} />}
        {view === 'admin' && <AdminView onNavigate={setView} />}
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
// HOME VIEW REDISEÑADO (Luminoso y Directo)
// ==========================================
function HomeView({ onNavigate }) {
  const [simCity, setSimCity] = useState('Bogotá');
  const [simArea, setSimArea] = useState('100');
  const [isScanning, setIsScanning] = useState(false);
  const [simResult, setSimResult] = useState(null);

  const handleSimulate = () => {
    setIsScanning(true);
    setSimResult(null);
    setTimeout(() => {
      setIsScanning(false);
      const randomMatches = Math.floor(Math.random() * 20) + 5;
      setSimResult(randomMatches);
    }, 2000);
  };

  return (
    <div>
      {/* 1. TICKER DE ACTIVIDAD */}
      <div style={{ background: THEME.colors.dark, color: 'white', padding: '10px 0', overflow: 'hidden', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '40px', animation: 'slide-up 0.5s ease-out' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '32px' }}>
            <span style={{ color: THEME.colors.success }}>●</span> 🔥 3 nuevos matches en Bogotá hace 5 min
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: THEME.colors.success }}>●</span>  Local en Chapinero arrendado en 48h
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: THEME.colors.success }}>●</span> 📈 142 empresas buscando locales esta semana
          </span>
        </div>
      </div>

      {/* 2. HERO SECTION LUMINOSO */}
      <div style={{ 
        position: 'relative', 
        minHeight: '85vh', 
        display: 'flex', 
        alignItems: 'center',
        // Overlay blanco brillante para máxima legibilidad
        background: `linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80') center/cover`,
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.4 }}></div>
        <div style={{ position: 'absolute', top: '15%', right: '15%', width: '200px', height: '200px', border: `2px solid ${THEME.colors.secondary}`, borderRadius: '50%', opacity: 0.6 }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 32px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 1, width: '100%' }}>
          
          {/* Lado Izquierdo: Texto y CTA (Ahora arriba y legible) */}
          <div className="animate-slide-up">
            <div style={{ display: 'inline-block', background: `${THEME.colors.primary}15`, color: THEME.colors.primary, padding: '8px 20px', borderRadius: THEME.radius.full, fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>
                La mayor comunidad de búsqueda inteligente
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '24px', lineHeight: 1.1, margin: '0 0 24px 0', color: THEME.colors.text }}>
              Hagamos Match entre tu<br/>
              <span style={{ color: THEME.colors.primary }}>Local y el Negocio Perfecto</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: THEME.colors.textLight, marginBottom: '40px', maxWidth: '550px', lineHeight: 1.6 }}>
              Deja de buscar. Empieza a encontrar. Nuestro algoritmo conecta empresas en expansión con locales comerciales ideales en tiempo real.
            </p>
            
            {/* Botones de acción inmediatos */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <button onClick={() => onNavigate('mis-locales')} style={{ padding: '16px 32px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(233,84,66,0.3)' }}>
                Busco locales →
              </button>
              <button style={{ padding: '16px 32px', background: 'white', color: THEME.colors.text, border: `2px solid ${THEME.colors.text}`, borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1.1rem' }}>
                Tengo locales
              </button>
            </div>

            {/* Trust indicators */}
            <div style={{ display: 'flex', gap: '24px', fontSize: '0.9rem', color: THEME.colors.textLight }}>
              <span>✅ Sin duplicados</span>
              <span>✅ Curación de contenido</span>
              <span>✅ Match 100% real</span>
            </div>
          </div>

          {/* Lado Derecho: Simulador Interactivo (Tarjeta blanca sólida para contraste) */}
          <div className="animate-float" style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, border: '1px solid #e2e8f0', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.3rem', color: THEME.colors.text }}>🎮 Prueba nuestro Radar</h3>
            <p style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>Simula una búsqueda y mira cuántos matches encontramos.</p>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: THEME.colors.text }}>Ciudad</label>
              <select value={simCity} onChange={(e) => setSimCity(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: THEME.radius.sm, border: '1px solid #e2e8f0', fontSize: '1rem', fontFamily: 'Comfortaa', background: '#f8f9fa' }}>
                <option value="Bogotá">Bogotá</option>
                <option value="Medellín">Medellín</option>
                <option value="Cali">Cali</option>
                <option value="Barranquilla">Barranquilla</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: THEME.colors.text }}>Área mínima (m²)</label>
              <input type="number" value={simArea} onChange={(e) => setSimArea(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: THEME.radius.sm, border: '1px solid #e2e8f0', fontSize: '1rem', fontFamily: 'Comfortaa', background: '#f8f9fa' }} />
            </div>

            <button onClick={handleSimulate} disabled={isScanning} style={{ width: '100%', padding: '16px', background: isScanning ? THEME.colors.textLight : THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: isScanning ? 'none' : '0 10px 20px rgba(233,84,66,0.2)' }}>
              {isScanning ? (
                <>
                  <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  Escaneando...
                </>
              ) : '🔍 ESCANEAR MATCHES'}
            </button>

            {simResult !== null && (
              <div className="animate-slide-up" style={{ marginTop: '24px', padding: '20px', background: `${THEME.colors.success}15`, borderRadius: THEME.radius.md, textAlign: 'center', border: `1px solid ${THEME.colors.success}` }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: THEME.colors.success }}>{simResult}</div>
                <div style={{ fontSize: '0.9rem', color: THEME.colors.text, fontWeight: 600 }}>¡Locales compatibles en {simCity}!</div>
                <button onClick={() => onNavigate('mis-locales')} style={{ marginTop: '12px', padding: '8px 20px', background: THEME.colors.success, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '0.85rem' }}>
                  Ver estos locales →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. SECCIÓN "CÓMO FUNCIONA" */}
      <div style={{ padding: '80px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: THEME.colors.text }}>¿Cómo funciona la <span style={{ color: THEME.colors.primary }}>TerraMagia</span>?</h2>
          <p style={{ fontSize: '1.1rem', color: THEME.colors.textLight, maxWidth: '600px', margin: '0 auto' }}>Nuestro motor de matching trabaja 24/7 para cruzar oferta y demanda.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {[
            { icon: '📝', title: '1. Crea tu IUB', desc: 'Define tu búsqueda ideal (ubicación, área, presupuesto) y genera tu Indicador Único de Búsqueda.', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80' },
            { icon: '', title: '2. El Algoritmo Busca', desc: 'Nuestro motor cruza tu IUB con miles de locales en tiempo real, filtrando duplicados y ruido.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' },
            { icon: '🤝', title: '3. Match y Cierre', desc: 'Recibe notificaciones de matches compatibles. Acepta, agenda visita y cierra el negocio.', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80' }
          ].map((step, i) => (
            <div key={i} style={{ background: THEME.colors.white, borderRadius: THEME.radius.lg, overflow: 'hidden', boxShadow: THEME.shadow, transition: 'transform 0.3s' }}
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

      {/* 4. CTA FINAL */}
      <div style={{ background: `linear-gradient(135deg, ${THEME.colors.primary} 0%, #ff7e6b 100%)`, padding: '80px 32px', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', border: '3px solid rgba(255,255,255,0.2)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '150px', height: '150px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>¿Listo para encontrar tu próximo local?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9 }}>Únete a más de 500 empresas que ya están usando TerraMatch.</p>
          <button onClick={() => onNavigate('mis-locales')} style={{ padding: '18px 40px', background: 'white', color: THEME.colors.primary, border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1.2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            Crear mi cuenta gratis →
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MIS LOCALES VIEW
// ==========================================
function MisLocalesView({ onNavigate }) {
  const MOCK_LOCALES = [
    { id: 1, titulo: 'Local esquinero en Pontevedra', ciudad: 'Cota', codigoPostal: '110141', area: 583, matches: 16, estado: 'Activo' },
    { id: 2, titulo: 'Local comercial en Cajicá', ciudad: 'Cajicá', codigoPostal: '212325', area: 877, matches: 3, estado: 'Activo' },
    { id: 3, titulo: 'Local en Chía', ciudad: 'Chía', codigoPostal: '110141', area: 130, matches: 5, estado: 'Activo' },
  ];

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '8px' }}>
            <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Inicio</button>
            <span style={{ margin: '0 8px' }}>&gt;</span>
            <span>Mis locales</span>
          </div>
          <h2 style={{ margin: 0, color: THEME.colors.text }}>Mis Locales</h2>
        </div>
        <button style={{ padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>+ Cargar Local</button>
      </div>

      <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TÍTULO</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CÓDIGO POSTAL</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA (M²)</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>MATCHES</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOCALES.map((local, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{local.titulo}</td>
                <td style={{ padding: '16px' }}>{local.ciudad}</td>
                <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '0.9rem' }}>{local.codigoPostal}</td>
                <td style={{ padding: '16px' }}>{local.area}</td>
                <td style={{ padding: '16px' }}><Badge color="primary">{local.matches}</Badge></td>
                <td style={{ padding: '16px' }}><Badge color={local.estado === 'Activo' ? 'success' : 'gray'}>{local.estado}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// ADMIN VIEW
// ==========================================
function AdminView({ onNavigate }) {
  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.dark, color: 'white', padding: '32px', borderRadius: THEME.radius.lg, marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0' }}>🛡️ Panel de Administrador</h2>
        <p style={{ margin: 0, opacity: 0.8 }}>Gestión de IUBs, Locales y Mediación de Matches</p>
      </div>
      <div style={{ background: THEME.colors.white, padding: '40px', borderRadius: THEME.radius.md, textAlign: 'center', boxShadow: THEME.shadow }}>
        <h3>Vista de Administración</h3>
        <p style={{ color: THEME.colors.textLight }}>Aquí irían las tablas de gestión de IUBs y Locales (ver Fase 2).</p>
        <button onClick={() => onNavigate('home')} style={{ padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, marginTop: '20px' }}>Volver al Home</button>
      </div>
    </div>
  );
}
