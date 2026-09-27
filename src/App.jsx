import { useState, useEffect } from 'react';

// ==========================================
// TEMA Y CONFIGURACIÓN VISUAL (Manual de Marca)
// ==========================================
const THEME = {
  colors: { 
    primary: '#e95442', // Rojo real del logo
    secondary: '#b9d3dc', // Azul claro
    text: '#2d3748', 
    textLight: '#718096', 
    bg: '#fafafa', 
    white: '#ffffff', 
    success: '#48bb78', 
    warning: '#ed8936',
    info: '#4299e1'
  },
  radius: { sm: '12px', md: '20px', lg: '32px', full: '9999px' },
  shadow: '0 10px 40px -10px rgba(233, 84, 66, 0.15)',
};

// Logo SVG Real
function Logo({ size = 160 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 281.78 281.78">
        <circle cx="140.89" cy="140.89" r="140.89" fill="#e95442" />
        <circle cx="140.89" cy="140.89" r="8" fill="#fff" />
        <path d="M200,220c-45,27.85-109.74,12.24-133-48.28a78,78,0,0,1-.58-53.7c24.05-68.59,103-82.32,148.33-39.07a89.59,89.59,0,0,1,16.58,108.19" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="15" />
        <path d="M188,201c-34.07,20.89-83,8.72-100-37.62a56,56,0,0,1-1.05-35.66c16.61-54.33,77.59-65.77,112.34-32.64a67.19,67.19,0,0,1,12.56,80.92" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="15" />
        <path d="M176,182c-23.51,14.17-57.42,4.91-67.51-28.6a32.86,32.86,0,0,1-.41-17.46c9.71-38.75,51.93-47.4,75.72-24.73a44.81,44.81,0,0,1,8.53,53.66" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="15" />
        <rect x="138.17" y="0" width="5.26" height="281.78" fill="#fff" />
        <rect x="0" y="138.17" width="281.78" height="5.26" fill="#fff" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.9 }}>
        <span style={{ fontFamily: 'Comfortaa, cursive', fontSize: size * 0.2, fontWeight: 700, color: THEME.colors.primary }}>terra</span>
        <span style={{ fontFamily: 'Comfortaa, cursive', fontSize: size * 0.2, fontWeight: 700, color: THEME.colors.primary }}>match</span>
      </div>
    </div>
  );
}

// Inyectar fuente
function useBrandFont() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Comfortaa', cursive";
    document.body.style.backgroundColor = THEME.colors.bg;
    document.body.style.margin = '0';
  }, []);
}

// ==========================================
// DATOS MOCK (Basados en tus 17 Pantallazos)
// ==========================================
const MOCK_IUB = {
  id: 'IUB141211',
  fecha: '29/04/2023 - 09:02',
  cantidad: 10,
  ciudad: 'Bogotá',
  zona: 'Norte',
  area: '1000 m²',
  precio: '$120.000/m²',
  precioTotal: '$120.000.000 / mes',
  tipo: 'Arriendo',
  caracteristicas: ['Esquinero', 'Vía Principal', 'Permiso de Construcción', 'Uso comercial exclusivo'],
  contacto: { empresa: 'Colliers Agregador', tel: '322 695 9898', email: 'ventas@colliers.com' }
};

const MOCK_MATCHES = [
  { id: 1, titulo: 'Excelente local en Pontevedra', area: 994, precioM2: 150000, estado: 'Nuevo', direccion: 'Calle 145 # 34-45', ciudad: 'Bogotá zona Norte' },
  { id: 2, titulo: 'Local sobre vía principal', area: 1025, precioM2: 90000, estado: 'Favorito', direccion: 'Cra 15 # 85-20', ciudad: 'Bogotá zona Norte' },
  { id: 3, titulo: 'Local esquinero amplio', area: 1150, precioM2: 95000, estado: 'Favorito', direccion: 'Calle 100 # 19-61', ciudad: 'Bogotá zona Norte' },
  { id: 4, titulo: 'Local en centro comercial', area: 956, precioM2: 80000, estado: 'Descartado', direccion: 'CC Andino', ciudad: 'Bogotá zona Norte' },
];

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function App() {
  useBrandFont();
  const [view, setView] = useState('home'); // home, dashboard, match-detail, admin
  const [activeTab, setActiveTab] = useState('iubs'); // iubs, locales

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* NAVBAR */}
      <nav style={{ background: THEME.colors.white, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => setView('home')} style={{ cursor: 'pointer' }}><Logo size={140} /></div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: THEME.colors.text }}>Inicio</button>
          <button onClick={() => setView('dashboard')} style={{ padding: '8px 20px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 700 }}>Mis IUBs</button>
          <button onClick={() => setView('admin')} style={{ padding: '8px 20px', background: THEME.colors.text, color: 'white', border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 700 }}>Admin</button>
        </div>
      </nav>

      {/* CONTENIDO DINÁMICO */}
      <main style={{ flex: 1 }}>
        {view === 'home' && <HomeView onNavigate={setView} />}
        {view === 'dashboard' && <DashboardView activeTab={activeTab} setActiveTab={setActiveTab} onNavigate={setView} />}
        {view === 'match-detail' && <MatchDetailView onNavigate={setView} />}
        {view === 'admin' && <AdminView onNavigate={setView} />}
      </main>

      {/* FOOTER */}
      <footer style={{ background: THEME.colors.text, color: 'white', padding: '40px 32px', textAlign: 'center', marginTop: '60px' }}>
        <Logo size={100} />
        <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '16px' }}>© 2026 TerraMatch · NIT 901.612.770-8 · Bogotá, Colombia</p>
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
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '350px', height: '350px', background: THEME.colors.primary, borderRadius: '50%', opacity: 0.05, filter: 'blur(60px)' }}></div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
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
          <div onClick={() => onNavigate('dashboard')} style={{ background: THEME.colors.white, padding: '40px 32px', borderRadius: THEME.radius.lg, cursor: 'pointer', border: `2px solid transparent`, boxShadow: THEME.shadow, transition: 'all 0.3s', textAlign: 'left' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.transform = 'translateY(-8px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ width: '70px', height: '70px', background: `${THEME.colors.primary}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: THEME.colors.text }}>¿Buscas locales?</h3>
            <p style={{ color: THEME.colors.textLight, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>Podrás comprar o arrendar locales que se ajusten a tus necesidades. Guarda tus búsquedas (IUB) y recibe avisos.</p>
            <button style={{ padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>SÍ, QUIERO BUSCAR →</button>
          </div>

          <div style={{ background: THEME.colors.white, padding: '40px 32px', borderRadius: THEME.radius.lg, cursor: 'pointer', border: `2px solid transparent`, boxShadow: THEME.shadow, transition: 'all 0.3s', textAlign: 'left' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.colors.primary; e.currentTarget.style.transform = 'translateY(-8px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ width: '70px', height: '70px', background: `${THEME.colors.secondary}30`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>🏪</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: THEME.colors.text }}>¿Tienes locales?</h3>
            <p style={{ color: THEME.colors.textLight, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>Podrás ofertar todos tus locales a la vez. Etiqueta tus locales para que aparezcan en las búsquedas de tus clientes potenciales.</p>
            <button style={{ padding: '12px 24px', background: THEME.colors.text, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>SÍ, QUIERO OFERTAR →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VISTA 2: DASHBOARD (Pantallazos 7, 8, 11)
// ==========================================
function DashboardView({ activeTab, setActiveTab, onNavigate }) {
  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ color: THEME.colors.text, margin: 0 }}>Mi Panel de Control</h2>
        <button style={{ padding: '12px 24px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>+ Crear Nuevo IUB</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: `2px solid #e2e8f0`, paddingBottom: '16px' }}>
        <button onClick={() => setActiveTab('iubs')} style={{ padding: '10px 20px', background: activeTab === 'iubs' ? THEME.colors.text : 'transparent', color: activeTab === 'iubs' ? 'white' : THEME.colors.text, border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}>Mis Búsquedas (IUBs)</button>
        <button onClick={() => setActiveTab('locales')} style={{ padding: '10px 20px', background: activeTab === 'locales' ? THEME.colors.text : 'transparent', color: activeTab === 'locales' ? 'white' : THEME.colors.text, border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}>Mis Locales</button>
      </div>

      {/* Tabla de IUBs (Estilo Pantallazo 12 pero modernizado) */}
      {activeTab === 'iubs' && (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight }}>IUB</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight }}>ÁREA (M²)</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight }}>MATCHES</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight }}>FECHA</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight }}>CIUDAD</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight }}>ESTADO</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight }}>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MATCHES.map((match, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => onNavigate('match-detail')}>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{MOCK_IUB.id}</td>
                  <td style={{ padding: '16px' }}>{MOCK_IUB.area}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ background: `${THEME.colors.primary}15`, color: THEME.colors.primary, padding: '4px 12px', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '0.85rem' }}>
                      {MOCK_MATCHES.length} activos
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: THEME.colors.textLight }}>{MOCK_IUB.fecha}</td>
                  <td style={{ padding: '16px' }}>{MOCK_IUB.ciudad} - {MOCK_IUB.zona}</td>
                  <td style={{ padding: '16px' }}><span style={{ background: THEME.colors.success, color: 'white', padding: '4px 12px', borderRadius: THEME.radius.full, fontSize: '0.75rem', fontWeight: 700 }}>ACTIVO</span></td>
                  <td style={{ padding: '16px' }}><button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer' }}>Ver Matches →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabla de Locales (Estilo Pantallazo 11) */}
      {activeTab === 'locales' && (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          <div style={{ padding: '24px', textAlign: 'center', color: THEME.colors.textLight }}>
            <h3>Vista de "Mis Locales" (Similar a la tabla de IUBs pero mostrando tus propiedades ofertadas)</h3>
            <p>Aquí aparecerían tus locales cargados con su respectivo contador de IUBs interesados.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// VISTA 3: DETALLE DEL MATCH (Pantallazos 8, 9, 14, 15)
// ==========================================
function MatchDetailView({ onNavigate }) {
  const [matches, setMatches] = useState(MOCK_MATCHES);

  const updateEstado = (id, nuevoEstado) => {
    setMatches(matches.map(m => m.id === id ? { ...m, estado: nuevoEstado } : m));
  };

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', fontWeight: 700, marginBottom: '24px', fontSize: '1rem' }}>← Volver a Mis IUBs</button>

      {/* Header del IUB */}
      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px', borderLeft: `6px solid ${THEME.colors.primary}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: THEME.colors.primary, fontWeight: 700, marginBottom: '8px' }}>{MOCK_IUB.id}</div>
            <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text }}>{MOCK_IUB.cantidad} Locales en {MOCK_IUB.ciudad} zona {MOCK_IUB.zona}</h2>
            <p style={{ margin: '0 0 8px 0', color: THEME.colors.textLight, fontSize: '1.1rem' }}>{MOCK_IUB.area} por {MOCK_IUB.precio} aprox {MOCK_IUB.precioTotal}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              {MOCK_IUB.caracteristicas.map((car, idx) => (
                <span key={idx} style={{ padding: '6px 14px', background: `${THEME.colors.secondary}30`, color: THEME.colors.text, borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 600 }}>{car}</span>
              ))}
            </div>
          </div>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: THEME.radius.md, minWidth: '250px' }}>
            <div style={{ fontSize: '0.85rem', color: THEME.colors.textLight, marginBottom: '8px', fontWeight: 700 }}>TIPO DE NEGOCIO</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: THEME.colors.text, marginBottom: '16px' }}>{MOCK_IUB.tipo}</div>
            <div style={{ fontSize: '0.85rem', color: THEME.colors.textLight, marginBottom: '8px', fontWeight: 700 }}>CREADO</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: THEME.colors.text }}>{MOCK_IUB.fecha}</div>
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
              <div style={{ display: 'flex', gap: '16px', color: THEME.colors.textLight, fontSize: '0.9rem', marginBottom: '12px' }}>
                <span>📍 {match.ciudad}</span>
                <span>📐 {match.area} m²</span>
                <span>💰 ${match.precioM2.toLocaleString()}/m²</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: THEME.colors.textLight }}>{match.direccion}</div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button onClick={() => updateEstado(match.id, 'Descartado')} style={{ padding: '10px 20px', background: match.estado === 'Descartado' ? '#e2e8f0' : 'white', color: match.estado === 'Descartado' ? THEME.colors.textLight : THEME.colors.textLight, border: `1px solid ${match.estado === 'Descartado' ? 'transparent' : '#e2e8f0'}`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Descartar</button>
              <button onClick={() => updateEstado(match.id, 'Favorito')} style={{ padding: '10px 20px', background: match.estado === 'Favorito' ? THEME.colors.success : 'white', color: match.estado === 'Favorito' ? 'white' : THEME.colors.success, border: `1px solid ${match.estado === 'Favorito' ? 'transparent' : THEME.colors.success}`, borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>Favorito</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// VISTA 4: ADMIN (Pantallazos 13, 14, 16, 17)
// ==========================================
function AdminView({ onNavigate }) {
  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ background: THEME.colors.text, color: 'white', padding: '32px', borderRadius: THEME.radius.lg, marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0' }}>🛡️ Torre de Control (Admin)</h2>
        <p style={{ margin: 0, opacity: 0.8 }}>Gestión de IUBs, Locales y Mediación de Matches</p>
      </div>

      {/* Tabs Admin */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button style={{ padding: '10px 20px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 700 }}>Gestión de IUBs</button>
        <button style={{ padding: '10px 20px', background: 'white', color: THEME.colors.text, border: '1px solid #e2e8f0', borderRadius: THEME.radius.full, cursor: 'pointer', fontWeight: 600 }}>Gestión de Locales</button>
      </div>

      {/* Detalle de IUB con Contacto Confidencial (Pantallazo 14) */}
      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px' }}>
        <h3 style={{ color: THEME.colors.text, marginTop: 0 }}>Detalle de Búsqueda: {MOCK_IUB.id}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
          <div>
            <h4 style={{ color: THEME.colors.primary, marginBottom: '16px' }}>Información de la Búsqueda</h4>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Tipo:</strong> {MOCK_IUB.tipo}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Ubicación:</strong> {MOCK_IUB.cantidad} Locales en {MOCK_IUB.ciudad} zona {MOCK_IUB.zona}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}><strong>Requerimiento:</strong> {MOCK_IUB.area} por {MOCK_IUB.precio}</p>
          </div>
          
          {/* DATOS CONFIDENCIALES SOLO PARA ADMIN */}
          <div style={{ background: '#fff5f5', padding: '24px', borderRadius: THEME.radius.md, border: `1px solid ${THEME.colors.primary}30` }}>
            <h4 style={{ color: THEME.colors.primary, marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>🔒 Contacto Confidencial</h4>
            <p style={{ margin: '8px 0', fontWeight: 700, color: THEME.colors.text, fontSize: '1.1rem' }}>{MOCK_IUB.contacto.empresa}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>📞 T. {MOCK_IUB.contacto.tel}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>✉️ E. {MOCK_IUB.contacto.email}</p>
            <button style={{ marginTop: '16px', width: '100%', padding: '12px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>📅 Agendar Presentación</button>
          </div>
        </div>
      </div>

      {/* Matches del Admin (Pantallazo 15) */}
      <h3 style={{ color: THEME.colors.text }}>Matches Asociados a este IUB</h3>
      <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight }}>TÍTULO</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight }}>ÁREA (M²)</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight }}>PRECIO/m²</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight }}>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_MATCHES.map((match, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{match.titulo}</td>
                <td style={{ padding: '16px' }}>{match.area}</td>
                <td style={{ padding: '16px' }}>${match.precioM2.toLocaleString()}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    background: match.estado === 'Favorito' ? `${THEME.colors.success}20` : match.estado === 'Descartado' ? '#e2e8f0' : `${THEME.colors.primary}15`, 
                    color: match.estado === 'Favorito' ? THEME.colors.success : match.estado === 'Descartado' ? THEME.colors.textLight : THEME.colors.primary, 
                    padding: '6px 14px', borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 700 
                  }}>
                    {match.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
