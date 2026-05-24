import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { getDifficultyBadgeClass } from "@/lib/utils";

function ActiveSessions({
  sessions,
  isLoading,
  isUserInSession,
}: {
  sessions: any[];
  isLoading: boolean;
  isUserInSession: (session: any) => boolean;
}) {
  return (
    <div className="md:col-span-2 card bg-white border border-black/10 shadow-sm h-full">
      <div className="card-body p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-xl">
              <ZapIcon className="size-4 lg:size-5 text-white" />
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-black">
              Live Sessions
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-700">
              {sessions.length} active
            </span>
          </div>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 md:pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 md:py-20">
              <LoaderIcon className="size-8 md:size-10 animate-spin text-black/40" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => {
              const participantCount = session.participants?.length ?? 0;
              const isFull = participantCount >= 1;

              return (
              <div
                key={session._id}
                className="border-b border-b-gray-300 hover:border-b-2 hover:border-gray-500 transition-colors  "
              >
                <div className="flex flex-col gap-4 pb-4 pt-1 sm:flex-row sm:items-center sm:justify-between md:pb-5">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="relative size-10 md:size-11 lg:size-12 shrink-0 rounded-xl bg-black flex items-center justify-center">
                      <Code2Icon className="size-5 lg:size-6 text-white" />
                      <div className="absolute -top-1 -right-1 size-3 lg:size-4 bg-green-500 rounded-full border-2 border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-base md:text-lg text-black truncate">
                          {session.problemTitle}
                        </h3>
                        <span
                          className={`text-xs rounded-md font-semibold  ${getDifficultyBadgeClass(session.difficulty)}`}
                        >
                          {session.difficulty.slice(0, 1).toUpperCase() +
                            session.difficulty.slice(1)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-black/70">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="size-3.5 md:size-4" />
                          <span className="font-medium">{session.host?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="size-3.5 md:size-4" />
                          <span>
                            {participantCount + 1}/2
                          </span>
                        </div>

                        {isFull && !isUserInSession(session) ? (
                          <span className="px-2 rounded-md text-xs lg:text-sm font-semibold bg-red-100 text-red-800 border border-red-300">
                            FULL
                          </span>
                        ) : (
                          <span className="px-2 rounded-md text-xs lg:text-sm font-semibold bg-green-100 text-green-800 border border-green-300">
                            OPEN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isFull && !isUserInSession(session) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="w-full py-4 sm:w-auto shrink-0"
                    >
                      Full
                    </Button>
                  ) : (
                    <Button asChild size="sm" className="w-full py-4 sm:w-auto shrink-0 gap-2">
                      <Link to={`/session/${session._id}`}>
                        {isUserInSession(session) ? "Rejoin" : "Join"}
                        <ArrowRightIcon className="size-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              );
            })
          ) : (
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-black/5 rounded-2xl md:rounded-3xl flex items-center justify-center">
                <SparklesIcon className="w-8 h-8 md:w-10 md:h-10 text-black/30" />
              </div>
              <p className="text-base md:text-lg font-semibold text-black/70 mb-1">
                No active sessions
              </p>
              <p className="text-sm text-black/50">
                Be the first to create one!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActiveSessions;
