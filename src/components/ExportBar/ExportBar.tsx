import { useState, useRef } from 'react';
import { NerdIcon } from '../NerdIcon';
import { useConfigStore } from '../../store/configStore';
import { exportConfig, downloadConfig, copyToClipboard } from '../../utils/configExporter';
import { importConfig } from '../../utils/configImporter';
import { SubmitConfigDialog } from '../SubmitConfigDialog';
import type { ExportFormat } from '../../types/ohmyposh';

const formatOptions: { value: ExportFormat; label: string; iconName: string }[] = [
  { value: 'json', label: 'JSON', iconName: 'fileJson' },
  { value: 'yaml', label: 'YAML', iconName: 'fileCode' },
  { value: 'toml', label: 'TOML', iconName: 'fileCode' },
];

export function ExportBar() {
  const config = useConfigStore((state) => state.config);
  const setConfig = useConfigStore((state) => state.setConfig);
  const exportFormat = useConfigStore((state) => state.exportFormat);
  const setExportFormat = useConfigStore((state) => state.setExportFormat);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async () => {
    const content = exportConfig(config, exportFormat);
    await copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadConfig(config, exportFormat);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedConfig = importConfig(text, file.name);
      setConfig(importedConfig);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to import config:', error);
      alert(`Failed to import configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const configContent = showCode ? exportConfig(config, exportFormat) : '';

  return (
    <div className="bg-[#16213e] border-t border-[#0f3460] relative">
      {/* Success notification */}
      {showSuccess && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50 transition-opacity duration-300">
          ✓ Configuration imported successfully
        </div>
      )}
      
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
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.yaml,.yml,.toml"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <button
            onClick={handleImportClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white bg-[#0f3460] rounded transition-colors"
            title="Import configuration from file"
          >
            <NerdIcon icon="action-upload" size={16} />
            <span>Import</span>
          </button>

          <SubmitConfigDialog />

          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white bg-[#0f3460] rounded transition-colors"
          >
            {showCode ? <NerdIcon icon="ui-eye-off" size={16} /> : <NerdIcon icon="ui-eye" size={16} />}
            <span>{showCode ? 'Hide' : 'View'} Config</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white bg-[#0f3460] rounded transition-colors"
          >
            {copied ? <NerdIcon icon="ui-check" size={16} className="text-green-400" /> : <NerdIcon icon="action-copy" size={16} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-[#e94560] hover:bg-[#d63850] rounded transition-colors"
          >
            <NerdIcon icon="action-download" size={16} />
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
