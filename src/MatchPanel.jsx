import { useState, useCallback } from "react";
import * as XLSX from "xlsx";

const COLOR = { red: "#CC0000", navy: "#0D0F1A", gold: "#E8A020", green: "#1A8A3A", gray: "#888" };

const normalize = (s) => (s || "").toString().toLowerCase().trim();
const parseNum = (v) => parseFloat((v || "0").toString().replace(/[^0-9.]/g, "")) || 0;
const parseArr = (v) => (v || "").toString().split(",").map(s => normalize(s)).filter(Boolean);

function calcMatch(tengo, busco) {
  const criteria = [];

  // 1. Ciudad
  const ciudadT = normalize(tengo.ciudad || tengo.ciudadBusqueda);
  const ciudadB = normalize(busco.ciudadBusqueda || busco.ciudad);
  const ciudadOk = ciudadT && ciudadB && ciudadT === ciudadB;
  criteria.push({ label: "Ciudad", ok: ciudadOk, detail: `${tengo.ciudad || tengo.ciudadBusqueda} / ${busco.ciudadBusqueda || busco.ciudad}` });

  // 2. Tipo de negocio
  const tipoOk = normalize(tengo.tipoNegocio) === normalize(busco.tipoNegocio);
  criteria.push({ label: "Tipo", ok: tipoOk, detail: `${tengo.tipoNegocio} / ${busco.tipoNegocio}` });

  // 3. Área ±10%
  const areaT = parseNum(tengo.areaTotalMin);
  const areaMinB = parseNum(busco.areaTotalMin) * 0.9;
  const areaMaxB = parseNum(busco.areaTotalMax) * 1.1;
  const areaOk = areaT > 0 && areaMinB > 0 && areaT >= areaMinB && areaT <= areaMaxB;
  criteria.push({ label: "Área m²", ok: areaOk, detail: `Local: ${areaT}m² / Busca: ${parseNum(busco.areaTotalMin)}–${parseNum(busco.areaTotalMax)}m² (±10%)` });

  // 4. Uso del suelo
  const usoT = parseArr(tengo.usoSuelo);
  const usoB = parseArr(busco.usoSuelo);
  const usoOk = usoT.some(u => usoB.includes(u));
  criteria.push({ label: "Uso del suelo", ok: usoOk, detail: `${tengo.usoSuelo} / ${busco.usoSuelo}` });

  // 5. Presupuesto vs canon ±10%
  const esArriendo = normalize(tengo.tipoNegocio).includes("arriendo");
  let presOk = false;
  let presDetail = "";
  if (esArriendo) {
    const canon = parseNum(tengo.canonArriendo);
    const maxCanon = parseNum(busco.canonMaximo) * 1.1;
    presOk = canon > 0 && maxCanon > 0 && canon <= maxCanon;
    presDetail = `Canon: $${canon.toLocaleString()} / Máx: $${parseNum(busco.canonMaximo).toLocaleString()} (±10%)`;
  } else {
    const precio = parseNum(tengo.precioVenta);
    const maxPres = parseNum(busco.presupuestoCompra) * 1.1;
    presOk = precio > 0 && maxPres > 0 && precio <= maxPres;
    presDetail = `Precio: $${precio.toLocaleString()} / Pres: $${parseNum(busco.presupuestoCompra).toLocaleString()} (±10%)`;
  }
  criteria.push({ label: "Precio / Canon", ok: presOk, detail: presDetail });

  // 6. Barrio / Zona
  const barrioT = normalize(tengo.barrioZona);
  const barrioB = normalize(busco.barrioZona);
  const barrioOk = barrioT && barrioB && (barrioT.includes(barrioB) || barrioB.includes(barrioT));
  criteria.push({ label: "Barrio / Zona", ok: barrioOk, detail: `${tengo.barrioZona} / ${busco.barrioZona}` });

  const score = criteria.filter(c => c.ok).length;
  const isMatch = criteria.every(c => c.ok);
  return { criteria, score, total: criteria.length, isMatch };
}

function parseSheet(data) {
  if (!data || data.length === 0) return [];
  const headers = data[0].map(h => (h || "").toString().trim());
  return data.slice(1).filter(row => row.some(c => c)).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (row[i] || "").toString().trim(); });
    return obj;
  });
}

function UploadZone({ label, color, onData, count }) {
  const [drag, setDrag] = useState(false);

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      onData(parseSheet(data));
    };
    reader.readAsBinaryString(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const onChange = (e) => { if (e.target.files[0]) processFile(e.target.files[0]); };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      style={{
        border: `2px dashed ${drag ? color : "#DDD"}`,
        borderRadius: 12, padding: 24, textAlign: "center",
        background: drag ? `${color}08` : "#FAFAFA",
        transition: "all 0.2s", cursor: "pointer",
      }}
      onClick={() => document.getElementById(`file-${label}`).click()}
    >
      <input id={`file-${label}`} type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={onChange} />
      <div style={{ fontSize: 28, marginBottom: 8 }}>{count > 0 ? "✅" : "📂"}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: count > 0 ? COLOR.green : "#333", marginBottom: 4 }}>
        {count > 0 ? `${count} registros cargados` : label}
      </div>
      <div style={{ fontSize: 11, color: "#999" }}>
        {count > 0 ? "Clic para reemplazar" : "Arrastra o clic — Excel o CSV"}
      </div>
    </div>
  );
}

function MatchCard({ tengo, busco, result, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: `1.5px solid ${result.isMatch ? "#1A8A3A" : "#EEE"}`,
      borderRadius: 12, overflow: "hidden", marginBottom: 12,
      background: result.isMatch ? "#F0FFF4" : "#FFF",
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: result.isMatch ? COLOR.green : COLOR.red,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#FFF", fontSize: 13, fontWeight: 800,
          }}>
            {result.score}/{result.total}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>
              🏪 {tengo.nombre || tengo.identificacion || `Local #${idx + 1}`}
              <span style={{ color: "#999", fontWeight: 400, margin: "0 8px" }}>→</span>
              🔍 {busco.nombre || busco.email || `Buscador #${idx + 1}`}
            </div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
              {tengo.ciudad || tengo.ciudadBusqueda} · {tengo.tipoNegocio} · {tengo.areaTotalMin}m²
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {result.isMatch && <span style={{ fontSize: 10, fontWeight: 700, color: COLOR.green, background: "#D4EDDA", padding: "3px 10px", borderRadius: 20, letterSpacing: "0.08em" }}>MATCH ✓</span>}
          <span style={{ color: "#BBB", fontSize: 16 }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid #F0F0F0", padding: "14px 18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            {result.criteria.map(c => (
              <div key={c.label} style={{
                padding: "8px 12px", borderRadius: 8,
                background: c.ok ? "#F0FFF4" : "#FFF5F5",
                border: `1px solid ${c.ok ? "#A8D5B5" : "#FFCDD2"}`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: c.ok ? COLOR.green : COLOR.red, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
                  {c.ok ? "✓" : "✗"} {c.label}
                </div>
                <div style={{ fontSize: 11, color: "#555" }}>{c.detail}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#F9F9F9", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: COLOR.red, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>🏪 Tengo Local</div>
              {[["Nombre", tengo.nombre], ["Email", tengo.email], ["Teléfono", tengo.telefono], ["Dirección", tengo.direccion]].filter(([,v]) => v).map(([k,v]) => (
                <div key={k} style={{ fontSize: 11, color: "#444", marginBottom: 3 }}><span style={{ color: "#999" }}>{k}:</span> {v}</div>
              ))}
            </div>
            <div style={{ background: "#F9F9F9", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#1A6B8A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>🔍 Busca Local</div>
              {[["Nombre", busco.nombre], ["Email", busco.email], ["Teléfono", busco.telefono], ["Actividad", busco.actividadNegocio]].filter(([,v]) => v).map(([k,v]) => (
                <div key={k} style={{ fontSize: 11, color: "#444", marginBottom: 3 }}><span style={{ color: "#999" }}>{k}:</span> {v}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchPanel() {
  const [tengoData, setTengoData] = useState([]);
  const [buscoData, setBuscoData] = useState([]);
  const [matches, setMatches] = useState(null);
  const [filtro, setFiltro] = useState("todos");

  const calcularMatches = () => {
    const results = [];
    tengoData.forEach((tengo) => {
      buscoData.forEach((busco) => {
        const result = calcMatch(tengo, busco);
        results.push({ tengo, busco, result });
      });
    });
    results.sort((a, b) => b.result.score - a.result.score);
    setMatches(results);
  };

  const matchesValidos = matches ? matches.filter(m => m.result.isMatch) : [];
  const matchesParciales = matches ? matches.filter(m => !m.result.isMatch && m.result.score >= 4) : [];
  const mostrar = filtro === "validos" ? matchesValidos : filtro === "parciales" ? matchesParciales : (matches || []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F4F4F6; font-family: 'DM Sans', sans-serif; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F4F4F6" }}>

        {/* TOP BAR */}
        <div style={{ background: "#0D0F1A", padding: "0 28px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: COLOR.red, letterSpacing: "-0.02em" }}>terramatch</span>
            <span style={{ width: 1, height: 18, background: "rgba(255,255,255,0.15)" }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Motor de Match</span>
          </div>
          {matches && (
            <div style={{ fontSize: 11, color: COLOR.gold, fontWeight: 700 }}>
              {matchesValidos.length} matches encontrados
            </div>
          )}
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 16px" }}>

          {/* UPLOAD SECTION */}
          <div style={{ background: "#FFF", borderRadius: 16, padding: 28, border: "1px solid #E8E8E8", marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E", fontFamily: "'Syne', sans-serif", marginBottom: 6 }}>
              Cargar datos del IUB
            </div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>
              Exporta cada pestaña de tu Google Sheets como Excel o CSV y súbela aquí.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <UploadZone label="🏪 Tengo Locales" color={COLOR.red} onData={setTengoData} count={tengoData.length} />
              <UploadZone label="🔍 Busco Locales" color="#1A6B8A" onData={setBuscoData} count={buscoData.length} />
            </div>
            <button
              onClick={calcularMatches}
              disabled={tengoData.length === 0 || buscoData.length === 0}
              style={{
                width: "100%", padding: "13px 0",
                background: tengoData.length > 0 && buscoData.length > 0 ? `linear-gradient(135deg, ${COLOR.red}, #990000)` : "#E0E0E0",
                color: "#FFF", border: "none", borderRadius: 8,
                fontSize: 13, fontWeight: 700, cursor: tengoData.length > 0 && buscoData.length > 0 ? "pointer" : "not-allowed",
                fontFamily: "'Syne', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase",
              }}
            >
              Calcular Matches →
            </button>
          </div>

          {/* RESULTS */}
          {matches && (
            <div>
              {/* STATS */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Combinaciones analizadas", value: matches.length, color: "#1A1A2E" },
                  { label: "Matches perfectos", value: matchesValidos.length, color: COLOR.green },
                  { label: "Matches parciales (4+ criterios)", value: matchesParciales.length, color: COLOR.gold },
                ].map(s => (
                  <div key={s.label} style={{ background: "#FFF", borderRadius: 12, padding: "16px 18px", border: "1px solid #E8E8E8" }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* FILTER */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[
                  { key: "todos", label: `Todos (${matches.length})` },
                  { key: "validos", label: `✓ Perfectos (${matchesValidos.length})` },
                  { key: "parciales", label: `~ Parciales (${matchesParciales.length})` },
                ].map(f => (
                  <button key={f.key} onClick={() => setFiltro(f.key)} style={{
                    padding: "7px 16px", borderRadius: 20, border: `2px solid ${filtro === f.key ? COLOR.red : "#DDD"}`,
                    background: filtro === f.key ? COLOR.red : "#FFF", color: filtro === f.key ? "#FFF" : "#555",
                    fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {f.label}
                  </button>
                ))}
              </div>

              {/* MATCH LIST */}
              {mostrar.length === 0 ? (
                <div style={{ background: "#FFF", borderRadius: 12, padding: 40, textAlign: "center", border: "1px solid #E8E8E8" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                  <div style={{ fontSize: 14, color: "#888" }}>No hay matches en esta categoría</div>
                </div>
              ) : (
                mostrar.map((m, i) => (
                  <MatchCard key={i} tengo={m.tengo} busco={m.busco} result={m.result} idx={i} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
