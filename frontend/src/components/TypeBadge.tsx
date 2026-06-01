export function TypeBadge({ type }: { type: string }) {
  const t = type.toLowerCase();
  return (
    <div className="type-badge">
      <span className={`type-dot type-${t}`} />
      <span>{type}</span>
    </div>
  );
}
