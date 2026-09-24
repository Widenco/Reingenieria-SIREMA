export function Modal({ children, onClose, zIndex = 1000, maxWidth = '480px' }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '2rem',
          width: '100%',
          maxWidth,
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
        }}
      >
        {children}
      </div>
    </div>
  );
}