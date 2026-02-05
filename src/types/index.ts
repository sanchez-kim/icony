import { LucideIcon } from 'lucide-react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Icon as TablerIcon } from '@tabler/icons-react';
import { Icon as PhosphorIcon } from 'phosphor-react';

export type IconType = 'lucide' | 'fontawesome' | 'tabler' | 'phosphor';

export interface Icon {
  id: string;
  name: string;
  category: string;
  tags: string[];
  type: IconType;
  component: LucideIcon | IconDefinition | TablerIcon | PhosphorIcon;
}

export interface CustomizationState {
  selectedIcon: Icon | null;
  color: string;
  size: number;
}

export interface ExportOptions {
  format: 'png';
  size: number;
  color: string;
  backgroundColor?: string;
}
