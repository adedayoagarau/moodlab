import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View as RNView,
} from 'react-native';

import { Text, View } from '@/components/Themed';
import { createMoodEntry, fetchMoodEntries, moodTagLabels } from '@/lib/api';
import type { MoodEntry, MoodTag } from '@moodlab/shared';
import { MOOD_TAGS } from '@moodlab/shared';

export default function JournalScreen() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [text, setText] = useState('');
  const [selectedTag, setSelectedTag] = useState<MoodTag | undefined>('calm');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchMoodEntries();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load journal');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  async function handleSubmit() {
    if (!text.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createMoodEntry({ text: text.trim(), moodTag: selectedTag });
      setText('');
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save entry');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Journal</Text>
      <Text style={styles.subheading}>Capture a line. Notice how it lands.</Text>

      <TextInput
        style={styles.input}
        placeholder="Write a line, a fragment, a feeling..."
        placeholderTextColor="#888"
        multiline
        value={text}
        onChangeText={setText}
        textAlignVertical="top"
      />

      <RNView style={styles.tagRow}>
        {MOOD_TAGS.map((tag) => (
          <Pressable
            key={tag}
            onPress={() => setSelectedTag(tag)}
            style={[styles.tagChip, selectedTag === tag && styles.tagChipActive]}
          >
            <Text style={[styles.tagText, selectedTag === tag && styles.tagTextActive]}>
              {moodTagLabels[tag]}
            </Text>
          </Pressable>
        ))}
      </RNView>

      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting || !text.trim()}
      >
        <Text style={styles.buttonText}>{submitting ? 'Saving…' : 'Save entry'}</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No entries yet. Start with one honest line.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.moodTag ? (
                <Text style={styles.cardTag}>{moodTagLabels[item.moodTag]}</Text>
              ) : null}
              <Text style={styles.cardText}>{item.text}</Text>
              {item.toneNotes ? <Text style={styles.cardNotes}>{item.toneNotes}</Text> : null}
            </View>
          )}
        />
      )}
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
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    minHeight: 96,
    fontSize: 16,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#bbb',
  },
  tagChipActive: {
    backgroundColor: '#5c4d7a',
    borderColor: '#5c4d7a',
  },
  tagText: {
    fontSize: 13,
  },
  tagTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#2f2542',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#c0392b',
    marginBottom: 8,
  },
  loader: {
    marginTop: 24,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  empty: {
    opacity: 0.6,
    marginTop: 16,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  cardTag: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 22,
  },
  cardNotes: {
    marginTop: 8,
    fontSize: 13,
    opacity: 0.65,
  },
});
