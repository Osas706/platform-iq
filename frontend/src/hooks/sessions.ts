import axiosInstance from "../lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";


//  createSession funcs
// {
//   "success": true,
//   "session": {
//       "problemTitle": "Two Sum",
//       "difficulty": "easy",
//       "host": "69dba58162b5326e4d8fd60d",
//       "participants": null,
//       "status": "active",
//       "callId": "session_1779382496689_62vc7j",
//       "_id": "6a0f38e091733d707e4aeaf9",
//       "createdAt": "2026-05-21T16:54:56.729Z",
//       "updatedAt": "2026-05-21T16:54:56.729Z",
//       "__v": 0
//   }
// }
export const createSession = async (data: any, token: string | null) => {
  const response = await axiosInstance.post(
    "/sessions",
    data,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  );
  return response.data;
};

export const useCreateSession = () => {
  const { getToken } = useAuth();
  return useMutation({
    mutationKey: ["createSession"],
    mutationFn: async (data: any) => {
      const token = await getToken();
      return createSession(data, token);
    },

    onSuccess: () => {
      toast.success("Session created successfully!");
    },

    onError: (error) => {
      toast.error(
        error?.message || "Failed to create session"
      );
    },
  });
};

// active sessions funcs 
export const getActiveSessions = async (token: string | null) => {
  const response = await axiosInstance.get("/sessions/active", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
};

export const useActiveSessions = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["activeSessions"],
    queryFn: async () => {
      const token = await getToken();
      return getActiveSessions(token);
    },
  });
};

// recent sessions funcs 
export const  getMyRecentSessions = async (token: string | null) => {
  const response = await axiosInstance.get("/sessions/recent-sessions", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
};

export const   useRecentSessions = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: async () => {
      const token = await getToken();
      return getMyRecentSessions(token);
    },
  });
};

// getSessionById funcs
export const getSessionById = async (id: string, token: string | null) => {
  const response = await axiosInstance.get(`/sessions/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
};

export const useSessionById = (id: string) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["session", id],

    queryFn: async () => {
      const token = await getToken();
      return getSessionById(id, token);
    },

    enabled: !!id,

    // Refetch every 5 seconds
    refetchInterval: 5000,
  });
};

//  joinSession funcs
export const joinSession = async (id: string, token: string | null) => {
  const response = await axiosInstance.post(
    `/sessions/${id}/join`,
    undefined,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  );
  return response.data;
};

export const useJoinSession = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["joinSession"],
    mutationFn: async (id: string) => {
      const token = await getToken();
      return joinSession(id, token);
    },

    onSuccess: (data, id) => {
      if (data?.session) {
        queryClient.setQueryData(["session", id], {
          success: true,
          session: data.session,
        });
      }
      toast.success("Joined session successfully!");
    },

    onError: (error) => {
      toast.error(
        error?.message || "Failed to join session"
      );
    },
  });
};

//  endSession funcs
export const endSession = async (id: string, token: string | null) => {
  const response = await axiosInstance.post(
    `/sessions/${id}/end`,
    undefined,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  );
  return response.data;
};

export const useEndSession = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["endSession"],
    mutationFn: async (id: string) => {
      const token = await getToken();
      return endSession(id, token);
    },

    onSuccess: (data, sessionId) => {
      if (data?.session) {
        queryClient.setQueryData(["session", sessionId], {
          success: true,
          session: data.session,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] });
      toast.success("Ended session successfully!");
    },

    onError: (error) => {
      toast.error(
        error?.message || "Failed to end session"
      );
    },
  });
};

