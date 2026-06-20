import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { SegmentedControl } from '@/components/editor/SegmentedControl';
import { StrengthSlider } from '@/components/editor/StrengthSlider';
import { theme } from '@/constants/theme';
import {
  BEAUTY_PRESETS,
  type BeautySettings,
  type FaceDetectionSource,
} from '@moodlab/shared';

type BeautyTab = 'auto' | 'skin' | 'face' | 'eyes' | 'lips';

const DETECTION_LABELS: Record<FaceDetectionSource, string> = {
  vision: 'Apple Vision landmarks',
  mlkit: 'ML Kit face detection',
  heuristic: 'Orientation estimate',
};

const TABS: { id: BeautyTab; label: string }[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'skin', label: 'Skin' },
  { id: 'face', label: 'Face' },
  { id: 'eyes', label: 'Eyes' },
  { id: 'lips', label: 'Lips' },
];

const SKIN_LEVELS = ['off', 'low', 'medium', 'high'] as const;
type SkinProtectionLevel = (typeof SKIN_LEVELS)[number];

type Props = {
  beauty: BeautySettings;
  isPro: boolean;
  faceDetectionSource?: FaceDetectionSource;
  hasSkinMask?: boolean;
  onChange: (patch: Partial<BeautySettings>) => void;
  onApplyPreset: (presetId: string) => void;
  onLockedPreset: (presetId: string, name: string) => void;
};

export function BeautyPanel({
  beauty,
  isPro,
  faceDetectionSource = 'heuristic',
  hasSkinMask = false,
  onChange,
  onApplyPreset,
  onLockedPreset,
}: Props) {
  const [tab, setTab] = useState<BeautyTab>('auto');

  function setBeautyKey<K extends keyof BeautySettings>(key: K, value: BeautySettings[K]) {
    onChange({ [key]: value });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Beauty Studio</Text>
      <Text style={styles.detectionBadge}>
        {DETECTION_LABELS[faceDetectionSource]}
        {hasSkinMask ? ' · skin mask' : ''}
      </Text>

      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <Pressable
            key={t.id}
            style={[styles.tab, tab === t.id && styles.tabActive]}
            onPress={() => setTab(t.id)}>
            <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {tab === 'auto' ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>One-tap looks</Text>
            <View style={styles.presetGrid}>
              {BEAUTY_PRESETS.map((preset) => {
                const locked = preset.plan === 'pro' && !isPro;
                const active = beauty.preset === preset.id;
                return (
                  <Pressable
                    key={preset.id}
                    style={[styles.presetCard, active && styles.presetCardActive]}
                    onPress={() =>
                      locked
                        ? onLockedPreset(preset.id, preset.name)
                        : onApplyPreset(preset.id)
                    }>
                    <Text style={styles.presetName}>{preset.name}</Text>
                    <Text style={styles.presetDesc} numberOfLines={2}>
                      {preset.description}
                    </Text>
                    {preset.plan === 'pro' ? (
                      <Text style={styles.proBadge}>{locked ? '🔒 PRO' : 'PRO'}</Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
            <Pressable style={styles.resetBtn} onPress={() => onApplyPreset('natural')}>
              <Text style={styles.resetText}>Reset to Natural</Text>
            </Pressable>
          </View>
        ) : null}

        {tab === 'skin' ? (
          <View style={styles.section}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleCopy}>
                <Text style={styles.controlLabel}>Melanin Guard</Text>
                <Text style={styles.controlHint}>Protects depth + undertone under LUTs</Text>
              </View>
              <Switch
                value={beauty.melaninGuard ?? true}
                onValueChange={(v) => setBeautyKey('melaninGuard', v)}
                trackColor={{ false: theme.color.surface.raised, true: theme.color.accent.gold }}
              />
            </View>

            <Text style={styles.sectionLabel}>Skin protection</Text>
            <SegmentedControl<SkinProtectionLevel>
              options={SKIN_LEVELS.map((level) => ({ value: level, label: level }))}
              value={beauty.skinProtection ?? 'medium'}
              onChange={(level) => setBeautyKey('skinProtection', level)}
            />

            <StrengthSlider
              label="Smooth"
              value={beauty.skinSmooth ?? 0}
              onChange={(v) => setBeautyKey('skinSmooth', v)}
            />
            <StrengthSlider
              label="Texture restore"
              value={beauty.textureRestore ?? 0.55}
              onChange={(v) => setBeautyKey('textureRestore', v)}
            />
            <StrengthSlider
              label="Even tone"
              value={beauty.evenTone ?? 0}
              onChange={(v) => setBeautyKey('evenTone', v)}
            />
            <StrengthSlider
              label="Reduce shine"
              value={beauty.reduceShine ?? 0}
              onChange={(v) => setBeautyKey('reduceShine', v)}
            />
            <StrengthSlider
              label="Ash fix"
              value={beauty.melaninAshFix ?? 0}
              onChange={(v) => setBeautyKey('melaninAshFix', v)}
            />
            <StrengthSlider
              label="Warmth protect"
              value={beauty.melaninWarmthProtect ?? 0}
              onChange={(v) => setBeautyKey('melaninWarmthProtect', v)}
            />
            <StrengthSlider
              label="Face LUT strength"
              value={beauty.faceLutStrength ?? 0.55}
              onChange={(v) => setBeautyKey('faceLutStrength', v)}
            />
            <StrengthSlider
              label="Background LUT strength"
              value={beauty.backgroundLutStrength ?? 1}
              onChange={(v) => setBeautyKey('backgroundLutStrength', v)}
            />
          </View>
        ) : null}

        {tab === 'face' ? (
          <View style={styles.section}>
            <StrengthSlider
              label="Face light"
              value={beauty.faceLight ?? 0}
              onChange={(v) => setBeautyKey('faceLight', v)}
            />
            <StrengthSlider
              label="Under-eye lift"
              value={beauty.underEyeLift ?? 0}
              onChange={(v) => setBeautyKey('underEyeLift', v)}
            />
            <Text style={styles.hint}>
              Face tools use {DETECTION_LABELS[faceDetectionSource].toLowerCase()}.
            </Text>
          </View>
        ) : null}

        {tab === 'eyes' ? (
          <View style={styles.section}>
            <StrengthSlider
              label="Eye brightness"
              value={beauty.eyeBrightness ?? 0}
              onChange={(v) => setBeautyKey('eyeBrightness', v)}
            />
          </View>
        ) : null}

        {tab === 'lips' ? (
          <View style={styles.section}>
            <StrengthSlider
              label="Lip color boost"
              value={beauty.lipColorBoost ?? 0}
              onChange={(v) => setBeautyKey('lipColorBoost', v)}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: theme.space[4],
    paddingTop: theme.space[3],
    paddingBottom: theme.space[2],
    backgroundColor: theme.color.surface.default,
    borderTopWidth: 1,
    borderTopColor: theme.color.stroke.subtle,
  },
  heading: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.color.text.muted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  detectionBadge: {
    fontSize: 11,
    color: theme.color.text.muted,
    marginTop: 4,
    marginBottom: theme.space[2],
  },
  tabRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: theme.space[2],
  },
  tab: {
    flex: 1,
    minHeight: 36,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.color.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: theme.color.surface.raised,
    borderWidth: 1,
    borderColor: theme.color.accent.gold,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.color.text.muted,
  },
  tabTextActive: {
    color: theme.color.accent.gold,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingBottom: theme.space[4],
  },
  section: {
    gap: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.color.text.muted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetCard: {
    width: '47%',
    padding: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface.elevated,
    minHeight: 76,
  },
  presetCardActive: {
    borderWidth: 1,
    borderColor: theme.color.accent.gold,
  },
  presetName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.color.text.primary,
  },
  presetDesc: {
    fontSize: 11,
    color: theme.color.text.secondary,
    marginTop: 4,
    lineHeight: 15,
  },
  proBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.color.accent.gold,
    marginTop: 6,
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resetText: {
    color: theme.color.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleCopy: {
    flex: 1,
  },
  controlLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
  controlHint: {
    fontSize: 12,
    color: theme.color.text.muted,
    marginTop: 2,
  },
  hint: {
    fontSize: 12,
    lineHeight: 17,
    color: theme.color.text.muted,
  },
});
