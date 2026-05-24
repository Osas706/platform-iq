import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState, type CSSProperties } from "react";
import {
  Channel,
  Chat,
  MessageComposer,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import type { Channel as StreamChannel, StreamChat } from "stream-chat";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/index.css";

type VideoCallUIProps = {
  chatClient: StreamChat | null;
  channel: StreamChannel | null;
  onLeave: () => void;
};

function VideoCallUI({ chatClient, channel, onLeave }: VideoCallUIProps) {
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  const [isChatOpen, setIsChatOpen] = useState(false);

  const streamVideoStyle = {
    "--str-video__primary-color": "#000000",
    "--str-video__secondary-color": "#f3f4f6",
    "--str-video__text-color": "#000000",
    "--str-video__background-color": "#f9fafb",
  } as CSSProperties;

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl border border-black/10">
        <div className="text-center">
          <Loader2Icon className="w-10 h-10 mx-auto animate-spin text-black/40 mb-3" />
          <p className="text-sm sm:text-base text-black/60">Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="str-video h-full flex flex-col sm:flex-row gap-2 sm:gap-3 text-black"
      style={streamVideoStyle}
    >
      {/* Video column */}
      <div className="flex-1 flex flex-col gap-2 sm:gap-3 min-w-0 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 bg-white border border-black/10 rounded-xl shadow-sm p-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 bg-black/5 rounded-lg shrink-0">
              <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-black/70" />
            </div>
            <span className="font-semibold text-sm sm:text-base text-black truncate">
              {participantCount}{" "}
              {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>

          {chatClient && channel && (
            <button
              type="button"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`hidden md:inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                isChatOpen
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black/10 hover:bg-black/5"
              }`}
              title={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <MessageSquareIcon className="size-4" />
              <span>Chat</span>
            </button>
          )}
        </div>

        {/* Video feed */}
        <div className="flex-1 min-h-[180px] sm:min-h-0 bg-gray-100 border border-black/10 rounded-xl overflow-hidden relative">
          <SpeakerLayout />
        </div>

        {/* Controls */}
        <div className="bg-white border border-black/10 rounded-xl shadow-sm p-2 sm:p-3 flex justify-center">
          <CallControls onLeave={onLeave} />
        </div>
      </div>

      {/* Chat panel */}
      {chatClient && channel && (
        <div
          className={`hidden md:flex flex-col rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${
            isChatOpen
              ? "w-full sm:w-72 md:w-80 h-64 sm:h-auto sm:min-h-0 opacity-100"
              : "w-0 h-0 sm:w-0 sm:h-0 opacity-0 border-0 pointer-events-none"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="bg-gray-50 px-3 py-2.5 border-b border-black/10 flex items-center justify-between shrink-0">
                <h3 className="font-semibold text-sm sm:text-base text-black">
                  Session Chat
                </h3>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-md text-black/50 hover:text-black hover:bg-black/5 transition-colors"
                  title="Close chat"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden [&_.str-chat]:h-full [&_.str-chat__container]:h-full">
                <Chat client={chatClient} theme="str-chat__theme-light">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageComposer />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;
