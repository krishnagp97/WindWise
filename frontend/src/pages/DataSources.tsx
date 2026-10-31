import {
  Database,
  CloudDownload,
  Clock3,
  Activity,
  CheckCircle2,
} from "lucide-react";

function DataSources() {
  return (
    <section className="data-sources-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">DATA INFRASTRUCTURE</div>
          <h1>Data Sources</h1>
          <p>
            Explore the datasets and processing methodology behind WindWise.
          </p>
        </div>
      </div>

      <section className="metrics-grid">
        <article className="metric-card">
          <div className="metric-top">
            <span>Forecast dataset</span>
            <div className="metric-icon">
              <CloudDownload size={18} />
            </div>
          </div>
          <div className="metric-value">WINDFOR</div>
          <div className="metric-note">Wind generation forecasts</div>
        </article>

        <article className="metric-card">
          <div className="metric-top">
            <span>Actual dataset</span>
            <div className="metric-icon">
              <Database size={18} />
            </div>
          </div>
          <div className="metric-value">FUELHH</div>
          <div className="metric-note">Actual wind generation</div>
        </article>

        <article className="metric-card">
          <div className="metric-top">
            <span>Actual resolution</span>
            <div className="metric-icon">
              <Clock3 size={18} />
            </div>
          </div>
          <div className="metric-value">30 min</div>
          <div className="metric-note">Half-hourly source readings</div>
        </article>

        <article className="metric-card">
          <div className="metric-top">
            <span>Evaluation period</span>
            <div className="metric-icon">
              <Activity size={18} />
            </div>
          </div>
          <div className="metric-value">January</div>
          <div className="metric-note">01–31, 2026</div>
        </article>
      </section>

      <section className="analysis-grid">
        <article className="panel methodology-panel">
          <div className="panel-heading">
            <div>
              <h2>Forecast data — WINDFOR</h2>
              <p>National wind generation forecast dataset</p>
            </div>
          </div>

          <div className="method-list">
            <div className="method-item">
              <span className="method-number">01</span>
              <div>
                <strong>startTime</strong>
                <p>Delivery period the forecast applies to.</p>
              </div>
            </div>

            <div className="method-item">
              <span className="method-number">02</span>
              <div>
                <strong>publishTime</strong>
                <p>Time at which the forecast was published.</p>
              </div>
            </div>

            <div className="method-item">
              <span className="method-number">03</span>
              <div>
                <strong>generation</strong>
                <p>Forecast wind generation in MW.</p>
              </div>
            </div>
          </div>
        </article>

        <article className="panel methodology-panel">
          <div className="panel-heading">
            <div>
              <h2>Actual data — FUELHH</h2>
              <p>Half-hourly national generation records</p>
            </div>
          </div>

          <div className="method-list">
            <div className="method-item">
              <span className="method-number">01</span>
              <div>
                <strong>fuelType = WIND</strong>
                <p>Only wind generation records are considered.</p>
              </div>
            </div>

            <div className="method-item">
              <span className="method-number">02</span>
              <div>
                <strong>startTime</strong>
                <p>Timestamp identifying the generation interval.</p>
              </div>
            </div>

            <div className="method-item">
              <span className="method-number">03</span>
              <div>
                <strong>generation</strong>
                <p>Measured wind generation in MW.</p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="panel source-method-panel">
        <div className="panel-heading">
          <div>
            <h2>Data processing pipeline</h2>
            <p>How source records become forecast accuracy results</p>
          </div>
        </div>

        <div className="source-pipeline">
          <div className="pipeline-step">
            <CloudDownload size={20} />
            <strong>Data ingestion</strong>
            <span>Retrieve WINDFOR and FUELHH from Elexon</span>
          </div>

          <div className="pipeline-step">
            <Clock3 size={20} />
            <strong>Time alignment</strong>
            <span>Align forecasts and actual delivery periods</span>
          </div>

          <div className="pipeline-step">
            <Activity size={20} />
            <strong>Aggregation</strong>
            <span>Average two half-hourly actual readings</span>
          </div>

          <div className="pipeline-step">
            <CheckCircle2 size={20} />
            <strong>Evaluation</strong>
            <span>Calculate forecast accuracy metrics</span>
          </div>
        </div>
      </section>

      <footer className="page-footer">
        <span>Source provider: Elexon BMRS</span>
        <span>National GB wind generation data</span>
      </footer>
    </section>
  );
}

export default DataSources;