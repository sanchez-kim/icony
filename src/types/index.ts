import { LucideIcon } from 'lucide-react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type IconType = 'lucide' | 'fontawesome';

export interface Icon {
  id: string;
  name: string;
  category: string;
  tags: string[];
  type: IconType;
  component: LucideIcon | IconDefinition;
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
