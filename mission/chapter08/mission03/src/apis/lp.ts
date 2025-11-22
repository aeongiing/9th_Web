import { axiosInstance } from "./axios";
import { type PaginationDto } from "../types/common";
import type {
  ResponseLikeLpDto,
  ResponseLpDto,
  ResponseLpListDto,
  ResponseCreateLpDto,
} from "../types/lp.ts";
import type { Lp, RequestLpDto, CreateLpDto } from "../types/lp.ts";

export const getLpList = async (
  PaginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: PaginationDto,
  });

  return data;
};

export const getLpById = async (id: string): Promise<Lp> => {
  const response = await axiosInstance.get(`/v1/lps/${id}`);
  return response.data.data;
};

export const getLpDetail = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
};

export const postLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);

  return data;
};

export const deleteLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

  return data;
};

export const getMyLpList = async (
  params: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps/user", {
    params,
  });

  return data;
};

export const createLp = async (
  body: CreateLpDto
): Promise<ResponseCreateLpDto> => {
  const { data } = await axiosInstance.post("/v1/lps", body);
  return data;
};