import { getDifficultyBadgeClass } from "../../lib/utilis";

type ProblemExample = {
  input: string;
  output: string;
  explanation?: string;
};

type ProblemDetails = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  description: {
    text: string;
    notes: string[];
  };
  examples: ProblemExample[];
  constraints: string[];
};

type ProblemDescriptionProps = {
  problem: ProblemDetails;
  currentProblemId: string;
  onProblemChange: (problemId: string) => void;
  allProblems: ProblemDetails[];
};

function ProblemDescription({
  problem,
  currentProblemId,
  onProblemChange,
  allProblems,
}: ProblemDescriptionProps) {
  return (
    <div className="h-full overflow-y-auto bg-white text-black">
      {/* HEADER SECTION */}
      <div className="p-6 bg-white border-b border-black/10">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-3xl font-bold text-black">{problem.title}</h1>
          <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="text-black/60">{problem.category}</p>

        {/* Problem selector */}
        <div className="mt-4">
          <select
            className="select select-sm w-full bg-white border-black/20 text-black"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* PROBLEM DESC */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-black/10">
          <h2 className="text-xl font-bold text-black">Description</h2>

          <div className="space-y-3 text-base leading-relaxed">
            <p className="text-black/90">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-black/90">
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-black/10">
          <h2 className="text-xl font-bold mb-4 text-black">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-sm">{idx + 1}</span>
                  <p className="font-semibold text-black">Example {idx + 1}</p>
                </div>
                <div className="bg-black/5 rounded-lg p-4 font-mono text-sm space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-black font-bold min-w-[70px]">Input:</span>
                    <span>{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-black font-bold min-w-[70px]">Output:</span>
                    <span>{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-black/10 mt-2">
                      <span className="text-black/60 font-sans text-xs">
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-black/10">
          <h2 className="text-xl font-bold mb-4 text-black">Constraints</h2>
          <ul className="space-y-2 text-black/90">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-black">•</span>
                <code className="text-sm">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;