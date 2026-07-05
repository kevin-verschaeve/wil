import { Text, type TextProps, type TextStyle } from 'react-native';

import { Type, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface AppTextProps extends TextProps {
  variant?: keyof typeof Type;
  color?: ThemeColor;
}

export function AppText({ variant = 'body', color = 'text', style, ...rest }: AppTextProps) {
  const theme = useTheme();
  return <Text style={[Type[variant] as TextStyle, { color: theme[color] }, style]} {...rest} />;
}
