import { useNavigate } from "react-router";
import Navbar from "../features/Navbar";
import { useUser } from "@clerk/react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useRecentSessions } from "../hooks/sessions";
import WelcomeSection from "../features/dashboard/WelcomeSection";


const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const {data: createSessionResponse , mutate: createSession} = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useRecentSessions();

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];
  
   //  handleCreateRoom
  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSession(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const isUserInSession = (session: any) => {
    if (!user?.id) return false;

    return session.host?.clerkId === user?.id || session.participant?.clerkId === user.id;
  };

  return (
    <div>
      <div className="min-h-screen bg-base-300">
        <Navbar />

        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />


      </div>
    </div>
  );
};

export default Dashboard;
