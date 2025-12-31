// Common Powerline/Nerd Font symbols with their descriptions
export const POWERLINE_SYMBOLS = [
  { value: '\ue0b0', label: 'Sharp Right', code: 'E0B0' },
  { value: '\ue0b2', label: 'Sharp Left', code: 'E0B2' },
  { value: '\ue0b4', label: 'Rounded Right', code: 'E0B4' },
  { value: '\ue0b6', label: 'Rounded Left', code: 'E0B6' },
  { value: '\ue0b1', label: 'Sharp Right Thin', code: 'E0B1' },
  { value: '\ue0b3', label: 'Sharp Left Thin', code: 'E0B3' },
  { value: '\ue0b5', label: 'Rounded Right Thin', code: 'E0B5' },
  { value: '\ue0b7', label: 'Rounded Left Thin', code: 'E0B7' },
  { value: '\ue0bc', label: 'Flame Right', code: 'E0BC' },
  { value: '\ue0be', label: 'Flame Left', code: 'E0BE' },
  { value: '\ue0c0', label: 'Pixelated Right', code: 'E0C0' },
  { value: '\ue0c2', label: 'Pixelated Left', code: 'E0C2' },
  { value: '\ue0c4', label: 'Honeycomb', code: 'E0C4' },
  { value: '\ue0c6', label: 'Honeycomb Outline', code: 'E0C6' },
  { value: '\ue0c8', label: 'Ice', code: 'E0C8' },
  { value: '\ue0cc', label: 'Trapezoid Top', code: 'E0CC' },
  { value: '\ue0ce', label: 'Trapezoid Bottom', code: 'E0CE' },
  { value: '\ue0d2', label: 'Semi-circle Right', code: 'E0D2' },
  { value: '\ue0d4', label: 'Semi-circle Left', code: 'E0D4' },
] as const;

// Recommended symbols for leading diamond (left-pointing)
export const LEADING_DIAMOND_SYMBOLS = POWERLINE_SYMBOLS.filter(s => 
  ['E0B6', 'E0B2', 'E0B7', 'E0B3', 'E0BE', 'E0C2', 'E0D4'].includes(s.code)
);

// Recommended symbols for trailing diamond (right-pointing)
export const TRAILING_DIAMOND_SYMBOLS = POWERLINE_SYMBOLS.filter(s => 
  ['E0B0', 'E0B4', 'E0B1', 'E0B5', 'E0BC', 'E0C0', 'E0D2'].includes(s.code)
);

export type PowerlineSymbol = typeof POWERLINE_SYMBOLS[number];
