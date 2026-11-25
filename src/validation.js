const NAME_REGEX = /^[A-Za-z]+( [A-Za-z]+)*$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function getTodayIST() {
  const istMs = Date.now() + 330 * 60 * 1000;
  const ist = new Date(istMs);
  const year = ist.getUTCFullYear();
  const month = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const day = String(ist.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidISODate(value) {
  if (!DATE_REGEX.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

export function validatePatient(form, options) {
  const errors = {};

  const trimmedName = String(form.name ?? '').trim();
  if (!trimmedName) {
    errors.name = 'Name is required';
  } else if (!NAME_REGEX.test(trimmedName)) {
    errors.name = 'Name must contain letters only';
  }

  const ageStr = String(form.age ?? '').trim();
  if (!ageStr) {
    errors.age = 'Age is required';
  } else if (!/^-?\d+$/.test(ageStr)) {
    errors.age = 'Age must be a number between 0 and 120';
  } else {
    const ageNum = Number(ageStr);
    if (ageNum < 0 || ageNum > 120) {
      errors.age = 'Age must be a number between 0 and 120';
    }
  }

  const genders = options?.genders || [];
  if (!form.gender || !genders.includes(form.gender)) {
    errors.gender = 'Please select a valid gender';
  }

  const wards = options?.wards || [];
  if (!form.ward || !wards.includes(form.ward)) {
    errors.ward = 'Please select a valid ward';
  }

  const departments = options?.departments || [];
  if (!form.department || !departments.includes(form.department)) {
    errors.department = 'Please select a valid department';
  }

  const doctors = options?.doctors || [];
  if (!form.doctor || !doctors.includes(form.doctor)) {
    errors.doctor = 'Please select a valid doctor';
  }

  const dateStr = String(form.admission_date ?? '').trim();
  if (!dateStr) {
    errors.admission_date = 'Admission date is required';
  } else if (!isValidISODate(dateStr)) {
    errors.admission_date = 'Admission date must be a valid date';
  } else if (dateStr > getTodayIST()) {
    errors.admission_date = 'Admission date cannot be in the future';
  }

  return errors;
}
