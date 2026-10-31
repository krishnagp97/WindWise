import type { AccuracyResponse } from "../types/accuracy";
import {
  Activity,
  ChartLine,
  Database,
  Target,
} from "lucide-react";

interface AccuracyProps {
  data: AccuracyResponse | null;
  loading: boolean;
  error: string | null;
}

function Accuracy({ data, loading, error }: AccuracyProps) {
  if (loading) {
    return <div className="page-loading">Loading accuracy analysis...</div>;
  }

  if (error || !data) {
    return (
      <div className="page-error">
        {error ?? "No accuracy data available."}
      </div>
    );
  }

  const metrics = [
    {
      label: "Mean Absolute Error",
      value: data.metrics.mae,
      unit: "MW",
      description: "Average absolute forecast error",
      icon: Activity,
    },
    {
      label: "Root Mean Square Error",
      value: data.metrics.rmse,
      unit: "MW",
      description: "Penalises larger forecast errors",
      icon: ChartLine,
    },
    {
      label: "Mean Absolute Percentage Error",
      value: data.metrics.mape,
      unit: "%",
      description: "Average percentage forecast error",
      icon: Target,
    },
    {
      label: "Matched Records",
      value: data.metrics.matched_records,
      unit: "hours",
      description: "Matched forecast and actual intervals",
      icon: Database,
    },
  ];

  return (
    <section className="accuracy-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">FORECAST PERFORMANCE</div>
          <h1>Accuracy</h1>
          <p>
            Evaluate the reliability of day-ahead wind generation forecasts.
          </p>
        </div>
      </div>

      <section className="section-heading">
        <div>
          <h2>Accuracy metrics</h2>
          <p>Performance evaluation · {data.period}</p>
        </div>
      </section>

      <section className="metrics-grid">
        {metrics.map(({ label, value, unit, description, icon: Icon }) => (
          <article className="metric-card" key={label}>
            <div className="metric-top">
              <span>{label}</span>
              <div className="metric-icon">
                <Icon size={18} />
              </div>
            </div>

            <div className="metric-value">
              {value == null
                ? "—"
                : value.toLocaleString("en-GB", {
                    maximumFractionDigits: 2,
                  })}
              <span>{unit}</span>
            </div>

            <div className="metric-note">{description}</div>
          </article>
        ))}
      </section>
    </section>
  );
}

export default Accuracy;