# 🗃️ Redux Store - Gestión de Estado

Estructura completa de Redux Toolkit para manejar el estado de los tres juegos de PokéMemory.

## 📁 Estructura

```
store/
├── store.js                    # Configuración del store + redux-persist
└── slices/
    ├── whosThatPokemonSlice.js  # Estado del juego "¿Quién es ese Pokémon?"
    ├── memoryGameSlice.js       # Estado del juego de Memoria
    └── typeMatcherSlice.js      # Estado del juego Type Matcher
```

## 🎮 Slices Implementados

### 1️⃣ whosThatPokemonSlice

**Estado:**
```javascript
{
  score: 0,              // Puntuación actual
  totalPlayed: 0,        // Total de Pokémon jugados
  streak: 0,             // Racha actual de aciertos
  bestStreak: 0,         // Mejor racha de todos los tiempos
  history: []            // Últimos 20 resultados
}
```

**Acciones:**
- `incrementScore()` - Incrementa score y streak, actualiza bestStreak
- `resetStreak()` - Resetea la racha a 0 (cuando falla)
- `incrementTotalPlayed()` - Incrementa el contador total
- `addToHistory(payload)` - Agrega resultado al historial
- `resetGame()` - Reinicia score, totalPlayed y streak
- `resetAll()` - Reinicia todo incluyendo bestStreak

---

### 2️⃣ memoryGameSlice

**Estado:**
```javascript
{
  moves: 0,              // Movimientos de la partida actual
  time: 0,               // Tiempo en segundos de la partida actual
  gamesPlayed: 0,        // Total de juegos jugados
  gamesWon: 0,           // Total de juegos ganados
  bestTime: null,        // Mejor tiempo (menor)
  bestMoves: null,       // Mejor cantidad de movimientos (menor)
  averageMoves: 0,       // Promedio de movimientos
  averageTime: 0,        // Promedio de tiempo
  history: []            // Últimos 20 resultados
}
```

**Acciones:**
- `incrementMoves()` - Incrementa el contador de movimientos
- `setTime(seconds)` - Establece el tiempo
- `incrementTime()` - Incrementa el tiempo en 1 segundo
- `gameWon()` - Actualiza estadísticas al ganar (bestTime, bestMoves, promedios)
- `resetCurrentGame()` - Reinicia moves y time
- `resetStats()` - Reinicia todas las estadísticas
- `resetAll()` - Reinicia todo

---

### 3️⃣ typeMatcherSlice

**Estado:**
```javascript
{
  score: 0,              // Aciertos totales
  attempts: 0,           // Intentos totales
  bestScore: 0,          // Mejor puntuación
  accuracy: 0,           // Porcentaje de precisión
  typeStats: {},         // Estadísticas por tipo de Pokémon
  history: []            // Últimos 20 resultados
}
```

**Estructura de `typeStats`:**
```javascript
{
  'fire': { attempts: 10, correct: 8, accuracy: 80 },
  'water': { attempts: 5, correct: 4, accuracy: 80 },
  // ... más tipos
}
```

**Acciones:**
- `incrementScore()` - Incrementa score, actualiza bestScore y accuracy
- `incrementAttempts()` - Incrementa intentos y recalcula accuracy
- `updateTypeStats({ types, isCorrect })` - Actualiza estadísticas por tipo
- `addToHistory(payload)` - Agrega resultado al historial
- `resetGame()` - Reinicia score, attempts y accuracy
- `resetStats()` - Reinicia bestScore, typeStats e history
- `resetAll()` - Reinicia todo

---

## 🔧 Configuración del Store

### Redux Persist

El store está configurado con `redux-persist` para guardar automáticamente el estado en `localStorage`:

**Persistencia:**
- ✅ Todas las estadísticas y récords
- ✅ Historial de juegos
- ✅ Mejores puntuaciones
- ❌ Estados temporales (UI, loading, etc.)

**Configuración:**
```javascript
{
  key: 'pokememory-root',
  storage: localStorage,
  whitelist: ['whosThatPokemon', 'memoryGame', 'typeMatcher']
}
```

---

## 📊 Uso en Componentes

### Leer Estado

```javascript
import { useSelector } from 'react-redux';

const MyComponent = () => {
  const { score, streak } = useSelector((state) => state.whosThatPokemon);
  
  return <div>Score: {score}</div>;
};
```

### Dispatchar Acciones

```javascript
import { useDispatch } from 'react-redux';
import { incrementScore } from '../store/slices/whosThatPokemonSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  
  const handleCorrectAnswer = () => {
    dispatch(incrementScore());
  };
  
  return <button onClick={handleCorrectAnswer}>Check</button>;
};
```

---

## 🎯 Integración Completa

### 1. Provider en `main.jsx`

```javascript
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <App />
  </PersistGate>
</Provider>
```

### 2. Componentes Conectados

- ✅ **WhosThatPokemon**: Score, streak, totalPlayed, bestStreak
- ✅ **MemoryGame**: Moves, time, bestTime, bestMoves
- ✅ **TypeMatcher**: Score, attempts, accuracy, bestScore

---

## 🔄 Flujo de Datos

### Ejemplo: ¿Quién es ese Pokémon?

```
Usuario selecciona respuesta
    ↓
handleOptionSelect()
    ↓
dispatch(incrementTotalPlayed())
    ↓
Si es correcto:
  ├─ dispatch(incrementScore())      → Actualiza score y streak
  └─ dispatch(addToHistory(...))     → Guarda en historial
    ↓
Si es incorrecto:
  ├─ dispatch(resetStreak())         → Resetea racha
  └─ dispatch(addToHistory(...))     → Guarda en historial
    ↓
Redux actualiza el estado
    ↓
Componente se re-renderiza con nuevos valores
    ↓
redux-persist guarda en localStorage
```

---

## 💾 Persistencia de Datos

### Datos que se Guardan

**¿Quién es ese Pokémon?**
- Mejor racha de aciertos
- Historial de los últimos 20 intentos

**Memoria**
- Mejor tiempo
- Mejores movimientos
- Promedios
- Historial de partidas

**Type Matcher**
- Mejor puntuación
- Estadísticas por tipo
- Historial de intentos

### Limpiar Datos Persistidos

```javascript
// En DevTools o consola
localStorage.removeItem('persist:pokememory-root');
```

---

## 🧪 DevTools

Redux está configurado para funcionar con [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools):

- Ver estado en tiempo real
- Viajar en el tiempo (time travel debugging)
- Inspeccionar acciones despachadas
- Exportar/importar estado

---

## 🚀 Mejoras Futuras

- [ ] Selector memoizados con `reselect`
- [ ] Middleware personalizado para analytics
- [ ] Thunks para llamadas asíncronas
- [ ] Sincronización con backend
- [ ] Comparaciones con otros jugadores
- [ ] Achievements/logros
- [ ] Sistema de niveles
