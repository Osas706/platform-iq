import { UserButton } from "@clerk/react";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon } from "lucide-react";
import { NavLink, Link } from "react-router";

function Navbar() {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-black/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <div className="size-10 rounded-xl bg-black flex items-center justify-center shadow-sm">
            <SparklesIcon className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl text-black font-mono tracking-wider">
              Platform IQ
            </span>
            <span className="text-xs text-black/60 font-medium -mt-1">
              Code Together
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {/* PROBLEMS */}
          <NavLink
            to="/problems"
            className={({ isActive } : { isActive: boolean }) =>
              `px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-black text-white"
                  : "hover:bg-black/5 text-black/70 hover:text-black"
              }`
            }
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </NavLink>

          {/* DASHBOARD */}
          <NavLink
            to="/dashboard"
            className={({ isActive } : { isActive: boolean }) =>
              `px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-black text-white"
                  : "hover:bg-black/5 text-black/70 hover:text-black"
              }`
            }
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Dashboard</span>
            </div>
          </NavLink>

          <div className="ml-4 mt-2">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;