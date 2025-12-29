import { useState } from 'react';
import { Download, Copy, Check, FileJson, FileCode, Eye, EyeOff } from 'lucide-react';
import { useConfigStore } from '../../store/configStore';
import { exportConfig, downloadConfig, copyToClipboard } from '../../utils/configExporter';
import type { ExportFormat } from '../../types/ohmyposh';

const formatOptions: { value: ExportFormat; label: string; icon: typeof FileJson }[] = [
  { value: 'json', label: 'JSON', icon: FileJson },
  { value: 'yaml', label: 'YAML', icon: FileCode },
  { value: 'toml', label: 'TOML', icon: FileCode },
];

export function ExportBar() {
  const config = useConfigStore((state) => state.config);
  const exportFormat = useConfigStore((state) => state.exportFormat);
  const setExportFormat = useConfigStore((state) => state.setExportFormat);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleCopy = async () => {
    const content = exportConfig(config, exportFormat);
    await copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadConfig(config, exportFormat);
  };

  const configContent = showCode ? exportConfig(config, exportFormat) : '';

  return (
    <div className="bg-[#16213e] border-t border-[#0f3460]">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Export Format:</span>
          <div className="flex items-center gap-1 bg-[#1a1a2e] rounded p-0.5">
            {formatOptions.map((format) => (
              <button
                key={format.value}
                onClick={() => setExportFormat(format.value)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  exportFormat === format.value
                    ? 'bg-[#e94560] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {format.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white bg-[#0f3460] rounded transition-colors"
          >
            {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{showCode ? 'Hide' : 'View'} Config</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white bg-[#0f3460] rounded transition-colors"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-[#e94560] hover:bg-[#d63850] rounded transition-colors"
          >
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {showCode && (
        <div className="border-t border-[#0f3460] max-h-64 overflow-auto">
          <pre className="p-4 text-xs font-mono text-gray-300 whitespace-pre-wrap">
            {configContent}
          </pre>
        </div>
      )}
    </div>
  );
}
