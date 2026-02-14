# 🎮 ¿Quién es ese Pokémon?

Componente de juego interactivo que desafía a los jugadores a identificar Pokémon por su silueta.

## 🎯 Características

- **Siluetas Animadas**: Los Pokémon aparecen en silueta hasta que se revela la respuesta
- **Opciones Múltiples**: 4 opciones de respuesta por cada Pokémon
- **Sistema de Puntuación**: 
  - Contador de aciertos
  - Racha de respuestas correctas
  - Total de intentos
- **Animaciones Fluidas**: Utilizando Framer Motion para transiciones suaves
- **API PokeAPI**: Datos reales de Pokémon de la primera generación
- **Feedback Visual**: Indicadores claros de respuestas correctas/incorrectas
- **Diseño Responsivo**: Adaptable a móviles y tablets

## 🛠️ Tecnologías Utilizadas

- React 19.2.0
- Framer Motion (animaciones)
- Axios (llamadas a API)
- CSS Modules
- PokeAPI (https://pokeapi.co/)

## 📁 Estructura de Archivos

```
WhosThatPokemon/
├── WhosThatPokemon.jsx       # Componente principal
└── WhosThatPokemon.module.css # Estilos del componente
```

## 🎮 Cómo Funciona

1. El componente carga un Pokémon aleatorio de la primera generación (1-151)
2. Se muestra la imagen en modo silueta (filtro brightness(0))
3. Se generan 3 opciones incorrectas aleatorias
4. Las 4 opciones se mezclan aleatoriamente
5. El jugador selecciona una opción
6. Se revela la imagen y se muestra feedback
7. Se actualiza la puntuación y racha
8. El jugador puede continuar con el siguiente Pokémon

## 🎨 Estados del Juego

- **Loading**: Spinner animado mientras carga el Pokémon
- **Pregunta**: Silueta mostrada con opciones disponibles
- **Revelado**: Imagen completa con feedback y botón "Siguiente"

## 📊 Sistema de Estadísticas

- **Puntuación**: Número total de aciertos
- **Racha**: Aciertos consecutivos (se reinicia con un error)
- **Total**: Número total de Pokémon jugados

## 🎯 Navegación

- Accesible desde el menú principal en la ruta `/whos-that-pokemon`
- Botón de inicio en el header para volver al menú
- Botón de reiniciar para resetear estadísticas

## 🔄 Mejoras Futuras

- [ ] Diferentes generaciones de Pokémon
- [ ] Niveles de dificultad (más/menos opciones)
- [ ] Temporizador por pregunta
- [ ] Tabla de puntuaciones
- [ ] Efectos de sonido
- [ ] Modo multijugador
- [ ] Guardado de progreso con Redux Persist
