import { Link } from "react-router";

import { PROBLEMS } from "../data/problems";
import { Code2Icon, SquareArrowOutUpRight } from "lucide-react";

import Navbar from "../features/Navbar";
import { getDifficultyBadgeClass } from "../lib/utilis";

type ProblemListItem = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  description: {
    text: string;
  };
};

function Problems() {
  const problems = Object.values(
    PROBLEMS as Record<string, ProblemListItem>,
  ) as ProblemListItem[];

  const easyProblemsCount = problems.filter(
    (p) => p.difficulty === "Easy",
  ).length;
  const mediumProblemsCount = problems.filter(
    (p) => p.difficulty === "Medium",
  ).length;
  const hardProblemsCount = problems.filter(
    (p) => p.difficulty === "Hard",
  ).length;

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-black mb-1 leading-tight">
            Practice Problems
          </h1>
          <p className="text-lg text-black/70 max-w-2xl">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-5">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="card bg-white border border-black/10 shadow-sm hover:scale-[1.01] hover:shadow-md transition-all duration-200"
            >
              <div className="card-body">
                <div className="flex items-center justify-between gap-4">
                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-8 md:size-12 rounded-xl bg-black/5 flex items-center justify-center">
                        <Code2Icon className="size-5 md:size-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 md:mb-1">
                          <h2 className="text-lg md:text-xl font-semibold md:font-bold">
                            {problem.title}
                          </h2>
                          <span
                            className={`badge text-xs md:text-sm font-medium  ${getDifficultyBadgeClass(problem.difficulty)}`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-black/60">
                          {problem.category}
                        </p>
                      </div>
                    </div>

                    <p className="text-black/80 mb-1">
                      {problem.description.text}
                    </p>
                  </div>
                  {/* RIGHT SIDE */}

                  <div className="flex items-center gap-1 text-black/80">
                    <SquareArrowOutUpRight className="size-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-14 card bg-white max-w-2xl  mx-auto border border-black/10 shadow-sm">
          <div className="card-body">
            <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              <div className="flex flex-col p-2 justify-center items-center ">
                <div className="text-gray-700">Total Problems</div>
                <div className="stat-value text-black">{problems.length}</div>
              </div>

              <div className="flex flex-col p-2 justify-center items-center ">
                <div className="text-gray-700">Easy</div>
                <div className="stat-value text-black">{easyProblemsCount}</div>
              </div>
              <div className="flex flex-col p-2 justify-center items-center ">
                <div className="text-gray-700">Medium</div>
                <div className="stat-value text-black">
                  {mediumProblemsCount}
                </div>
              </div>
              <div className="flex flex-col p-2 justify-center items-center ">
                <div className="text-gray-700">Hard</div>
                <div className="stat-value text-black ">
                  {hardProblemsCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Problems;
