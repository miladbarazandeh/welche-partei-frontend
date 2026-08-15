export default function PartyPicker({ label, parties, selected, onSelect }) {
  if (!parties || parties.length === 0) return null;

  return (
    <div className="wp-party-picker">
      {label && <p className="wp-party-picker__label">{label}</p>}
      <div className="wp-party-picker__grid">
        {parties.map((party) => {
          const isSelected = selected === party.id;
          return (
            <button
              key={party.id}
              type="button"
              className={`wp-party-picker__btn${isSelected ? ' wp-party-picker__btn--selected' : ''}`}
              style={{
                '--party-color': party.color_hex || '#6b7280',
              }}
              onClick={() => onSelect(isSelected ? '' : party.id)}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <span className="wp-party-picker__check" aria-hidden="true">✓</span>
              )}
              {party.short_name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
