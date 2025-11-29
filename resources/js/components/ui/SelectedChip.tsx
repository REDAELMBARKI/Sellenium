import { X } from "lucide-react";

interface SelectedChipProps {
  label: string;
  onRemove: () => void;
  removable?: boolean;
}
const SelectedChip: React.FC<SelectedChipProps> = ({ label, onRemove, removable = true }) => {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
      style={{ 
        backgroundColor: '#e5e7eb',
        color: '#374151',
        border: '1px solid #d1d5db'
      }}
    >
      {label}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-0.5 transition-all duration-200 hover:bg-red-100"
          style={{
            color: '#6b7280'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fee2e2';
            e.currentTarget.style.color = '#dc2626';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#6b7280';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
};


export default SelectedChip ; 