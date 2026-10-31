import api from "../lib/api";

export interface ForecastRecord {
  startTime: string;
  publishTime: string;
  generation: number;
}

export interface ForecastResponse {
  dataset: string;
  total_records_received: number;
  january_delivery_records: number;
  unique_delivery_periods: number;
  unique_publish_times: number;
  max_forecast_versions_per_delivery: number;
  forecast_history: ForecastRecord[];
  pre_delivery_versions: number;
  post_delivery_versions: number;
  latest_pre_delivery_forecast: ForecastRecord | null;
  day_ahead_cutoff_hour_utc: number;
  selected_forecast_records: number;
  selected_forecast_sample: ForecastRecord[];
}

export const getForecastData = async (): Promise<ForecastResponse> => {
  const response = await api.get<ForecastResponse>("/api/forecasts");
  return response.data;
};