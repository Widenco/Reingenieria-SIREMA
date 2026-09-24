export function Paginacion({
  total,
  paginaActual,
  porPagina,
  onCambiarPagina,
}) {
  if (total === 0) {
    return (
      <div
        style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid #e5e7eb',
          fontSize: '0.9rem',
          color: '#6b7280',
        }}
      >
        No hay registros
      </div>
    );
  }

  const totalPaginas = Math.ceil(total / porPagina);
  const desde = (paginaActual - 1) * porPagina + 1;
  const hasta = Math.min(paginaActual * porPagina, total);

  // Generar array de páginas a mostrar (con elipsis si son muchas)
  const paginas = [];
  const maxBotones = 7;

  if (totalPaginas <= maxBotones) {
    for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
  } else {
    if (paginaActual <= 4) {
      for (let i = 1; i <= 5; i++) paginas.push(i);
      paginas.push('...');
      paginas.push(totalPaginas);
    } else if (paginaActual >= totalPaginas - 3) {
      paginas.push(1);
      paginas.push('...');
      for (let i = totalPaginas - 4; i <= totalPaginas; i++) paginas.push(i);
    } else {
      paginas.push(1);
      paginas.push('...');
      for (let i = paginaActual - 1; i <= paginaActual + 1; i++) paginas.push(i);
      paginas.push('...');
      paginas.push(totalPaginas);
    }
  }

  const btnBase = {
    border: '1px solid #e5e7eb',
    background: 'white',
    color: '#374151',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    minWidth: '38px',
  };

  const btnActivo = {
    ...btnBase,
    background: '#1e40af',
    color: 'white',
    border: '1px solid #1e40af',
    fontWeight: 600,
  };

  const btnDeshabilitado = {
    ...btnBase,
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderTop: '1px solid #e5e7eb',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
        Showing {desde} to {hasta} of {total} entries
      </span>

      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => onCambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          style={paginaActual === 1 ? btnDeshabilitado : btnBase}
        >
          Previous
        </button>

        {paginas.map((p, i) =>
          p === '...' ? (
            <span
              key={`elipsis-${i}`}
              style={{ padding: '0.375rem 0.5rem', color: '#6b7280' }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onCambiarPagina(p)}
              style={p === paginaActual ? btnActivo : btnBase}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onCambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          style={paginaActual === totalPaginas ? btnDeshabilitado : btnBase}
        >
          Next
        </button>
      </div>
    </div>
  );
}