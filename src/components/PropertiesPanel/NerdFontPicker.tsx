import { useState } from 'react';
import { NerdIcon } from '../NerdIcon';
import { NERD_FONT_ICONS, getCategories } from '../../constants/nerdFontIcons';
import type { NerdFontIcon } from '../../constants/nerdFontIcons';
import { useClipboard } from '../../hooks/useClipboard';

interface NerdFontPickerProps {
  onSelect?: (unicode: string) => void;
}

export function NerdFontPicker({ onSelect }: NerdFontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { copiedText, copyToClipboard } = useClipboard();
  const categories = ['All', ...getCategories()];

  const filteredIcons = NERD_FONT_ICONS.filter((icon) => {
    const matchesSearch = 
      icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (icon.aliases?.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase())) || false);
    const matchesCategory = selectedCategory === 'All' || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (icon: NerdFontIcon) => {
    // Copy the unicode escape sequence (e.g., \ue0b0) instead of the character
    const unicodeEscape = `\\u${icon.code.toLowerCase()}`;
    copyToClipboard(unicodeEscape);
    if (onSelect) {
      onSelect(unicodeEscape);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-1.5 text-sm bg-[#0f3460] text-gray-200 rounded hover:bg-[#1a4a7a] transition-colors flex items-center justify-center gap-2"
      >
        <span className="nerd-font-symbol"></span>
        <span>Browse Nerd Font Icons</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            {/* Picker Modal */}
            <div 
              className="bg-[#16213e] border border-[#0f3460] rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-[#0f3460] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-200">Nerd Font Icons</h3>
                    <span className="text-xs text-gray-500">Click to copy</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <NerdIcon icon="action-search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search icons..."
                    className="w-full pl-10 pr-3 py-2 text-sm bg-[#1a1a2e] border border-[#0f3460] rounded text-gray-200 focus:outline-none focus:border-[#e94560]"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#e94560] text-white'
                          : 'bg-[#0f3460] text-gray-400 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icons Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-3">
                  {filteredIcons.map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => handleCopy(icon)}
                      className="flex items-center gap-3 p-3 bg-[#1a1a2e] hover:bg-[#0f3460] border border-[#0f3460] rounded transition-colors group text-left"
                      title={`Click to copy: \\u${icon.code.toLowerCase()}`}
                    >
                      <span className="nerd-font-symbol text-3xl text-white flex-shrink-0">
                        {icon.char}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-300 font-medium truncate">
                          {icon.name}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          \u{icon.code.toLowerCase()}
                        </div>
                      </div>
                      {copiedText === `\\u${icon.code.toLowerCase()}` ? (
                        <NerdIcon icon="ui-check" size={16} className="text-green-400 flex-shrink-0" />
                      ) : (
                        <NerdIcon icon="action-copy" size={16} className="text-gray-500 group-hover:text-gray-300 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                
                {filteredIcons.length === 0 && (
                  <div className="text-center py-12 text-gray-500 text-sm">
                    No icons found matching "{searchQuery}"
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-[#0f3460] text-xs text-gray-500 text-center">
                {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} • Click any icon to copy to clipboard
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
