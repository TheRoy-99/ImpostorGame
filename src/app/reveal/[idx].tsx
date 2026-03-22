import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'
import { Fonts } from '../../constants/fonts'
import { useGameStore } from '../../store/gameStore'
import { SwipeCard } from '../../components/game/SwipeCard'

const { height: H } = Dimensions.get('window')

const CHARACTERS = [
  require('../../assets/characters/persona1.png'),
  require('../../assets/characters/persona2.png'),
  require('../../assets/characters/persona3.png'),
  require('../../assets/characters/persona4.png'),
  require('../../assets/characters/persona5.png')
]

export default function RevealScreen () {
  const { idx } = useLocalSearchParams<{ idx: string }>()
  const currentIdx = parseInt(idx ?? '0')
  const { currentGame } = useGameStore()
  const [revealed, setRevealed] = useState(false)

  const resultOpacity = useRef(new Animated.Value(0)).current
  const resultTransY = useRef(new Animated.Value(20)).current
  const btnOpacity = useRef(new Animated.Value(0)).current
  const charOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!currentGame) router.replace('/')
  }, [currentGame])

  if (!currentGame) return null

  const assignment = currentGame.assignments[currentIdx]
  const total = currentGame.assignments.length
  const isLast = currentIdx + 1 >= total
  const isImpostor = assignment.role === 'impostor'
  const character = CHARACTERS[currentIdx % CHARACTERS.length]

  const handleReveal = () => {
    setRevealed(true)
    Animated.sequence([
      Animated.parallel([
        Animated.timing(charOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(resultOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true
        }),
        Animated.spring(resultTransY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 5
        })
      ]),
      Animated.timing(btnOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true
      })
    ]).start()
  }

  const handleNext = () => {
    if (isLast) router.push('/end-round')
    else router.push(`/reveal/${currentIdx + 1}` as any) // ← directo, sin pass-reveal
  }

  return (
    <View style={styles.container}>
      {/* Personaje de fondo al revelar */}
      {revealed && (
        <Animated.View style={[styles.bgCharacter, { opacity: charOpacity }]}>
          <Image source={character} style={styles.bgCharacterImage} />
          {/* Gradiente encima del personaje */}
          <LinearGradient
            colors={[
              'rgba(10,15,30,0.3)',
              'rgba(10,15,30,0.5)',
              isImpostor ? 'rgba(239,68,68,0.15)' : 'rgba(124,58,237,0.15)',
              'rgba(10,15,30,0.95)'
            ]}
            locations={[0, 0.3, 0.6, 1]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {assignment.player.name}</Text>
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

      {/* Resultado revelado */}
      {revealed && (
        <Animated.View
          style={[
            styles.resultZone,
            {
              opacity: resultOpacity,
              transform: [{ translateY: resultTransY }]
            }
          ]}
        >
          <View
            style={[
              styles.roleBadge,
              isImpostor ? styles.roleBadgeImpostor : styles.roleBadgeWord
            ]}
          >
            <Ionicons
              name={isImpostor ? 'skull-outline' : 'eye-outline'}
              size={12}
              color={isImpostor ? Colors.red : Colors.purple}
            />
            <Text
              style={[
                styles.roleBadgeText,
                isImpostor
                  ? styles.roleBadgeTextImpostor
                  : styles.roleBadgeTextWord
              ]}
            >
              {isImpostor ? 'IMPOSTOR' : 'TU PALABRA'}
            </Text>
          </View>

          <Text
            style={[
              styles.resultWord,
              isImpostor ? styles.resultWordImpostor : styles.resultWordWord
            ]}
          >
            {isImpostor ? 'Impostor' : currentGame.chosenWord.word}
          </Text>

          <Text style={styles.resultSub}>
            {isImpostor
              ? 'No conoces la palabra secreta.\n¡Finge que sí y no te descubran!'
              : 'Esa es tu palabra. Da pistas\nsin decirla directamente.'}
          </Text>
        </Animated.View>
      )}

      {/* Tarjeta deslizable */}
      {!revealed && (
        <View style={styles.cardZone}>
          <SwipeCard onReveal={handleReveal} playerIndex={currentIdx} />
        </View>
      )}

      {/* Botón siguiente */}
      {revealed && (
        <Animated.View style={[styles.btnWrap, { opacity: btnOpacity }]}>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
            <Ionicons name='lock-closed' size={15} color={Colors.white} />
            <Text style={styles.btnText}>
              {isLast ? 'Finalizar reparto' : 'Siguiente jugador'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  // Personaje de fondo
  bgCharacter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: H * 0.65
  },
  bgCharacterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 12,
    alignItems: 'center',
    gap: 10,
    zIndex: 10
  },
  greeting: {
    color: Colors.white,
    fontSize: 24,
    fontFamily: Fonts.display,
    letterSpacing: -0.5
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.purplePale
  },
  dotActive: { width: 20, backgroundColor: Colors.purple },
  dotDone: { backgroundColor: Colors.purpleLight },

  // Resultado
  resultZone: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 10,
    zIndex: 10
  },

  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1
  },
  roleBadgeImpostor: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderColor: 'rgba(239,68,68,0.3)'
  },
  roleBadgeWord: {
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderColor: 'rgba(124,58,237,0.3)'
  },
  roleBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 1.5
  },
  roleBadgeTextImpostor: { color: Colors.red },
  roleBadgeTextWord: { color: Colors.purple },

  resultWord: {
    fontSize: H * 0.06,
    fontFamily: Fonts.display,
    textAlign: 'center',
    letterSpacing: -1
  },
  resultWordImpostor: { color: Colors.red },
  resultWordWord: { color: Colors.white },
  resultSub: {
    color: Colors.textMuted,
    fontSize: 13,
    fontFamily: Fonts.body,
    textAlign: 'center',
    lineHeight: 20
  },

  // Tarjeta
  cardZone: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    bottom: 0
  },

  // Botón
  btnWrap: {
    position: 'absolute',
    bottom: 28,
    left: 24,
    right: 24,
    zIndex: 10
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.purple,
    borderRadius: 20,
    paddingVertical: 18,
    elevation: 0
  },
  btnText: { color: Colors.white, fontSize: 17, fontFamily: Fonts.display }
})
