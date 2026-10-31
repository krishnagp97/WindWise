import { useState } from 'react'
import {
  Activity,
  Bell,
  CalendarDays,
  ChartLine,
  ChevronDown,
  Clock3,
  Database,
  LayoutDashboard,
  Menu,
  Settings,
  Wind,
  Zap,
} from 'lucide-react'
import './App.css'

const navigation = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Forecast analysis', icon: ChartLine },
  { label: 'Accuracy', icon: Activity },
  { label: 'Data sources', icon: Database },
]

const metrics = [
  {
    label: 'Latest wind forecast',
    value: '—',
    unit: 'MW',
    note: 'Awaiting backend data',
    icon: Wind,
  },
  {
    label: 'Actual generation',
    value: '—',
    unit: 'MW',
    note: 'Awaiting backend data',
    icon: Zap,
  },
  {
    label: 'Mean absolute error',
    value: '—',
    unit: 'MW',
    note: 'Accuracy calculation pending',
    icon: Activity,
  },
  {
    label: 'Forecast bias',
    value: '—',
    unit: 'MW',
    note: 'Accuracy calculation pending',
    icon: ChartLine,
  },
]

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">
            <Wind size={23} strokeWidth={2.2} />
          </div>
          <div>
            <span className="brand-name">windwise</span>
            <span className="brand-caption">ENERGY INTELLIGENCE</span>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activePage === label ? 'active' : ''}`}
              onClick={() => {
                setActivePage(label)
                setSidebarOpen(false)
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <div className="sidebar-note">
            <div className="sidebar-note-icon">
              <Activity size={17} />
            </div>
            <div>
              <strong>Day-ahead insights</strong>
              <p>Wind generation intelligence for better procurement decisions.</p>
            </div>
          </div>

          <div className="sidebar-footer">
            <span className="status-dot" />
            <span>WindWise workspace</span>
            <span className="version">v1.0</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <div className="period-selector">
              <CalendarDays size={16} />
              <span>January 2026</span>
              <ChevronDown size={15} />
            </div>
            <button className="notification-button" aria-label="Notifications">
              <Bell size={18} />
              <span />
            </button>
            <div className="avatar">WG</div>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div>
              <div className="eyebrow">WIND GENERATION INTELLIGENCE</div>
              <h1>{activePage}</h1>
              <p>
                Monitor wind generation forecasts and evaluate their accuracy
                for day-ahead procurement.
              </p>
            </div>

            <div className="data-status">
              <span className="status-dot pending" />
              API integration pending
            </div>
          </section>

          <section className="context-strip">
            <div className="context-icon">
              <Clock3 size={19} />
            </div>
            <div className="context-copy">
              <strong>Day-ahead forecast selection</strong>
              <span>
                Forecasts are selected using the latest publication available
                by 10:00 UTC on the previous day.
              </span>
            </div>
            <span className="cutoff-tag">10:00 UTC CUTOFF</span>
          </section>

          <section className="section-heading">
            <div>
              <h2>Performance overview</h2>
              <p>Key indicators for the January 2026 evaluation period</p>
            </div>
            <span className="live-period">JAN 01 — JAN 31, 2026</span>
          </section>

          <section className="metrics-grid">
            {metrics.map(({ label, value, unit, note, icon: Icon }) => (
              <article className="metric-card" key={label}>
                <div className="metric-top">
                  <span>{label}</span>
                  <div className="metric-icon">
                    <Icon size={18} />
                  </div>
                </div>
                <div className="metric-value">
                  {value}
                  <span>{unit}</span>
                </div>
                <div className="metric-note">{note}</div>
              </article>
            ))}
          </section>

          <section className="analysis-grid">
            <article className="panel forecast-panel">
              <div className="panel-heading">
                <div>
                  <h2>Wind generation profile</h2>
                  <p>Forecast versus actual generation</p>
                </div>
                <button className="period-selector compact">
                  <CalendarDays size={15} />
                  January
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="chart-placeholder">
                <div className="placeholder-icon">
                  <ChartLine size={25} />
                </div>
                <strong>Forecast analysis will appear here</strong>
                <span>
                  This chart will compare selected day-ahead forecasts with
                  actual wind generation.
                </span>
                <div className="chart-legend">
                  <span><i className="legend-forecast" /> Forecast</span>
                  <span><i className="legend-actual" /> Actual</span>
                </div>
              </div>
            </article>

            <article className="panel methodology-panel">
              <div className="panel-heading">
                <div>
                  <h2>Evaluation methodology</h2>
                  <p>How WindWise assesses forecast quality</p>
                </div>
              </div>

              <div className="method-list">
                <div className="method-item">
                  <span className="method-number">01</span>
                  <div>
                    <strong>Forecast selection</strong>
                    <p>Use the latest WINDFOR publication available by the day-ahead cutoff.</p>
                  </div>
                </div>
                <div className="method-item">
                  <span className="method-number">02</span>
                  <div>
                    <strong>Actual generation</strong>
                    <p>Compare against WIND generation records from FUELHH.</p>
                  </div>
                </div>
                <div className="method-item">
                  <span className="method-number">03</span>
                  <div>
                    <strong>Accuracy evaluation</strong>
                    <p>Measure forecast error across 30-minute delivery intervals.</p>
                  </div>
                </div>
              </div>

              <div className="source-footer">
                <Database size={16} />
                <span>Data sources: Elexon BMRS · WINDFOR · FUELHH</span>
              </div>
            </article>
          </section>

          <footer className="page-footer">
            <span>WindWise · Wind generation intelligence</span>
            <span>UK electricity market · January 2026</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App