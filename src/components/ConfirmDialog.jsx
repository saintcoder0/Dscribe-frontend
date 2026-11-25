export default function ConfirmDialog({
  patient,
  deleting,
  onConfirm,
  onCancel,
}) {
  if (!patient) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal modal-confirm">
        <h2 id="confirm-title">Confirm Delete</h2>
        <p className="confirm-message">
          Are you sure you want to delete {patient.name}?
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
