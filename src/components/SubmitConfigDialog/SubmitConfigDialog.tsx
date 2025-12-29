import { useState } from 'react';
import { Share2, X, Github, Check, ExternalLink } from 'lucide-react';
import { useConfigStore } from '../../store/configStore';

export function SubmitConfigDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [configName, setConfigName] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [copied, setCopied] = useState(false);
  const config = useConfigStore((state) => state.config);

  const handleCopyConfig = () => {
    const configData = {
      id: configName.toLowerCase().replace(/\s+/g, '-'),
      name: configName,
      description,
      icon: 'Star',
      author,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      config: {
        ...config,
        blocks: config.blocks.map(({ id, ...block }) => ({
          ...block,
          segments: block.segments.map(({ id: segId, ...segment }) => segment),
        })),
      },
    };

    navigator.clipboard.writeText(JSON.stringify(configData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFormValid = configName && description && author;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white bg-[#0f3460] rounded transition-colors"
        title="Submit your configuration to the community"
      >
        <Share2 size={16} />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1b2e] border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Share Your Configuration</h2>
                  <p className="text-sm text-gray-400">
                    Contribute your theme to the community
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  <strong>How it works:</strong> Fill in the details below, copy your configuration,
                  and submit a pull request to add your theme to the community collection!
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Configuration Name *
                  </label>
                  <input
                    type="text"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    placeholder="e.g., My Awesome Theme"
                    className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of your configuration..."
                    rows={3}
                    className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name/Username *
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g., John Doe or @johndoe"
                    className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., minimal, developer, colorful"
                    className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-white">Submission Steps:</h3>
                <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
                  <li>Fill in all required fields above</li>
                  <li>Click "Copy Configuration" to copy the JSON to your clipboard</li>
                  <li>
                    Fork the{' '}
                    <a
                      href="https://github.com/jamesmontemagno/ohmyposh-configurator"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      repository
                    </a>
                  </li>
                  <li>
                    Create a new file in <code className="bg-gray-900 px-1 py-0.5 rounded text-xs">public/configs/community/</code> named <code className="bg-gray-900 px-1 py-0.5 rounded text-xs">your-theme-name.json</code>
                  </li>
                  <li>Paste your copied configuration into that file</li>
                  <li>Update <code className="bg-gray-900 px-1 py-0.5 rounded text-xs">public/configs/community/manifest.json</code> to include your config</li>
                  <li>Submit a pull request with your changes</li>
                </ol>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 bg-[#0f0f23] flex items-center justify-between">
              <a
                href="https://github.com/jamesmontemagno/ohmyposh-configurator/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                <ExternalLink size={14} />
                View Contribution Guide
              </a>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCopyConfig}
                  disabled={!isFormValid}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Github size={16} />
                      Copy Configuration
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
