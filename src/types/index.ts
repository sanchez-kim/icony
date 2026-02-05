import { LucideIcon } from 'lucide-react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type IconType = 'lucide' | 'fontawesome' | 'tabler' | 'phosphor';

// Generic icon component type that works for all libraries
export type IconComponent = LucideIcon | IconDefinition | React.ComponentType<any>;

export interface Icon {
  id: string;
  name: string;
  category: string;
  tags: string[];
  type: IconType;
  component: IconComponent;
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
