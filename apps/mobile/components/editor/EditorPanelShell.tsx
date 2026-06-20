import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type Props = {
  title?: string;
  subtitle?: string;
  header?: ReactNode;
  children: ReactNode;
  scrollable?: boolean;
};

export function EditorPanelShell({
  title,
  subtitle,
  header,
  children,
  scrollable = true,
}: Props) {
  const body = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled>
      {children}
    </ScrollView>
  ) : (
    <View style={styles.body}>{children}</View>
  );

  return (
    <View style={styles.shell}>
      {header}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: theme.color.surface.default,
    borderTopWidth: 1,
    borderTopColor: theme.color.stroke.subtle,
    paddingHorizontal: theme.space[4],
    paddingTop: theme.space[3],
    paddingBottom: theme.space[2],
    minHeight: 0,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.color.text.muted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: theme.color.text.secondary,
    marginBottom: theme.space[3],
    lineHeight: 18,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingBottom: theme.space[4],
    gap: 14,
  },
  body: {
    flex: 1,
    minHeight: 0,
  },
});
