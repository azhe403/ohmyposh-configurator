interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  allowEmpty?: boolean;
}

export function ColorInput({ label, value, onChange, allowEmpty = false }: ColorInputProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-400 w-24">{label}</label>
      <div className="flex-1 flex items-center gap-2">
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={allowEmpty ? 'None (transparent)' : '#ffffff'}
          className="flex-1 px-2 py-1 text-xs bg-[#1a1a2e] border border-[#0f3460] rounded text-gray-200 focus:outline-none focus:border-[#e94560]"
        />
      </div>
    </div>
  );
}
