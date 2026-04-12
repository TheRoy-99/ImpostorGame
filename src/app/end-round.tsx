// EndRoundScreen.tsx — reemplazo completo y funcional

import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Modal, Image, Animated
} from 'react-native'
import { router } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../constants/colors'
import { Fonts } from '../constants/fonts'
import { useGameStore } from '../store/gameStore'
import { useGame } from '../hooks/useGame'

export default function EndRoundScreen () {
  const { currentGame, collectedWords, usedWords, reset, players } = useGameStore() // ← players del store
  const { startGame } = useGame()
  const [votes, setVotes] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAllUsed, setShowAllUsed] = useState(false)
  const pulseAnim = useRef(new Animated.Value(1)).current

  const totalPlayers = players.length // ← fuente de verdad correcta

  useEffect(() => {
    if (!currentGame) router.replace('/')
  }, [currentGame])

  useEffect(() => {
    if (currentGame?.allWordsUsed) setShowAllUsed(true)
  }, [currentGame])

  if (!currentGame) return null

  const triggerPulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1,    duration: 80, useNativeDriver: true })
    ]).start()
  }

  const handleVote = () => {
    if (revealed) return
    triggerPulse()
    const next = votes + 1
    setVotes(next)
    if (next >= totalPlayers) setRevealed(true)
  }

  const handleNewRound = async () => {
    setRevealed(false)
    setVotes(0)
    setLoading(true)
    const game = await startGame()
    setLoading(false)
    if (game) router.push('/pass-reveal/0' as any)
  }

  const remaining = totalPlayers - votes
  const progressPercent = totalPlayers > 0 ? (votes / totalPlayers) * 100 : 0

  return (
    <View style={styles.container}>
      {/* Modal palabras agotadas */}
      <Modal visible={showAllUsed} transparent animationType='fade'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Ionicons name='refresh-circle' size={40} color={Colors.purple} />
            </View>
            <Text style={styles.modalTitle}>Palabras agotadas</Text>
            <Text style={styles.modalSub}>
              Ya se usaron todas las palabras.{'\n'}Se reciclarán desde el inicio.
            </Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setShowAllUsed(false)}>
              <Text style={styles.modalBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <Text style={styles.title}>¿Descubrieron al impostor?</Text>
      <Text style={styles.sub}>
        {revealed
          ? 'Palabra revelada'
          : votes === 0
          ? `Cada jugador debe confirmar (${totalPlayers} toques)`
          : `Faltan ${remaining} jugador${remaining !== 1 ? 'es' : ''}`}
      </Text>

      {/* Progreso de palabras */}
      <View style={styles.progressRow}>
        <Ionicons name='albums-outline' size={12} color={Colors.textMuted} />
        <Text style={styles.progressText}>
          {usedWords.length} / {collectedWords.length} palabras usadas
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(usedWords.length / Math.max(collectedWords.length, 1)) * 100}%` as any }
          ]}
        />
      </View>

      {/* Carta con votos */}
      <Animated.View style={{ width: '100%', transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[styles.mysteryCard, revealed && styles.mysteryCardRevealed]}
          onPress={handleVote}
          activeOpacity={revealed ? 1 : 0.85}
          disabled={revealed}
        >
          {!revealed ? (
            <>
              <View style={styles.mysteryIconCircle}>
                <Image source={require('../assets/descubrir.png')} style={styles.mysteryIcon} />
              </View>

              {/* Dots por jugador */}
              <View style={styles.voteDotsRow}>
                {Array.from({ length: totalPlayers }).map((_, i) => (
                  <View key={i} style={[styles.voteDot, i < votes && styles.voteDotActive]} />
                ))}
              </View>

              {/* Barra de progreso de votos */}
              <View style={styles.voteBarTrack}>
                <View style={[styles.voteBarFill, { width: `${progressPercent}%` as any }]} />
              </View>

              <Text style={styles.mysteryText}>
                {votes === 0
                  ? 'Pasa el teléfono — cada uno toca una vez'
                  : `${votes} de ${totalPlayers} confirmados`}
              </Text>
            </>
          ) : (
            <>
              <Ionicons name='checkmark-circle' size={32} color={Colors.purple} />
              <Text style={styles.revealedLabel}>LA PALABRA ERA</Text>
              <Text style={styles.revealedWord}>{currentGame.chosenWord.word}</Text>
              <Text style={styles.revealedBy}>
                Propuesta por{' '}
                <Text style={styles.revealedByName}>{currentGame.chosenWord.player.name}</Text>
              </Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Botones */}
      {usedWords.length < collectedWords.length ? (
        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={handleNewRound}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name='refresh' size={18} color={Colors.white} />
              <Text style={styles.btnText}>Nueva Ronda</Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.allUsedBox}>
          <Ionicons name='checkmark-circle' size={20} color={Colors.purpleLight} />
          <Text style={styles.allUsedText}>Todas las palabras fueron usadas</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => { reset(); router.replace('/') }}
      >
        <Ionicons name='trash-outline' size={16} color={Colors.textSecondary} />
        <Text style={styles.btnSecondaryText}>
          {usedWords.length >= collectedWords.length ? 'Nueva partida' : 'Reiniciar todo'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  // — todos los estilos anteriores igual —
  container: {
    flex: 1, backgroundColor: Colors.bg, padding: 28,
    alignItems: 'center', justifyContent: 'center', gap: 14
  },
  mysteryIcon: { width: 52, height: 52, resizeMode: 'contain' },
  title: {
    color: Colors.white, fontSize: 28, fontFamily: Fonts.display,
    textAlign: 'center', letterSpacing: -1
  },
  sub: { color: Colors.textMuted, fontSize: 14, fontFamily: Fonts.body, textAlign: 'center' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressText: { color: Colors.textMuted, fontSize: 11, fontFamily: Fonts.bodyBold, letterSpacing: 0.5 },
  progressBar: {
    width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2, overflow: 'hidden'
  },
  progressFill: { height: '100%', backgroundColor: Colors.purple, borderRadius: 2 },
  mysteryCard: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24,
    padding: 36, alignItems: 'center', gap: 12, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)', elevation: 0
  },
  mysteryCardRevealed: { backgroundColor: 'rgba(124,58,237,0.15)', borderColor: Colors.purple },
  mysteryIconCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.purplePale,
    alignItems: 'center', justifyContent: 'center'
  },
  mysteryText: { color: Colors.textSecondary, fontSize: 15, fontFamily: Fonts.bodyBold, textAlign: 'center' },
  revealedLabel: { color: Colors.textMuted, fontSize: 11, fontFamily: Fonts.bodyBold, letterSpacing: 2 },
  revealedWord: { color: Colors.white, fontSize: 40, fontFamily: Fonts.display, letterSpacing: -1 },
  revealedBy: { color: Colors.textMuted, fontSize: 13, fontFamily: Fonts.body },
  revealedByName: { color: Colors.purpleLight, fontFamily: Fonts.bodyBold },
  btnPrimary: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 18, elevation: 0
  },
  btnDisabled: { backgroundColor: Colors.purplePale },
  btnText: { color: Colors.white, fontSize: 17, fontFamily: Fonts.display },
  btnSecondary: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, paddingVertical: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', elevation: 0
  },
  btnSecondaryText: { color: Colors.textSecondary, fontSize: 17, fontFamily: Fonts.display },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', alignItems: 'center',
    justifyContent: 'center', padding: 32
  },
  modalCard: {
    width: '100%', backgroundColor: '#131829', borderRadius: 24, padding: 32,
    alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)'
  },
  modalIconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.purplePale,
    alignItems: 'center', justifyContent: 'center'
  },
  modalTitle: { color: Colors.white, fontSize: 22, fontFamily: Fonts.display, textAlign: 'center' },
  modalSub: { color: Colors.textSecondary, fontSize: 14, fontFamily: Fonts.body, textAlign: 'center', lineHeight: 22 },
  modalBtn: { width: '100%', backgroundColor: Colors.purple, borderRadius: 16, paddingVertical: 14, alignItems: 'center', elevation: 0 },
  modalBtnText: { color: Colors.white, fontSize: 15, fontFamily: Fonts.bodyBold },
  allUsedBox: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.purplePale, borderRadius: 20, paddingVertical: 18,
    borderWidth: 1, borderColor: Colors.bgCardBorder
  },
  allUsedText: { color: Colors.purpleLight, fontSize: 15, fontFamily: Fonts.bodyBold },

  // — estilos nuevos para el sistema de votos —
  voteDotsRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  voteDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.15)' },
  voteDotActive: { backgroundColor: Colors.purple },
  voteBarTrack: {
    width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2, overflow: 'hidden'
  },
  voteBarFill: { height: '100%', backgroundColor: Colors.purple, borderRadius: 2 },
})