import {
  Code2Icon,
  ClockIcon,
  UsersIcon,
  TrophyIcon,
  LoaderIcon,
} from "lucide-react";
import { getDifficultyBadgeClass } from "../../lib/utilis";

function RecentSessions({
  sessions,
  isLoading,
}: {
  sessions: any[];
  isLoading: boolean;
}) {
  return (
    <div className="card bg-white border border-black/10 shadow-sm mt-6 md:mt-8">
      <div className="card-body p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="p-2 bg-black rounded-xl">
            <ClockIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-black">
            Your Past Sessions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-16 md:py-20">
              <LoaderIcon className="w-8 h-8 md:w-10 md:h-10 animate-spin text-black/40" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className={`card relative border shadow-sm transition-colors ${
                  session.status === "active"
                    ? "bg-green-50 border-green-200 hover:border-green-300"
                    : "bg-white border-black/10 hover:border-black/20"
                }`}
              >
                {session.status === "active" && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs lg:text-sm rounded-md px-2 bg-green-100 text-green-800 border border-green-300 gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      ACTIVE
                    </span>
                  </div>
                )}

                <div className="card-body p-4 md:p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl flex items-center justify-center ${
                        session.status === "active"
                          ? "bg-green-600"
                          : "bg-black"
                      }`}
                    >
                      <Code2Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm md:text-base text-black mb-1 truncate">
                        {session.problemTitle}
                      </h3>
                      <span
                        className={`text-xs rounded-md px-2 ${getDifficultyBadgeClass(session.difficulty)}`}
                      >
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs md:text-sm text-black/70 mb-4">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{session.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UsersIcon className="w-4 h-4 shrink-0" />
                      <span>
                        {1 + (session.participants?.length ?? 0)} participant
                        {(session.participants?.length ?? 0) > 0 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-black/10">
                    <span className="text-xs font-semibold text-black/70 uppercase">
                      Completed
                    </span>
                    <span className="text-xs text-black/50">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-black/5 rounded-2xl md:rounded-3xl flex items-center justify-center">
                <TrophyIcon className="w-8 h-8 md:w-10 md:h-10 text-black/30" />
              </div>
              <p className="text-base md:text-lg font-semibold text-black/70 mb-1">
                No sessions yet
              </p>
              <p className="text-sm text-black/50">
                Start your coding journey today!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;
