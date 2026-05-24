import { useUser } from "@clerk/react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }: { onCreateSession: () => void }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden bg-gray-00">
      <div className="relative max-w-7xl mx-auto px-4 py-10 md:px-6 md:py-16">
        <div className="flex flex-col gap-3 md:gap-6 justify-center items-center md:flex-row md:justify-between">
          <div className="">
            <div className="flex items-center gap-1 md:gap-3  ">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                <SparklesIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900">
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
          </div>

          <button
            onClick={onCreateSession}
            className="group px-6 py-3 md:px-5 lg:px-8 md:py-4 bg-gray-900 rounded-2xl transition-all duration-200 hover:bg-gray-700"
          >
            <div className="flex items-center justify-center gap-3 md:gap-2 lg:gap-3 text-white font-bold text-base lg:text-lg">
              <ZapIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              <span>Create Session</span>
              <ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
