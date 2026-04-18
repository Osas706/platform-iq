const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
} as const;

type SupportedLanguage = keyof typeof LANGUAGE_VERSIONS;

export type ExecuteCodeResult = {
  success: boolean;
  output?: string;
  error?: string;
};

type PistonExecuteResponse = {
  run?: {
    output?: string;
    stderr?: string;
  };
};

function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return Object.prototype.hasOwnProperty.call(LANGUAGE_VERSIONS, lang);
}

/**
 * Run source code via the Piston API.
 */
export async function executeCode(language: string, code: string): Promise<ExecuteCodeResult> {
  try {
    if (!isSupportedLanguage(language)) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const languageConfig = LANGUAGE_VERSIONS[language];

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const data = (await response.json()) as PistonExecuteResponse;
    const output = data.run?.output ?? "";
    const stderr = data.run?.stderr ?? "";

    if (stderr) {
      return {
        success: false,
        output,
        error: stderr,
      };
    }

    return {
      success: true,
      output: output || "No output",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to execute code: ${message}`,
    };
  }
}

function getFileExtension(language: SupportedLanguage): string {
  const extensions: Record<SupportedLanguage, string> = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language];
}
