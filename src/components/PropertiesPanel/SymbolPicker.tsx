import { useState } from 'react';
import { parseUnicodeEscapes } from '../../utils/unicode';
import type { PowerlineSymbol } from '../../constants/symbols';

interface SymbolPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  symbols: readonly PowerlineSymbol[];
  placeholder?: string;
}

export function SymbolPicker({ label, value, onChange, symbols, placeholder }: SymbolPickerProps) {
  const [isCustom, setIsCustom] = useState(() => {
    // Check if current value is not in the predefined list
    return value ? !symbols.some(s => s.value === value) : false;
  });

  const currentSymbol = symbols.find(s => s.value === value);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === '__custom__') {
      setIsCustom(true);
    } else if (selected === '__none__') {
      setIsCustom(false);
      onChange('');
    } else {
      setIsCustom(false);
      onChange(selected);
    }
  };

  const handleCustomInput = (inputValue: string) => {
    onChange(parseUnicodeEscapes(inputValue));
  };

  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <select
        value={isCustom ? '__custom__' : (value || '__none__')}
        onChange={handleSelectChange}
        className="w-full mt-1 px-2 py-1.5 text-sm bg-[#1a1a2e] border border-[#0f3460] rounded text-gray-200 focus:outline-none focus:border-[#e94560]"
      >
        <option value="__none__">None</option>
        {symbols.map((symbol) => (
          <option key={symbol.code} value={symbol.value}>
            {symbol.label} (U+{symbol.code})
          </option>
        ))}
        <option value="__custom__">Custom...</option>
      </select>
      
      {isCustom && (
        <>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleCustomInput(e.target.value)}
            placeholder={placeholder || 'Enter symbol or Unicode (e.g., \\ue0b0)'}
            className="w-full mt-1 px-2 py-1 text-sm bg-[#1a1a2e] border border-[#0f3460] rounded text-gray-200 focus:outline-none focus:border-[#e94560] font-mono"
          />
          {value && (
            <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
              <span>Preview:</span>
              <span className="nerd-font-symbol text-lg text-white">{value}</span>
            </div>
          )}
        </>
      )}
      
      {value && !isCustom && currentSymbol && (
        <p className="text-xs text-gray-500 mt-1">
          Unicode: U+{currentSymbol.code}
        </p>
      )}
    </div>
  );
}
