export default function PatientList({
  patients,
  loading,
  onEdit,
  onDischarge,
  onDelete,
}) {
  if (loading) {
    return <p className="status-text">Loading patients...</p>;
  }

  if (patients.length === 0) {
    return <p className="status-text empty-state">No patients found</p>;
  }

  const renderBadge = (status) => (
    <span
      className={`badge ${
        status === 'Admitted' ? 'badge-admitted' : 'badge-discharged'
      }`}
    >
      {status}
    </span>
  );

  const renderActions = (patient) => {
    const isDischarged = patient.status === 'Discharged';
    return (
      <div className="row-actions">
        <button
          type="button"
          className="btn btn-small btn-secondary"
          onClick={() => onEdit(patient)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-small btn-warning"
          onClick={() => onDischarge(patient)}
          disabled={isDischarged}
        >
          Discharge
        </button>
        <button
          type="button"
          className="btn btn-small btn-danger"
          onClick={() => onDelete(patient)}
        >
          Delete
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="table-wrapper">
        <table className="patient-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Ward</th>
              <th>Department</th>
              <th>Doctor</th>
              <th>Admission Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="cell-name">{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.ward}</td>
                <td>{patient.department}</td>
                <td>{patient.doctor}</td>
                <td>{patient.admission_date}</td>
                <td>{renderBadge(patient.status)}</td>
                <td>{renderActions(patient)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cards-list">
        {patients.map((patient) => (
          <article key={patient.id} className="patient-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">{patient.name}</h3>
                <p className="card-subtitle">
                  {patient.age} yrs &middot; {patient.gender}
                </p>
              </div>
              {renderBadge(patient.status)}
            </div>

            <dl className="card-details">
              <div>
                <dt>Ward</dt>
                <dd>{patient.ward}</dd>
              </div>
              <div>
                <dt>Department</dt>
                <dd>{patient.department}</dd>
              </div>
              <div>
                <dt>Doctor</dt>
                <dd>{patient.doctor}</dd>
              </div>
              <div>
                <dt>Admission Date</dt>
                <dd>{patient.admission_date}</dd>
              </div>
            </dl>

            <div className="card-footer">{renderActions(patient)}</div>
          </article>
        ))}
      </div>
    </>
  );
}
