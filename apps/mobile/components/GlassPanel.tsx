import { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

type GlassPanelProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function GlassPanel({ children, style }: GlassPanelProps) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.color.glass,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.color.stroke.subtle,
    padding: theme.space[4],
  },
});
