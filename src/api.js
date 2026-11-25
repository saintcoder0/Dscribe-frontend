const API_BASE = (import.meta.env.BACKEND_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

async function handleResponse(res) {
  if (res.status === 204) {
    return null;
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const error = new Error(data?.detail || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
}

export async function fetchOptions() {
  const res = await fetch(`${API_BASE}/api/options`);
  return handleResponse(res);
}

export async function fetchPatients({ search = '', ward = '', department = '', doctor = '' } = {}) {
  const params = new URLSearchParams();
  if (search.trim()) params.set('search', search.trim());
  if (ward) params.set('ward', ward);
  if (department) params.set('department', department);
  if (doctor) params.set('doctor', doctor);

  const query = params.toString();
  const url = query ? `${API_BASE}/api/patients?${query}` : `${API_BASE}/api/patients`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function createPatient(payload) {
  const res = await fetch(`${API_BASE}/api/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updatePatient(id, payload) {
  const res = await fetch(`${API_BASE}/api/patients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function dischargePatient(id) {
  const res = await fetch(`${API_BASE}/api/patients/${id}/discharge`, {
    method: 'PATCH',
  });
  return handleResponse(res);
}

export async function deletePatient(id) {
  const res = await fetch(`${API_BASE}/api/patients/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}
