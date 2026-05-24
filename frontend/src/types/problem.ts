export type Difficulty = "Easy" | "Medium" | "Hard";

export type LanguageCode = "javascript" | "python" | "java";

export type LanguageCodeMap = Partial<Record<LanguageCode, string>>;

export type ProblemExample = {
  input: string;
  output: string;
  explanation?: string;
};

export type ProblemDescription = {
  text: string;
  notes: string[];
};

export type Problem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  description: ProblemDescription;
  examples: ProblemExample[];
  constraints: string[];
  starterCode: LanguageCodeMap;
  expectedOutput: LanguageCodeMap;
};

export type CreateProblemInput = Problem;

export type ProblemListItem = {
  id: string;
  title: string;
  difficulty: Difficulty | string;
  category: string;
  description: {
    text: string;
    notes?: string[];
  };
};

export type ProblemListItemWithSource = ProblemListItem & {
  source: "builtin" | "custom";
};

export type ProblemsPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type GetProblemsResponse = {
  message: string;
  data: ProblemListItem[];
  pagination: ProblemsPagination;
};

export type CreateProblemResponse = {
  message: string;
  data: Problem;
};

export const EMPTY_PROBLEM_FORM: CreateProblemInput = {
  id: "",
  title: "",
  difficulty: "Easy",
  category: "",
  description: {
    text: "",
    notes: [],
  },
  examples: [{ input: "", output: "", explanation: "" }],
  constraints: [],
  starterCode: {
    javascript: "",
    python: "",
    java: "",
  },
  expectedOutput: {
    javascript: "",
    python: "",
    java: "",
  },
};
