import { Modal } from './Modal.jsx';

export function FormularioModal({
  titulo,
  label,
  valor,
  onChange,
  onSubmit,
  onCancel,
  guardando,
  placeholder = '',
  maxLength = 100,
}) {
  return (
    <Modal onClose={guardando ? undefined : onCancel} maxWidth="500px">
      <h2 style={{ marginTop: 0 }}>{titulo}</h2>

      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          {label}
        </label>
        <input
          type="text"
          value={valor}
          onChange={onChange}
          required
          maxLength={maxLength}
          autoFocus
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            marginBottom: '1.5rem',
            fontSize: '1rem',
          }}
        />

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