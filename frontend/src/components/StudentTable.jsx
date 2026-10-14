import { IconAlertCircle, IconRefresh, IconSearch } from "./Icons";

function getInitials(firstName, lastName) {
  const f = firstName ? firstName.charAt(0).toUpperCase() : "";
  const l = lastName ? lastName.charAt(0).toUpperCase() : "";
  return f + l || "ST";
}

function getCgpaClass(cgpa) {
  if (cgpa === null || cgpa === undefined || isNaN(cgpa)) return "cgpa-neutral";
  const num = parseFloat(cgpa);
  if (num >= 8.5) return "cgpa-excellent";
  if (num >= 7.5) return "cgpa-good";
  return "cgpa-standard";
}

export default function StudentTable({
  students,
  loading,
  error,
  searchQuery,
  selectedDepartment,
  onResetFilters,
  onRetry
}) {
  if (loading) {
    return (
      <div className="table-state-box loading-state">
        <div className="loading-spinner"></div>
        <h4 className="state-title">Fetching Student Records</h4>
        <p className="state-desc">Connecting to Supabase PostgreSQL database via backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-state-box error-state">
        <div className="error-icon-box">
          <IconAlertCircle size={32} />
        </div>
        <h4 className="state-title">Failed to Load Student Records</h4>
        <p className="state-desc">{error}. Please verify backend server and database connectivity.</p>
        {onRetry && (
          <button type="button" className="btn-retry" onClick={onRetry}>
            <IconRefresh size={16} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    );
  }

  if (!students || students.length === 0) {
    const isFiltered = Boolean(searchQuery || selectedDepartment);
    return (
      <div className="table-state-box empty-state">
        <div className="empty-icon-box">
          <IconSearch size={32} />
        </div>
        <h4 className="state-title">No Students Found</h4>
        <p className="state-desc">
          {isFiltered
            ? `No records match your search criteria "${searchQuery || selectedDepartment}".`
            : "No student records are currently available in the database."}
        </p>
        {isFiltered && onResetFilters && (
          <button type="button" className="btn-reset-filters" onClick={onResetFilters}>
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="table-responsive-container">
      <table className="students-data-table" aria-label="Student records table">
        <thead>
          <tr>
            <th scope="col" className="col-roll">Roll Number</th>
            <th scope="col" className="col-name">Student Name</th>
            <th scope="col" className="col-dept">Department</th>
            <th scope="col" className="col-sem">Semester</th>
            <th scope="col" className="col-div">Division</th>
            <th scope="col" className="col-cgpa">CGPA</th>
            <th scope="col" className="col-status">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const fullName = [
              student.first_name,
              student.middle_name,
              student.last_name
            ]
              .filter(Boolean)
              .join(" ");

            const initials = getInitials(student.first_name, student.last_name);
            const status = student.student_status || "Active";
            const isStatusActive = status.toLowerCase() === "active";

            return (
              <tr key={student.student_id ?? student.roll_number}>
                <td className="col-roll">
                  <span className="roll-badge">{student.roll_number || "—"}</span>
                </td>

                <td className="col-name">
                  <div className="student-profile-cell">
                    <div className="student-avatar" aria-hidden="true">
                      {initials}
                    </div>
                    <div className="student-name-meta">
                      <span className="student-fullname">{fullName || "—"}</span>
                      {student.email && (
                        <span className="student-email">{student.email}</span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="col-dept">
                  <span className="dept-tag">
                    {student.department || "—"}
                  </span>
                </td>

                <td className="col-sem">
                  <span className="meta-badge sem-badge">
                    {student.semester !== null && student.semester !== undefined
                      ? `Sem ${student.semester}`
                      : "—"}
                  </span>
                </td>

                <td className="col-div">
                  <span className="meta-badge div-badge">
                    {student.division !== null && student.division !== undefined
                      ? `Div ${student.division}`
                      : "—"}
                  </span>
                </td>

                <td className="col-cgpa">
                  <span className={`cgpa-pill ${getCgpaClass(student.cgpa)}`}>
                    {student.cgpa !== null && student.cgpa !== undefined
                      ? Number(student.cgpa).toFixed(2)
                      : "—"}
                  </span>
                </td>

                <td className="col-status">
                  <span className={`status-badge ${isStatusActive ? "status-active" : "status-inactive"}`}>
                    <span className="status-badge-dot"></span>
                    <span>{status}</span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
