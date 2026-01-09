import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./button";

interface WarningModalProps {
  isOpen: boolean;
  onDeny: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  denyText?: string;
}

const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onDeny,
  onConfirm,
  title = "Warning",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  denyText = "Cancel",
}) => {
  if (!isOpen) return null;

  const handleClose = () => onDeny();

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
      style={{
        backdropFilter: "blur(10px)",
        background: "rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* click outside to deny */}
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-xl z-10">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Footer buttons */}
        <div className="px-6 pb-6 flex justify-between gap-3">
          <Button
            onClick={onDeny}
            className="px-4 py-2 flex-1 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {denyText}
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1"
            variant="danger"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WarningModal;
