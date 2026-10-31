import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { Clock3, Database, Layers3, TrendingUp } from "lucide-react";

import {
  getForecastData,
  type ForecastResponse,
} from "../services/forecastService";
import { getAccuracyData } from "../services/accuracyService";
import type { AccuracyResponse } from "../types/accuracy";

const formatChartDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });

const formatNumber = (value: number) =>
  value.toLocaleString("en-GB", {
    maximumFractionDigits: 2,
  });

const ForecastAnalysis = () => {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accuracyData, setAccuracyData] = useState<AccuracyResponse | null>(
    null,
  );

  const [accuracyLoading, setAccuracyLoading] = useState(true);
  const [accuracyError, setAccuracyError] = useState<string | null>(null);

  useEffect(() => {
    const loadForecasts = async () => {
      try {
        const response = await getForecastData();
        setData(response);
      } catch {
        setError("Unable to load forecast data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadForecasts();
  }, []);

  useEffect(() => {
    const loadAccuracy = async () => {
      try {
        const response = await getAccuracyData();
        setAccuracyData(response);
      } catch {
        setAccuracyError("Unable to load forecast comparison data.");
      } finally {
        setAccuracyLoading(false);
      }
    };

    loadAccuracy();
  }, []);

  if (loading) {
    return <div className="page-loading">Loading forecast analysis...</div>;
  }

  if (error || !data) {
    return (
      <div className="page-error">{error ?? "No forecast data available."}</div>
    );
  }

  const statistics = [
    {
      label: "Forecast records",
      value: data.total_records_received.toLocaleString(),
      icon: Database,
    },
    {
      label: "Delivery periods",
      value: data.unique_delivery_periods.toLocaleString(),
      icon: Clock3,
    },
    {
      label: "Selected forecasts",
      value: data.selected_forecast_records.toLocaleString(),
      icon: TrendingUp,
    },
    {
      label: "Max versions per period",
      value: data.max_forecast_versions_per_delivery.toLocaleString(),
      icon: Layers3,
    },
  ];

  return (
    <section className="forecast-analysis">
      <div className="page-heading">
        <div>
          <p className="eyebrow">FORECAST INTELLIGENCE</p>
          <h1>Forecast Analysis</h1>
          <p>
            Explore forecast versions, publication timing, and generation
            predictions.
          </p>
        </div>
      </div>

      <div className="forecast-stat-grid">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="forecast-stat-card" key={stat.label}>
              <div className="stat-icon">
                <Icon size={20} />
              </div>
              <p>{stat.label}</p>
              <h2>{stat.value}</h2>
            </article>
          );
        })}
      </div>

      <div className="forecast-info-panel">
        <h3>Day-ahead forecast strategy</h3>
        <p>
          The latest forecast published by {data.day_ahead_cutoff_hour_utc}:00
          UTC on the previous day is selected for each delivery period.
        </p>

        <div className="forecast-info-details">
          <div>
            <span>Pre-delivery versions</span>
            <strong>{data.pre_delivery_versions}</strong>
          </div>
          <div>
            <span>Post-delivery versions</span>
            <strong>{data.post_delivery_versions}</strong>
          </div>
          <div>
            <span>Publication timestamps</span>
            <strong>{data.unique_publish_times}</strong>
          </div>
        </div>
      </div>
      <section className="forecast-chart-panel">
        <div className="forecast-chart-heading">
          <div>
            <h3>Forecast vs Actual Generation</h3>
            <p>Hourly wind generation comparison · January 2026</p>
          </div>
          <span>MW</span>
        </div>

        <div className="forecast-chart-container">
          {accuracyLoading ? (
            <p>Loading comparison data...</p>
          ) : accuracyError ? (
            <p>{accuracyError}</p>
          ) : accuracyData?.comparisons.length ? (
            <ResponsiveContainer width="100%" height={340}>
              <LineChart
                data={accuracyData.comparisons}
                margin={{ top: 15, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="startTime"
                  tickFormatter={formatChartDate}
                  minTickGap={35}
                />

                <YAxis
                  tickFormatter={(value: number) =>
                    `${Math.round(value / 1000)}k`
                  }
                />

                <Tooltip
                  labelFormatter={(label) =>
                    new Date(String(label)).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "UTC",
                    }) + " UTC"
                  }
                  formatter={(value, name) => [
                    `${formatNumber(Number(value))} MW`,
                    name === "forecast" ? "Forecast" : "Actual",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="forecast"
                  stroke="#32836b"
                  strokeWidth={2}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="actual"
                  name="actual"
                  stroke="#4776a8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No matched forecast and actual records available.</p>
          )}
        </div>

        <div className="forecast-chart-legend">
          <span>
            <i className="legend-forecast" /> Forecast
          </span>
          <span>
            <i className="legend-actual" /> Actual
          </span>
        </div>
      </section>
    </section>
  );
};

export default ForecastAnalysis;
