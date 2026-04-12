import {
  View, Text, StyleSheet, ScrollView,
  Switch, TouchableOpacity, Image
} from 'react-native'
import { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Colors } from '../constants/colors'
import { Fonts } from '../constants/fonts'
import { useGameStore } from '../store/gameStore'
import { AppInput } from '../components/common/AppInput'
import { WORD_CATALOG, getRandomWord } from '../constants/wordCatalog'
import { BuildGameUseCase } from '../domain/useCases/BuildGameUseCase'
import { GameRepository } from '../data/repositories/GameRepository'

const buildGameUseCase = new BuildGameUseCase()
const gameRepository = new GameRepository()
const PLAYERS_KEY = 'impostor_player_names'

export default function HomeScreen () {
  const {
    numImpostors, setNumImpostors, setPlayers,
    reset, setSelectedCategory, setGame, addUsedWord,
    setCharacterIndices, addWord
  } = useGameStore()

  const [playerInput, setPlayerInput]     = useState('')
  const [playerNames, setPlayerNames]     = useState<string[]>([])
  const [gameMode, setGameMode]           = useState<'classic' | 'catalog'>('classic')
  const [pickedCategory, setPickedCategory] = useState<string | null>(null)

  // ── Cargar nombres guardados al montar ──────────────────────
  useEffect(() => {
    AsyncStorage.getItem(PLAYERS_KEY).then(raw => {
      if (raw) {
        const saved = JSON.parse(raw) as string[]
        if (saved.length > 0) setPlayerNames(saved)
      }
    })
  }, [])

  // ── Guardar nombres cada vez que cambian ────────────────────
  useEffect(() => {
    AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(playerNames))
  }, [playerNames])

  const addPlayer = () => {
    if (playerInput.trim().length < 1) return
    setPlayerNames(p => [...p, playerInput.trim()])
    setPlayerInput('')
  }

  const removePlayer = (i: number) =>
    setPlayerNames(p => p.filter((_, idx) => idx !== i))

  const canStart =
    playerNames.length >= 3 &&
    (gameMode === 'classic' || pickedCategory !== null)

  const handleStart = async () => {
    const currentNumImpostors = numImpostors
    reset()

    const resolvedPlayers = playerNames.map((name, i) => ({
      id: (i + 1).toString(),
      name,
    }))
    setPlayers(resolvedPlayers)
    setNumImpostors(currentNumImpostors)

    if (gameMode === 'classic') {
      // ── Flujo clásico — sin cambios ──────────────────────────
      setSelectedCategory(null)
      router.push('/pass/0' as any)

    } else {
      // ── Flujo catálogo — asigna palabras aquí mismo ──────────
      setSelectedCategory(pickedCategory)

      // Cada jugador recibe una palabra random de la categoría
      const usedInThisRound: string[] = []
      for (const player of resolvedPlayers) {
        const word =
          getRandomWord(pickedCategory!, usedInThisRound) ??
          // fallback si se agotan palabras de la categoría
          WORD_CATALOG.flatMap(c => c.words)
            .filter(w => !usedInThisRound.includes(w))[0] ??
          'Misterio'

        usedInThisRound.push(word)
        addWord({ player, word })
      }

      // Construye el juego con las palabras ya cargadas en el store
      try {
        const { collectedWords, usedWords } = useGameStore.getState()
        const game = buildGameUseCase.execute(
          resolvedPlayers,
          collectedWords,
          currentNumImpostors,
          usedWords
        )
        setGame(game)
        addUsedWord(game.chosenWord.word)
        await gameRepository.saveGame(game)

        const indices = Array.from({ length: resolvedPlayers.length }, () =>
          Math.floor(Math.random() * 5)
        )
        setCharacterIndices(indices)

        // Directo a reveal — sin pasar por pass-category
        router.push('/reveal/0' as any)
      } catch (e) {
        console.error('Error al construir juego catálogo:', e)
      }
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/espia.png')} style={styles.logoImage} />
        <Text style={styles.title}>Impostor RMR</Text>
        <Text style={styles.sub}>¿Quién es el infiltrado?</Text>
      </View>

      {/* Jugadores */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name='people' size={16} color={Colors.purple} />
          <Text style={styles.sectionLabel}>Jugadores ({playerNames.length})</Text>
        </View>
        <View style={styles.inputRow}>
          <AppInput
            value={playerInput}
            onChangeText={setPlayerInput}
            placeholder='Nombre del jugador'
            onSubmitEditing={addPlayer}
            returnKeyType='done'
            containerStyle={styles.inputFlex}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addPlayer}>
            <Ionicons name='person-add' size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
        {playerNames.length < 3 && (
          <View style={styles.hintRow}>
            <Ionicons name='information-circle-outline' size={13} color={Colors.textMuted} />
            <Text style={styles.hint}>Mínimo 3 jugadores necesarios</Text>
          </View>
        )}
        <View style={styles.chips}>
          {playerNames.map((name, i) => (
            <TouchableOpacity key={i} style={styles.chip} onPress={() => removePlayer(i)}>
              <Text style={styles.chipText}>{name}</Text>
              <Ionicons name='close' size={13} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Impostores toggle */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleLeft}>
          <Ionicons name='skull-outline' size={18} color={Colors.purple} />
          <View>
            <Text style={styles.toggleLabel}>Impostores</Text>
            <Text style={styles.toggleSub}>
              {numImpostors} {numImpostors === 1 ? 'impostor' : 'impostores'}
            </Text>
          </View>
        </View>
        <View style={styles.toggleGroup}>
          <Text style={styles.toggleNum}>1</Text>
          <Switch
            value={numImpostors === 2}
            onValueChange={v => setNumImpostors(v ? 2 : 1)}
            trackColor={{ false: Colors.purplePale, true: Colors.purple }}
            thumbColor={Colors.white}
          />
          <Text style={styles.toggleNum}>2</Text>
        </View>
      </View>

      {/* Modo de juego */}
      <View style={styles.modeSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name='options-outline' size={16} color={Colors.purple} />
          <Text style={styles.sectionLabel}>Modo de juego</Text>
        </View>
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, gameMode === 'classic' && styles.modeBtnActive]}
            onPress={() => { setGameMode('classic'); setPickedCategory(null) }}
            activeOpacity={0.75}
          >
            <Ionicons
              name='create-outline'
              size={18}
              color={gameMode === 'classic' ? Colors.white : Colors.textSecondary}
            />
            <Text style={[styles.modeBtnText, gameMode === 'classic' && styles.modeBtnTextActive]}>
              Clásico
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, gameMode === 'catalog' && styles.modeBtnActive]}
            onPress={() => setGameMode('catalog')}
            activeOpacity={0.75}
          >
            <Ionicons
              name='dice-outline'
              size={18}
              color={gameMode === 'catalog' ? Colors.white : Colors.textSecondary}
            />
            <Text style={[styles.modeBtnText, gameMode === 'catalog' && styles.modeBtnTextActive]}>
              Catálogo
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.modeHint}>
          {gameMode === 'classic'
            ? 'Cada jugador escribe su propia palabra secreta'
            : 'Acuerden una categoría — el sistema asigna la palabra a cada uno'}
        </Text>
      </View>

      {/* Selector de categoría — solo en modo catálogo */}
      {gameMode === 'catalog' && (
        <View style={styles.categorySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name='albums-outline' size={16} color={Colors.purple} />
            <Text style={styles.sectionLabel}>Categoría de la ronda</Text>
          </View>
          <View style={styles.categoryGrid}>
            {WORD_CATALOG.map(cat => {
              const isSelected = pickedCategory === cat.id
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catChip, isSelected && styles.catChipActive]}
                  onPress={() => setPickedCategory(cat.id)}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={14}
                    color={isSelected ? Colors.white : Colors.purpleLight}
                  />
                  <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          {!pickedCategory && (
            <View style={styles.hintRow}>
              <Ionicons name='information-circle-outline' size={13} color={Colors.textMuted} />
              <Text style={styles.hint}>Elige una categoría para continuar</Text>
            </View>
          )}
        </View>
      )}

      {/* CTA */}
      <TouchableOpacity
        style={[styles.btnPrimary, !canStart && styles.btnDisabled]}
        onPress={handleStart}
        disabled={!canStart}
      >
        <Ionicons name='play' size={18} color={Colors.white} />
        <Text style={styles.btnText}>Comenzar Ronda</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll:        { flex: 1, backgroundColor: Colors.bg },
  container:     { padding: 24, paddingTop: 60 },
  header:        { marginBottom: 36, alignItems: 'center', gap: 4 },
  logoCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(124,58,237,0.15)', borderWidth: 2,
    borderColor: Colors.purple, alignItems: 'center',
    justifyContent: 'center', overflow: 'hidden', marginBottom: 8,
  },
  logoImage:     { width: 130, height: 130, resizeMode: 'cover' },
  title:         { color: Colors.white, fontSize: 36, fontFamily: Fonts.display, letterSpacing: -1 },
  sub:           { color: Colors.textMuted, fontSize: 14, fontFamily: Fonts.body },
  section:       { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  sectionLabel:  { color: Colors.white, fontSize: 16, fontFamily: Fonts.bodyBold },
  inputRow:      { flexDirection: 'row', gap: 10, marginBottom: 8, alignItems: 'center' },
  inputFlex:     { flex: 1 },
  addBtn: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: Colors.purple,
    alignItems: 'center', justifyContent: 'center', elevation: 0,
  },
  hintRow:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  hint:     { color: Colors.textMuted, fontSize: 12, fontFamily: Fonts.body },
  chips:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.purplePale, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.bgCardBorder,
  },
  chipText:      { color: Colors.textSecondary, fontSize: 13, fontFamily: Fonts.bodyBold },
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: Colors.bgCardBorder, marginBottom: 20,
  },
  toggleLeft:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggleLabel:   { color: Colors.white, fontSize: 14, fontFamily: Fonts.bodyBold },
  toggleSub:     { color: Colors.textMuted, fontSize: 12, fontFamily: Fonts.body, marginTop: 2 },
  toggleGroup:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleNum:     { color: Colors.textSecondary, fontSize: 14, fontFamily: Fonts.bodyBold },
  modeSection:   { marginBottom: 20 },
  modeToggle:    { flexDirection: 'row', gap: 10 },
  modeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.bgCard, borderRadius: 16,
    paddingVertical: 14, borderWidth: 1, borderColor: Colors.bgCardBorder,
  },
  modeBtnActive:     { backgroundColor: Colors.purplePale, borderColor: Colors.purple },
  modeBtnText:       { color: Colors.textSecondary, fontSize: 14, fontFamily: Fonts.bodyBold },
  modeBtnTextActive: { color: Colors.white },
  modeHint: {
    color: Colors.textMuted, fontSize: 12, fontFamily: Fonts.body,
    marginTop: 10, textAlign: 'center', lineHeight: 18
  },
  categorySection: { marginBottom: 28 },
  categoryGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.bgCard, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.bgCardBorder,
  },
  catChipActive:     { backgroundColor: Colors.purplePale, borderColor: Colors.purple },
  catChipText:       { color: Colors.textSecondary, fontSize: 13, fontFamily: Fonts.bodyBold },
  catChipTextActive: { color: Colors.white },
  btnPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 18, elevation: 0,
  },
  btnDisabled: { backgroundColor: Colors.purplePale },
  btnText:     { color: Colors.white, fontSize: 17, fontFamily: Fonts.display },
})