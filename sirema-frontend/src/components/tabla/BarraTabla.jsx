export function BarraTabla({
  porPagina,
  onCambiarPorPagina,
  busqueda,
  onCambiarBusqueda,
  opcionesPorPagina = [5, 10, 25, 50],
}) {
  const inputStyle = {
    padding: '0.375rem 0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.9rem',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #e5e7eb',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#374151' }}>
        <span>Show</span>
        <select
          value={porPagina}
          onChange={(e) => onCambiarPorPagina(Number(e.target.value))}
          style={inputStyle}
        >
          {opcionesPorPagina.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span>entries</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#374151' }}>
        <span>Search:</span>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onCambiarBusqueda(e.target.value)}
          style={{ ...inputStyle, minWidth: '200px' }}
        />
      </div>
    </div>
  );
}