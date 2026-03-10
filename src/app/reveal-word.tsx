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

export default function RevealWordScreen () {
  const { currentGame } = useGameStore()
  const { reset, resetWords } = useGame()

  if (!currentGame) {
    router.replace('/')
    return null
  }

  const { chosenWord, assignments } = currentGame
  const allWords = assignments
    .filter(a => a.role === 'word')
    .map(a => currentGame.chosenWord)

  // Todas las palabras que pusieron los jugadores — las guardamos en el store
  const { collectedWords } = useGameStore()

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.label}>La palabra elegida era</Text>

      <View style={styles.wordCard}>
        <Text style={styles.wordEmoji}>🎯</Text>
        <Text style={styles.word}>{chosenWord.word}</Text>
        <Text style={styles.wordAuthor}>
          Propuesta por{' '}
          <Text style={styles.authorName}>{chosenWord.player.name}</Text>
        </Text>
      </View>

      <View style={styles.allWordsCard}>
        <Text style={styles.allWordsLabel}>TODAS LAS PALABRAS PROPUESTAS</Text>
        <View style={styles.tags}>
          {collectedWords.map((w, i) => (
            <View
              key={i}
              style={[
                styles.tag,
                w.word === chosenWord.word && styles.tagActive
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  w.word === chosenWord.word && styles.tagTextActive
                ]}
              >
                {w.word}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={() => {
          reset()
          router.replace('/')
        }}
      >
        <Text style={styles.btnText}>Nueva partida</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => {
          resetWords()
          router.replace('/players')
        }}
      >
        <Text style={styles.btnSecondaryText}>
          Repetir con mismos jugadores
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 32, alignItems: 'center', paddingBottom: 48 },
  label: {
    color: Colors.textLight,
    fontSize: 12,
    fontFamily: Fonts.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
    marginTop: 20
  },
  wordCard: {
    width: '100%',
    backgroundColor: Colors.salmonPale,
    borderRadius: 28,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.salmonLight
  },
  wordEmoji: { fontSize: 40, marginBottom: 12 },
  word: {
    color: Colors.salmon,
    fontSize: 42,
    fontFamily: Fonts.display,
    marginBottom: 8,
    textTransform: 'capitalize',
    letterSpacing: -1
  },
  wordAuthor: { color: Colors.textLight, fontSize: 13, fontFamily: Fonts.body },
  authorName: { color: Colors.textMid, fontFamily: Fonts.bodyBold },
  allWordsCard: {
    width: '100%',
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    padding: 16,
    marginBottom: 28
  },
  allWordsLabel: {
    color: Colors.textLight,
    fontSize: 12,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'center'
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center'
  },
  tag: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: Colors.salmonPale
  },
  tagActive: { backgroundColor: Colors.salmon, borderColor: Colors.salmon },
  tagText: { color: Colors.textMid, fontSize: 13, fontFamily: Fonts.bodyBold },
  tagTextActive: { color: Colors.white },
  btnPrimary: {
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
    marginBottom: 10
  },
  btnText: { color: Colors.white, fontSize: 17, fontFamily: Fonts.display },
  btnSecondary: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.salmonPale
  },
  btnSecondaryText: {
    color: Colors.salmon,
    fontSize: 17,
    fontFamily: Fonts.display
  }
})
