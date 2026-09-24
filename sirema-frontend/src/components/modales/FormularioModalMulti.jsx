import { Modal } from './Modal.jsx';

/**
 * Modal de formulario con N campos en grid.
 * 
 * Cada campo puede tener:
 *   - key, label, tipo ('text' | 'select' | 'checkbox')
 *   - valor, onChange
 *   - placeholder, maxLength (para text)
 *   - opciones (para select)
 *   - required (default true, ignorado para checkbox)
 *   - ancho: 'completo' (default) | 'medio' — para grid de 2 columnas
 */
export function FormularioModalMulti({
  titulo,
  campos = [],
  onSubmit,
  onCancel,
  guardando,
  maxWidth = '700px',
  textoGuardar = 'Guardar',
  colorGuardar = '#1e40af',   // azul por defecto
}) {
  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.95rem',
    background: 'white',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
    fontSize: '0.9rem',
    color: '#334155',
  };

  return (
    <Modal onClose={guardando ? undefined : onCancel} maxWidth={maxWidth}>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{titulo}</h2>

      <form onSubmit={onSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          {campos.map((campo, i) => {
            const span = campo.ancho === 'completo' || campo.ancho === undefined ? 'auto' : 'auto';
            const gridColumn = campo.ancho === 'completo' ? 'span 2' : 'span 1';

            return (
              <div key={campo.key} style={{ gridColumn }}>
                {campo.tipo === 'checkbox' ? (
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      paddingTop: '1.5rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!campo.valor}
                      onChange={campo.onChange}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#334155' }}>
                      {campo.label}
                    </span>
                  </label>
                ) : (
                  <>
                    <label style={labelStyle}>
                      {campo.label}
                      {campo.required === false && campo.tipo !== 'checkbox' && (
                        <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: '0.35rem' }}>
                          (opcional)
                        </span>
                      )}
                    </label>

                    {campo.tipo === 'select' ? (
                      <select
                        value={campo.valor}
                        onChange={campo.onChange}
                        required={campo.required !== false}
                        style={inputStyle}
                      >
                        {campo.opciones.map((op) => (
                          <option key={op.valor} value={op.valor}>
                            {op.texto}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={campo.valor}
                        onChange={campo.onChange}
                        required={campo.required !== false}
                        maxLength={campo.maxLength || 100}
                        placeholder={campo.placeholder || ''}
                        autoFocus={i === 0}
                        style={inputStyle}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end',
            marginTop: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={guardando}
            style={{
              background: '#e5e7eb',
              color: '#1f2937',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.6rem 1.25rem',
              cursor: guardando ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            style={{
              background: colorGuardar,
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.6rem 1.25rem',
              cursor: guardando ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            {guardando ? 'Guardando…' : textoGuardar}
          </button>
        </div>
      </form>
    </Modal>
  );
}