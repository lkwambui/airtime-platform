import { useEffect, useId, useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";

type PinModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: (pin: string) => Promise<void> | void;
  onClose: () => void;
};

export default function PinModal({
  open,
  title = "Enter Admin PIN",
  description = "This action requires authorization.",
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
}: PinModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [pin, setPin] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, submitting]);

  if (!open) return null;

  const handleConfirm = async () => {
    if (!pin.trim()) return;
    setSubmitting(true);
    try {
      await onConfirm(pin.trim());
      setPin("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <Card
        className="w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <h3 id={titleId} className="text-lg font-semibold text-slate-900">{title}</h3>
        <p id={descriptionId} className="mt-1 text-sm text-slate-600">{description}</p>

        <Input
          containerClassName="mt-4"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          label="Admin PIN"
          placeholder="••••"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void handleConfirm();
            }
          }}
        />

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={() => void handleConfirm()} disabled={submitting || !pin.trim()}>
            {submitting ? "Verifying..." : confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}