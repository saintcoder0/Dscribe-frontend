import { useCallback, useEffect, useState } from 'react';
import {
  createPatient,
  deletePatient,
  dischargePatient,
  fetchOptions,
  fetchPatients,
  updatePatient,
} from './api';
import ConfirmDialog from './components/ConfirmDialog';
import Filters from './components/Filters';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';

const EMPTY_OPTIONS = {
  genders: [],
  wards: [],
  departments: [],
  doctors: [],
};

export default function App() {
  const [options, setOptions] = useState(EMPTY_OPTIONS);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    ward: '',
    department: '',
    doctor: '',
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deletingPatient, setDeletingPatient] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    fetchOptions()
      .then((data) => {
        if (active && data) {
          setOptions(data);
        }
      })
      .catch(() => {
        if (active) {
          setError('Unable to reach server. Please check that the backend is running.');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetchPatients({
      search: debouncedSearch,
      ward: filters.ward,
      department: filters.department,
      doctor: filters.doctor,
    })
      .then((data) => {
        if (!active) return;
        setPatients(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(() => {
        if (!active) return;
        setError('Unable to reach server. Please check that the backend is running.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [debouncedSearch, filters.ward, filters.department, filters.doctor, refreshTick]);

  const reloadPatients = useCallback(() => {
    setLoading(true);
    setRefreshTick((tick) => tick + 1);
  }, []);

  const handleFilterChange = (field, value) => {
    setLoading(true);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setLoading(true);
    setSearchInput('');
    setDebouncedSearch('');
    setFilters({ ward: '', department: '', doctor: '' });
  };

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (patient) => {
    setEditingPatient(patient);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingPatient(null);
  };

  const handleSavePatient = async (payload) => {
    if (editingPatient) {
      await updatePatient(editingPatient.id, payload);
    } else {
      await createPatient(payload);
    }
    handleCloseForm();
    reloadPatients();
  };

  const handleDischarge = async (patient) => {
    setError('');
    try {
      await dischargePatient(patient.id);
      reloadPatients();
    } catch {
      setError('Failed to discharge patient. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingPatient) return;
    setIsDeleting(true);
    setError('');
    try {
      await deletePatient(deletingPatient.id);
      setDeletingPatient(null);
      reloadPatients();
    } catch {
      setError('Failed to delete patient. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>Patient Admission Management</h1>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          Add Patient
        </button>
      </header>

      <main>
        <Filters
          search={searchInput}
          ward={filters.ward}
          department={filters.department}
          doctor={filters.doctor}
          options={options}
          onSearchChange={setSearchInput}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {error && (
          <p className="error-banner" role="alert">
            {error}
          </p>
        )}

        <PatientList
          patients={patients}
          loading={loading}
          onEdit={handleOpenEdit}
          onDischarge={handleDischarge}
          onDelete={setDeletingPatient}
        />
      </main>

      {formOpen && (
        <PatientForm
          patient={editingPatient}
          options={options}
          onSave={handleSavePatient}
          onClose={handleCloseForm}
        />
      )}

      <ConfirmDialog
        patient={deletingPatient}
        deleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingPatient(null)}
      />
    </div>
  );
}
