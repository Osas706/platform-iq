import axios from "axios";
import axiosInstance from "./axios";

export type ExecuteCodeResult = {
  success: boolean;
  output?: string;
  error?: string;
};

export async function executeCode(
  language: string,
  code: string,
  token: string | null,
): Promise<ExecuteCodeResult> {
  try {
    const { data } = await axiosInstance.post<ExecuteCodeResult>(
      "/ai/execute",
      { language, code },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as ExecuteCodeResult;
    }
    const message = error instanceof Error ? error.message : "Request failed";
    return { success: false, error: message };
  }
}
