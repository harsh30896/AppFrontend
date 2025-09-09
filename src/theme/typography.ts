import { Platform } from 'react-native';

export const typography = {
  // Font families
  fontFamily: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
    }),
    semiBold: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
    }),
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40,
    '4xl': 44,
    '5xl': 56,
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  
  // Text styles
  textStyles: {
    h1: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700' as const,
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto-Bold',
      }),
    },
    h2: {
      fontSize: 30,
      lineHeight: 40,
      fontWeight: '600' as const,
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto-Medium',
      }),
    },
    h3: {
      fontSize: 24,
      lineHeight: 36,
      fontWeight: '600' as const,
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto-Medium',
      }),
    },
    h4: {
      fontSize: 20,
      lineHeight: 32,
      fontWeight: '500' as const,
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto-Medium',
      }),
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    button: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as const,
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto-Medium',
      }),
    },
    buttonSmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600' as const,
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto-Medium',
      }),
    },
  },
};
