import { type Request, type Response } from "express";
import openai from "../lib/openai";
import { ENV } from "../lib/env";

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

function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return Object.prototype.hasOwnProperty.call(LANGUAGE_VERSIONS, lang);
}

/**
 * Run source code via OpenAI API (simulated execution).
 * Note: This uses AI to analyze and explain code output rather than actual execution.
 * For real execution, consider alternatives like self-hosted sandbox or other APIs.
 */
export async function executeCode(language: string, code: string): Promise<ExecuteCodeResult> {
  try {
    if (!isSupportedLanguage(language)) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    if (!ENV.GEMINI_API_KEY) {
      return {
        success: false,
        error: "GEMINI_API_KEY is not configured on the server",
      };
    }

    const response = await openai.chat.completions.create({
      model: ENV.GEMINI_MODEL || "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are a code execution simulator for ${language}. 
Analyze the provided code and return ONLY the exact output that would be produced when running it. 
Do not include explanations, markdown formatting, or any additional text. 
Return exactly what the console/terminal would show. If there's an error, return the exact error message.`,
        },
        {
          role: "user",
          content: `Language: ${language}\n\nCode:\n${code}`,
        },
      ],
      temperature: 0, // Deterministic output
    });

    const output = response.choices[0]?.message?.content?.trim() ?? "";

    // Check if the AI indicates an error (basic heuristic)
    const errorIndicators = ["error:", "exception:", "traceback", "syntaxerror", "referenceerror"];
    const isError = errorIndicators.some(indicator => 
      output.toLowerCase().startsWith(indicator) || 
      output.toLowerCase().includes(`\n${indicator}`)
    );

    if (isError) {
      return {
        success: false,
        error: output,
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

export const runCode = async (req: Request, res: Response) => {
  try {
    const { language, code } = req.body as { language?: string; code?: string };

    if (!language || !code) {
      res.status(400).json({
        success: false,
        error: "language and code are required",
      });
      return;
    }

    const result = await executeCode(language, code);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in runCode", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Keep for compatibility, though not needed with OpenAI approach
// function getFileExtension(language: SupportedLanguage): string {
//   const extensions: Record<<SupportedLanguage, string> = {
//     javascript: "js",
//     python: "py",
//     java: "java",
//   };
//   return extensions[language];
// }