import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function DynamicIcon({ name, size = 16, className = '' }: DynamicIconProps) {
  // Get the icon component from lucide-react
  const IconComponent = (LucideIcons as any)[name] as LucideIcon;

  // Return the icon if it exists, otherwise return a default icon
  if (!IconComponent) {
    const DefaultIcon = LucideIcons.HelpCircle;
    return <DefaultIcon size={size} className={className} />;
  }

  return <IconComponent size={size} className={className} />;
}
