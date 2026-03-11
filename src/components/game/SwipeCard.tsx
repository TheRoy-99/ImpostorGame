import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.55;
const THRESHOLD = -SCREEN_HEIGHT * 0.15;

interface SwipeCardProps {
  playerName: string;
  current: number;
  total: number;
  onReveal: () => void;
}

export function SwipeCard({ playerName, current, total, onReveal }: SwipeCardProps) {
  const translateY = useSharedValue(0);
  const arrowOpacity1 = useSharedValue(0.3);
  const arrowOpacity2 = useSharedValue(0.3);
  const arrowOpacity3 = useSharedValue(0.3);

  // Flechas pulsando en cascada
  useEffect(() => {
    const animate = () => {
      arrowOpacity1.value = withTiming(1, { duration: 400 }, () => {
        arrowOpacity1.value = withTiming(0.3, { duration: 400 });
      });
      setTimeout(() => {
        arrowOpacity2.value = withTiming(1, { duration: 400 }, () => {
          arrowOpacity2.value = withTiming(0.3, { duration: 400 });
        });
      }, 150);
      setTimeout(() => {
        arrowOpacity3.value = withTiming(1, { duration: 400 }, () => {
          arrowOpacity3.value = withTiming(0.3, { duration: 400 });
        });
      }, 300);
    };
    animate();
    const interval = setInterval(animate, 1200);
    return () => clearInterval(interval);
  }, []);

  // Nueva API de gestos — Reanimated 3+
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY < THRESHOLD) {
        translateY.value = withSpring(-SCREEN_HEIGHT, {
          damping: 20,
          stiffness: 90,
        });
        runOnJS(onReveal)();
      } else {
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 120,
        });
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const progress = Math.abs(translateY.value) / SCREEN_HEIGHT;
    return {
      transform: [{ translateY: translateY.value }],
      shadowOpacity: interpolate(progress, [0, 0.3], [0.08, 0.35]),
      shadowRadius: interpolate(progress, [0, 0.3], [12, 32]),
    };
  });

  const shimmerStyle = useAnimatedStyle(() => {
    const progress = Math.abs(translateY.value) / SCREEN_HEIGHT;
    return {
      opacity: interpolate(progress, [0, 0.2], [0, 0.25]),
      height: interpolate(progress, [0, 0.3], [0, CARD_HEIGHT * 0.5]),
    };
  });

  const lockStyle = useAnimatedStyle(() => {
    const progress = Math.abs(translateY.value) / SCREEN_HEIGHT;
    return {
      opacity: interpolate(progress, [0, 0.2], [1, 0]),
      transform: [
        { scale: interpolate(progress, [0, 0.2], [1, 0.7]) },
        { translateY: interpolate(progress, [0, 0.2], [0, -20]) },
      ],
    };
  });

  const hintStyle = useAnimatedStyle(() => {
    const progress = Math.abs(translateY.value) / SCREEN_HEIGHT;
    return {
      opacity: interpolate(progress, [0, 0.15], [1, 0]),
    };
  });

  const arrow1Style = useAnimatedStyle(() => ({ opacity: arrowOpacity1.value }));
  const arrow2Style = useAnimatedStyle(() => ({ opacity: arrowOpacity2.value }));
  const arrow3Style = useAnimatedStyle(() => ({ opacity: arrowOpacity3.value }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, cardStyle]}>

        {/* Shimmer al deslizar */}
        <Animated.View style={[styles.shimmer, shimmerStyle]} />

        {/* Candado */}
        <Animated.View style={[styles.lockContainer, lockStyle]}>
          <View style={styles.lockCircle}>
            <Text style={styles.lockEmoji}>🔒</Text>
          </View>
        </Animated.View>

        {/* Hint */}
        <Animated.View style={[styles.hintContainer, hintStyle]}>
          <Text style={styles.hintTitle}>Desliza hacia arriba</Text>
          <Text style={styles.hintSub}>para revelar tu rol</Text>
        </Animated.View>

        {/* Flechas animadas */}
        <View style={styles.arrowsContainer}>
          <Animated.Text style={[styles.arrow, arrow3Style]}>↑</Animated.Text>
          <Animated.Text style={[styles.arrow, arrow2Style]}>↑</Animated.Text>
          <Animated.Text style={[styles.arrow, arrow1Style]}>↑</Animated.Text>
        </View>

      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    backgroundColor: Colors.grayLight,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    shadowColor: Colors.salmon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.salmon,
    borderRadius: 32,
  },
  lockContainer:  { alignItems: 'center' },
  lockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.salmonPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockEmoji:      { fontSize: 36 },
  hintContainer:  { alignItems: 'center', gap: 4 },
  hintTitle:      { color: Colors.textMid, fontSize: 16, fontFamily: Fonts.bodyBold },
  hintSub:        { color: Colors.textLight, fontSize: 13, fontFamily: Fonts.body },
  arrowsContainer:{ flexDirection: 'column', alignItems: 'center', gap: 0 },
  arrow:          { color: Colors.salmon, fontSize: 24, fontFamily: Fonts.body },
});