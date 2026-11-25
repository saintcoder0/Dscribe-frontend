export default function Filters({
  search,
  ward,
  department,
  doctor,
  options,
  onSearchChange,
  onFilterChange,
  onClear,
}) {
  const hasActiveFilters = Boolean(search || ward || department || doctor);

  return (
    <section className="filters-bar" aria-label="Search and filter patients">
      <div className="filter-group filter-search">
        <label htmlFor="search-name">Search by Name</label>
        <input
          id="search-name"
          type="text"
          placeholder="Search patient name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="filter-ward">Ward</label>
        <select
          id="filter-ward"
          value={ward}
          onChange={(e) => onFilterChange('ward', e.target.value)}
        >
          <option value="">All</option>
          {options.wards.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-department">Department</label>
        <select
          id="filter-department"
          value={department}
          onChange={(e) => onFilterChange('department', e.target.value)}
        >
          <option value="">All</option>
          {options.departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-doctor">Doctor</label>
        <select
          id="filter-doctor"
          value={doctor}
          onChange={(e) => onFilterChange('doctor', e.target.value)}
        >
          <option value="">All</option>
          {options.doctors.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClear}
          disabled={!hasActiveFilters}
        >
          Clear filters
        </button>
      </div>
    </section>
  );
}
