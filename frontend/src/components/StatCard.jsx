
export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "blue",
  trendText = null
}) {
  return (
    <article className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-inner">
        <div className="stat-content">
          <p className="stat-label">{title}</p>
          <div className="stat-value-row">
            <h3 className="stat-number">{value}</h3>
          </div>
          <p className="stat-description">{subtitle}</p>
          {trendText && <span className="stat-trend-tag">{trendText}</span>}
        </div>

        <div className={`stat-icon-wrapper variant-${variant}`}>
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </article>
  );
}
