import { Modal } from './Modal.jsx';

export function FormularioModalDoble({
  titulo,
  // Campo 1
  label1,
  valor1,
  onChange1,
  placeholder1 = '',
  maxLength1 = 100,
  // Campo 2
  label2,
  valor2,
  onChange2,
  placeholder2 = '',
  maxLength2 = 100,
  // Comunes
  onSubmit,
  onCancel,
  guardando,
}) {
  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    fontSize: '0.9rem',
  };

  return (
    <Modal onClose={guardando ? undefined : onCancel} maxWidth="640px">
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{titulo}</h2>

      <form onSubmit={onSubmit}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>{label1}</label>
            <input
              type="text"
              value={valor1}
              onChange={onChange1}
              required
              maxLength={maxLength1}
              autoFocus
              placeholder={placeholder1}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>{label2}</label>
            <input
              type="text"
              value={valor2}
              onChange={onChange2}
              required
              maxLength={maxLength2}
              placeholder={placeholder2}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
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