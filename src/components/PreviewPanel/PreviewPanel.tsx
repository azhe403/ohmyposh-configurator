import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useConfigStore } from '../../store/configStore';
import { useSegmentMetadata } from '../../hooks/useSegmentMetadata';
import type { Block, Segment, SegmentStyle } from '../../types/ohmyposh';
import { DynamicIcon } from '../DynamicIcon';

// Mock data for preview
const mockData: Record<string, any> = {
  // Path segments
  Path: '~/dev/my-app',
  Folder: 'my-app',
  
  // Session
  UserName: 'user',
  HostName: 'laptop',
  
  // Git
  HEAD: 'main',
  BranchStatus: '↑2',
  UpstreamIcon: '',
  Working: { Changed: false, String: '' },
  Staging: { Changed: false, String: '' },
  StashCount: 0,
  
  // Languages
  Full: 'v1.2.3',
  Major: '1',
  Minor: '2',
  Patch: '3',
  Venv: 'venv',
  
  // Time
  CurrentDate: 'Monday at 2:45 PM',
  Format: '',
  
  // Execution time
  FormattedMs: '127ms',
  Ms: 127,
  
  // Azure
  EnvironmentName: 'production',
  
  // Docker/Kubectl
  Context: 'default',
  
  // Status
  Code: 0,
  
  // Battery
  Percentage: 85,
  
  // Copilot
  Premium: { Percent: { Gauge: '████░' } },
};

// Default symbols
const DEFAULT_POWERLINE_SYMBOL = '\ue0b0';
const DEFAULT_LEADING_DIAMOND = '\ue0b6';
const DEFAULT_TRAILING_DIAMOND = '\ue0b4';

// Parse inline color codes from Oh My Posh templates
// Format: <#hexcolor>text</> or </>text (to reset)
function parseInlineColors(text: string, defaultColor: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /<#([0-9a-fA-F]{6})>([^<]*)<\/>|<\/>/g;
  let lastIndex = 0;
  let match;
  let currentColor = defaultColor;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      parts.push(
        <span key={`text-${lastIndex}`} style={{ color: currentColor }}>
          {beforeText}
        </span>
      );
    }

    // Add colored text or handle color reset
    if (match[1]) {
      // Color code found
      currentColor = `#${match[1]}`;
      parts.push(
        <span key={`color-${match.index}`} style={{ color: currentColor }}>
          {match[2]}
        </span>
      );
    } else {
      // Reset to default color
      currentColor = defaultColor;
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`} style={{ color: currentColor }}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : [text];
}

function getPreviewText(segment: Segment, metadata?: { name: string; previewText?: string }): string {
  // First priority: use template if available (shows inline colors and symbols)
  if (segment.template) {
    // Replace template variables with mock data
    let result = segment.template;
    
    // Handle nested properties (any depth) like .Working.Changed or .Premium.Percent.Gauge
    result = result.replace(/{{\s*\.([.\w]+)\s*}}/g, (match, path) => {
      const keys = path.split('.');
      let value: any = mockData;
      
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return '';
        }
      }
      
      return value !== undefined ? String(value) : '';
    });
    
    // Handle conditional statements - just show the content for preview
    result = result.replace(/{{\s*if\s+[^}]*}}(.*?){{\s*end\s*}}/gs, '$1');
    result = result.replace(/{{\s*if\s+[^}]*}}/g, '');
    result = result.replace(/{{\s*end\s*}}/g, '');
    
    // Handle date formatting
    result = result.replace(/{{\s*\.CurrentDate\s*\|\s*date\s+\.Format\s*}}/g, mockData.CurrentDate);
    result = result.replace(/{{\s*\.CurrentDate\s*\|\s*date\s+"([^"]+)"\s*}}/g, mockData.CurrentDate);
    
    // Clean up any remaining template expressions
    result = result.replace(/{{.*?}}/g, '');
    
    return result;
  }
  
  // Second priority: use previewText from metadata if available
  if (metadata?.previewText) {
    return metadata.previewText;
  }
  
  // Third priority: generate preview based on segment type
  const typeMap: Record<string, string> = {
    path: mockData.Path,
    git: `${mockData.HEAD} ${mockData.BranchStatus}`,
    node: 'v20.10.0',
    python: '3.11.0',
    go: '1.21.0',
    rust: '1.74.0',
    dotnet: '8.0.0',
    java: '17.0.0',
    azfunc: 'v4.0',
    az: mockData.EnvironmentName,
    docker: mockData.Context,
    kubectl: 'k8s-prod::default',
    time: mockData.CurrentDate,
    session: `${mockData.UserName}@${mockData.HostName}`,
    executiontime: mockData.FormattedMs,
    status: '❯',
    battery: '85%',
    aws: 'prod@us-east-1',
    terraform: 'production',
  };
  
  if (typeMap[segment.type]) {
    return typeMap[segment.type];
  }
  
  // Fall back to segment name
  return metadata?.name || segment.type;
}

interface SegmentPreviewProps {
  segment: Segment;
  nextBackground?: string;
  blockLeadingDiamond?: string;
  blockTrailingDiamond?: string;
  prevStyle?: SegmentStyle;
}

function SegmentPreview({ segment, nextBackground, blockLeadingDiamond, blockTrailingDiamond, prevStyle }: SegmentPreviewProps) {
  const metadata = useSegmentMetadata(segment.type);
  const text = getPreviewText(segment, metadata);
  const bg = segment.background || 'transparent';
  const fg = segment.foreground || '#ffffff';
  const hasBackground = !!segment.background;
  
  // Parse inline colors from text
  const renderedText = parseInlineColors(text, fg);

  // Add negative margin if previous segment was powerline
  const marginClass = prevStyle === 'powerline' ? '-ml-[2px]' : '';

  if (segment.style === 'powerline') {
    const powerlineSymbol = segment.powerline_symbol || DEFAULT_POWERLINE_SYMBOL;
    // For powerline, the symbol color is the current segment's background,
    // rendered on top of the next segment's background (or transparent)
    const symbolBg = nextBackground || 'transparent';
    
    return (
      <span className={`inline-flex items-stretch -mr-[2px] ${marginClass}`}>
        <span
          style={{ 
            backgroundColor: bg, 
            color: fg,
            border: !hasBackground ? '1px solid rgba(128,128,128,0.3)' : 'none',
            borderRight: !hasBackground && hasBackground ? 'none' : undefined,
          }}
          className="px-2 py-1 inline-flex items-center gap-1.5"
        >
          {metadata?.icon && <DynamicIcon name={metadata.icon} size={14} />}
          <span>{renderedText}</span>
        </span>
        {/* Powerline symbol - only show if current segment has background */}
        {hasBackground && (
          <span 
            className="nerd-font-symbol -ml-[2px] inline-flex items-center"
            style={{
              color: bg,
              backgroundColor: symbolBg,
            }}
          >
            {powerlineSymbol}
          </span>
        )}
      </span>
    );
  }

  if (segment.style === 'diamond') {
    // Only use diamonds if explicitly set (don't use defaults)
    const leadingDiamond = segment.leading_diamond || blockLeadingDiamond;
    const trailingDiamond = segment.trailing_diamond || blockTrailingDiamond;
    
    return (
      <span className={`inline-flex items-stretch ${marginClass}`}>
        {/* Leading diamond - only show if explicitly set */}
        {leadingDiamond && (
          <span 
            className="nerd-font-symbol inline-flex items-center -mr-[2px]"
            style={{
              color: hasBackground ? bg : fg,
              backgroundColor: 'transparent',
            }}
          >
            {parseInlineColors(leadingDiamond, hasBackground ? bg : fg)}
          </span>
        )}
        <span
          style={{ 
            backgroundColor: bg, 
            color: fg,
            border: !hasBackground ? '1px solid rgba(128,128,128,0.3)' : 'none',
            borderLeft: !hasBackground && leadingDiamond ? 'none' : undefined,
            borderRight: !hasBackground && trailingDiamond ? 'none' : undefined,
          }}
          className={`px-2 py-1 inline-flex items-center gap-1.5 ${leadingDiamond ? '-ml-[2px]' : ''} ${trailingDiamond ? '-mr-[2px]' : ''}`}
        >
          {metadata?.icon && <DynamicIcon name={metadata.icon} size={14} />}
          <span>{renderedText}</span>
        </span>
        {/* Trailing diamond - only show if explicitly set */}
        {trailingDiamond && (
          <span 
            className="nerd-font-symbol inline-flex items-center -ml-[2px]"
            style={{
              color: hasBackground ? bg : fg,
              backgroundColor: 'transparent',
            }}
          >
            {parseInlineColors(trailingDiamond, hasBackground ? bg : fg)}
          </span>
        )}
      </span>
    );
  }

  // Plain or accordion style
  return (
    <span
      style={{ 
        backgroundColor: bg, 
        color: fg,
        border: !hasBackground ? '1px solid rgba(128,128,128,0.3)' : 'none',
      }}
      className={`px-2 py-1 rounded inline-flex items-center gap-1.5 ${marginClass}`}
    >
      {metadata?.icon && <DynamicIcon name={metadata.icon} size={14} />}
      <span>{renderedText}</span>
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
          nextBackground={index < block.segments.length - 1 ? block.segments[index + 1].background : undefined}
          blockLeadingDiamond={block.leading_diamond}
          blockTrailingDiamond={block.trailing_diamond}
          prevStyle={index > 0 ? block.segments[index - 1].style : undefined}
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
        className="p-4 text-sm"
        style={{ 
          backgroundColor: bgColor, 
          color: textColor,
          fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', 'Monaco', monospace",
        }}
      >
        <div className="space-y-2">
          {config.blocks.map((block, index) => (
            <div key={block.id}>
              <BlockPreview block={block} />
              {block.newline && index < config.blocks.length - 1 && <br />}
            </div>
          ))}
          <div className="mt-2">
            <span style={{ color: textColor }}>❯ </span>
            <span className="animate-pulse">▋</span>
          </div>
        </div>
      </div>
    </div>
  );
}
