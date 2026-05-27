import axios from "axios";
import axiosInstance from "@/lib/axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import type {
  CreateProblemInput,
  CreateProblemResponse,
  GetProblemsResponse,
} from "@/types/problem";

export const getProblems = async (
  token: string | null,
): Promise<GetProblemsResponse> => {
  const response = await axiosInstance.get<GetProblemsResponse>("/problems", {
    params: { limit: 100 },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
};

export const createProblem = async (
  data: CreateProblemInput,
  token: string | null,
): Promise<CreateProblemResponse> => {
  const response = await axiosInstance.post<CreateProblemResponse>(
    "/problems",
    data,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  );
  return response.data;
};

export const useProblems = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["problems"],
    queryFn: async () => {
      const token = await getToken();
      return getProblems(token);
    },
  });
};

export const useCreateProblem = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createProblem"],
    mutationFn: async (data: CreateProblemInput) => {
      const token = await getToken();
      return createProblem(data, token);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem created successfully!");
    },

    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string })?.message
        : error instanceof Error
          ? error.message
          : "Failed to create problem";
      toast.error(message || "Failed to create problem");
    },
  });
};
