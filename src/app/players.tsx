import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native'
import { router } from 'expo-router'
import { Colors } from '../constants/colors'
import { Fonts } from '../constants/fonts'
import { useGameStore } from '../store/gameStore'
import { Player } from '../domain/entities'

export default function PlayersScreen () {
  const { numPlayers, players, setPlayers, reset } = useGameStore()

  const getName = (i: number) => players[i]?.name ?? ''

  const updateName = (i: number, name: string) => {
    const updated: Player[] = Array.from({ length: numPlayers }, (_, idx) => ({
      id: (idx + 1).toString(),
      name: idx === i ? name : players[idx]?.name ?? ''
    }))
    setPlayers(updated)
  }

  const handleNext = () => {
    // Asegura que todos los jugadores tengan id y name
    const resolved: Player[] = Array.from({ length: numPlayers }, (_, i) => ({
      id: (i + 1).toString(),
      name: getName(i).trim() || `Jugador ${i + 1}`
    }))
    setPlayers(resolved)
    router.push('/collect/0')
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => {
          reset()
          router.back()
        }}
      >
        <Text style={styles.back}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>¿Quiénes juegan?</Text>
      <Text style={styles.sub}>Nombres opcionales.</Text>

      <View style={styles.list}>
        {Array.from({ length: numPlayers }).map((_, i) => (
          <View key={i} style={styles.row}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{i + 1}</Text>
            </View>
            <TextInput
              value={getName(i)}
              onChangeText={t => updateName(i, t)}
              placeholder={`Jugador ${i + 1}`}
              placeholderTextColor={Colors.textLight}
              style={styles.input}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
        <Text style={styles.btnPrimaryText}>
          Siguiente: palabras secretas →
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 24, paddingBottom: 48 },
  back: {
    color: Colors.textLight,
    fontSize: 13,
    fontFamily: Fonts.body,
    marginBottom: 16
  },
  title: {
    color: Colors.text,
    fontSize: 26,
    fontFamily: Fonts.display,
    marginBottom: 4
  },
  sub: {
    color: Colors.textLight,
    fontSize: 14,
    fontFamily: Fonts.body,
    marginBottom: 20
  },
  list: { gap: 10, marginBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.salmon,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: { color: Colors.white, fontSize: 13, fontFamily: Fonts.display },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 15,
    fontFamily: Fonts.bodyBold
  },
  btnPrimary: {
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
  btnPrimaryText: {
    color: Colors.white,
    fontSize: 17,
    fontFamily: Fonts.display
  }
})
