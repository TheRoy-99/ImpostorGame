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
import { useGame } from '../hooks/useGame'

export default function EndRoundScreen () {
  const { currentGame, numImpostors } = useGameStore()
  const { reset, resetWords } = useGame()

  if (!currentGame) {
    router.replace('/')
    return null
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>🏆</Text>
      <Text style={styles.title}>¡A jugar!</Text>
      <Text style={styles.sub}>
        Discutan, den pistas y descubran{'\n'}quién es el{' '}
        <Text style={styles.highlight}>impostor</Text>.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>ENTRE USTEDES HAY</Text>
        <Text style={styles.infoValue}>
          {numImpostors} {numImpostors === 1 ? 'impostor' : 'impostores'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.btnReveal}
        onPress={() => router.push('/reveal-word')}
      >
        <Text style={styles.btnRevealText}>🔓 Revelar palabra elegida</Text>
      </TouchableOpacity>
      <Text style={styles.revealHint}>Úsenlo solo al terminar la ronda</Text>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => {
          reset()
          router.replace('/')
        }}
      >
        <Text style={styles.btnSecondaryText}>Nueva partida</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnGhost}
        onPress={() => {
          resetWords()
          router.replace('/players')
        }}
      >
        <Text style={styles.btnGhostText}>Repetir con mismos jugadores</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 32, alignItems: 'center', paddingBottom: 48 },
  emoji: { fontSize: 72, marginBottom: 16, marginTop: 32 },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontFamily: Fonts.display,
    marginBottom: 10
  },
  sub: {
    color: Colors.textMid,
    fontSize: 15,
    fontFamily: Fonts.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24
  },
  highlight: { color: Colors.impostor, fontFamily: Fonts.bodyBold },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24
  },
  infoLabel: {
    color: Colors.textLight,
    fontSize: 12,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 1,
    marginBottom: 4
  },
  infoValue: { color: Colors.text, fontSize: 20, fontFamily: Fonts.display },
  btnReveal: {
    width: '100%',
    backgroundColor: Colors.salmon,
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: Colors.salmon,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 8
  },
  btnRevealText: {
    color: Colors.white,
    fontSize: 17,
    fontFamily: Fonts.display
  },
  revealHint: {
    color: Colors.textLight,
    fontSize: 12,
    fontFamily: Fonts.body,
    fontStyle: 'italic',
    marginBottom: 20
  },
  btnSecondary: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.salmonPale,
    marginBottom: 10
  },
  btnSecondaryText: {
    color: Colors.salmon,
    fontSize: 17,
    fontFamily: Fonts.display
  },
  btnGhost: { paddingVertical: 8 },
  btnGhostText: {
    color: Colors.textLight,
    fontSize: 14,
    fontFamily: Fonts.body
  }
})
