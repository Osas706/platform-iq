import { useNavigate, useParams } from "react-router";
import Navbar from "../features/Navbar";
import { useEffect, useState } from "react";
import { PROBLEMS } from "../data/problems";
import { Panel, Group, Separator } from "react-resizable-panels";
import ProblemDescription from "../features/problem/ProblemDescription";
import CodeEditorPanel from "../features/problem/CodeEditorPanel";
import OutputPanel from "../features/problem/OutputPanel";
import { executeCode } from "../lib/piston";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const MOBILE_BREAKPOINT = 768;

const Problem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState< "javascript" | "java" | "python">("javascript");

  const [code, setCode] = useState(
    PROBLEMS[currentProblemId].starterCode.javascript,
  );

  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT,
  );

  const currentProblem = PROBLEMS[currentProblemId];

  // update problem when URL param changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );

    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();

    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  const handleLanguageChange = (e: any) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId: any) =>
    navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output : any) => {
    // normalize output for comparison (trim whitespace, handle different spacing)
    return output
      .trim()
      .split("\n")
      .map((line: any) =>
        line
          .trim()
          // remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line: any) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput: any, expectedOutput: any) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);
    return normalizedActual == normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result as any);
    setIsRunning(false);

    // check if code executed successfully and matches expected output

    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else {
      toast.error("Code execution failed!");
    }
  };

  return (
    <div className="h-screen bg-white text-black flex flex-col">
      <Navbar />

      <div className="flex-1">
        <Group orientation={isMobile ? "vertical" : "horizontal"}>
          {/* left panel- problem desc */}
          <Panel defaultSize={isMobile ? 45 : 40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <Separator
            className={`bg-black/10 hover:bg-black/20 transition-colors ${
              isMobile
                ? "h-2 w-full cursor-row-resize"
                : "w-2 h-full cursor-col-resize"
            }`}
          />

          {/* right panel- code editor & output */}
          <Panel
            defaultSize={isMobile ? 55 : 60}
            minSize={30}
            className="bg-white"
          >
            <Group orientation="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={50} minSize={30} className="bg-white">
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <Separator className="h-2 bg-black/10 hover:bg-black/20 transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}

              <Panel defaultSize={30} minSize={30} className="bg-white">
                <OutputPanel output={output} />
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>
    </div>
  );
};

export default Problem;
