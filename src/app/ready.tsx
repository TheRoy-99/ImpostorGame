import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Colors } from '../constants/colors'
import { Fonts } from '../constants/fonts'
import { useGameStore } from '../store/gameStore'
import { useGame } from '../hooks/useGame'

export default function ReadyScreen () {
  const { numPlayers, numImpostors } = useGameStore()
  const { startGame } = useGame()

  const handleStart = async () => {
    await startGame()
    router.push('/reveal/0')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🛡️</Text>
      <Text style={styles.title}>¡Todo listo!</Text>
      <Text style={styles.sub}>
        Las palabras están guardadas.{'\n'}El sorteo ya ocurrió en secreto 🎲
      </Text>
      <Text style={styles.sub2}>
        Cada jugador recibirá su rol.{'\n'}Nadie sabrá la palabra hasta que
        deslice.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>RECUERDEN</Text>
        <Text style={styles.infoText}>
          Hay {numImpostors} {numImpostors === 1 ? 'impostor' : 'impostores'}{' '}
          entre los {numPlayers} jugadores
        </Text>
      </View>

      <TouchableOpacity style={styles.btnPrimary} onPress={handleStart}>
        <Text style={styles.btnText}>Repartir roles →</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emoji: { fontSize: 64, marginBottom: 20 },
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
    marginBottom: 8
  },
  sub2: {
    color: Colors.textLight,
    fontSize: 13,
    fontFamily: Fonts.body,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32
  },
  infoBox: {
    width: '100%',
    backgroundColor: Colors.salmonPale,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.salmonLight,
    marginBottom: 28,
    alignItems: 'center'
  },
  infoLabel: {
    color: Colors.textLight,
    fontSize: 12,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 1,
    marginBottom: 4
  },
  infoText: {
    color: Colors.salmonDark,
    fontSize: 15,
    fontFamily: Fonts.bodyBold,
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
    elevation: 6
  },
  btnText: { color: Colors.white, fontSize: 17, fontFamily: Fonts.display }
})
