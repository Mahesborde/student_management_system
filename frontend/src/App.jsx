import { useEffect, useState, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";
import StudentTable from "./components/StudentTable";
import {
  IconUsers,
  IconBuilding,
  IconUserCheck,
  IconAward,
  IconSearch,
  IconFilter,
  IconX
} from "./components/Icons";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch student records from the existing backend API
  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/students");

      if (!response.ok) {
        throw new Error("Unable to fetch student records");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error("Student data could not be loaded");
      }

      setStudents(result.students || []);
    } catch (err) {
      setError(err.message || "Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const response = await fetch("http://localhost:5000/api/students");
        if (!response.ok) {
          throw new Error("Unable to fetch student records");
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error("Student data could not be loaded");
        }
        if (active) {
          setStudents(result.students || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to connect to backend server");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  // Compute unique departments dynamically from real student records
  const departmentsList = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.department && typeof s.department === "string") {
        set.add(s.department.trim());
      }
    });
    return Array.from(set).sort();
  }, [students]);

  // Derived statistics computed from API data
  const totalStudents = students.length;
  const uniqueDepartmentsCount = departmentsList.length;
  const activeStudentsCount = students.filter(
    (s) => (s.student_status || "").toLowerCase() === "active"
  ).length;

  const averageCgpa = useMemo(() => {
    const validCgpas = students
      .map((s) => parseFloat(s.cgpa))
      .filter((n) => !isNaN(n) && n > 0);
    if (validCgpas.length === 0) return "—";
    const sum = validCgpas.reduce((acc, curr) => acc + curr, 0);
    return (sum / validCgpas.length).toFixed(2);
  }, [students]);

  // Filtered student records based on search query and department dropdown
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // 1. Department filter
      if (selectedDepartment !== "ALL") {
        if ((student.department || "").trim() !== selectedDepartment) {
          return false;
        }
      }

      // 2. Search text filter (preserves existing search fields)
      if (!search.trim()) return true;

      const searchText = search.toLowerCase();
      return [
        student.roll_number,
        student.first_name,
        student.middle_name,
        student.last_name,
        student.department,
        student.email,
        student.mobile_number
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(searchText)
      );
    });
  }, [students, search, selectedDepartment]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedDepartment("ALL");
  };

  const isFiltered = search.trim() !== "" || selectedDepartment !== "ALL";

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={(item) => setActiveNav(item)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          isConnected={!error}
          isLoading={loading}
          onRefresh={fetchStudents}
          totalRecords={totalStudents}
        />

        <main className="dashboard-content">
          {/* Welcome Institutional Banner */}
          <section className="welcome-banner">
            <div className="banner-content">
              <span className="banner-badge">Sanjivani Rural Education Society</span>
              <h2 className="banner-title">Sanjivani College of Engineering, Kopargaon</h2>
              <p className="banner-subtitle">
                Autonomous Institute · Approved by AICTE, New Delhi · Affiliated to Savitribai Phule Pune University
              </p>
            </div>
            <div className="banner-stats-pill">
              <span className="pill-dot-live"></span>
              <span>Live Database Synchronized</span>
            </div>
          </section>

          {/* Statistics Cards */}
          <section className="stats-grid" aria-label="Dashboard statistics">
            <StatCard
              title="Total Students"
              value={loading ? "..." : totalStudents}
              subtitle="Enrolled in Supabase DB"
              icon={IconUsers}
              variant="blue"
              trendText="Official Records"
            />
            <StatCard
              title="Departments"
              value={loading ? "..." : uniqueDepartmentsCount}
              subtitle="Engineering Branches"
              icon={IconBuilding}
              variant="indigo"
              trendText="Autonomous Units"
            />
            <StatCard
              title="Active Students"
              value={loading ? "..." : activeStudentsCount}
              subtitle="Current Academic Status"
              icon={IconUserCheck}
              variant="emerald"
              trendText="In Good Standing"
            />
            <StatCard
              title="Average CGPA"
              value={loading ? "..." : averageCgpa}
              subtitle="Cumulative Academic Grade"
              icon={IconAward}
              variant="amber"
              trendText="Current Year"
            />
          </section>

          {/* Student Records Directory Section */}
          <section className="students-directory-card">
            <div className="card-header">
              <div className="card-header-left">
                <h3 className="card-title">Student Records Directory</h3>
                <p className="card-subtitle">
                  Comprehensive listing of all registered students with academic details
                </p>
              </div>

              <div className="card-header-right">
                <span className="results-badge">
                  Showing {filteredStudents.length} of {totalStudents} students
                </span>
              </div>
            </div>

            {/* Search and Filter Toolbar */}
            <div className="table-toolbar">
              <div className="search-input-wrapper">
                <IconSearch size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by student name, roll number, department..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                  aria-label="Search students"
                />
                {search && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearch("")}
                    aria-label="Clear search input"
                  >
                    <IconX size={15} />
                  </button>
                )}
              </div>

              <div className="filter-dropdown-wrapper">
                <IconFilter size={16} className="filter-icon" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="department-select"
                  aria-label="Filter by department"
                >
                  <option value="ALL">All Departments ({uniqueDepartmentsCount})</option>
                  {departmentsList.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {isFiltered && (
                <button
                  type="button"
                  className="btn-clear-filters"
                  onClick={handleResetFilters}
                  title="Reset all filters"
                >
                  <IconX size={14} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Department Filter Pills (Quick filter for convenience) */}
            <div className="quick-dept-tabs" role="tablist" aria-label="Department quick filter">
              <button
                type="button"
                className={`dept-tab-btn ${selectedDepartment === "ALL" ? "active" : ""}`}
                onClick={() => setSelectedDepartment("ALL")}
              >
                All Departments ({totalStudents})
              </button>
              {departmentsList.map((dept) => {
                const count = students.filter((s) => s.department === dept).length;
                return (
                  <button
                    key={dept}
                    type="button"
                    className={`dept-tab-btn ${selectedDepartment === dept ? "active" : ""}`}
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    {dept} ({count})
                  </button>
                );
              })}
            </div>

            {/* Data Table Component */}
            <StudentTable
              students={filteredStudents}
              loading={loading}
              error={error}
              searchQuery={search}
              selectedDepartment={selectedDepartment}
              onResetFilters={handleResetFilters}
              onRetry={fetchStudents}
            />

            {/* Table Footer */}
            {!loading && !error && (
              <div className="card-footer">
                <p className="footer-count-text">
                  Displaying {filteredStudents.length} of {totalStudents} registered students · Sanjivani College of Engineering, Kopargaon
                </p>
                <div className="footer-brand-tag">
                  SRES · Established 1983
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
