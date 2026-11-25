import { useState } from 'react';
import { getTodayIST, validatePatient } from '../validation';

function getInitialState(patient) {
  if (patient) {
    return {
      name: patient.name ?? '',
      age: String(patient.age ?? ''),
      gender: patient.gender ?? '',
      ward: patient.ward ?? '',
      department: patient.department ?? '',
      doctor: patient.doctor ?? '',
      admission_date: patient.admission_date ?? '',
    };
  }
  return {
    name: '',
    age: '',
    gender: '',
    ward: '',
    department: '',
    doctor: '',
    admission_date: getTodayIST(),
  };
}

export default function PatientForm({
  patient,
  options,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(() => getInitialState(patient));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(patient);
  const maxDate = getTodayIST();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors = validatePatient(form, options);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      ward: form.ward,
      department: form.department,
      doctor: form.doctor,
      admission_date: form.admission_date,
    };

    setSubmitting(true);
    try {
      await onSave(payload);
    } catch (err) {
      if (err.errors && typeof err.errors === 'object') {
        setErrors(err.errors);
      } else {
        setSubmitError(err.message || 'Could not save patient. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="patient-form-title">
      <div className="modal">
        <div className="modal-header">
          <h2 id="patient-form-title">{isEdit ? 'Edit Patient' : 'Add Patient'}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close form"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="patient-form">
          {submitError && <p className="error-banner">{submitError}</p>}

          <div className="form-field">
            <label htmlFor="patient-name">Name</label>
            <input
              id="patient-name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Aarav Kumar"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="patient-age">Age</label>
              <input
                id="patient-age"
                type="number"
                min="0"
                max="120"
                step="1"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="0 - 120"
              />
              {errors.age && <span className="field-error">{errors.age}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="patient-gender">Gender</label>
              <select
                id="patient-gender"
                value={form.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <option value="">Select gender</option>
                {options.genders.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.gender && <span className="field-error">{errors.gender}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="patient-ward">Ward</label>
              <select
                id="patient-ward"
                value={form.ward}
                onChange={(e) => handleChange('ward', e.target.value)}
              >
                <option value="">Select ward</option>
                {options.wards.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.ward && <span className="field-error">{errors.ward}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="patient-department">Department</label>
              <select
                id="patient-department"
                value={form.department}
                onChange={(e) => handleChange('department', e.target.value)}
              >
                <option value="">Select department</option>
                {options.departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.department && (
                <span className="field-error">{errors.department}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="patient-doctor">Doctor</label>
              <select
                id="patient-doctor"
                value={form.doctor}
                onChange={(e) => handleChange('doctor', e.target.value)}
              >
                <option value="">Select doctor</option>
                {options.doctors.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.doctor && <span className="field-error">{errors.doctor}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="patient-admission-date">Admission Date</label>
              <input
                id="patient-admission-date"
                type="date"
                max={maxDate}
                value={form.admission_date}
                onChange={(e) => handleChange('admission_date', e.target.value)}
              />
              {errors.admission_date && (
                <span className="field-error">{errors.admission_date}</span>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
