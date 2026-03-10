import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { router } from 'expo-router'
import { Colors } from '../constants/colors'
import { Fonts } from '../constants/fonts'
import { useGameStore } from '../store/gameStore'

export default function HomeScreen () {
  const { numPlayers, numImpostors, setNumPlayers, setNumImpostors } =
    useGameStore()

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.emoji}>🕵️</Text>
        <Text style={styles.heroLabel}>Juego de roles</Text>
        <Text style={styles.heroTitle}>Impostor</Text>
        <Text style={styles.heroSub}>¿Quién no sabe la palabra?</Text>
      </View>

      {/* Jugadores */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>JUGADORES</Text>
        <View style={styles.pills}>
          {[3, 4, 5, 6, 7].map(n => (
            <TouchableOpacity
              key={n}
              style={[styles.pill, numPlayers === n && styles.pillActive]}
              onPress={() => setNumPlayers(n)}
            >
              <Text
                style={[
                  styles.pillText,
                  numPlayers === n && styles.pillTextActive
                ]}
              >
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Impostores */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>IMPOSTORES</Text>
        <View style={styles.pills}>
          {[1, 2].map(n => (
            <TouchableOpacity
              key={n}
              style={[
                styles.pill,
                styles.pillWide,
                numImpostors === n && styles.pillActive
              ]}
              onPress={() => setNumImpostors(n)}
            >
              <Text
                style={[
                  styles.pillText,
                  numImpostors === n && styles.pillTextActive
                ]}
              >
                {n} {n === 1 ? 'impostor' : 'impostores'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={() => router.push('/players')}
      >
        <Text style={styles.btnPrimaryText}>Configurar jugadores →</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 24, paddingBottom: 48 },
  hero: {
    backgroundColor: Colors.salmon,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.salmon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8
  },
  emoji: { fontSize: 48, marginBottom: 8 },
  heroLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: Fonts.body
  },
  heroTitle: {
    color: Colors.white,
    fontSize: 36,
    fontFamily: Fonts.display,
    marginVertical: 4
  },
  heroSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontFamily: Fonts.body
  },
  card: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14
  },
  cardLabel: {
    color: Colors.textMid,
    fontSize: 12,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 1,
    marginBottom: 10
  },
  pills: { flexDirection: 'row', gap: 8 },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.salmonPale,
    alignItems: 'center'
  },
  pillWide: { paddingHorizontal: 8 },
  pillActive: {
    backgroundColor: Colors.salmon,
    borderColor: Colors.salmon,
    shadowColor: Colors.salmon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4
  },
  pillText: { color: Colors.gray, fontFamily: Fonts.display, fontSize: 15 },
  pillTextActive: { color: Colors.white },
  btnPrimary: {
    backgroundColor: Colors.salmon,
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: Colors.salmon,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 6
  },
  btnPrimaryText: {
    color: Colors.white,
    fontSize: 17,
    fontFamily: Fonts.display
  }
})
