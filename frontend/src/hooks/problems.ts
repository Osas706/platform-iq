import axios from "axios";
import axiosInstance from "@/lib/axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import type {
  CreateProblemInput,
  CreateProblemResponse,
  GetProblemsResponse,
} from "@/types/problem";

export const getProblems = async (): Promise<GetProblemsResponse> => {
  const response = await axiosInstance.get<GetProblemsResponse>("/problems", {
    params: { limit: 100 },
  });
  return response.data;
};

export const createProblem = async (
  data: CreateProblemInput,
): Promise<CreateProblemResponse> => {
  const response = await axiosInstance.post<CreateProblemResponse>(
    "/problems",
    data,
  );
  return response.data;
};

export const useProblems = () => {
  return useQuery({
    queryKey: ["problems"],
    queryFn: getProblems,
  });
};

export const useCreateProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createProblem"],
    mutationFn: createProblem,

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
