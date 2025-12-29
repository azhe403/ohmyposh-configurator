import { Sun, Moon } from 'lucide-react';
import { useConfigStore } from '../../store/configStore';
import { getSegmentMetadata } from '../../data/segments';
import type { Block, Segment } from '../../types/ohmyposh';

// Mock data for preview
const mockData: Record<string, string> = {
  path: '~/projects/my-app',
  git: 'main ↑2',
  node: 'v20.10.0',
  python: '3.11.0',
  go: '1.21.0',
  rust: '1.74.0',
  java: '17.0.1',
  dotnet: '8.0.0',
  time: '14:32:05',
  battery: '85%',
  os: '',
  shell: 'zsh',
  session: 'user@host',
  aws: 'prod@us-east-1',
  kubectl: 'k8s-prod::default',
  docker: 'default',
  terraform: 'production',
};

function getPreviewText(segment: Segment): string {
  const metadata = getSegmentMetadata(segment.type);
  
  // Try to use mock data
  if (mockData[segment.type]) {
    return mockData[segment.type];
  }
  
  // Fall back to segment name
  return metadata?.name || segment.type;
}

interface SegmentPreviewProps {
  segment: Segment;
  isFirst: boolean;
  isLast: boolean;
  prevBackground?: string;
}

function SegmentPreview({ segment, isFirst, isLast, prevBackground }: SegmentPreviewProps) {
  const text = getPreviewText(segment);
  const metadata = getSegmentMetadata(segment.type);
  const bg = segment.background || '#61AFEF';
  const fg = segment.foreground || '#ffffff';

  if (segment.style === 'powerline') {
    const symbol = segment.powerline_symbol || '\ue0b0';
    return (
      <span className="inline-flex items-center">
        {!isFirst && prevBackground && (
          <span style={{ color: prevBackground, backgroundColor: bg }}>{symbol}</span>
        )}
        <span
          style={{ backgroundColor: bg, color: fg }}
          className="px-2 py-0.5"
        >
          {metadata?.icon} {text}
        </span>
        {isLast && (
          <span style={{ color: bg }}>{symbol}</span>
        )}
      </span>
    );
  }

  if (segment.style === 'diamond') {
    const leadingDiamond = segment.leading_diamond || '\ue0b6';
    const trailingDiamond = segment.trailing_diamond || '\ue0b4';
    return (
      <span className="inline-flex items-center">
        <span style={{ color: bg }}>{leadingDiamond}</span>
        <span
          style={{ backgroundColor: bg, color: fg }}
          className="px-2 py-0.5"
        >
          {metadata?.icon} {text}
        </span>
        <span style={{ color: bg }}>{trailingDiamond}</span>
      </span>
    );
  }

  // Plain or accordion style
  return (
    <span
      style={{ backgroundColor: bg, color: fg }}
      className="px-2 py-0.5 rounded"
    >
      {metadata?.icon} {text}
    </span>
  );
}

interface BlockPreviewProps {
  block: Block;
}

function BlockPreview({ block }: BlockPreviewProps) {
  if (block.segments.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-0 ${
        block.alignment === 'right' ? 'justify-end' : 'justify-start'
      }`}
    >
      {block.segments.map((segment, index) => (
        <SegmentPreview
          key={segment.id}
          segment={segment}
          isFirst={index === 0}
          isLast={index === block.segments.length - 1}
          prevBackground={index > 0 ? block.segments[index - 1].background : undefined}
        />
      ))}
    </div>
  );
}

export function PreviewPanel() {
  const config = useConfigStore((state) => state.config);
  const previewBackground = useConfigStore((state) => state.previewBackground);
  const setPreviewBackground = useConfigStore((state) => state.setPreviewBackground);

  const bgColor = previewBackground === 'dark' ? '#1e1e1e' : '#ffffff';
  const textColor = previewBackground === 'dark' ? '#cccccc' : '#333333';

  return (
    <div className="bg-[#16213e] border-t border-[#0f3460]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#0f3460]">
        <h2 className="text-sm font-semibold text-gray-200">Preview</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Background:</span>
          <button
            onClick={() => setPreviewBackground('dark')}
            className={`p-1.5 rounded transition-colors ${
              previewBackground === 'dark'
                ? 'bg-[#0f3460] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Dark background"
          >
            <Moon size={14} />
          </button>
          <button
            onClick={() => setPreviewBackground('light')}
            className={`p-1.5 rounded transition-colors ${
              previewBackground === 'light'
                ? 'bg-[#0f3460] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Light background"
          >
            <Sun size={14} />
          </button>
        </div>
      </div>

      <div
        className="p-4 font-mono text-sm"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="space-y-1">
          {config.blocks.map((block, index) => (
            <div key={block.id}>
              <BlockPreview block={block} />
              {block.newline && index < config.blocks.length - 1 && <br />}
            </div>
          ))}
          <div className="mt-1">
            <span style={{ color: textColor }}>❯ </span>
            <span className="animate-pulse">▋</span>
          </div>
        </div>
      </div>
    </div>
  );
}
