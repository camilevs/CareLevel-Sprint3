export default function Logo({ size = 40, showText = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <img
        src="/Logo.svg"
        alt="Logo"
        width={size}
        height={size}
      />

      {showText && (
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1.2rem',
          color: 'var(--green-dark)',
          letterSpacing: '-0.3px',
        }}>
          CareLevel
        </span>
      )}
    </div>
  );
}