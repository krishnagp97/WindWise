export interface ForecastComparison {
  startTime: string;
  forecast: number;
  actual: number;
  error: number;
  absolute_error: number;
}

export interface AccuracyMetrics {
  matched_records: number;
  mae: number | null;
  rmse: number | null;
  mape: number | null;
  mape_records: number;
  zero_actual_records: number;
}

export interface DataCoverage {
  forecast_versions: number;
  selected_forecasts: number;
  half_hourly_actuals: number;
  hourly_actuals: number;
  matched_records: number;
  unmatched_forecasts: number;
  unmatched_actuals: number;
}

export interface AccuracyResponse {
  period: string;
  forecast_strategy: string;
  actual_aggregation: string;
  data_coverage: DataCoverage;
  metrics: AccuracyMetrics;
  comparisons: ForecastComparison[];
  sample_comparisons: ForecastComparison[];
}