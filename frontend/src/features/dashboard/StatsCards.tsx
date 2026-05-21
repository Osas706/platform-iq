import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({
  activeSessionsCount,
  recentSessionsCount,
}: {
  activeSessionsCount: number;
  recentSessionsCount: number;
}) {
  return (
    <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
      <div className="card bg-white border border-black/10 shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 md:p-3 bg-black/5 rounded-xl">
              <UsersIcon className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </div>
            <span className="badge badge-sm bg-green-100 text-green-800 border border-green-300">
              Live
            </span>
          </div>
          <div className="text-2xl md:text-4xl font-black text-black mb-1">
            {activeSessionsCount}
          </div>
          <div className="text-xs md:text-sm text-black/60">Active Sessions</div>
        </div>
      </div>

      <div className="card bg-white border border-black/10 shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 md:p-3 bg-black/5 rounded-xl">
              <TrophyIcon className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </div>
          </div>
          <div className="text-2xl md:text-4xl font-black text-black mb-1">
            {recentSessionsCount}
          </div>
          <div className="text-xs md:text-sm text-black/60">Total Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
