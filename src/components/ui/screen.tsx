import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ScreenProps {
  children: React.ReactNode;
  /** Wrap content in a ScrollView (default true). */
  scroll?: boolean;
  /** Apply top safe-area padding — use on screens without a header. */
  safeTop?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

/** Page container: themed background, safe areas, centered max width on tablets/web. */
export function Screen({ children, scroll = true, safeTop = false, contentStyle }: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const padding = {
    paddingTop: safeTop ? insets.top + Spacing.lg : Spacing.lg,
    paddingBottom: insets.bottom + Spacing.xxl,
  };

  if (!scroll) {
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <View style={[styles.content, padding, contentStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, padding, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
});
