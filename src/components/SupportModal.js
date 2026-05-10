const BMC_URL = 'https://buymeacoffee.com/welche.partei';

export default function SupportModal({ onClose }) {
  const handleSupport = () => {
    window.open(BMC_URL, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="support-overlay" onClick={onClose}>
      <div className="support-modal" onClick={e => e.stopPropagation()}>
        <div className="support-modal__icon">☕</div>
        <h2 className="support-modal__title">Macht dir das Spiel Spaß?</h2>
        <p className="support-modal__text">
          Welche Partei? ist kostenlos. Ein kleiner Kaffee hilft, das Projekt am Leben zu halten.
        </p>
        <div className="support-modal__actions">
          <button className="support-modal__btn support-modal__btn--primary" onClick={handleSupport}>
            Kaffee spendieren ☕
          </button>
          <button className="support-modal__btn support-modal__btn--secondary" onClick={onClose}>
            Vielleicht später
          </button>
        </div>
      </div>
    </div>
  );
}
