/** MoodLab design tokens — from docs/design/design_tokens.json */

export const theme = {
  color: {
    surface: {
      base: '#070708',
      default: '#0D0D10',
      elevated: '#15151A',
      raised: '#1E1E25',
    },
    text: {
      primary: '#F7F4EE',
      secondary: '#B9B3AA',
      muted: '#76716B',
    },
    accent: {
      gold: '#F5B85B',
      orange: '#FF7A33',
      blue: '#6CA7FF',
      green: '#66D19E',
      red: '#FF5C66',
    },
    stroke: {
      subtle: 'rgba(255,255,255,0.10)',
      strong: 'rgba(255,255,255,0.22)',
    },
    glass: 'rgba(22,22,26,0.72)',
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    xl: 28,
    full: 999,
  },
  space: {
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
  },
} as const;
