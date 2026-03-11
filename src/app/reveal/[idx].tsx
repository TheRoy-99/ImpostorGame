import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { useGameStore } from '../../store/gameStore';
import { SwipeCard } from '../../components/game/SwipeCard';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RevealScreen() {
  const { idx } = useLocalSearchParams<{ idx: string }>();
  const currentIdx = parseInt(idx ?? '0');
  const { currentGame } = useGameStore();
  const [revealed, setRevealed] = useState(false);

  const resultOpacity = useSharedValue(0);
  const resultTranslateY = useSharedValue(30);

  if (!currentGame) { router.replace('/'); return null; }

  const assignment = currentGame.assignments[currentIdx];
  const numPlayers = currentGame.assignments.length;
  const isLast = currentIdx + 1 >= numPlayers;
  const isImpostor = assignment.role === 'impostor';

  const handleReveal = () => {
    setRevealed(true);
    resultOpacity.value = withTiming(1, { duration: 400 });
    resultTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  };

  const resultStyle = useAnimatedStyle(() => ({
    opacity: resultOpacity.value,
    transform: [{ translateY: resultTranslateY.value }],
  }));

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

      {/* Progress dots */}
      <View style={styles.dots}>
        {Array.from({ length: numPlayers }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIdx && styles.dotActive,
              i < currentIdx && styles.dotDone,
            ]}
          />
        ))}
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {!revealed ? (
          <SwipeCard
            playerName={assignment.player.name}
            current={currentIdx + 1}
            total={numPlayers}
            onReveal={handleReveal}
          />
        ) : (
          <Animated.View style={[styles.resultWrapper, resultStyle]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultScroll}
            >
              {/* Card resultado */}
              <View style={[
                styles.resultCard,
                isImpostor ? styles.resultImpostor : styles.resultWord,
              ]}>
                <Text style={styles.resultEmoji}>
                  {isImpostor ? '🕵️' : '🎯'}
                </Text>

                <View style={[
                  styles.roleBadge,
                  isImpostor ? styles.roleBadgeImpostor : styles.roleBadgeWord,
                ]}>
                  <Text style={styles.roleBadgeText}>Rol secreto</Text>
                </View>

                <Text style={[
                  styles.roleTitle,
                  isImpostor ? styles.roleTitleImpostor : styles.roleTitleWord,
                ]}>
                  {isImpostor ? 'Impostor' : currentGame.chosenWord.word}
                </Text>

                <Text style={styles.roleSub}>
                  {isImpostor
                    ? 'No conoces la palabra secreta.\n¡Finge que sí y no te descubran!'
                    : 'Da pistas sin decirla directamente\ny descubre al impostor.'}
                </Text>
              </View>

              {/* Botón siguiente */}
              <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
                <Text style={styles.btnText}>
                  {isLast
                    ? '✓ Finalizar reparto'
                    : `Siguiente: ${currentGame.assignments[currentIdx + 1]?.player.name} →`}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: Colors.bg },
  header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.salmonPale },
  headerLabel:        { color: Colors.textLight, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: Fonts.body },
  headerName:         { color: Colors.text, fontSize: 22, fontFamily: Fonts.display, marginTop: 2 },
  counter:            { backgroundColor: Colors.salmonPale, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6 },
  counterText:        { color: Colors.salmon, fontSize: 13, fontFamily: Fonts.bodyBold },
  dots:               { flexDirection: 'row', gap: 6, justifyContent: 'center', paddingVertical: 12 },
  dot:                { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.salmonPale },
  dotActive:          { width: 20, backgroundColor: Colors.salmonDark },
  dotDone:            { backgroundColor: Colors.salmon },
  content:            { flex: 1, paddingHorizontal: 20, paddingVertical: 16, justifyContent: 'center' },
  resultWrapper:      { flex: 1 },
  resultScroll:       { flexGrow: 1, justifyContent: 'center', paddingBottom: 24 },
  resultCard:         { borderRadius: 28, padding: 32, alignItems: 'center', gap: 12, marginBottom: 20 },
  resultImpostor:     { backgroundColor: Colors.impostorBg, borderWidth: 2, borderColor: `${Colors.impostor}33` },
  resultWord:         { backgroundColor: Colors.wordBg, borderWidth: 2, borderColor: `${Colors.salmonLight}66` },
  resultEmoji:        { fontSize: SCREEN_HEIGHT * 0.07 },
  roleBadge:          { borderRadius: 12, paddingHorizontal: 18, paddingVertical: 5 },
  roleBadgeImpostor:  { backgroundColor: Colors.impostor },
  roleBadgeWord:      { backgroundColor: Colors.salmon },
  roleBadgeText:      { color: Colors.white, fontSize: 11, fontFamily: Fonts.bodyBold, letterSpacing: 2, textTransform: 'uppercase' },
  roleTitle:          { fontSize: SCREEN_HEIGHT * 0.045, fontFamily: Fonts.display, textAlign: 'center' },
  roleTitleImpostor:  { color: Colors.impostor },
  roleTitleWord:      { color: Colors.salmon, textTransform: 'capitalize' },
  roleSub:            { color: Colors.textLight, fontSize: 14, fontFamily: Fonts.body, textAlign: 'center', lineHeight: 22 },
  btnPrimary:         { backgroundColor: Colors.salmon, borderRadius: 20, paddingVertical: 17, alignItems: 'center', shadowColor: Colors.salmon, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.38, shadowRadius: 12, elevation: 6 },
  btnText:            { color: Colors.white, fontSize: 17, fontFamily: Fonts.display },
});