export function BotonPrimario({ children, onClick, disabled, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? '#94a3b8' : '#1e40af',
        color: 'white',
        border: 'none',
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}