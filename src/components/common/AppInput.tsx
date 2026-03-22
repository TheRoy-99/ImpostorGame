import {
  TextInput,
  StyleSheet,
  View,
  TextInputProps,
  ViewStyle
} from 'react-native'
import { Colors } from '../../constants/colors'
import { Fonts } from '../../constants/fonts'

interface AppInputProps extends TextInputProps {
  containerStyle?: ViewStyle
}

export function AppInput ({ containerStyle, style, ...props }: AppInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...props}
        style={[styles.input, style]}
        placeholderTextColor={Colors.textMuted}
        underlineColorAndroid='transparent'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgInput,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    overflow: 'hidden'
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.white,
    fontFamily: Fonts.body,
    fontSize: 15,
    borderWidth: 0,
    backgroundColor: 'transparent'
  }
})
