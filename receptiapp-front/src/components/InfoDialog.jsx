const InfoDialog = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn cancel" onClick={onClose}>U redu</button>
        </div>
      </div>
    </div>
  );
};

export default InfoDialog;
