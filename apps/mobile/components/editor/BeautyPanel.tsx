import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { StrengthSlider } from '@/components/editor/StrengthSlider';
import { theme } from '@/constants/theme';
import {
  BEAUTY_PRESETS,
  type BeautySettings,
} from '@moodlab/shared';

type BeautyTab = 'auto' | 'skin' | 'face' | 'eyes' | 'lips';

const TABS: { id: BeautyTab; label: string }[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'skin', label: 'Skin' },
  { id: 'face', label: 'Face' },
  { id: 'eyes', label: 'Eyes' },
  { id: 'lips', label: 'Lips' },
];

const SKIN_LEVELS: BeautySettings['skinProtection'][] = ['off', 'low', 'medium', 'high'];

type Props = {
  beauty: BeautySettings;
  isPro: boolean;
  onChange: (patch: Partial<BeautySettings>) => void;
  onApplyPreset: (presetId: string) => void;
  onLockedPreset: (presetId: string, name: string) => void;
};

export function BeautyPanel({
  beauty,
  isPro,
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
      <Text style={styles.tagline}>Polished portraits. Protected melanin. Kept texture.</Text>

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

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
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
              <View>
                <Text style={styles.controlLabel}>Melanin Guard</Text>
                <Text style={styles.controlHint}>Protects depth + undertone under LUTs</Text>
              </View>
              <Switch
                value={beauty.melaninGuard ?? true}
                onValueChange={(v) => setBeautyKey('melaninGuard', v)}
                trackColor={{ false: theme.color.surface.raised, true: theme.color.accent.gold }}
              />
            </View>

            <Text style={styles.sectionLabel}>Skin protection (LUT on face)</Text>
            <View style={styles.steps}>
              {SKIN_LEVELS.map((level) => (
                <Pressable
                  key={level}
                  style={[
                    styles.stepBtn,
                    beauty.skinProtection === level && styles.stepBtnActive,
                  ]}
                  onPress={() => setBeautyKey('skinProtection', level)}>
                  <Text style={styles.stepText}>{level}</Text>
                </Pressable>
              ))}
            </View>

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
              label="Ash fix (Melanin)"
              value={beauty.melaninAshFix ?? 0}
              onChange={(v) => setBeautyKey('melaninAshFix', v)}
            />
            <StrengthSlider
              label="Warmth protect (Melanin)"
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
              Face tools target the detected portrait region. ML Kit segmentation ships in native
              RenderCore.
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
            <Text style={styles.hint}>
              Brightens the upper face / eye zone for clearer catchlights and alertness.
            </Text>
          </View>
        ) : null}

        {tab === 'lips' ? (
          <View style={styles.section}>
            <StrengthSlider
              label="Lip color boost"
              value={beauty.lipColorBoost ?? 0}
              onChange={(v) => setBeautyKey('lipColorBoost', v)}
            />
            <Text style={styles.hint}>
              Subtle saturation + warmth on the lip zone — not a full lipstick filter.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.space[4],
    paddingTop: theme.space[3],
    paddingBottom: theme.space[2],
    backgroundColor: theme.color.surface.default,
    borderTopWidth: 1,
    borderTopColor: theme.color.stroke.subtle,
    maxHeight: 320,
  },
  heading: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.color.text.muted,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 12,
    color: theme.color.text.secondary,
    marginTop: 2,
    marginBottom: 10,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.color.surface.elevated,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: theme.color.surface.raised,
    borderWidth: 1,
    borderColor: theme.color.accent.gold,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.color.text.muted,
  },
  tabTextActive: {
    color: theme.color.accent.gold,
  },
  scroll: {
    flexGrow: 0,
  },
  section: {
    gap: 10,
    paddingBottom: 12,
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
    padding: 10,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface.elevated,
    minHeight: 72,
  },
  presetCardActive: {
    borderWidth: 1,
    borderColor: theme.color.accent.gold,
  },
  presetName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.color.text.primary,
  },
  presetDesc: {
    fontSize: 10,
    color: theme.color.text.secondary,
    marginTop: 4,
    lineHeight: 14,
  },
  proBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.color.accent.gold,
    marginTop: 6,
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  resetText: {
    color: theme.color.text.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
  controlHint: {
    fontSize: 11,
    color: theme.color.text.muted,
    marginTop: 2,
    maxWidth: 220,
  },
  steps: {
    flexDirection: 'row',
    gap: 8,
  },
  stepBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.color.surface.elevated,
    alignItems: 'center',
  },
  stepBtnActive: {
    borderWidth: 1,
    borderColor: theme.color.accent.gold,
    backgroundColor: theme.color.surface.raised,
  },
  stepText: {
    fontSize: 11,
    color: theme.color.text.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  hint: {
    fontSize: 11,
    lineHeight: 16,
    color: theme.color.text.muted,
    marginTop: 4,
  },
});
