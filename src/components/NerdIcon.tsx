import { getIconChar } from '../constants/nerdFontIcons';

interface NerdIconProps {
  icon: string;       // Icon ID from nerdFontIcons (e.g., 'ui-plus', 'lang-python')
  size?: number;
  className?: string;
}

export function NerdIcon({ icon, size = 16, className = '' }: NerdIconProps) {
  const iconChar = getIconChar(icon);
  
  return (
    <span
      className={`nerd-font-symbol inline-flex items-center justify-center ${className}`}
      style={{ 
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      {iconChar}
    </span>
  );
}
