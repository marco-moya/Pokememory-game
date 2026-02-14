# 🧠 Juego de Memoria Pokémon

Juego clásico de memoria donde debes encontrar las parejas de Pokémon coincidentes.

## 🎯 Características

- **12 Cartas**: 6 pares de Pokémon aleatorios de la primera generación
- **Animaciones de Volteo**: Cartas con efecto flip 3D usando CSS
- **Sistema de Tiempo**: Cronómetro que inicia al voltear la primera carta
- **Contador de Movimientos**: Rastrea cuántos intentos has realizado
- **Detección de Coincidencias**: Las cartas coincidentes se marcan como emparejadas
- **Modal de Victoria**: Celebración con confetti al completar el juego
- **Pokémon Reales**: Imágenes obtenidas de PokeAPI
- **Diseño Responsivo**: Grid adaptable a diferentes tamaños de pantalla

## 🛠️ Tecnologías Utilizadas

- React 19.2.0
- Framer Motion (animaciones)
- React Confetti (celebración)
- Axios (llamadas a API)
- CSS Modules
- PokeAPI (https://pokeapi.co/)

## 📁 Estructura de Archivos

```
MemoryGame/
├── MemoryGame.jsx           # Componente principal con lógica del juego
└── MemoryGame.module.css    # Estilos del contenedor y modal
```

### Componentes Reutilizados

- **GameInfo**: Muestra tiempo y movimientos (actualizado para recibir props)
- **GameBoard**: Renderiza el grid de cartas (actualizado para recibir props)
- **Card**: Componente de carta individual con animación flip

## 🎮 Mecánicas del Juego

### Flujo Principal

1. Se cargan 6 Pokémon aleatorios de la PokeAPI
2. Se crean parejas (12 cartas en total)
3. Las cartas se mezclan aleatoriamente
4. El jugador voltea cartas de dos en dos
5. Si coinciden, se marcan como emparejadas
6. Si no coinciden, se voltean de nuevo después de 1 segundo
7. El juego termina cuando todas las parejas están emparejadas

### Estados del Juego

- **Loading**: Cargando Pokémon de la API
- **Jugando**: Jugador volteando cartas
- **Victoria**: Todas las cartas emparejadas

### Sistema de Validación

```javascript
// No permitir:
- Voltear más de 2 cartas a la vez
- Voltear cartas ya emparejadas
- Voltear la misma carta dos veces
```

## 📊 Estadísticas Rastreadas

- **Tiempo**: Cronómetro en formato MM:SS
- **Movimientos**: Número de pares volteados
- **Cartas Emparejadas**: Progreso del juego

## 🎨 Componentes Principales

### MemoryGame

Componente contenedor que maneja:
- Estado del juego
- Lógica de coincidencias
- Temporizador
- Carga de datos desde la API
- Modal de victoria

### GameInfo (Actualizado)

Props:
- `time`: String con formato "MM:SS"
- `moves`: Número de movimientos

### GameBoard (Actualizado)

Props:
- `cards`: Array de objetos carta
- `onCardClick`: Función callback al hacer clic en una carta

### Card

Props:
- `pokemon`: Objeto con datos del Pokémon
- `isFlipped`: Boolean para estado volteado
- `isMatched`: Boolean para estado emparejado
- `onClick`: Función callback

## 🎯 Navegación

- Accesible desde el menú principal en la ruta `/memory`
- Botón flotante de inicio (esquina superior izquierda)
- Botón flotante de reinicio (esquina superior derecha)

## 🎨 Efectos Visuales

- **Entrada**: Fade in con slide up
- **Cartas**: Efecto flip 3D
- **Victoria**: Confetti animado + modal con estadísticas
- **Botones flotantes**: Hover con scale y cambio de color

## 🔄 Optimizaciones

- `useCallback` para prevenir re-renders innecesarios
- Mezcla aleatoria de cartas usando Fisher-Yates
- Cleanup de timers en useEffect
- Deshabilitación de clicks durante validación

## 🏆 Mejoras Futuras

- [ ] Diferentes niveles de dificultad (4x4, 6x6, 8x8)
- [ ] Selector de generaciones de Pokémon
- [ ] Tabla de mejores tiempos
- [ ] Modo de desafío con tiempo límite
- [ ] Efectos de sonido
- [ ] Animaciones de celebración mejoradas
- [ ] Modo multijugador local
- [ ] Guardar progreso con Redux Persist
- [ ] Sistema de pistas
