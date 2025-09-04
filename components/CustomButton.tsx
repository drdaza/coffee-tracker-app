import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';

export type CustomButtonType = 'base' | 'delete' | 'action';

interface CustomButtonProps extends Omit<PressableProps, 'style'> {
  type?: CustomButtonType;
  label: string;
  style?: ViewStyle;
}

const baseStyle: ViewStyle = {
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 100,
};

export function CustomButton({ type = 'base', label, style, onPress, ...props }: CustomButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const tint = useThemeColor({}, 'tint');
  const textBase = useThemeColor({}, 'input');

  const buttonStyleMap: Record<CustomButtonType, ViewStyle> = {
    base: {
      ...baseStyle,
      backgroundColor: tint,
    },
    delete: {
      ...baseStyle,
      backgroundColor: '#e74c3c', // Red for delete
    },
    action: {
      ...baseStyle,
      backgroundColor: tint,
    },
  };

  const textColorMap: Record<CustomButtonType, string> = {
    base: tint,
    delete: '#ffffff', // White text for delete button
    action: textBase,
  };

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyleMap[type],
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
          { color: textBase },
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