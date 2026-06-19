import { Image, StyleSheet, View } from 'react-native';

import { theme } from '@/constants/theme';
import { DEMO_IMAGE_URI } from '@/lib/use-platform-status';
import { getLutPreviewTint } from '@/lib/render-preview';
import type { LutDefinition } from '@moodlab/shared';

type Props = {
  lut: LutDefinition;
  size?: number;
};

/** Photo-based LUT carousel thumb — demo portrait + mood tint overlay. */
export function LutThumbnail({ lut, size = 56 }: Props) {
  const tint = getLutPreviewTint(lut);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Image
        source={{ uri: DEMO_IMAGE_URI }}
        style={[styles.photo, { width: size, height: size }]}
        resizeMode="cover"
      />
      <View
        style={[
          styles.overlay,
          {
            width: size,
            height: size,
            backgroundColor: tint?.overlay ?? theme.color.accent.gold,
            opacity: tint?.opacity ?? 0.45,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    marginBottom: 6,
  },
  photo: {
    borderRadius: theme.radius.sm,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.radius.sm,
  },
});
