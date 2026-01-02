import { ChevronDown, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface CollapsibleFriendlySectionProps {
  title: string;
  icon?: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  headerActions?: ReactNode;
  children: ReactNode;
}

function CollapsibleFriendlySection({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  headerActions,
  children,
}: CollapsibleFriendlySectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-stretch hover:bg-gray-50 transition-colors">
        <div
          className="flex items-center justify-between flex-1 p-5 cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-5 h-5 text-gray-700" />}
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-900">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {headerActions}
            </div>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="flex items-center justify-center px-4 hover:bg-gray-200 transition-all border-l border-gray-200"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse section" : "Expand section"}
        >
          <ChevronDown
            className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[2000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="p-6 pt-4 border-t border-gray-100 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default CollapsibleFriendlySection;
