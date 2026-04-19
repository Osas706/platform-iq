import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { LANGUAGE_CONFIG } from "../../data/problems";

type SupportedLanguage = keyof typeof LANGUAGE_CONFIG;

type CodeEditorPanelProps = {
  selectedLanguage: SupportedLanguage;
  code: string;
  isRunning: boolean;
  onLanguageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onCodeChange: (value: string | any) => void;
  onRunCode: () => void;
};

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}: CodeEditorPanelProps) {
  return (
    <div className="h-full bg-white text-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-black/10">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6"
          />
          <select
            className="select select-sm bg-white border-black/20 text-black"
            value={selectedLanguage}
            onChange={onLanguageChange}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-neutral btn-sm gap-2"
          disabled={isRunning}
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="size-4" />
              Run Code
            </>
          )}
        </button>
      </div>

      <div className="flex-1 p-3 bg-white">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="w-full h-full rounded-xl border border-black/10 bg-white p-4 font-mono text-sm text-black outline-none focus:border-black/30"
          spellCheck={false}
        />
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="light"
          options={{
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;