import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { ButtonProps } from '../../types';

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: disabled ? 0.6 : 1,
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        height: theme.layout.buttonHeightSmall,
        paddingHorizontal: theme.spacing.md,
      },
      medium: {
        height: theme.layout.buttonHeight,
        paddingHorizontal: theme.spacing.lg,
      },
      large: {
        height: theme.layout.buttonHeightLarge,
        paddingHorizontal: theme.spacing.xl,
      },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: theme.colors.buttonPrimary,
      },
      secondary: {
        backgroundColor: theme.colors.buttonSecondary,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      danger: {
        backgroundColor: theme.colors.buttonDanger,
      },
      success: {
        backgroundColor: theme.colors.buttonSuccess,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: theme.typography.fontWeight.semiBold,
      textAlign: 'center',
    };

    const sizeStyles: Record<string, TextStyle> = {
      small: {
        fontSize: theme.typography.fontSize.sm,
      },
      medium: {
        fontSize: theme.typography.fontSize.base,
      },
      large: {
        fontSize: theme.typography.fontSize.lg,
      },
    };

    const variantStyles: Record<string, TextStyle> = {
      primary: {
        color: theme.colors.text,
      },
      secondary: {
        color: theme.colors.text,
      },
      danger: {
        color: theme.colors.text,
      },
      success: {
        color: theme.colors.text,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.colors.text : theme.colors.primary}
        />
      );
    }

    return (
      <>
        {icon && (
          <Text style={[styles.icon, { marginRight: title ? theme.spacing.sm : 0 }]}>
            {icon}
          </Text>
        )}
        <Text style={getTextStyle()}>{title}</Text>
      </>
    );
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyle(), style]}
        testID={testID}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      testID={testID}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: {
    fontSize: 16,
  },
});

export default Button;
