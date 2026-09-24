import { Modal } from './Modal.jsx';

export function ConfirmacionModal({
  titulo = '¿Estás seguro?',
  mensaje = 'El estado del registro se actualizará',
  textoConfirmar = 'Sí, actualizar!',
  textoCancelar = 'Cancel',
  procesando = false,
  onConfirmar,
  onCancelar,
}) {
  return (
    <Modal onClose={onCancelar} maxWidth="480px">
      <div style={{ textAlign: 'center' }}>
        {/* Ícono */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '4px solid #fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem',
            color: '#fbbf24',
            fontWeight: 'bold',
          }}
        >
          !
        </div>

        <h2 style={{ margin: '0 0 0.75rem 0', fontSize: '1.75rem', color: '#1f2937' }}>
          {titulo}
        </h2>

        <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1rem' }}>
          {mensaje}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={procesando}
            style={{
              background: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.6rem 1.5rem',
              cursor: procesando ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            {procesando ? 'Procesando…' : textoConfirmar}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            disabled={procesando}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.6rem 1.5rem',
              cursor: procesando ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            {textoCancelar}
          </button>
        </div>
      </div>
    </Modal>
  );
}