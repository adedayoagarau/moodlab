import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type Props = {
  visible: boolean;
  lutName?: string;
  onClose: () => void;
  onUnlockDemo: () => void;
};

export function PaywallSheet({ visible, lutName, onClose, onUnlockDemo }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.kicker}>MoodLab Pro</Text>
          <Text style={styles.title}>
            {lutName ? `"${lutName}" is a Pro mood` : 'Unlock premium moods'}
          </Text>
          <Text style={styles.body}>
            Pro unlocks Melanin Gold, Creator Cover, premium beauty presets, high-res export, and
            no watermark — built for beat covers, rollouts, and campaign visuals.
          </Text>
          <Pressable style={styles.primary} onPress={onUnlockDemo}>
            <Text style={styles.primaryText}>Start Pro (demo unlock)</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={onClose}>
            <Text style={styles.secondaryText}>Maybe later</Text>
          </Pressable>
          <Text style={styles.footnote}>RevenueCat billing replaces demo unlock before App Store ship.</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    backgroundColor: theme.color.surface.default,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    padding: theme.space[5],
    gap: 12,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.color.accent.gold,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.color.text.primary,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.color.text.secondary,
  },
  primary: {
    backgroundColor: theme.color.accent.gold,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.color.surface.base,
  },
  secondary: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 15,
    color: theme.color.text.secondary,
    fontWeight: '600',
  },
  footnote: {
    fontSize: 11,
    color: theme.color.text.muted,
    textAlign: 'center',
    marginTop: 4,
  },
});
