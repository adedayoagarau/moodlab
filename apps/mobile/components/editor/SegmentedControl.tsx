import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type Props<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={[styles.segment, active && styles.segmentActive]}
            onPress={() => onChange(option.value)}>
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.color.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: theme.color.surface.raised,
    borderWidth: 1,
    borderColor: theme.color.accent.gold,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.color.text.muted,
    textTransform: 'capitalize',
  },
  segmentTextActive: {
    color: theme.color.accent.gold,
  },
});
