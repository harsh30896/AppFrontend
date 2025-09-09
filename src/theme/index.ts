export * from './colors';
export * from './typography';
export * from './spacing';

import { colors, gradients } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, layout } from './spacing';

export const theme = {
  colors: colors.dark, // Using dark theme as primary
  gradients, 
  typography,
  spacing,
  borderRadius,
  layout,
  isDark: true,
};

export type Theme = typeof theme;
