import { PROBLEMS } from "@/data/problems";
import Navbar from "@/features/Navbar";
import { executeCode } from "@/hooks/executeCode";
import {
  useEndSession,
  useJoinSession,
  useSessionById,
} from "@/hooks/sessions";
import { useUser } from "@clerk/react";
import { useEffect, useRef, useState } from "react";
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
  } = useSessionById(id as string);

  const { mutate: joinSessionMutation } = useJoinSession();
  const { mutate: endSessionMutation } = useEndSession();
  const hasAttemptedJoin = useRef(false);

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participants?.some(
    (participant: { clerkId?: string }) => participant?.clerkId === user?.id,
  );

  // find the problem data based on session problem title
  const problemData: any = session?.problemTitle
    ? Object.values(PROBLEMS).find((p: any) => p?.title === session.problemTitle)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState( problemData?.starterCode?.[selectedLanguage] || "");


  // Auto-join once when the user is a guest who hasn't joined yet.
  // Do NOT put `session` in deps — useSessionById polls every 5s and returns a
  // new object reference each time, which would re-fire this effect repeatedly.
  useEffect(() => {
    if (loadingSession || !session || !user?.id || !id) return;
    if (isHost || isParticipant) return;
    if (hasAttemptedJoin.current) return;

    hasAttemptedJoin.current = true;
    joinSessionMutation(id, {
      onError: () => {
        hasAttemptedJoin.current = false;
      },
    });
  }, [id, user?.id, loadingSession, isHost, isParticipant, joinSessionMutation]);
  
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
