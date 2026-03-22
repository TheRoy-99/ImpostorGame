import { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions,
  Animated, PanResponder, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

const { height: H } = Dimensions.get('window');
const CARD_HEIGHT = H * 0.78;
const THRESHOLD   = -H * 0.18;

const CHARACTERS = [
  require('../../assets/characters/persona1.png'),
  require('../../assets/characters/persona2.png'),
  require('../../assets/characters/persona3.png'),
  require('../../assets/characters/persona4.png'),
  require('../../assets/characters/persona5.png'),
];

interface Props {
  onReveal: () => void;
  playerIndex: number;
}

export function SwipeCard({ onReveal, playerIndex }: Props) {
  const translateY = useRef(new Animated.Value(0)).current;
  const a1 = useRef(new Animated.Value(0.2)).current;
  const a2 = useRef(new Animated.Value(0.2)).current;
  const a3 = useRef(new Animated.Value(0.2)).current;

  const character = CHARACTERS[playerIndex % CHARACTERS.length];

  useEffect(() => {
    const pulse = () => Animated.sequence([
      Animated.timing(a1, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(a1, { toValue: 0.2, duration: 350, useNativeDriver: true }),
        Animated.timing(a2, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(a2, { toValue: 0.2, duration: 350, useNativeDriver: true }),
        Animated.timing(a3, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]),
      Animated.timing(a3, { toValue: 0.2, duration: 350, useNativeDriver: true }),
    ]).start(() => pulse());
    pulse();
  }, []);

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderMove: (_, g) => {
      if (g.dy < 0) translateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy < THRESHOLD) {
        Animated.spring(translateY, {
          toValue: -H,
          useNativeDriver: true,
          speed: 18,
        }).start(() => onReveal());
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 12,
        }).start();
      }
    },
  })).current;

  return (
    <Animated.View
      style={[styles.card, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      {/* Personaje */}
      <View style={styles.characterWrap}>
        <Image
          source={character}
          style={styles.character}
        />
        {/* Gradiente que funde el personaje con el fondo */}
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(10,15,30,0.6)', 'rgba(10,15,30,0.95)', '#0A0F1E']}
          locations={[0, 0.4, 0.65, 0.82, 1]}
          style={styles.fadeGradient}
        />
      </View>

      {/* Zona inferior con hint */}
      <View style={styles.hintZone}>
        <View style={styles.arrowRow}>
          <Animated.View style={{ opacity: a1 }}>
            <Ionicons name="chevron-up" size={18} color={Colors.purple} />
          </Animated.View>
          <Animated.View style={{ opacity: a2 }}>
            <Ionicons name="chevron-up" size={18} color={Colors.purple} />
          </Animated.View>
          <Animated.View style={{ opacity: a3 }}>
            <Ionicons name="chevron-up" size={18} color={Colors.purple} />
          </Animated.View>
        </View>
        <Text style={styles.hintTitle}>Desliza hacia arriba</Text>
        <Text style={styles.hintSub}>para ver tu rol</Text>
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={12} color={Colors.textMuted} />
          <Text style={styles.lockText}>Solo tú verás esto</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    backgroundColor: '#0A0F1E',
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    elevation: 0,
    shadowOpacity: 0,
  },
  characterWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  character: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  hintZone:  { paddingBottom: 28, paddingTop: 4, alignItems: 'center', gap: 4 },
  arrowRow:  { flexDirection: 'row', gap: 2, marginBottom: 2 },
  hintTitle: { color: Colors.white, fontSize: 15, fontFamily: Fonts.bodyBold },
  hintSub:   { color: Colors.textMuted, fontSize: 12, fontFamily: Fonts.body },
  lockBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginTop: 4 },
  lockText:  { color: Colors.textMuted, fontSize: 11, fontFamily: Fonts.body },
});