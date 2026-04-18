import { useNavigate, useParams } from "react-router";
import Navbar from "../features/Navbar";
import { useEffect, useState } from "react";
import { PROBLEMS } from "../data/problems";
import { Panel, Group, Separator } from "react-resizable-panels";

const Problem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);

  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId];

  // update problem when URL param changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e : any) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId : any) => navigate(`/problem/${newProblemId}`);

  // const triggerConfetti = () => {
  //   confetti({
  //     particleCount: 80,
  //     spread: 250,
  //     origin: { x: 0.2, y: 0.6 },
  //   });

  //   confetti({
  //     particleCount: 80,
  //     spread: 250,
  //     origin: { x: 0.8, y: 0.6 },
  //   });
  // };

  // const normalizeOutput = (output : any) => {
  //   // normalize output for comparison (trim whitespace, handle different spacing)
  //   return output
  //     .trim()
  //     .split("\n")
  //     .map((line: any) =>
  //       line
  //         .trim()
  //         // remove spaces after [ and before ]
  //         .replace(/\[\s+/g, "[")
  //         .replace(/\s+\]/g, "]")
  //         // normalize spaces around commas to single space after comma
  //         .replace(/\s*,\s*/g, ",")
  //     )
  //     .filter((line: any) => line.length > 0)
  //     .join("\n");
  // };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
    <Navbar />

    <div className="flex-1">
      <Group orientation="horizontal">
        {/* left panel- problem desc */}
        <Panel defaultSize={40} minSize={30}>
          {/* <ProblemDescription
            problem={currentProblem}
            currentProblemId={currentProblemId}
            onProblemChange={handleProblemChange}
            allProblems={Object.values(PROBLEMS)}
          /> */}
        </Panel>

        <Separator className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

        {/* right panel- code editor & output */}
        <Panel defaultSize={60} minSize={30}>
          <Group orientation="vertical">
            {/* Top panel - Code editor */}
            <Panel defaultSize={70} minSize={30}>
              {/* <CodeEditorPanel
                selectedLanguage={selectedLanguage}
                code={code}
                isRunning={isRunning}
                onLanguageChange={handleLanguageChange}
                onCodeChange={setCode}
                onRunCode={handleRunCode}
              /> */}
            </Panel>

            <Separator className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

            {/* Bottom panel - Output Panel*/}

            <Panel defaultSize={30} minSize={30}>
              {/* <OutputPanel output={output} /> */}
            </Panel>
          </Group>
        </Panel>
      </Group>
    </div>
  </div>
  );
};

export default Problem;
