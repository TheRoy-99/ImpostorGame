# 🕵️ Impostor RMR

> *¿Quién es el infiltrado?*

Juego de roles para grupos donde cada jugador escribe una palabra secreta, el sistema elige una al azar y asigna impostores que no la conocen. El objetivo: debatir con pistas y descubrir quién finge saber la palabra.

---

## 📱 Screenshots

| Inicio | Pasa el teléfono | Desliza tu rol | Impostor | Fin de ronda |
|--------|-----------------|----------------|----------|--------------|
| ![Home](docs/home.png) | ![Pass](docs/pass.png) | ![Swipe](docs/swipe.png) | ![Impostor](docs/impostor.png) | ![End](docs/end.png) |

---

## 🎮 Cómo se juega

1. **Configura** — Agrega jugadores (mínimo 3) y elige cuántos impostores (1 o 2)
2. **Palabras secretas** — Cada jugador escribe su palabra en privado al pasar el teléfono
3. **Sorteo silencioso** — El sistema elige una palabra al azar y asigna roles sin que nadie lo vea
4. **Desliza** — Cada jugador desliza para ver si es jugador normal (ve la palabra) o impostor (no la conoce)
5. **Debate** — Todos dan pistas. Los normales intentan descubrir al impostor. El impostor finge saber la palabra
6. **Revela** — Al final de la ronda, toca la carta para revelar la palabra elegida

---

## 🏗️ Arquitectura

El proyecto sigue **Clean Architecture** con 3 capas bien definidas:

```
src/
├── app/                    # Expo Router — pantallas
│   ├── index.tsx           # Home — configuración
│   ├── pass/[idx].tsx      # Pasa el teléfono (palabras)
│   ├── collect/[idx].tsx   # Escribe tu palabra
│   ├── reveal/[idx].tsx    # Desliza tu rol
│   ├── end-round.tsx       # Fin de ronda
│   └── _layout.tsx         # Layout raíz
│
├── domain/                 # Lógica de negocio pura
│   ├── entities/           # Tipos: Player, Game, Assignment...
│   ├── useCases/           # BuildGameUseCase
│   └── repositories/       # Contratos (interfaces)
│
├── data/                   # Implementaciones de datos
│   ├── repositories/       # GameRepository (AsyncStorage)
│   └── storage/            # StorageKeys
│
├── store/                  # Estado global (Zustand)
│   └── gameStore.ts
│
├── hooks/                  # Custom hooks
│   └── useGame.ts
│
├── components/             # UI reutilizable
│   ├── common/             # AppButton, AppInput
│   └── game/               # SwipeCard
│
├── constants/              # Colors, Fonts
└── assets/                 # Imágenes, personajes
```

### Patrones aplicados

| Patrón | Dónde | Por qué |
|--------|-------|---------|
| **Repository Pattern** | `data/repositories/` | Abstrae el acceso a datos — fácil de cambiar AsyncStorage por una API |
| **Use Case Pattern** | `domain/useCases/` | Lógica de negocio pura sin dependencias de React |
| **Zustand Store** | `store/gameStore.ts` | Estado global simple, sin boilerplate |
| **Custom Hooks** | `hooks/useGame.ts` | Orquesta Use Cases + Store. Los screens solo llaman hooks |

---

## 🛠️ Stack tecnológico

| Herramienta | Versión | Uso |
|-------------|---------|-----|
| React Native | 0.76+ | Framework móvil |
| Expo SDK | 55 | Toolchain y módulos nativos |
| Expo Router | 4 | Navegación basada en archivos |
| TypeScript | 5 | Tipado estático |
| Zustand | 5 | Estado global |
| AsyncStorage | 2 | Persistencia local |
| Expo Linear Gradient | 14 | Gradientes en UI |
| @expo/vector-icons | - | Iconos (Ionicons) |
| EAS Build | - | Compilación en la nube |

---

## 🚀 Instalación y desarrollo

### Prerequisitos

- Node.js 20+
- npm o yarn
- Expo Go en tu teléfono ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Setup

```bash
# Clona el repositorio
git clone https://github.com/roy_m/impostor-app.git
cd impostor-app

# Instala dependencias
npm install --legacy-peer-deps

# Crea el archivo .npmrc para evitar conflictos
echo "legacy-peer-deps=true" > .npmrc

# Inicia el servidor de desarrollo
npx expo start
```

Escanea el QR con Expo Go en tu teléfono.

---

## 📦 Build de producción

### Android APK (para distribuir sin Play Store)

```bash
# Login en Expo
eas login

# Build preview (APK directo)
eas build --platform android --profile preview
```

### Android AAB (para Play Store)

```bash
eas build --platform android --profile production
```

### iOS (requiere cuenta Apple Developer)

```bash
eas build --platform ios --profile production
```

---

## 🌿 Git Flow

```
main          ← releases estables
  └── develop ← integración
        ├── feature/dark-redesign
        ├── feature/swipe-animation
        ├── feature/ui-improvements
        └── feature/app-icon
```

### Convención de commits

```
feat:     nueva funcionalidad
fix:      corrección de bug
chore:    configuración, dependencias
refactor: refactorización sin cambio funcional
docs:     documentación
merge:    merge de feature branch
```

---

## 🔐 Seguridad del juego

El diseño garantiza que nadie pueda hacer trampa:

- **Sorteo silencioso** — La palabra se elige en `BuildGameUseCase` sin ninguna pantalla visible
- **Palabras ocultas** — `secureTextEntry` reemplazado por ocultamiento manual para compatibilidad
- **Botón atrás bloqueado** — `BackHandler` en Android + `gestureEnabled: false` en iOS
- **Pantalla de paso** — Cada jugador confirma que el anterior ya no ve la pantalla antes de deslizar

---

## 📁 Variables de entorno

No se requieren variables de entorno para desarrollo local.

Para producción, el `projectId` de EAS está en `app.json`:

```json
"extra": {
  "eas": {
    "projectId": "27182487-eef8-4b68-9c49-e535e878bb70"
  }
}
```

---

## 📋 Roadmap

- [x] Flujo completo de juego
- [x] Diseño dark mode con tema púrpura
- [x] Personajes ilustrados por jugador
- [x] Rotación de palabras sin repetir
- [x] Detección de palabras agotadas
- [x] Build Android (APK)
- [ ] Categorías de palabras predefinidas
- [ ] Temporizador por ronda
- [ ] Historial de partidas
- [ ] Sonidos y haptics
- [ ] Publicación en Play Store
- [ ] Publicación en App Store

---

## 👨‍💻 Autor

**Roy MR** — [@roy_m](https://expo.dev/accounts/roy_m)

---

## 📄 Licencia

MIT © 2026 Roy MR
