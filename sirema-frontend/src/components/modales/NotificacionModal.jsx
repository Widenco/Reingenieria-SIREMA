import { Modal } from './Modal.jsx';

export function NotificacionModal({ tipo = 'exito', titulo, mensaje, onClose }) {
  const esExito = tipo === 'exito';

  return (
    <Modal onClose={onClose} zIndex={1100} maxWidth="480px">
      <div style={{ textAlign: 'center' }}>
        {/* Ícono */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: `4px solid ${esExito ? '#86efac' : '#fca5a5'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem',
            color: esExito ? '#22c55e' : '#dc2626',
            fontWeight: 'bold',
          }}
        >
          {esExito ? '✓' : '✕'}
        </div>

        <h2
          style={{
            margin: '0 0 0.75rem 0',
            fontSize: '1.75rem',
            color: '#1f2937',
          }}
        >
          {titulo}
        </h2>

        <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1rem' }}>
          {mensaje}
        </p>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: esExito ? '#8b5cf6' : '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            padding: '0.6rem 2rem',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
          }}
        >
          OK
        </button>
      </div>
    </Modal>
  );
}