import {
  TouchableOpacity, Text, StyleSheet,
  ViewStyle, TextStyle, TouchableOpacityProps, View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

interface AppButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export function AppButton({
  label, variant = 'primary',
  containerStyle, textStyle, ...props
}: AppButtonProps) {
  return (
    <View style={[
      styles.shadow,
      variant === 'primary'   && styles.shadowPrimary,
      variant === 'secondary' && styles.shadowNone,
      variant === 'ghost'     && styles.shadowNone,
      props.disabled          && styles.shadowNone,
      containerStyle,
    ]}>
      <TouchableOpacity
        {...props}
        activeOpacity={0.8}
        style={[
          styles.base,
          variant === 'primary'   && styles.primary,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost'     && styles.ghost,
          props.disabled          && styles.disabled,
        ]}
      >
        <Text style={[
          styles.text,
          variant === 'secondary' && styles.textSecondary,
          variant === 'ghost'     && styles.textGhost,
          textStyle,
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Sombra en el View exterior — NO en el TouchableOpacity
  shadow: {
    width: '100%',
    borderRadius: 20,
  },
  shadowPrimary: {
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  shadowNone: {
    elevation: 0,
    shadowOpacity: 0,
  },
  // TouchableOpacity sin elevation ni sombra propia
  base: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 0,
    borderWidth: 0,
  },
  primary:       { backgroundColor: Colors.purple },
  secondary:     { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.bgCardBorder },
  ghost:         { backgroundColor: 'transparent' },
  disabled:      { backgroundColor: Colors.purplePale },
  text:          { color: Colors.white, fontSize: 17, fontFamily: Fonts.display },
  textSecondary: { color: Colors.textSecondary },
  textGhost:     { color: Colors.textMuted, fontSize: 14 },
});