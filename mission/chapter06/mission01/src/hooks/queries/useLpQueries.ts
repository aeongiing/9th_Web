import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLps, fetchLpDetail, likeLp, unlikeLp, type FetchLpsParams } from '../../apis/lp';

export const useLpList = (params: FetchLpsParams = {}) => {
  return useQuery({
    queryKey: ['lps', params],
    queryFn: () => fetchLps(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useLpDetail = (lpId: number) => {
  return useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => fetchLpDetail(lpId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!lpId,
  });
};

export const useLikeLp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likeLp,
    onSuccess: (_, lpId) => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });
    },
  });
};

export const useUnlikeLp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unlikeLp,
    onSuccess: (_, lpId) => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });
    },
  });
};