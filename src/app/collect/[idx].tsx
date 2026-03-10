import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Colors } from '../../constants/colors'
import { Fonts } from '../../constants/fonts'
import { useGameStore } from '../../store/gameStore'

export default function CollectWordScreen () {
  const { idx } = useLocalSearchParams<{ idx: string }>()
  const currentIdx = parseInt(idx ?? '0')
  const { players, numPlayers, addWord, resetWords } = useGameStore()
  const [input, setInput] = useState('')

  const currentPlayer = players[currentIdx]
  const isLast = currentIdx + 1 >= numPlayers

  const handleConfirm = () => {
    if (input.trim().length < 2) return
    addWord({ player: currentPlayer, word: input.trim() })
    setInput('')
    if (isLast) {
      router.push('/ready')
    } else {
      router.push(`/collect/${currentIdx + 1}`)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Dots */}
        <View style={styles.dots}>
          {Array.from({ length: numPlayers }).map((_, i) => (
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

        <Text style={styles.emoji}>✏️</Text>
        <Text style={styles.label}>
          Turno {currentIdx + 1} de {numPlayers}
        </Text>
        <Text style={styles.title}>{currentPlayer?.name}, escribe</Text>
        <Text style={styles.sub}>
          tu palabra secreta — nadie más puede ver.
        </Text>

        <View style={styles.inputBox}>
          <TextInput
            autoFocus
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleConfirm}
            placeholder='Ej: Volcán, Carnaval, Sushi...'
            placeholderTextColor={Colors.textLight}
            style={styles.input}
            returnKeyType='done'
          />
        </View>

        <TouchableOpacity
          style={[
            styles.btnPrimary,
            input.trim().length < 2 && styles.btnDisabled
          ]}
          onPress={handleConfirm}
          disabled={input.trim().length < 2}
        >
          <Text style={styles.btnText}>
            {isLast ? '✓ Confirmar — ¡Empezar!' : 'Confirmar y pasar →'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (currentIdx === 0) {
              resetWords()
              router.back()
            } else router.back()
          }}
        >
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dots: { flexDirection: 'row', gap: 6, marginBottom: 32 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.salmonPale
  },
  dotActive: { width: 22, backgroundColor: Colors.salmonDark },
  dotDone: { backgroundColor: Colors.salmon },
  emoji: { fontSize: 48, marginBottom: 12 },
  label: {
    color: Colors.salmonDark,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    backgroundColor: Colors.salmonPale,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden'
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontFamily: Fonts.display,
    marginBottom: 4,
    textAlign: 'center'
  },
  sub: {
    color: Colors.textLight,
    fontSize: 13,
    fontFamily: Fonts.body,
    marginBottom: 28,
    textAlign: 'center'
  },
  inputBox: {
    width: '100%',
    backgroundColor: Colors.grayLight,
    borderRadius: 18,
    marginBottom: 16
  },
  input: {
    width: '100%',
    padding: 16,
    fontSize: 18,
    fontFamily: Fonts.display,
    color: Colors.text,
    textAlign: 'center'
  },
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
    marginBottom: 12
  },
  btnDisabled: {
    backgroundColor: Colors.salmonPale,
    shadowOpacity: 0,
    elevation: 0
  },
  btnText: { color: Colors.white, fontSize: 17, fontFamily: Fonts.display },
  back: {
    color: Colors.textLight,
    fontSize: 14,
    fontFamily: Fonts.body,
    marginTop: 8
  }
})
