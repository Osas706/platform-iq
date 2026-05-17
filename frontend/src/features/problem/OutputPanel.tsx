type CodeExecutionResult = {
  success: boolean;
  output?: string;
  error?: string;
};

type OutputPanelProps = {
  output: CodeExecutionResult | null;
};

function OutputPanel({ output }: OutputPanelProps) {
  return (
    <div className="h-full bg-gray-200 text-black flex flex-col border border-gray-300">
      <div className="px-4 py-3 bg-gray-200 border-b border-gray-300 font-semibold text-sm">
        Output
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output === null ? (
          <p className="text-black/50 text-sm">Click "Run Code" to see the output here...</p>
        ) : output.success ? (
          <pre className="text-sm font-mono text-black whitespace-pre-wrap">
            {output.output}
          </pre>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono text-black whitespace-pre-wrap mb-2">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono text-red-600 whitespace-pre-wrap">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;