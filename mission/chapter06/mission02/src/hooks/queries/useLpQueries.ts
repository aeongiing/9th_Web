// src/hooks/queries/useLpQueries.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { 
  fetchLps, 
  fetchLpDetail, 
  likeLp, 
  unlikeLp, 
  fetchComments,
  type FetchLpsParams,
  type FetchCommentsParams 
} from '../../apis/lp';

export const useLpList = (params: Omit<FetchLpsParams, 'offset'> = {}) => {
  return useInfiniteQuery({
    queryKey: ['lps', params.sort],
    queryFn: ({ pageParam = 0 }) => 
      fetchLps({ ...params, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNext) return undefined;
      return allPages.length * (params.limit || 20);
    },
    initialPageParam: 0,
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

export const useComments = (params: Omit<FetchCommentsParams, 'offset'>) => {
  return useInfiniteQuery({
    queryKey: ['lpComments', params.lpId, params.order],
    queryFn: ({ pageParam = 0 }) =>
      fetchComments({ ...params, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNext) return undefined;
      return allPages.length * (params.limit || 20);
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!params.lpId,
  });
};