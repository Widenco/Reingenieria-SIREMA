import { Modal } from './Modal.jsx';

/**
 * Modal de formulario con N campos.
 * 
 * campos: array de objetos con:
 *   - key: nombre del campo en el state (ej: 'descripcion')
 *   - label: etiqueta visible
 *   - tipo: 'text' | 'select'
 *   - valor: valor actual
 *   - onChange: función onChange
 *   - placeholder: (opcional, para text)
 *   - maxLength: (opcional, para text)
 *   - opciones: (para select) array de { valor, texto }
 *   - required: (opcional) default true
 */
export function FormularioModalMulti({
  titulo,
  campos = [],
  onSubmit,
  onCancel,
  guardando,
  maxWidth = '560px',
}) {
  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    background: 'white',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    fontSize: '0.9rem',
  };

  return (
    <Modal onClose={guardando ? undefined : onCancel} maxWidth={maxWidth}>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{titulo}</h2>

      <form onSubmit={onSubmit}>
        {campos.map((campo, i) => (
          <div key={campo.key} style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>
              {campo.label}
              {campo.required === false && (
                <span style={{ fontWeight: 400, color: '#6b7280', marginLeft: '0.5rem' }}>
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
          </div>
        ))}

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
              padding: '0.5rem 1rem',
              cursor: guardando ? 'not-allowed' : 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            style={{
              background: '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              cursor: guardando ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}