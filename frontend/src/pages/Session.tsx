import { PROBLEMS } from "@/data/problems";
import Navbar from "@/features/Navbar";
import { executeCode } from "@/hooks/executeCode";
import {
  useEndSession,
  useJoinSession,
  useSessionById,
} from "@/hooks/sessions";
import { useUser } from "@clerk/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const Session = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const {
    data: sessionData,
    isLoading: loadingSession,
    refetch,
  } = useSessionById(id as string);

  const { mutate: joinSessionMutation } = useJoinSession();
  const { mutate: endSessionMutation } = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  // find the problem data based on session problem title
  const problemData: any = session?.problem
    ? Object.values(PROBLEMS).find((p: any) => p?.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState( problemData?.starterCode?.[selectedLanguage] || "");


  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
  
    joinSessionMutation(id as string, { onSuccess: refetch });
  
    // remove the joinSessionMutation, refetch from dependencies to avoid infinite loop
  }, [session, user, loadingSession, isHost, isParticipant, id]);
  
  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;
  
    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);
  
  // update code when problem loads or changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  // handleLanguageChange func
  const handleLanguageChange = (e: any) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  // handleRunCode func
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code, null);

    setOutput(result?.output ?? null);
    setIsRunning(false);
  };

  // handleEndSession func
  const handleEndSession = () => {
    if ( confirm( "Are you sure you want to end this session? All participants will be notified.",)) {
      // this will navigate the HOST to dashboard

      endSessionMutation(id as string, {
        onSuccess: () => navigate("/dashboard"),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      Session
    </div>
  );
};

export default Session;
