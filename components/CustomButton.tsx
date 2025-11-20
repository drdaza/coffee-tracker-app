import { useThemeColor } from '@/hooks/useThemeColor';
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';

export type CustomButtonType = 'base' | 'delete' | 'action';
export type CustomButtonSize = 'small' | 'medium' | 'large' | 'full';

interface CustomButtonProps extends Omit<PressableProps, 'style'> {
  type?: CustomButtonType;
  label: string;
  style?: ViewStyle;
  size?: CustomButtonSize;
}

const baseStyle: ViewStyle = {
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
};

const sizeStyleMap: Record<CustomButtonSize, ViewStyle> = {
  small: {
    width: 100,
  },
  medium: {
    width: 150,
  },
  large: {
    width: 200,
  },
  full: {
    width: '100%',
  },
};

export function CustomButton({ type = 'base', label, style, size = 'medium', onPress, ...props }: CustomButtonProps) {
  const tint = useThemeColor({}, 'tint');
  const textBase = useThemeColor({}, 'input');

  const buttonStyleMap: Record<CustomButtonType, ViewStyle> = {
    base: {
      ...baseStyle,
      backgroundColor: tint,
    },
    delete: {
      ...baseStyle,
      backgroundColor: '#e74c3c',
    },
    action: {
      ...baseStyle,
      backgroundColor: tint,
    },
  };

  const textColorMap: Record<CustomButtonType, string> = {
    base: textBase,
    delete: '#ffffff',
    action: textBase,
  };

  const sizeStyle = sizeStyleMap[size];

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyleMap[type],
        sizeStyle,
        {
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      <Text
        style={[
          styles.text,
          { color: textColorMap[type] },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});