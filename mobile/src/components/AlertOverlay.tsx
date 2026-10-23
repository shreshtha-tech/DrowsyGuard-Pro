import { StyleSheet, Text, View } from 'react-native';

interface AlertOverlayProps {
  stage: number;
  score: number;
}

const messages: Record<number, string> = {
  1: 'Drowsiness detected. Stay alert.',
  2: 'Warning: take a break as soon as it is safe.',
  3: 'Danger: pull over safely now.',
  4: 'Critical drowsiness detected. Pull over safely now.',
};

export default function AlertOverlay({ stage, score }: AlertOverlayProps) {
  if (stage < 1) return null;
  const critical = stage >= 3;
  return (
    <View pointerEvents="none" style={[styles.overlay, critical ? styles.critical : styles.warning]}>
      <View style={styles.card}>
        <Text style={[styles.title, critical ? styles.criticalText : styles.warningText]}>
          {critical ? 'DANGER' : 'CAUTION'}
        </Text>
        <Text style={styles.message}>{messages[stage] ?? messages[4]}</Text>
        <Text style={styles.score}>Fatigue score: {score}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', padding: 24 },
  critical: { backgroundColor: 'rgba(127, 29, 29, 0.65)' },
  warning: { backgroundColor: 'rgba(113, 63, 18, 0.45)' },
  card: { backgroundColor: '#111827', borderRadius: 20, padding: 24, alignItems: 'center' },
  title: { fontSize: 30, fontWeight: '800', marginBottom: 12 },
  criticalText: { color: '#f87171' },
  warningText: { color: '#fbbf24' },
  message: { color: '#fff', fontSize: 18, textAlign: 'center', fontWeight: '600' },
  score: { color: '#d1d5db', marginTop: 16 },
});
