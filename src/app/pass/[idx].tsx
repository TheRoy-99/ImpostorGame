import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { Fonts } from '../../constants/fonts'
import { useGameStore } from '../../store/gameStore'
import { Image } from 'react-native'

export default function PassScreen () {
  const { idx } = useLocalSearchParams<{ idx: string }>()
  const currentIdx = parseInt(idx ?? '0')
  const { players } = useGameStore()
  const total = players.length
  const currentPlayer = players[currentIdx]

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {currentIdx + 1} de {total} jugadores
        </Text>
      </View>

      <Text style={styles.label}>Siguiente jugador:</Text>
      <Text style={styles.name}>{currentPlayer?.name}</Text>

      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Image
            source={require('../../assets/telefono.png')}
            style={styles.phoneIcon}
          />
        </View>
        <Text style={styles.cardText}>
          Pasa el teléfono a{' '}
          <Text style={styles.cardName}>{currentPlayer?.name}</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={() => router.push(`/collect/${currentIdx}` as any)}
      >
        <Text style={styles.btnText}>Estoy listo</Text>
      </TouchableOpacity>

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
  badge: {
    backgroundColor: Colors.purplePale,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder
  },
  badgeText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: Fonts.bodyBold
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontFamily: Fonts.body,
    marginBottom: 6
  },
  name: {
    color: Colors.white,
    fontSize: 36,
    fontFamily: Fonts.display,
    marginBottom: 36,
    letterSpacing: -1
  },
  card: {
    width: '100%',
    backgroundColor: Colors.bgCard,
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    marginBottom: 36,
    elevation: 0
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.purplePale,
    alignItems: 'center',
    justifyContent: 'center'
  },
  phoneIcon: {
  width: 52,
  height: 52,
  resizeMode: 'contain',
},
  cardText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontFamily: Fonts.body,
    textAlign: 'center',
    lineHeight: 24
  },
  cardName: { color: Colors.purpleLight, fontFamily: Fonts.bodyBold },
  btnPrimary: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.purple,
    borderRadius: 20,
    paddingVertical: 18,
    elevation: 0,
    marginBottom: 28
  },
  btnText: { color: Colors.white, fontSize: 17, fontFamily: Fonts.display },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.purplePale
  },
  dotActive: { width: 20, backgroundColor: Colors.purple },
  dotDone: { backgroundColor: Colors.purpleLight }
})
