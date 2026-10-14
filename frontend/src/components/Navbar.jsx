import { IconMenu, IconRefresh } from "./Icons";

export default function Navbar({
  onOpenSidebar,
  isConnected = true,
  isLoading = false,
  onRefresh
}) {
  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
        >
          <IconMenu size={22} />
        </button>

        <div className="navbar-title-group">
          <div className="college-eyebrow">
            <span className="college-name-tag">SANJIVANI COLLEGE OF ENGINEERING, KOPARGAON</span>
            <span className="pill-divider">•</span>
            <span className="college-dept-tag">EXAMINATION & STUDENT RECORDS</span>
          </div>
          <h1 className="navbar-page-title">Student Management Dashboard</h1>
        </div>
      </div>

      <div className="navbar-right">
        {/* Backend Connectivity Status */}
        <div className={`status-pill ${isConnected ? "connected" : "disconnected"}`}>
          <span className="status-ping-dot">
            <span className="ping-anim"></span>
            <span className="ping-core"></span>
          </span>
          <span className="status-text">
            {isConnected ? "Backend Connected" : "Backend Disconnected"}
          </span>
        </div>

        {/* Quick Refresh Button */}
        <button
          type="button"
          className={`btn-refresh ${isLoading ? "is-refreshing" : ""}`}
          onClick={onRefresh}
          title="Refresh student records from Supabase"
          aria-label="Refresh student data"
          disabled={isLoading}
        >
          <IconRefresh size={16} />
          <span className="btn-refresh-text">Refresh</span>
        </button>

        {/* Admin Profile Pill */}
        <div className="admin-profile-pill">
          <div className="avatar-initials">SC</div>
          <div className="admin-profile-meta">
            <span className="admin-name">Admin Office</span>
            <span className="admin-role">SCOE Kopargaon</span>
          </div>
        </div>
      </div>
    </header>
  );
}
