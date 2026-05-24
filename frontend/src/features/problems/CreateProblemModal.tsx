import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_CONFIG } from "@/data/problems";
import type {
  CreateProblemInput,
  Difficulty,
  LanguageCode,
  ProblemExample,
} from "@/types/problem";
import { EMPTY_PROBLEM_FORM } from "@/types/problem";
import Editor from "@monaco-editor/react";
import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type CreateProblemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProblemInput) => void;
  isSubmitting: boolean;
};

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const LANGUAGES = Object.keys(LANGUAGE_CONFIG) as LanguageCode[];

function CreateProblemModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateProblemModalProps) {
  const [form, setForm] = useState<CreateProblemInput>(EMPTY_PROBLEM_FORM);
  const [notesText, setNotesText] = useState("");
  const [constraintsText, setConstraintsText] = useState("");
  const [activeStarterLang, setActiveStarterLang] =
    useState<LanguageCode>("javascript");

  useEffect(() => {
    if (!isOpen) return;
    setForm(EMPTY_PROBLEM_FORM);
    setNotesText("");
    setConstraintsText("");
    setActiveStarterLang("javascript");
  }, [isOpen]);

  const updateField = <K extends keyof CreateProblemInput>(
    key: K,
    value: CreateProblemInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateExample = (
    index: number,
    field: keyof ProblemExample,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      examples: prev.examples.map((ex, i) =>
        i === index ? { ...ex, [field]: value } : ex,
      ),
    }));
  };

  const addExample = () => {
    setForm((prev) => ({
      ...prev,
      examples: [...prev.examples, { input: "", output: "", explanation: "" }],
    }));
  };

  const removeExample = (index: number) => {
    setForm((prev) => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index),
    }));
  };

  const updateStarterCode = (lang: LanguageCode, value: string) => {
    setForm((prev) => ({
      ...prev,
      starterCode: { ...prev.starterCode, [lang]: value },
    }));
  };

  const updateExpectedOutput = (lang: LanguageCode, value: string) => {
    setForm((prev) => ({
      ...prev,
      expectedOutput: { ...prev.expectedOutput, [lang]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateProblemInput = {
      ...form,
      id: form.id.trim().toLowerCase().replace(/\s+/g, "-"),
      title: form.title.trim(),
      category: form.category.trim(),
      description: {
        text: form.description.text.trim(),
        notes: notesText
          .split("\n")
          .map((n) => n.trim())
          .filter(Boolean),
      },
      constraints: constraintsText
        .split("\n")
        .map((c) => c.trim())
        .filter(Boolean),
      examples: form.examples
        .map((ex) => ({
          input: ex.input.trim(),
          output: ex.output.trim(),
          ...(ex.explanation?.trim()
            ? { explanation: ex.explanation.trim() }
            : {}),
        }))
        .filter((ex) => ex.input && ex.output),
    };

    if (!payload.id || !payload.title || !payload.category) {
      toast.error("Please fill in ID, title, and category.");
      return;
    }
    if (!payload.description.text) {
      toast.error("Please add a problem description.");
      return;
    }
    if (payload.examples.length === 0) {
      toast.error("Add at least one example with input and output.");
      return;
    }

    onSubmit(payload);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black">
            Add New Problem
          </DialogTitle>
          <DialogDescription>
            Create a custom problem with description, examples, starter code,
            and expected output — same structure as built-in problems.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-problem-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto space-y-6 py-2 pr-1"
        >
          {/* Basic info */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-black border-b border-black/10 pb-1">
              Basic Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-black">
                  Problem ID (slug) <span className="text-red-600">*</span>
                </label>
                <Input
                  placeholder="e.g. two-sum"
                  value={form.id}
                  onChange={(e) => updateField("id", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-black">
                  Title <span className="text-red-600">*</span>
                </label>
                <Input
                  placeholder="e.g. Two Sum"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-black">
                  Difficulty <span className="text-red-600">*</span>
                </label>
                <Select
                  value={form.difficulty}
                  onValueChange={(value) =>
                    updateField("difficulty", value as Difficulty)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-black">
                  Category <span className="text-red-600">*</span>
                </label>
                <Input
                  placeholder="e.g. Array • Hash Table"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-black border-b border-black/10 pb-1">
              Description
            </h3>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-black">
                Main description <span className="text-red-600">*</span>
              </label>
              <textarea
                className="w-full min-h-[80px] rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black/40"
                placeholder="Problem statement..."
                value={form.description.text}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: { ...prev.description, text: e.target.value },
                  }))
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-black">
                Notes (one per line)
              </label>
              <textarea
                className="w-full min-h-[60px] rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black/40"
                placeholder="Additional notes..."
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
              />
            </div>
          </section>

          {/* Examples */}
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-black/10 pb-1">
              <h3 className="text-sm font-semibold text-black">Examples</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExample}
                className="gap-1"
              >
                <PlusIcon className="size-4" />
                Add example
              </Button>
            </div>
            {form.examples.map((example, index) => (
              <div
                key={index}
                className="rounded-lg border border-black/10 p-3 space-y-2 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-black/60">
                    Example {index + 1}
                  </span>
                  {form.examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExample(index)}
                      className="text-black/40 hover:text-red-600"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  )}
                </div>
                <Input
                  placeholder="Input"
                  value={example.input}
                  onChange={(e) => updateExample(index, "input", e.target.value)}
                />
                <Input
                  placeholder="Output"
                  value={example.output}
                  onChange={(e) =>
                    updateExample(index, "output", e.target.value)
                  }
                />
                <Input
                  placeholder="Explanation (optional)"
                  value={example.explanation ?? ""}
                  onChange={(e) =>
                    updateExample(index, "explanation", e.target.value)
                  }
                />
              </div>
            ))}
          </section>

          {/* Constraints */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-black border-b border-black/10 pb-1">
              Constraints
            </h3>
            <textarea
              className="w-full min-h-[60px] rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black/40"
              placeholder="One constraint per line"
              value={constraintsText}
              onChange={(e) => setConstraintsText(e.target.value)}
            />
          </section>

          {/* Starter code — Monaco */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-black border-b border-black/10 pb-1">
              Starter Code
            </h3>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveStarterLang(lang)}
                  className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                    activeStarterLang === lang
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-black/10 hover:bg-black/5"
                  }`}
                >
                  {LANGUAGE_CONFIG[lang].name}
                </button>
              ))}
            </div>
            <div className="h-48 rounded-lg border border-black/10 overflow-hidden">
              <Editor
                height="100%"
                language={LANGUAGE_CONFIG[activeStarterLang].monacoLang}
                value={form.starterCode[activeStarterLang] ?? ""}
                onChange={(value) =>
                  updateStarterCode(activeStarterLang, value ?? "")
                }
                theme="light"
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </section>

          {/* Expected output */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-black border-b border-black/10 pb-1">
              Expected Output
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {LANGUAGES.map((lang) => (
                <div key={lang} className="space-y-1.5">
                  <label className="text-xs font-medium text-black/70">
                    {LANGUAGE_CONFIG[lang].name}
                  </label>
                  <textarea
                    className="w-full min-h-[56px] rounded-lg border border-black/20 bg-white px-3 py-2 font-mono text-xs text-black outline-none focus:border-black/40"
                    placeholder="Expected stdout (one line per test case)"
                    value={form.expectedOutput[lang] ?? ""}
                    onChange={(e) =>
                      updateExpectedOutput(lang, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </section>

        </form>

        <DialogFooter className="border-t border-black/10 pt-4 shrink-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-problem-form"
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusIcon className="size-4" />
                Create Problem
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProblemModal;
