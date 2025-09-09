import { useThemeColor } from '@/hooks/useThemeColor';
import { Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

export type CustomInputType = 'base';
export type CustomInputSize = 'small' | 'medium' | 'large' | 'full';

interface CustomInputProps extends Omit<TextInputProps, 'style'> {
  type?: CustomInputType;
  style?: TextStyle;
  size?: CustomInputSize;
  label?: string;
  showLabel?: boolean;
  showPlaceholder?: boolean;
}

const baseStyle: TextStyle = {
  padding: 12,
  borderRadius: 8,
  borderWidth: 1,
};

const sizeStyleMap: Record<CustomInputSize, ViewStyle> = {
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

export function CustomInput({ type = 'base', style, size = 'medium', label, showLabel = true, showPlaceholder = true, ...props }: CustomInputProps) {
  const tint = useThemeColor({}, 'tint');
  const inputColor = useThemeColor({}, 'input');
  const textBase = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'icon');


  const inputStyleMap: Record<CustomInputType, TextStyle> = {
    base: {
      ...baseStyle,
      backgroundColor: inputColor,
      borderColor: tint,
      color: textBase,
    },
  };

  const sizeStyle = sizeStyleMap[size];
  const { placeholder, ...rest } = props;

  return (
    <View style={sizeStyle}>
      {showLabel && label && <Text style={{ color: textBase, marginBottom: 8, fontSize: 16, fontWeight: '600' }}>{label}</Text>}
      <TextInput
        style={[
          inputStyleMap[type],
          { width: '100%' },
          style,
        ]}
        placeholderTextColor={placeholderColor}
        placeholder={showPlaceholder ? placeholder : undefined}
        {...rest}
      />
    </View>
  );
}
