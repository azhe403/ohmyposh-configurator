import { Github, Book, RotateCcw, Sparkles } from 'lucide-react';
import { useConfigStore } from '../../store/configStore';
import { SamplePicker } from '../SamplePicker';

export function Header() {
  const resetConfig = useConfigStore((state) => state.resetConfig);

  return (
    <header className="bg-[#16213e] border-b border-[#0f3460] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-purple-400" />
        <div>
          <h1 className="text-lg font-bold text-white">Oh My Posh Configurator</h1>
          <p className="text-xs text-gray-400">Visual Configuration Builder</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <SamplePicker />
        
        <button
          onClick={resetConfig}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-[#0f3460] rounded transition-colors"
          title="Reset to default configuration"
        >
          <RotateCcw size={16} />
          <span className="hidden sm:inline">Reset</span>
        </button>
        
        <a
          href="https://ohmyposh.dev/docs/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-[#0f3460] rounded transition-colors"
        >
          <Book size={16} />
          <span className="hidden sm:inline">Docs</span>
        </a>
        
        <a
          href="https://github.com/JanDeDobbeleer/oh-my-posh"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-[#0f3460] rounded transition-colors"
        >
          <Github size={16} />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
