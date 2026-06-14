export default function FormField({ label, children, className = "" }) {
  return (
    <div className={`field ${className}`}>
      <span className="field__label">{label}</span>
      {children}
    </div>
  );
}