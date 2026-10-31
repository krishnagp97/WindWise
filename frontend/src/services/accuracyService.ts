import api from "../lib/api";
import type { AccuracyResponse } from "../types/accuracy";

export const getAccuracyData = async (): Promise<AccuracyResponse> => {
  const response = await api.get<AccuracyResponse>("/api/accuracy");
  return response.data;
};