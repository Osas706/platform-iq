import { PROBLEMS, LANGUAGE_CONFIG } from "@/data/problems";
import Navbar from "@/features/Navbar";
import CodeEditorPanel from "@/features/problem/CodeEditorPanel";
import OutputPanel from "@/features/problem/OutputPanel";
import { executeCode, type ExecuteCodeResult } from "@/hooks/executeCode";
import {
  useEndSession,
  useJoinSession,
  useSessionById,
} from "@/hooks/sessions";
import { getDifficultyBadgeClass } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/react";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Panel, Group, Separator } from "react-resizable-panels";
import { useStreamClient } from "@/hooks/chats";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "@/features/sessions/VideoCallUi";

const MOBILE_BREAKPOINT = 768;

type ProblemExample = {
  input: string;
  output: string;
  explanation?: string;
};

type ProblemDetails = {
  title: string;
  category?: string;
  description?: {
    text: string;
    notes?: string[];
  };
  examples?: ProblemExample[];
  constraints?: string[];
  starterCode?: Record<string, string>;
};

type SessionParticipant = {
  clerkId?: string;
  name?: string;
};

type SupportedLanguage = keyof typeof LANGUAGE_CONFIG;

const Session = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [output, setOutput] = useState<ExecuteCodeResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>("javascript");
  const [code, setCode] = useState("");
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT,
  );

  const {
    data: sessionData,
    isLoading: loadingSession,
  } = useSessionById(id as string);

  const { mutate: joinSessionMutation } = useJoinSession();
  const { mutate: endSessionMutation, isPending: isEndingSession } =
    useEndSession();
  const hasAttemptedJoin = useRef(false);

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participants?.some(
    (participant: SessionParticipant) => participant?.clerkId === user?.id,
  );

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  const problemData: ProblemDetails | null = session?.problemTitle
    ? (Object.values(PROBLEMS) as ProblemDetails[]).find(
        (p) => p?.title === session.problemTitle,
      ) ?? null
    : null;

  const participantCount = (session?.participants?.length ?? 0) + 1;

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );

    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();

    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  // Auto-join once when the user is a guest who hasn't joined yet.
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

  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as SupportedLanguage;
    setSelectedLanguage(newLang);
    setCode(problemData?.starterCode?.[newLang] || "");
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      const token = await getToken();
      const result = await executeCode(selectedLanguage, code, token);
      setOutput(result);
    } catch {
      setOutput({ success: false, error: "Code execution failed!" });
    } finally {
      setIsRunning(false);
    }
  };

  const handleEndSession = () => {
    if (
      confirm(
        "Are you sure you want to end this session? All participants will be notified.",
      )
    ) {
      endSessionMutation(id as string, {
        onSuccess: () => navigate("/dashboard"),
      });
    }
  };

  const formatDifficulty = (difficulty?: string) => {
    if (!difficulty) return "Easy";
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  return (
    <div className="h-screen bg-white text-black flex flex-col">
      <Navbar />

      <div className="flex-1 min-h-0">
        {loadingSession ? (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2Icon className="w-10 h-10 mx-auto animate-spin text-black/40 mb-3" />
              <p className="text-black/60">Loading session...</p>
            </div>
          </div>
        ) : (
          <Group orientation={isMobile ? "vertical" : "horizontal"}>
            {/* Left — problem description + code editor */}
            <Panel
              defaultSize={isMobile ? 65 : 55}
              minSize={30}
              className="bg-white"
            >
              <Group orientation="vertical">
                {/* PROBLEM DESCRIPTION */}
                <Panel defaultSize={isMobile ? 40 : 45} minSize={20}>
                  <div className="h-full overflow-y-auto bg-gray-50 text-black">
                    <div className="p-4 sm:p-6 bg-gray-50 border-b border-black/10">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <h1 className="text-2xl sm:text-3xl font-bold text-black truncate">
                            {session?.problemTitle || "Loading..."}
                          </h1>
                          {problemData?.category && (
                            <p className="text-black/60 mt-1 text-sm sm:text-base">
                              {problemData.category}
                            </p>
                          )}
                          <p className="text-black/60 mt-2 text-sm">
                            Host: {session?.host?.name || "—"} •{" "}
                            {participantCount}/2 participants
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                          <span
                            className={`text-sm rounded-md py-0.5 px-2 ${getDifficultyBadgeClass(
                              session?.difficulty,
                            )}`}
                          >
                            {formatDifficulty(session?.difficulty)}
                          </span>
                          {isHost && session?.status === "active" && (
                            <button
                              onClick={handleEndSession}
                              disabled={isEndingSession}
                              className="btn btn-error btn-sm gap-2"
                            >
                              {isEndingSession ? (
                                <Loader2Icon className="w-4 h-4 animate-spin" />
                              ) : (
                                <LogOutIcon className="w-4 h-4" />
                              )}
                              End Session
                            </button>
                          )}
                          {session?.status === "completed" && (
                            <span className="text-sm rounded-md py-0.5 px-2 bg-gray-100 text-gray-800 border border-gray-300">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                      {problemData?.description && (
                        <div className="bg-gray-50 rounded-xl shadow-sm p-4 sm:p-5 border border-black/10">
                          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">
                            Description
                          </h2>
                          <div className="space-y-3 text-sm sm:text-base leading-relaxed">
                            <p className="text-black/90">
                              {problemData.description.text}
                            </p>
                            {problemData.description.notes?.map((note, idx) => (
                              <p key={idx} className="text-black/90">
                                {note}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {problemData?.examples &&
                        problemData.examples.length > 0 && (
                          <div className="bg-gray-50 rounded-xl shadow-sm p-4 sm:p-5 border border-black/10">
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">
                              Examples
                            </h2>
                            <div className="space-y-4">
                              {problemData.examples.map((example, idx) => (
                                <div key={idx}>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="badge badge-sm">
                                      {idx + 1}
                                    </span>
                                    <p className="font-semibold text-black">
                                      Example {idx + 1}
                                    </p>
                                  </div>
                                  <div className="bg-black/5 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm space-y-1.5 overflow-x-auto">
                                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                      <span className="text-black font-bold sm:min-w-[70px]">
                                        Input:
                                      </span>
                                      <span className="break-all">
                                        {example.input}
                                      </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                      <span className="text-black font-bold sm:min-w-[70px]">
                                        Output:
                                      </span>
                                      <span className="break-all">
                                        {example.output}
                                      </span>
                                    </div>
                                    {example.explanation && (
                                      <div className="pt-2 border-t border-black/10 mt-2">
                                        <span className="text-black/60 font-sans text-xs">
                                          <span className="font-semibold">
                                            Explanation:
                                          </span>{" "}
                                          {example.explanation}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {problemData?.constraints &&
                        problemData.constraints.length > 0 && (
                          <div className="bg-gray-50 rounded-xl shadow-sm p-4 sm:p-5 border border-black/10">
                            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">
                              Constraints
                            </h2>
                            <ul className="space-y-2 text-sm sm:text-base text-black/90">
                              {problemData.constraints.map((constraint, idx) => (
                                <li key={idx} className="flex gap-2">
                                  <span className="text-black shrink-0">•</span>
                                  <code className="text-xs sm:text-sm break-all">
                                    {constraint}
                                  </code>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                </Panel>

                <Separator className="h-2 bg-black/10 hover:bg-black/20 transition-colors cursor-row-resize" />

                {/* CODE EDITOR + OUTPUT */}
                <Panel defaultSize={isMobile ? 60 : 55} minSize={25}>
                  <Group orientation="vertical">
                    <Panel defaultSize={65} minSize={30} className="bg-gray-100">
                      <CodeEditorPanel
                        selectedLanguage={selectedLanguage}
                        code={code}
                        isRunning={isRunning}
                        onLanguageChange={handleLanguageChange}
                        onCodeChange={setCode}
                        onRunCode={handleRunCode}
                      />
                    </Panel>

                    <Separator className="h-2 bg-black/10 hover:bg-black/20 transition-colors cursor-row-resize" />

                    <Panel defaultSize={35} minSize={20} className="bg-gray-200">
                      <OutputPanel output={output} />
                    </Panel>
                  </Group>
                </Panel>
              </Group>
            </Panel>

            <Separator
              className={`bg-black/10 hover:bg-black/20 transition-colors ${
                isMobile
                  ? "h-2 w-full cursor-row-resize"
                  : "w-2 h-full cursor-col-resize"
              }`}
            />

            {/* Right — video / collaboration panel */}
            <Panel
              defaultSize={isMobile ? 35 : 45}
              minSize={20}
              className="bg-gray-50"
            >
              {/* <div className="h-full overflow-auto p-4 sm:p-6">
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <VideoIcon className="w-5 h-5 text-black/70" />
                    <h2 className="text-lg font-bold text-black">
                      Collaboration
                    </h2>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md bg-white rounded-xl border border-black/10 shadow-sm p-6 sm:p-8 text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UsersIcon className="w-8 h-8 sm:w-10 sm:h-10 text-black/50" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-black mb-2">
                        Video Call
                      </h3>
                      <p className="text-sm sm:text-base text-black/60 mb-4">
                        Connect with your session partner in real time. Video
                        integration is coming soon.
                      </p>

                      <div className="flex flex-col gap-2 text-left bg-gray-50 rounded-lg p-4 border border-black/10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-sm font-semibold">
                            {session?.host?.name?.charAt(0) || "H"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black">
                              {session?.host?.name || "Host"}
                            </p>
                            <p className="text-xs text-black/50">Host</p>
                          </div>
                        </div>
                        {session?.participants?.map(
                          (participant: SessionParticipant, idx: number) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-sm font-semibold">
                                {participant?.name?.charAt(0) || "P"}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-black">
                                  {participant?.name || "Participant"}
                                </p>
                                <p className="text-xs text-black/50">
                                  Participant
                                </p>
                              </div>
                            </div>
                          ),
                        )}
                        {participantCount < 2 && (
                          <p className="text-xs text-black/40 text-center pt-2 border-t border-black/10 mt-1">
                            Waiting for a participant to join...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

            <div className="h-full bg-gray-300 p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="card bg-base-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-base-content/70">Unable to connect to the video call</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>

            </Panel>
          </Group>
        )}
      </div>
    </div>
  );
};

export default Session;
