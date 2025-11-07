import axiosInstance from './axiosInstance';
import type { LpListResponse, LpDetail } from '../types/lp';

export interface FetchLpsParams {
  sort?: 'latest' | 'oldest';
  limit?: number;
  offset?: number;
}

export const fetchLps = async (params: FetchLpsParams = {}): Promise<LpListResponse> => {
  const { sort = 'latest', limit = 20, offset = 0 } = params;
  const response = await axiosInstance.get('/v1/lps', {
    params: { sort, limit, offset },
  });
  return response.data;
};

export const fetchLpDetail = async (lpId: number): Promise<LpDetail> => {
  const response = await axiosInstance.get(`/v1/lps/${lpId}`);
  return response.data;
};

export const likeLp = async (lpId: number): Promise<void> => {
  await axiosInstance.post(`/v1/lps/${lpId}/like`);
};

export const unlikeLp = async (lpId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/like`);
};