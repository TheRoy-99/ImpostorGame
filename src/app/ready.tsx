import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';
import { useGameStore } from '../store/gameStore';
import { useGame } from '../hooks/useGame';

export default function ReadyScreen() {
  const { numImpostors } = useGameStore();
  const { startGame } = useGame();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    const { players, collectedWords } = useGameStore.getState();
    if (players.length === 0 || collectedWords.length === 0) {
      setLoading(false);
      router.replace('/');
      return;
    }
    const game = await startGame();
    setLoading(false);
    if (!game) { router.replace('/'); return; }
    router.push('/pass-reveal/0' as any);
  };

  return (
    <View style={styles.container}>

      <View style={styles.iconCircle}>
        <Ionicons name="shuffle" size={36} color={Colors.white} />
      </View>

      <Text style={styles.title}>Todo listo</Text>
      <Text style={styles.sub}>
        El sorteo ocurrió en secreto.{'\n'}Nadie sabe quién es el impostor.
      </Text>

      <View style={styles.infoCard}>
        <Ionicons name="skull-outline" size={16} color={Colors.textMuted} />
        <View>
          <Text style={styles.infoLabel}>ENTRE USTEDES HAY</Text>
          <Text style={styles.infoValue}>
            {numImpostors} {numImpostors === 1 ? 'impostor' : 'impostores'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.btnPrimary, loading && styles.btnDisabled]}
        onPress={handleStart}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            <Ionicons name="people" size={18} color={Colors.white} />
            <Text style={styles.btnText}>Repartir roles</Text>
          </>
        )}
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.bg, padding: 32, alignItems: 'center', justifyContent: 'center', gap: 16 },
  iconCircle:  { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.purple, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title:       { color: Colors.white, fontSize: 30, fontFamily: Fonts.display, letterSpacing: -1 },
  sub:         { color: Colors.textSecondary, fontSize: 15, fontFamily: Fonts.body, textAlign: 'center', lineHeight: 24, marginBottom: 8 },
  infoCard:    { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.purplePale, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.bgCardBorder },
  infoLabel:   { color: Colors.textMuted, fontSize: 11, fontFamily: Fonts.bodyBold, letterSpacing: 2, marginBottom: 2 },
  infoValue:   { color: Colors.white, fontSize: 20, fontFamily: Fonts.display },
  btnPrimary:  { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 18, elevation: 0 },
  btnDisabled: { backgroundColor: Colors.purplePale },
  btnText:     { color: Colors.white, fontSize: 17, fontFamily: Fonts.display },
});