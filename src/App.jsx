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
    document.body.style.fontFamily = "'Comfortaa', cursive";
    document.body.style.backgroundColor = THEME.colors.bg;
  }, []);
}

// ==========================================
// COMPONENTES REUTILIZABLES
// ==========================================
function Badge({ children, color = 'primary' }) {
  const colors = {
    primary: { bg: `${THEME.colors.primary}15`, text: THEME.colors.primary },
    success: { bg: `${THEME.colors.success}20`, text: THEME.colors.success },
    warning: { bg: `${THEME.colors.warning}20`, text: THEME.colors.warning },
    gray: { bg: '#e2e8f0', text: THEME.colors.textLight }
  };
  return (
    <span style={{
      background: colors[color].bg,
      color: colors[color].text,
      padding: '6px 14px',
      borderRadius: THEME.radius.full,
      fontSize: '0.85rem',
      fontWeight: 700,
      display: 'inline-block'
    }}>
      {children}
    </span>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: THEME.radius.full,
            background: currentPage === page ? THEME.colors.primary : THEME.colors.white,
            color: currentPage === page ? 'white' : THEME.colors.text,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: currentPage === page ? THEME.shadow : 'none'
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

// ==========================================
// DATOS MOCK
// ==========================================
const MOCK_LOCALES = [
  { id: 1, titulo: 'Local esquinero en Pontevedra', ciudad: 'Cota', codigoPostal: '110141', area: 583, matches: 16, estado: 'Activo' },
  { id: 2, titulo: 'Local comercial en Cajicá', ciudad: 'Cajicá', codigoPostal: '212325', area: 877, matches: 3, estado: 'Activo' },
  { id: 3, titulo: 'Local en Chía', ciudad: 'Chía', codigoPostal: '110141', area: 130, matches: 5, estado: 'Activo' },
  { id: 4, titulo: 'Local en Bogotá Norte', ciudad: 'Bogotá', codigoPostal: '110141', area: 196, matches: 13, estado: 'Activo' },
  { id: 5, titulo: 'Local en Tenjo', ciudad: 'Tenjo', codigoPostal: '101589', area: 647, matches: 3, estado: 'Inactivo' },
  { id: 6, titulo: 'Local en Suba', ciudad: 'Bogotá', codigoPostal: '110141', area: 826, matches: 5, estado: 'Activo' },
  { id: 7, titulo: 'Local en La Vega', ciudad: 'La Vega', codigoPostal: '111618', area: 492, matches: 2, estado: 'Activo' },
  { id: 8, titulo: 'Local en Cota Centro', ciudad: 'Cota', codigoPostal: '212325', area: 600, matches: 3, estado: 'Activo' },
];

const MOCK_IUBS = [
  { id: 'IUB141211', area: 1000, matches: 16, fecha: '29/04/2023 - 09:02', ciudad: 'Bogotá', tipo: 'Arriendo', estado: 'Nuevo', contacto: { empresa: 'Colliers Agregador', tel: '322 695 9898', email: 'ventas@colliers.com' } },
  { id: 'IUB112223', area: 120, matches: 16, fecha: '27/04/2023 - 09:02', ciudad: 'Bogotá', tipo: 'Compra', estado: 'Activo', contacto: { empresa: 'Tiendas D1', tel: '300 123 4567', email: 'expansion@d1.com.co' } },
  { id: 'IUB112423', area: 30, matches: 16, fecha: '27/04/2023 - 09:02', ciudad: 'Bogotá', tipo: 'Arriendo', estado: 'Activo', contacto: { empresa: 'Olimpica', tel: '301 234 5678', email: 'inmobiliario@olimpica.com' } },
  { id: 'IUB112523', area: 70, matches: 2, fecha: '27/04/2023 - 09:02', ciudad: 'Cali', tipo: 'Arriendo', estado: 'Inactivo', contacto: { empresa: 'Pharetra', tel: '302 345 6789', email: 'contacto@pharetra.com' } },
];

const MOCK_MATCHES_IUB = [
  { id: 1, titulo: 'Excelente local en Pontevedra', area: 994, precioM2: 150000, estado: 'Nuevo', direccion: 'Calle 145 # 34-45', ciudad: 'Bogotá zona Norte' },
  { id: 2, titulo: 'Local sobre vía principal', area: 1025, precioM2: 90000, estado: 'Favorito', direccion: 'Cra 15 # 85-20', ciudad: 'Bogotá zona Norte' },
  { id: 3, titulo: 'Local esquinero amplio', area: 1150, precioM2: 95000, estado: 'Favorito', direccion: 'Calle 100 # 19-61', ciudad: 'Bogotá zona Norte' },
  { id: 4, titulo: 'Local en centro comercial', area: 956, precioM2: 80000, estado: 'Favorito', direccion: 'CC Andino', ciudad: 'Bogotá zona Norte' },
  { id: 5, titulo: 'Local premium Suba', area: 880, precioM2: 160000, estado: 'Favorito', direccion: 'Cra 119 # 140-20', ciudad: 'Bogotá zona Norte' },
  { id: 6, titulo: 'Local grande Usaquén', area: 1350, precioM2: 78000, estado: 'Descartado', direccion: 'Calle 170 # 15-30', ciudad: 'Bogotá zona Norte' },
];

// ==========================================
// APP PRINCIPAL
// ==========================================
export default function App() {
  useBrandFont();
  const [view, setView] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* NAVBAR */}
      <nav style={{ background: THEME.colors.white, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => setView('home')} style={{ cursor: 'pointer' }}><Logo size={140} /></div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', fontWeight: 600, color: THEME.colors.text, padding: '8px 16px' }}>Inicio</button>
          <button onClick={() => setView('mis-locales')} style={{ padding: '8px 20px', background: 'transparent', border: `1px solid ${THEME.colors.primary}`, color: THEME.colors.primary, borderRadius: THEME.radius.full, fontWeight: 700 }}>Mis Locales</button>
          <button onClick={() => setView('admin')} style={{ padding: '8px 20px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700 }}>Admin</button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <main style={{ flex: 1 }}>
        {view === 'home' && <HomeView onNavigate={setView} />}
        {view === 'mis-locales' && <MisLocalesView onNavigate={setView} setSelectedItem={setSelectedItem} />}
        {view === 'admin' && <AdminView onNavigate={setView} setSelectedItem={setSelectedItem} />}
        {view === 'admin-iub-detail' && selectedItem && <AdminIUBDetail item={selectedItem} onNavigate={setView} />}
        {view === 'admin-local-detail' && selectedItem && <AdminLocalDetail item={selectedItem} onNavigate={setView} />}
      </main>

      {/* FOOTER */}
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
// HOME VIEW
// ==========================================
function HomeView({ onNavigate }) {
  return (
    <div style={{ padding: '80px 32px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '24px' }}>Bienvenido a <span style={{ color: THEME.colors.primary }}>TerraMatch</span></h1>
      <p style={{ fontSize: '1.2rem', color: THEME.colors.textLight, marginBottom: '48px' }}>La plataforma de matching inteligente para locales comerciales</p>
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
        <button onClick={() => onNavigate('mis-locales')} style={{ padding: '16px 32px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1rem' }}>Ver Mis Locales</button>
        <button onClick={() => onNavigate('admin')} style={{ padding: '16px 32px', background: THEME.colors.dark, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, fontSize: '1rem' }}>Panel Admin</button>
      </div>
    </div>
  );
}

// ==========================================
// MIS LOCALES VIEW (Pantallazo 11)
// ==========================================
function MisLocalesView({ onNavigate, setSelectedItem }) {
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const localesFiltrados = MOCK_LOCALES.filter(l => l.titulo.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
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

      {/* Buscador */}
      <div style={{ background: THEME.colors.white, padding: '24px', borderRadius: THEME.radius.md, boxShadow: THEME.shadow, marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Busca un local..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 20px',
            border: `1px solid #e2e8f0`,
            borderRadius: THEME.radius.full,
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Tabla */}
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
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>OPERACIONES</th>
            </tr>
          </thead>
          <tbody>
            {localesFiltrados.map((local, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem(local); onNavigate('admin-local-detail'); }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{local.titulo}</td>
                <td style={{ padding: '16px' }}>{local.ciudad}</td>
                <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '0.9rem' }}>{local.codigoPostal}</td>
                <td style={{ padding: '16px' }}>{local.area}</td>
                <td style={{ padding: '16px' }}>
                  <Badge color="primary">{local.matches}</Badge>
                </td>
                <td style={{ padding: '16px' }}>
                  <Badge color={local.estado === 'Activo' ? 'success' : 'gray'}>{local.estado}</Badge>
                </td>
                <td style={{ padding: '16px' }}>
                  <button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination currentPage={pagina} totalPages={3} onPageChange={setPagina} />
    </div>
  );
}

// ==========================================
// ADMIN VIEW (Pantallazos 12, 16)
// ==========================================
function AdminView({ onNavigate, setSelectedItem }) {
  const [tab, setTab] = useState('iubs');

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: THEME.colors.dark, color: 'white', padding: '32px', borderRadius: THEME.radius.lg, marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0' }}>🛡️ Panel de Administrador</h2>
        <p style={{ margin: 0, opacity: 0.8 }}>Gestión de IUBs, Locales y Mediación de Matches</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => setTab('iubs')}
          style={{
            padding: '12px 24px',
            background: tab === 'iubs' ? THEME.colors.primary : THEME.colors.white,
            color: tab === 'iubs' ? 'white' : THEME.colors.text,
            border: tab === 'iubs' ? 'none' : `1px solid #e2e8f0`,
            borderRadius: THEME.radius.full,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Gestión de IUBs
        </button>
        <button
          onClick={() => setTab('locales')}
          style={{
            padding: '12px 24px',
            background: tab === 'locales' ? THEME.colors.primary : THEME.colors.white,
            color: tab === 'locales' ? 'white' : THEME.colors.text,
            border: tab === 'locales' ? 'none' : `1px solid #e2e8f0`,
            borderRadius: THEME.radius.full,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Gestión de Locales
        </button>
      </div>

      {/* Tabla IUBs */}
      {tab === 'iubs' && (
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
              {MOCK_IUBS.map((iub, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem(iub); onNavigate('admin-iub-detail'); }}>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{iub.id}</td>
                  <td style={{ padding: '16px' }}>{iub.area}</td>
                  <td style={{ padding: '16px' }}>
                    <Badge color="primary">{iub.matches}</Badge>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem', color: THEME.colors.textLight }}>{iub.fecha}</td>
                  <td style={{ padding: '16px' }}>{iub.ciudad}</td>
                  <td style={{ padding: '16px' }}>{iub.tipo}</td>
                  <td style={{ padding: '16px' }}>
                    <Badge color={iub.estado === 'Nuevo' ? 'warning' : iub.estado === 'Activo' ? 'success' : 'gray'}>{iub.estado}</Badge>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Ver detalles →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabla Locales */}
      {tab === 'locales' && (
        <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TÍTULO</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CIUDAD</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CÓDIGO POSTAL</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA (M²)</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>MATCHES</th>
                <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LOCALES.map((local, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { setSelectedItem(local); onNavigate('admin-local-detail'); }}>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{local.titulo}</td>
                  <td style={{ padding: '16px' }}>{local.ciudad}</td>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '0.9rem' }}>{local.codigoPostal}</td>
                  <td style={{ padding: '16px' }}>{local.area}</td>
                  <td style={{ padding: '16px' }}>
                    <Badge color="primary">{local.matches}</Badge>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button style={{ background: 'none', border: 'none', color: THEME.colors.primary, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Ver detalles →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ADMIN IUB DETAIL (Pantallazos 13, 14, 15)
// ==========================================
function AdminIUBDetail({ item, onNavigate }) {
  const [matches, setMatches] = useState(MOCK_MATCHES_IUB);

  const updateEstado = (id, nuevoEstado) => {
    setMatches(matches.map(m => m.id === id ? { ...m, estado: nuevoEstado } : m));
  };

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
        <button onClick={() => onNavigate('admin')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Admin</button>
        <span style={{ margin: '0 8px' }}>&gt;</span>
        <span style={{ color: THEME.colors.text, fontWeight: 600 }}>{item.id}</span>
      </div>

      {/* Header del IUB con Contacto Confidencial */}
      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Badge color="warning">{item.tipo}</Badge>
              <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: THEME.colors.primary, fontWeight: 700 }}>{item.id}</span>
            </div>
            <p style={{ margin: '0 0 8px 0', color: THEME.colors.textLight, fontSize: '0.9rem' }}>{item.fecha}</p>
            <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.5rem' }}>10 Locales en {item.ciudad} zona Norte</h2>
            <p style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>{item.area} m² por $120.000/m² aprox <strong>$120.000.000/mes</strong></p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Esquinero', 'Vía Principal', 'Permiso de Construcción', 'Uso comercial exclusivo'].map((c, i) => (
                <span key={i} style={{ padding: '6px 14px', background: `${THEME.colors.secondary}30`, color: THEME.colors.text, borderRadius: THEME.radius.full, fontSize: '0.85rem', fontWeight: 600 }}>{c}</span>
              ))}
            </div>
          </div>

          {/* Contacto Confidencial */}
          <div style={{ background: '#fff5f5', padding: '24px', borderRadius: THEME.radius.md, border: `1px solid ${THEME.colors.primary}30` }}>
            <h4 style={{ color: THEME.colors.primary, marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}> Contacto Confidencial</h4>
            <p style={{ margin: '8px 0', fontWeight: 700, color: THEME.colors.text, fontSize: '1.1rem' }}>{item.contacto.empresa}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>📞 T. {item.contacto.tel}</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>✉️ E. {item.contacto.email}</p>
            <button style={{ marginTop: '16px', width: '100%', padding: '12px', background: THEME.colors.primary, color: 'white', border: 'none', borderRadius: THEME.radius.full, fontWeight: 700, cursor: 'pointer' }}>📅 Agendar Presentación</button>
          </div>
        </div>
      </div>

      {/* Matches */}
      <h3 style={{ color: THEME.colors.text, marginBottom: '24px' }}>Esta búsqueda tiene {matches.length} Matches</h3>
      <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TÍTULO</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ÁREA (M²)</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>PRECIO/m²</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{match.titulo}</td>
                <td style={{ padding: '16px' }}>{match.area}</td>
                <td style={{ padding: '16px' }}>${match.precioM2.toLocaleString()}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Badge color={match.estado === 'Favorito' ? 'success' : match.estado === 'Descartado' ? 'gray' : 'warning'}>{match.estado}</Badge>
                    {match.estado !== 'Favorito' && (
                      <button onClick={() => updateEstado(match.id, 'Favorito')} style={{ background: 'none', border: 'none', color: THEME.colors.success, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Favorito</button>
                    )}
                    {match.estado !== 'Descartado' && (
                      <button onClick={() => updateEstado(match.id, 'Descartado')} style={{ background: 'none', border: 'none', color: THEME.colors.textLight, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Descartar</button>
                    )}
                  </div>
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
// ADMIN LOCAL DETAIL (Pantallazo 17)
// ==========================================
function AdminLocalDetail({ item, onNavigate }) {
  const [matches, setMatches] = useState([
    { id: 1, iub: 'IUB141211', contacto: 'Tiendas D1', precioM2: 150000, tipo: 'Arriendo' },
    { id: 2, iub: 'IUB112223', contacto: 'Olimpica', precioM2: 90000, tipo: 'Arriendo' },
    { id: 3, iub: 'IUB112423', contacto: 'Pharetra', precioM2: 95000, tipo: 'Arriendo' },
    { id: 4, iub: 'IUB112523', contacto: 'Risus vitae', precioM2: 80000, tipo: 'Arriendo' },
  ]);

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.9rem', color: THEME.colors.textLight, marginBottom: '24px' }}>
        <button onClick={() => onNavigate('admin')} style={{ background: 'none', border: 'none', color: THEME.colors.primary, cursor: 'pointer', padding: 0 }}>Admin</button>
        <span style={{ margin: '0 8px' }}>&gt;</span>
        <span style={{ color: THEME.colors.text, fontWeight: 600 }}>{item.titulo}</span>
      </div>

      {/* Header del Local */}
      <div style={{ background: THEME.colors.white, padding: '32px', borderRadius: THEME.radius.lg, boxShadow: THEME.shadow, marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div>
            <h2 style={{ margin: '0 0 16px 0', color: THEME.colors.text, fontSize: '1.5rem' }}>{item.titulo}</h2>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <Badge color="primary">{item.ciudad}</Badge>
              <Badge color="success">Arriendo</Badge>
              <Badge color="warning">Venta</Badge>
            </div>
            <p style={{ margin: '0 0 8px 0', color: THEME.colors.text, fontSize: '1.1rem' }}>
              <strong>$7.500.000</strong> /mes · <strong>$3.500.000.000</strong> venta
            </p>
            <p style={{ margin: '0', color: THEME.colors.textLight }}>Calle 98 # 70 91 · Código Postal: {item.codigoPostal}</p>
          </div>

          {/* Contacto del Propietario */}
          <div style={{ background: '#fff5f5', padding: '24px', borderRadius: THEME.radius.md, border: `1px solid ${THEME.colors.primary}30` }}>
            <h4 style={{ color: THEME.colors.primary, marginTop: 0, marginBottom: '16px' }}>🔒 Contacto Propietario</h4>
            <p style={{ margin: '8px 0', fontWeight: 700, color: THEME.colors.text }}>Colliers Agregador</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>📞 T. 322 695 9898</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight }}>✉️ E. ventas@colliers.com</p>
            <p style={{ margin: '8px 0', color: THEME.colors.textLight, fontSize: '0.85rem' }}>Matrícula: C50668973</p>
          </div>
        </div>
      </div>

      {/* Matches Bidireccional */}
      <h3 style={{ color: THEME.colors.text, marginBottom: '24px' }}>Este local tiene {matches.length} Matches (IUBs interesados)</h3>
      <div style={{ background: THEME.colors.white, borderRadius: THEME.radius.md, boxShadow: THEME.shadow, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: `2px solid #e2e8f0` }}>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>IUB</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>CONTACTO</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>PRECIO/m²</th>
              <th style={{ padding: '16px', fontWeight: 700, color: THEME.colors.textLight, fontSize: '0.85rem' }}>TIPO NEGOCIO</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { /* Navegar al detalle del IUB */ }}>
                <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, color: THEME.colors.primary }}>{match.iub}</td>
                <td style={{ padding: '16px', fontWeight: 600 }}>{match.contacto}</td>
                <td style={{ padding: '16px' }}>${match.precioM2.toLocaleString()}</td>
                <td style={{ padding: '16px' }}>
                  <Badge color="primary">{match.tipo}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
