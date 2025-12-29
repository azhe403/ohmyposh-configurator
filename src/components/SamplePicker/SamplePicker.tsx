import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { sampleConfigs, loadSampleConfig } from '../../data/sampleConfigs';
import { useConfigStore } from '../../store/configStore';
import { DynamicIcon } from '../DynamicIcon';

export function SamplePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const setConfig = useConfigStore((state) => state.setConfig);

  const handleLoadSample = (sampleId: string) => {
    const config = loadSampleConfig(sampleId);
    if (config) {
      setConfig(config);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        title="Load Sample Configuration"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">Sample Configs</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1b2e] border border-gray-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Sample Configurations</h2>
                  <p className="text-sm text-gray-400">
                    Choose a pre-configured theme for your scenario
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
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleConfigs.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleLoadSample(sample.id)}
                    className="group relative flex flex-col items-start p-5 bg-[#0f0f23] hover:bg-[#16172e] border border-gray-700 hover:border-purple-500 rounded-lg transition-all text-left"
                  >
                    {/* Icon Badge */}
                    <div className="absolute -top-3 -right-3 transform group-hover:scale-110 transition-transform bg-purple-600 rounded-full p-2">
                      <DynamicIcon name={sample.icon} size={20} className="text-white" />
                    </div>

                    {/* Content */}
                    <div className="w-full">
                      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                        {sample.name}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {sample.description}
                      </p>

                      {/* Segment Count */}
                      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          {sample.config.blocks.length} block
                          {sample.config.blocks.length !== 1 ? 's' : ''}
                        </span>
                        <span>•</span>
                        <span>
                          {sample.config.blocks.reduce(
                            (sum, block) => sum + block.segments.length,
                            0
                          )}{' '}
                          segment
                          {sample.config.blocks.reduce(
                            (sum, block) => sum + block.segments.length,
                            0
                          ) !== 1
                            ? 's'
                            : ''}
                        </span>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-lg pointer-events-none"></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 bg-[#0f0f23]">
              <p className="text-xs text-gray-500 text-center">
                Loading a sample will replace your current configuration
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
