import axiosInstance from "../lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
export const createSession = async (data: any) => {
  const response = await axiosInstance.post("/sessions", data);
  return response.data;
};

export const useCreateSession = () => {
  return useMutation({
    mutationKey: ["createSession"],
    mutationFn: createSession,

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
export const getActiveSessions = async () => {
  const response = await axiosInstance.get("/sessions/active");
  return response.data;
};

export const useActiveSessions = () => {
  return useQuery({
    queryKey: ["activeSessions"],
    queryFn: getActiveSessions,
  });
};

// recent sessions funcs 
export const  getMyRecentSessions = async () => {
  const response = await axiosInstance.get("/sessions/recent-sessions");
  return response.data;
};

export const   useRecentSessions = () => {
  return useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: getMyRecentSessions,
  });
};

// getSessionById funcs
export const getSessionById = async (id: string) => {
  const response = await axiosInstance.get(`/sessions/${id}`);
  return response.data;
};

export const useSessionById = (id: string) => {
  return useQuery({
    queryKey: ["session", id],

    queryFn: () => getSessionById(id),

    enabled: !!id,

    // Refetch every 5 seconds
    refetchInterval: 5000,
  });
};

//  joinSession funcs
export const joinSession = async (id: string) => {
  const response = await axiosInstance.post(`/sessions/${id}/join`);
  return response.data;
};

export const useJoinSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["joinSession"],
    mutationFn: joinSession,

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
export const endSession = async (id: string) => {
  const response = await axiosInstance.post(`/sessions/${id}/end`);
  return response.data;
};

export const useEndSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["endSession"],
    mutationFn: endSession,

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

