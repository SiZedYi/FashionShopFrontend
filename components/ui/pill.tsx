
export const Pill: React.FC<{ text: string; onRemove: () => void; colorClass?: string }> = ({
  text,
  onRemove,
  colorClass = "bg-blue-600",
}) => (
  <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${colorClass} gap-1`}> 
    {text}
    <button
      type="button"
      onClick={onRemove}
      className="ml-1 focus:outline-none"
    >
      ×
    </button>
  </span>
);