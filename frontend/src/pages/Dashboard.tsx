import { useNavigate } from "react-router";
import Navbar from "../features/Navbar";
import { useUser } from "@clerk/react";
import { useState } from "react";
import {
  useActiveSessions,
  useCreateSession,
  useRecentSessions,
} from "../hooks/sessions";
import WelcomeSection from "../features/dashboard/WelcomeSection";
import StatsCards from "../features/dashboard/StatsCards";
import ActiveSessions from "../features/dashboard/ActiveSessions";
import RecentSessions from "../features/dashboard/RecentSessions";
import CreateSession from "../features/dashboard/CreateSession";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problemTitle: "", difficulty: "" });

  const { mutate: createSession, isPending } = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } =
    useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } =
    useRecentSessions();

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const handleCreateRoom = () => {
    if (!roomConfig.problemTitle || !roomConfig.difficulty) return;

    createSession(
      {
        problemTitle: roomConfig.problemTitle,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      },
    );
  };

  const isUserInSession = (session: any) => {
    if (!user?.id) return false;

    return (
      session.host?.clerkId === user?.id ||
      session.participant?.clerkId === user.id
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

      <div className="max-w-7xl mx-auto px-4 pb-10 md:px-6 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StatsCards
            activeSessionsCount={activeSessions?.length}
            recentSessionsCount={recentSessions?.length}
          />

          <ActiveSessions
            sessions={activeSessions}
            isLoading={loadingActiveSessions}
            isUserInSession={isUserInSession}
          />
        </div>

        <RecentSessions
          sessions={recentSessions}
          isLoading={loadingRecentSessions}
        />
      </div>

      <CreateSession
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={isPending}
      />
    </div>
  );
};

export default Dashboard;
