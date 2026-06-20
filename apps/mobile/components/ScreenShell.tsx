import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

/** Tab screen wrapper with safe-area padding and optional scroll. */
export function ScreenShell({ children, scroll = true, style, contentStyle }: Props) {
  const insets = useSafeAreaInsets();

  if (scroll) {
    return (
      <ScrollView
        style={[styles.root, style]}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + theme.space[4], paddingBottom: insets.bottom + 88 },
          contentStyle,
        ]}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.root,
        styles.content,
        { paddingTop: insets.top + theme.space[4], paddingBottom: insets.bottom + 88 },
        style,
        contentStyle,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.color.surface.base,
  },
  content: {
    paddingHorizontal: theme.space[4],
  },
});
