import { useState } from 'react';
import { Globe, Code } from 'lucide-react';
import { useConfigStore } from '../../store/configStore';
import type { OhMyPoshConfig } from '../../types/ohmyposh';

export function GlobalSettings() {
  const config = useConfigStore((state) => state.config);
  const updateGlobalConfig = useConfigStore((state) => state.updateGlobalConfig);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpdate = (updates: Partial<OhMyPoshConfig>) => {
    updateGlobalConfig(updates);
  };

  return (
    <div className="space-y-4 p-4 bg-[#1a1a2e] rounded-lg mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between hover:text-white transition-colors"
      >
        <div className="flex items-center gap-2">
          <Globe size={20} className="text-gray-400" />
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-200">Global Settings</h3>
            <p className="text-xs text-gray-500">Configuration-wide options</p>
          </div>
        </div>
        <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="space-y-4 pt-2 border-t border-[#0f3460]">
          {/* Console Title Template */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Code size={14} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-300">Console Title Template</span>
            </div>
            <textarea
              value={config.console_title_template || ''}
              onChange={(e) => handleUpdate({ console_title_template: e.target.value || undefined })}
              rows={2}
              className="w-full px-2 py-1.5 text-xs font-mono bg-[#1a1a2e] border border-[#0f3460] rounded text-gray-200 focus:outline-none focus:border-[#e94560] resize-y"
              placeholder="{{.Folder}}{{if .Root}} :: root{{end}} :: {{.Shell}}"
            />
            <p className="text-xs text-gray-500 mt-1">
              Template for the terminal window title.{' '}
              <a
                href="https://ohmyposh.dev/docs/configuration/title"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e94560] hover:underline"
              >
                Learn more
              </a>
            </p>
          </div>

          {/* Terminal Background */}
          <div>
            <label className="text-xs text-gray-400">Terminal Background</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={config.terminal_background || '#000000'}
                onChange={(e) => handleUpdate({ terminal_background: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={config.terminal_background || ''}
                onChange={(e) => handleUpdate({ terminal_background: e.target.value || undefined })}
                placeholder="#000000"
                className="flex-1 px-2 py-1 text-xs bg-[#1a1a2e] border border-[#0f3460] rounded text-gray-200 focus:outline-none focus:border-[#e94560]"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Used for transparency in some segments
            </p>
          </div>

          {/* Accent Color */}
          <div>
            <label className="text-xs text-gray-400">Accent Color</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={config.accent_color || '#ffffff'}
                onChange={(e) => handleUpdate({ accent_color: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={config.accent_color || ''}
                onChange={(e) => handleUpdate({ accent_color: e.target.value || undefined })}
                placeholder="#ffffff"
                className="flex-1 px-2 py-1 text-xs bg-[#1a1a2e] border border-[#0f3460] rounded text-gray-200 focus:outline-none focus:border-[#e94560]"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Default accent color for segments
            </p>
          </div>

          {/* Final Space */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="final_space"
              checked={config.final_space ?? true}
              onChange={(e) => handleUpdate({ final_space: e.target.checked })}
              className="rounded bg-[#0f0f23] border-[#0f3460]"
            />
            <label htmlFor="final_space" className="text-xs text-gray-300">
              Add final space after prompt
            </label>
          </div>

          {/* Shell Integration */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="shell_integration"
              checked={config.shell_integration || false}
              onChange={(e) => handleUpdate({ shell_integration: e.target.checked })}
              className="rounded bg-[#0f0f23] border-[#0f3460]"
            />
            <label htmlFor="shell_integration" className="text-xs text-gray-300">
              Enable shell integration
            </label>
          </div>

          {/* Enable Cursor Positioning */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enable_cursor_positioning"
              checked={config.enable_cursor_positioning || false}
              onChange={(e) => handleUpdate({ enable_cursor_positioning: e.target.checked })}
              className="rounded bg-[#0f0f23] border-[#0f3460]"
            />
            <label htmlFor="enable_cursor_positioning" className="text-xs text-gray-300">
              Enable cursor positioning
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
