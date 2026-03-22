import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, TouchableOpacity, TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { useGameStore } from '../../store/gameStore';
import { AppButton } from '../../components/common/AppButton';

export default function CollectWordScreen() {
  const { idx } = useLocalSearchParams<{ idx: string }>();
  const currentIdx = parseInt(idx ?? '0');
  const { players, addWord } = useGameStore();
  const [focused, setFocused] = useState(false);
  const [word, setWord] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const currentPlayer = players[currentIdx];
  const isLast = currentIdx + 1 >= players.length;
  const total = players.length;

  useEffect(() => {
    setWord('');
    setConfirmed(false);
    const timer = setTimeout(() => inputRef.current?.focus(), 600);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const handleConfirm = () => {
    if (word.trim().length < 1) return;
    setConfirmed(true);
    addWord({ player: currentPlayer, word: word.trim() });
    setTimeout(() => {
      setWord('');
      setConfirmed(false);
      if (isLast) router.push('/ready');
      else router.push(`/pass/${currentIdx + 1}` as any);
    }, 700);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>

        <View style={styles.dots}>
          {Array.from({ length: total }).map((_, i) => (
            <View key={i} style={[
              styles.dot,
              i === currentIdx && styles.dotActive,
              i < currentIdx && styles.dotDone,
            ]} />
          ))}
        </View>

        <Text style={styles.greeting}>Hola, {currentPlayer?.name}</Text>
        <Text style={styles.sub}>Escribe tu palabra secreta</Text>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
          style={[
            styles.inputBox,
            focused && styles.inputBoxFocused,
            confirmed && styles.inputBoxConfirmed,
          ]}
        >
          <TextInput
            ref={inputRef}
            value={confirmed ? '•'.repeat(word.length) : word}
            onChangeText={(t) => !confirmed && setWord(t)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Tu palabra..."
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
            editable={!confirmed}
            underlineColorAndroid="transparent"
            selectionColor={Colors.purple}
            cursorColor={Colors.purple}
          />
        </TouchableOpacity>

        {/* Hint con icono */}
        <View style={styles.hintRow}>
          {confirmed
            ? <Ionicons name="checkmark-circle" size={14} color={Colors.purpleLight} />
            : word.length > 0
            ? <Ionicons name="eye-off-outline" size={14} color={Colors.textMuted} />
            : <Ionicons name="lock-closed-outline" size={14} color={Colors.textMuted} />
          }
          <Text style={styles.hint}>
            {confirmed
              ? 'Guardado — pasando...'
              : word.length > 0
              ? 'Solo tú ves esto'
              : 'Nadie más puede ver lo que escribes'}
          </Text>
        </View>

        <AppButton
          label={confirmed ? 'Guardado' : isLast ? 'Empezar' : 'Confirmar'}
          onPress={handleConfirm}
          disabled={word.trim().length < 1 || confirmed}
        />

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:              { flex: 1, backgroundColor: Colors.bg },
  container:         { flex: 1, padding: 28, alignItems: 'center', justifyContent: 'center' },
  dots:              { flexDirection: 'row', gap: 6, marginBottom: 36 },
  dot:               { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.purplePale },
  dotActive:         { width: 20, backgroundColor: Colors.purple },
  dotDone:           { backgroundColor: Colors.purpleLight },
  greeting:          { color: Colors.white, fontSize: 28, fontFamily: Fonts.display, marginBottom: 6, letterSpacing: -0.5 },
  sub:               { color: Colors.textMuted, fontSize: 14, fontFamily: Fonts.body, marginBottom: 28 },
  inputBox:          { width: '100%', borderRadius: 20, borderWidth: 1.5, borderColor: Colors.bgCardBorder, marginBottom: 12, overflow: 'hidden', elevation: 0 },
  inputBoxFocused:   { borderColor: Colors.purple },
  inputBoxConfirmed: { borderColor: Colors.purpleLight },
  input:             { width: '100%', paddingHorizontal: 44, paddingVertical: 18, fontSize: 20, fontFamily: Fonts.display, color: Colors.white, textAlign: 'center', textAlignVertical: 'center', letterSpacing: 2, backgroundColor: Colors.bgInput },
  hintRow:           { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 28 },
  hint:              { color: Colors.textMuted, fontSize: 12, fontFamily: Fonts.body },
});