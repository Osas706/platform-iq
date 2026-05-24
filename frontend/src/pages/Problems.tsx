import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Code2Icon, Loader2Icon, PlusIcon, SquareArrowOutUpRight } from "lucide-react";
import { PROBLEMS } from "@/data/problems";
import Navbar from "@/features/Navbar";
import CreateProblemModal from "@/features/problems/CreateProblemModal";
import { useCreateProblem, useProblems } from "@/hooks/problems";
import { getDifficultyBadgeClass } from "@/lib/utils";
import type {
  CreateProblemInput,
  ProblemListItem,
  ProblemListItemWithSource,
} from "@/types/problem";
import { Button } from "@/components/ui/button";

function toListItem(
  problem: ProblemListItem,
  source: "builtin" | "custom",
): ProblemListItemWithSource {
  return { ...problem, source };
}

type ProblemCardProps = {
  problem: ProblemListItemWithSource;
};

function ProblemCard({ problem }: ProblemCardProps) {
  const content = (
    <div className="card-body">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 md:size-12 rounded-xl bg-black/5 flex items-center justify-center">
              <Code2Icon className="size-5 md:size-6 text-black" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 md:mb-1">
                <h2 className="text-lg md:text-xl font-semibold md:font-bold">
                  {problem.title}
                </h2>
                <span
                  className={`badge text-xs md:text-sm font-medium ${getDifficultyBadgeClass(problem.difficulty)}`}
                >
                  {problem.difficulty}
                </span>
                <span
                  className={`badge text-xs font-medium ${
                    problem.source === "builtin"
                      ? "bg-black/5 text-black/70 border border-black/10"
                      : "bg-blue-50 text-blue-800 border border-blue-200"
                  }`}
                >
                  {problem.source === "builtin" ? "Built-in" : "Custom"}
                </span>
              </div>
              <p className="text-xs md:text-sm text-black/60">{problem.category}</p>
            </div>
          </div>
          <p className="text-black/80 mb-1 line-clamp-2">
            {problem.description.text}
          </p>
        </div>
        {problem.source === "builtin" && (
          <div className="flex items-center gap-1 text-black/80 shrink-0">
            <SquareArrowOutUpRight className="size-5" />
          </div>
        )}
      </div>
    </div>
  );

  if (problem.source === "builtin") {
    return (
      <Link
        to={`/problem/${problem.id}`}
        className="card bg-white border border-black/10 shadow-sm hover:scale-[1.01] hover:shadow-md transition-all duration-200 block"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="card bg-white border border-black/10 shadow-sm">
      {content}
    </div>
  );
}

function Problems() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: problemsResponse, isLoading: isLoadingCustom } = useProblems();
  const { mutate: createProblemMutation, isPending: isCreating } =
    useCreateProblem();

  const builtinProblems = useMemo(
    () =>
      (Object.values(PROBLEMS) as ProblemListItem[]).map((p) =>
        toListItem(p, "builtin"),
      ),
    [],
  );

  const customProblems = useMemo(() => {
    const apiProblems = problemsResponse?.data ?? [];
    const builtinIds = new Set(builtinProblems.map((p) => p.id));
    return apiProblems
      .filter((p) => !builtinIds.has(p.id))
      .map((p) => toListItem(p, "custom"));
  }, [problemsResponse?.data, builtinProblems]);

  const allProblems = [...builtinProblems, ...customProblems];

  const easyProblemsCount = allProblems.filter(
    (p) => p.difficulty === "Easy",
  ).length;
  const mediumProblemsCount = allProblems.filter(
    (p) => p.difficulty === "Medium",
  ).length;
  const hardProblemsCount = allProblems.filter(
    (p) => p.difficulty === "Hard",
  ).length;

  const handleCreateProblem = (data: CreateProblemInput) => {
    createProblemMutation(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black mb-1 leading-tight">
              Practice Problems
            </h1>
            <p className="text-lg text-black/70 max-w-2xl">
              Sharpen your coding skills with built-in and custom problems
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 shrink-0 py-5"
          >
            <PlusIcon className="size-4" />
            Add Problem
          </Button>
        </div>

        {/* Built-in problems */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-black mb-4">
            Built-in Problems
            <span className="ml-2 text-sm font-normal text-black/50">
              ({builtinProblems.length})
            </span>
          </h2>
          <div className="space-y-5">
            {builtinProblems.map((problem) => (
              <ProblemCard key={`builtin-${problem.id}`} problem={problem} />
            ))}
          </div>
        </section>

        {/* Custom problems from API */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-black mb-4">
            Custom Problems
            <span className="ml-2 text-sm font-normal text-black/50">
              ({customProblems.length})
            </span>
          </h2>
          {isLoadingCustom ? (
            <div className="flex items-center justify-center py-16">
              <Loader2Icon className="size-8 animate-spin text-black/40" />
            </div>
          ) : customProblems.length > 0 ? (
            <div className="space-y-5">
              {customProblems.map((problem) => (
                <ProblemCard key={`custom-${problem.id}`} problem={problem} />
              ))}
            </div>
          ) : (
            <div className="card bg-gray-50 border border-black/10 border-dashed">
              <div className="card-body text-center py-10">
                <p className="text-black/60 mb-4">
                  No custom problems yet. Add one to get started.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  className="gap-2 w-max mx-auto"
                >
                  <PlusIcon className="size-4" />
                  Add Problem
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Stats footer */}
        <div className="mt-14 card bg-white max-w-2xl mx-auto border border-black/10 shadow-sm">
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex flex-col p-2 justify-center items-center">
                <div className="text-gray-700">Total Problems</div>
                <div className="stat-value text-black">{allProblems.length}</div>
              </div>
              <div className="flex flex-col p-2 justify-center items-center">
                <div className="text-gray-700">Easy</div>
                <div className="stat-value text-black">{easyProblemsCount}</div>
              </div>
              <div className="flex flex-col p-2 justify-center items-center">
                <div className="text-gray-700">Medium</div>
                <div className="stat-value text-black">
                  {mediumProblemsCount}
                </div>
              </div>
              <div className="flex flex-col p-2 justify-center items-center">
                <div className="text-gray-700">Hard</div>
                <div className="stat-value text-black">{hardProblemsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateProblemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProblem}
        isSubmitting={isCreating}
      />
    </div>
  );
}

export default Problems;
