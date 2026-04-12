import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { Fonts } from '../../constants/fonts'
import { useGameStore } from '../../store/gameStore'
import { WORD_CATALOG, getRandomWord } from '../../constants/wordCatalog'
import { BuildGameUseCase } from '../../domain/useCases/BuildGameUseCase'
import { GameRepository } from '../../data/repositories/GameRepository'

const buildGameUseCase = new BuildGameUseCase()
const gameRepository = new GameRepository()

export default function PassCategoryScreen () {
  const { idx } = useLocalSearchParams<{ idx: string }>()
  const currentIdx = parseInt(idx ?? '0')
  const { players, addWord, selectedCategory } = useGameStore()
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const currentPlayer = players[currentIdx]
  const isLast = currentIdx + 1 >= players.length
  const total = players.length

  // Nombre de la categoría para mostrar en UI
  const categoryLabel =
    WORD_CATALOG.find(c => c.id === selectedCategory)?.label ?? ''
  const categoryIcon =
    WORD_CATALOG.find(c => c.id === selectedCategory)?.icon ?? 'albums-outline'

  const handleConfirm = async () => {
    if (confirmed) return
    setConfirmed(true)
    setLoading(true)

    const { usedWords } = useGameStore.getState()
    const word = selectedCategory
      ? getRandomWord(selectedCategory, usedWords)
      : null

    if (!word) {
      // Fallback: cualquier palabra no usada
      const fallback = WORD_CATALOG.flatMap(c => c.words).filter(
        w => !usedWords.includes(w)
      )
      const picked =
        fallback[Math.floor(Math.random() * fallback.length)] ?? 'Misterio'
      addWord({ player: currentPlayer, word: picked })
    } else {
      addWord({ player: currentPlayer, word })
    }

    setTimeout(async () => {
      if (isLast) {
        const {
          players,
          collectedWords,
          numImpostors,
          usedWords,
          setGame,
          addUsedWord
        } = useGameStore.getState()
        try {
          const game = buildGameUseCase.execute(
            players,
            collectedWords,
            numImpostors,
            usedWords
          )
          setGame(game)
          addUsedWord(game.chosenWord.word)
          await gameRepository.saveGame(game)
          const indices = Array.from({ length: players.length }, () =>
            Math.floor(Math.random() * 5)
          )
          useGameStore.getState().setCharacterIndices(indices)
          router.push('/reveal/0' as any)
        } catch (e) {
          console.error('Error al construir juego:', e)
        }
      } else {
        router.push(`/pass-category/${currentIdx + 1}` as any)
      }
      setLoading(false)
    }, 600)
  }

  return (
    <View style={styles.container}>
      {/* Dots progreso */}
      <View style={styles.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIdx && styles.dotActive,
              i < currentIdx && styles.dotDone
            ]}
          />
        ))}
      </View>

      {/* Header */}
      <Text style={styles.greeting}>Hola, {currentPlayer?.name}</Text>
      <Text style={styles.sub}>
        Toca confirmar — el sistema te{'\n'}asignará una palabra secreta
      </Text>

      {/* Badge de categoría */}
      <View style={styles.categoryBadge}>
        <Ionicons
          name={categoryIcon as any}
          size={20}
          color={Colors.purpleLight}
        />
        <Text style={styles.categoryLabel}>{categoryLabel}</Text>
      </View>

      {/* Hint */}
      <View style={styles.hintRow}>
        <Ionicons
          name={confirmed ? 'checkmark-circle' : 'lock-closed-outline'}
          size={14}
          color={confirmed ? Colors.purpleLight : Colors.textMuted}
        />
        <Text style={styles.hint}>
          {confirmed
            ? 'Palabra asignada — pasa el teléfono'
            : 'No verás la palabra que te toca'}
        </Text>
      </View>

      {/* Botón */}
      <TouchableOpacity
        style={[styles.btnPrimary, confirmed && styles.btnDisabled]}
        onPress={handleConfirm}
        disabled={confirmed}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            <Text style={styles.btnText}>
              {confirmed ? 'Listo' : isLast ? 'Empezar' : 'Confirmar'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dots: { flexDirection: 'row', gap: 6, marginBottom: 36 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.purplePale
  },
  dotActive: { width: 20, backgroundColor: Colors.purple },
  dotDone: { backgroundColor: Colors.purpleLight },
  greeting: {
    color: Colors.white,
    fontSize: 28,
    fontFamily: Fonts.display,
    marginBottom: 4,
    letterSpacing: -0.5,
    textAlign: 'center'
  },
  sub: {
    color: Colors.textMuted,
    fontSize: 13,
    fontFamily: Fonts.body,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.purplePale,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.purple,
    marginBottom: 32
  },
  categoryLabel: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.bodyBold
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 28
  },
  hint: { color: Colors.textMuted, fontSize: 12, fontFamily: Fonts.body },
  btnPrimary: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.purple,
    borderRadius: 20,
    paddingVertical: 18,
    elevation: 0
  },
  btnDisabled: { backgroundColor: Colors.purplePale },
  btnText: { color: Colors.white, fontSize: 17, fontFamily: Fonts.display }
})
