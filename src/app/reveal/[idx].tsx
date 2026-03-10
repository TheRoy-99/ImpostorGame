import { View, Text, StyleSheet, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { useGameStore } from '../../store/gameStore';

export default function RevealScreen() {
  const { idx } = useLocalSearchParams<{ idx: string }>();
  const currentIdx = parseInt(idx ?? '0');
  const { currentGame } = useGameStore();
  const [revealed, setRevealed] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  if (!currentGame) { router.replace('/'); return null; }

  const assignment = currentGame.assignments[currentIdx];
  const numPlayers = currentGame.assignments.length;
  const isLast = currentIdx + 1 >= numPlayers;
  const isImpostor = assignment.role === 'impostor';

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy < 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -90) {
          Animated.spring(translateY, { toValue: -400, useNativeDriver: true }).start();
          setTimeout(() => setRevealed(true), 300);
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const handleNext = () => {
    if (isLast) router.push('/end-round');
    else router.push(`/reveal/${currentIdx + 1}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Turno de</Text>
          <Text style={styles.headerName}>{assignment.player.name}</Text>
        </View>
        <View style={styles.counter}>
          <Text style={styles.counterText}>{currentIdx + 1} / {numPlayers}</Text>
        </View>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {Array.from({ length: numPlayers }).map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIdx && styles.dotActive, i < currentIdx && styles.dotDone]} />
        ))}
      </View>

      {/* Swipe o resultado */}
      <View style={styles.content}>
        {!revealed ? (
          <Animated.View
            style={[styles.swipeCard, { transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            <Text style={styles.swipeEmoji}>🔒</Text>
            <Text style={styles.swipeTitle}>Desliza hacia arriba</Text>
            <Text style={styles.swipeSub}>para revelar tu rol</Text>
            <Text style={styles.arrows}>↑{'\n'}↑{'\n'}↑</Text>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.resultCard, isImpostor ? styles.resultImpostor : styles.resultWord]}>
            <Text style={styles.resultEmoji}>{isImpostor ? '🕵️' : '🎯'}</Text>
            <View style={[styles.roleBadge, isImpostor ? styles.roleBadgeImpostor : styles.roleBadgeWord]}>
              <Text style={styles.roleBadgeText}>Rol secreto</Text>
            </View>
            <Text style={[styles.roleTitle, isImpostor ? styles.roleTitleImpostor : styles.roleTitleWord]}>
              {isImpostor ? 'Impostor' : currentGame.chosenWord.word}
            </Text>
            <Text style={styles.roleSub}>
              {isImpostor
                ? 'No conoces la palabra.\n¡Finge que sí y no te descubran!'
                : 'Da pistas sin decirla directamente\ny descubre al impostor.'}
            </Text>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
              <Text style={styles.btnText}>
                {isLast ? '✓ Finalizar reparto' : `Siguiente: ${currentGame.assignments[currentIdx + 1]?.player.name} →`}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: Colors.bg },
  header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.salmonPale },
  headerLabel:        { color: Colors.textLight, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: Fonts.body },
  headerName:         { color: Colors.text, fontSize: 20, fontFamily: Fonts.display, marginTop: 2 },
  counter:            { backgroundColor: Colors.salmonPale, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6 },
  counterText:        { color: Colors.salmon, fontSize: 13, fontFamily: Fonts.bodyBold },
  dots:               { flexDirection: 'row', gap: 6, justifyContent: 'center', paddingTop: 12 },
  dot:                { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.salmonPale },
  dotActive:          { width: 20, backgroundColor: Colors.salmonDark },
  dotDone:            { backgroundColor: Colors.salmon },
  content:            { flex: 1, padding: 24, justifyContent: 'center' },
  swipeCard:          { backgroundColor: Colors.grayLight, borderRadius: 28, padding: 36, alignItems: 'center', gap: 12 },
  swipeEmoji:         { fontSize: 48 },
  swipeTitle:         { color: Colors.textMid, fontSize: 15, fontFamily: Fonts.bodyBold },
  swipeSub:           { color: Colors.textLight, fontSize: 12, fontFamily: Fonts.body },
  arrows:             { color: Colors.salmon, fontSize: 18, textAlign: 'center', lineHeight: 22, marginTop: 8, opacity: 0.7 },
  resultCard:         { borderRadius: 28, padding: 32, alignItems: 'center', gap: 12 },
  resultImpostor:     { backgroundColor: Colors.impostorBg, borderWidth: 2, borderColor: `${Colors.impostor}22` },
  resultWord:         { backgroundColor: Colors.wordBg, borderWidth: 2, borderColor: `${Colors.salmonLight}44` },
  resultEmoji:        { fontSize: 56, marginBottom: 4 },
  roleBadge:          { borderRadius: 12, paddingHorizontal: 18, paddingVertical: 5, marginBottom: 4 },
  roleBadgeImpostor:  { backgroundColor: Colors.impostor },
  roleBadgeWord:      { backgroundColor: Colors.salmon },
  roleBadgeText:      { color: Colors.white, fontSize: 11, fontFamily: Fonts.bodyBold, letterSpacing: 2, textTransform: 'uppercase' },
  roleTitle:          { fontSize: 34, fontFamily: Fonts.display, marginBottom: 4 },
  roleTitleImpostor:  { color: Colors.impostor },
  roleTitleWord:      { color: Colors.salmon, textTransform: 'capitalize' },
  roleSub:            { color: Colors.textLight, fontSize: 13, fontFamily: Fonts.body, textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  btnPrimary:         { width: '100%', backgroundColor: Colors.salmon, borderRadius: 20, paddingVertical: 17, alignItems: 'center', shadowColor: Colors.salmon, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.38, shadowRadius: 12, elevation: 6, marginTop: 8 },
  btnText:            { color: Colors.white, fontSize: 17, fontFamily: Fonts.display },
});