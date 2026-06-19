import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { MOOD_TAGS } from '@moodlab/shared';
import { moodTagLabels } from '@/lib/api';

const prompts: Record<string, string> = {
  calm: 'What would a calmer version of this line sound like?',
  joyful: 'Where does lightness enter — word choice, rhythm, or image?',
  anxious: 'What tightens the register? Short clauses, hedges, repetition?',
  melancholy: 'Which images carry weight without explaining it?',
  energized: 'What picks up pace — verbs, punctuation, sentence length?',
  tender: 'How does warmth show up without sentimentality?',
  frustrated: 'What friction is visible in diction or structure?',
  hopeful: 'Where does the line turn toward possibility?',
};

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore mood</Text>
      <Text style={styles.subheading}>
        Prompts for reading emotional register — poetry and product copy share the same question: how
        does this line feel?
      </Text>

      {MOOD_TAGS.map((tag) => (
        <View key={tag} style={styles.card}>
          <Text style={styles.tag}>{moodTagLabels[tag]}</Text>
          <Text style={styles.prompt}>{prompts[tag]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  tag: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  prompt: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.85,
  },
});
