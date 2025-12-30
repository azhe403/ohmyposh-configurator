import yaml from 'js-yaml';
import TOML from '@iarna/toml';
import type { OhMyPoshConfig, Block, Segment, ExportFormat } from '../types/ohmyposh';

// Type for cleaned segment (without internal id)
type CleanedSegment = Omit<Segment, 'id'>;

// Type for cleaned block (without internal ids)
interface CleanedBlock extends Omit<Block, 'id' | 'segments'> {
  segments: CleanedSegment[];
}

// Type for cleaned config
interface CleanedConfig extends Omit<OhMyPoshConfig, 'blocks'> {
  blocks: CleanedBlock[];
}

// Remove internal IDs before export
function cleanSegment(segment: Segment): CleanedSegment {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = segment;
  return rest;
}

function cleanBlock(block: Block): CleanedBlock {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = block;
  return {
    ...rest,
    segments: rest.segments.map(cleanSegment),
  };
}

export function cleanConfig(config: OhMyPoshConfig): CleanedConfig {
  return {
    ...config,
    blocks: config.blocks.map(cleanBlock),
  };
}

export function exportToJson(config: OhMyPoshConfig): string {
  const cleanedConfig = cleanConfig(config);
  
  // Custom replacer to escape unicode characters
  const escapeUnicode = (str: string): string => {
    return str.replace(/[\u0080-\uffff]/g, (char) => {
      return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
    });
  };
  
  // Stringify with proper formatting
  const jsonString = JSON.stringify(cleanedConfig, null, 2);
  
  // Escape unicode characters in string values
  return jsonString.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match) => {
    // Only process string values (not keys), and only if they contain high unicode
    if (/[\u0080-\uffff]/.test(match)) {
      const inner = match.slice(1, -1); // Remove quotes
      const escaped = escapeUnicode(inner);
      return '"' + escaped + '"';
    }
    return match;
  });
}

export function exportToYaml(config: OhMyPoshConfig): string {
  const cleanedConfig = cleanConfig(config);
  return yaml.dump(cleanedConfig, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
  });
}

export function exportToToml(config: OhMyPoshConfig): string {
  const cleanedConfig = cleanConfig(config);
  // TOML doesn't support null values, so we need to remove them
  const cleanedForToml = JSON.parse(JSON.stringify(cleanedConfig, (_, value) => 
    value === null ? undefined : value
  ));
  return TOML.stringify(cleanedForToml as TOML.JsonMap);
}

export function exportConfig(config: OhMyPoshConfig, format: ExportFormat): string {
  switch (format) {
    case 'json':
      return exportToJson(config);
    case 'yaml':
      return exportToYaml(config);
    case 'toml':
      return exportToToml(config);
    default:
      return exportToJson(config);
  }
}

export function downloadConfig(config: OhMyPoshConfig, format: ExportFormat): void {
  const content = exportConfig(config, format);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const extension = format === 'yaml' ? 'yaml' : format;
  const filename = `ohmyposh.${extension}`;
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
