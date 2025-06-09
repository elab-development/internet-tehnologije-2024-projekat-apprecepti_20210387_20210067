const ConfirmDialog = ({ show, onClose, onConfirm, message }) => {
  if (!show) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm" onClick={onConfirm}>Potvrdi</button>
          <button className="confirm-btn cancel" onClick={onClose}>Otkaži</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
