import {
  IconDashboard,
  IconUsers,
  IconBuilding,
  IconBookOpen,
  IconSettings,
  IconGraduationCap,
  IconX
} from "./Icons";

export default function Sidebar({
  activeNav = "Dashboard",
  onSelectNav,
  isOpen = false,
  onClose
}) {
  const navItems = [
    { id: "Dashboard", label: "Dashboard", icon: IconDashboard },
    { id: "All Students", label: "All Students", icon: IconUsers },
    { id: "Departments", label: "Departments", icon: IconBuilding },
    { id: "Academic Records", label: "Academic Records", icon: IconBookOpen },
    { id: "Settings", label: "Settings", icon: IconSettings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-logo-wrap">
            <div className="brand-crest">
              <IconGraduationCap size={22} className="crest-icon" />
            </div>
            <div className="brand-text">
              <span className="brand-badge">Autonomous</span>
              <h2 className="brand-name">SANJIVANI</h2>
              <p className="brand-sub">College of Engineering</p>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="sidebar-college-pill">
          <span className="pill-dot"></span>
          <span>Kopargaon, Maharashtra</span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-group-title">MAIN MENU</p>
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`nav-link ${isActive ? "active" : ""}`}
                    onClick={() => {
                      if (onSelectNav) onSelectNav(item.id);
                      if (onClose) onClose();
                    }}
                  >
                    <span className="nav-icon-wrap">
                      <Icon size={18} />
                    </span>
                    <span className="nav-label">{item.label}</span>
                    {isActive && <span className="active-indicator" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="academic-badge-box">
            <p className="academic-year-title">Academic Year 2026–27</p>
            <p className="academic-year-sub">Affiliated to SPPU, Pune</p>
            <div className="naac-accreditation">NAAC 'A' Grade · NBA Accredited</div>
          </div>
        </div>
      </aside>
    </>
  );
}
