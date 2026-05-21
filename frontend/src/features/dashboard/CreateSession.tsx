import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../../data/problems";

type ProblemItem = {
  id: string;
  title: string;
  difficulty: string;
};
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RoomConfig = {
  problemTitle: string;
  difficulty: string;
};

type CreateSessionProps = {
  isOpen: boolean;
  onClose: () => void;
  roomConfig: RoomConfig;
  setRoomConfig: React.Dispatch<React.SetStateAction<RoomConfig>>;
  onCreateRoom: () => void;
  isCreating: boolean;
};

function CreateSession({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}: CreateSessionProps) {
  const problems = Object.values(PROBLEMS) as ProblemItem[];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black">
            Create New Session
          </DialogTitle>
          <DialogDescription>
            Pick a problem to start a 1-on-1 coding session with another
            developer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">
              Select Problem <span className="text-red-600">*</span>
            </label>

            <Select
              value={roomConfig?.problemTitle || undefined}
              onValueChange={(value: string) => {
                const selectedProblem = problems.find((p) => p.title === value);
                if (selectedProblem) {
                  setRoomConfig({
                    problemTitle: value,
                    difficulty: selectedProblem.difficulty,
                  });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a coding problem..." />
              </SelectTrigger>
              <SelectContent>
                {problems.map((problem) => (
                  <SelectItem key={problem.id} value={problem.title}>
                    {problem.title} ({problem.difficulty})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {roomConfig?.problemTitle && (
            <div className="flex gap-3 rounded-lg border border-black/10 bg-gray-50 p-4">
              <Code2Icon className="size-5 shrink-0 text-black/70" />
              <div className="space-y-1 text-sm text-black/80">
                <p className="font-semibold text-black">Room Summary</p>
                <p>
                  Problem:{" "}
                  <span className="font-medium text-black">
                    {roomConfig.problemTitle}
                  </span>
                </p>
                <p>
                  Max Participants:{" "}
                  <span className="font-medium text-black">
                    2 (1-on-1 session)
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problemTitle}
            className="gap-2"
          >
            {isCreating ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <PlusIcon className="size-4" />
            )}
            {isCreating ? "Creating..." : "Create Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSession;
