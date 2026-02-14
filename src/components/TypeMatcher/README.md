# 🎯 Type Matcher - Adivina los Tipos

Juego interactivo donde debes adivinar los tipos de un Pokémon usando drag & drop.

## 🎮 Objetivo del Juego

Arrastra los tipos correctos desde el panel de tipos disponibles hasta las zonas de drop para adivinar a qué tipo(s) pertenece cada Pokémon mostrado.

## 🎯 Características

- **Drag & Drop Nativo**: Funcionalidad completa de arrastrar y soltar
- **Pokémon Aleatorios**: De la primera generación (1-151)
- **18 Tipos Disponibles**: Todos los tipos de Pokémon con colores oficiales
- **Validación en Tiempo Real**: Verifica si los tipos son correctos
- **Sistema de Puntuación**: Rastrea aciertos e intentos
- **Feedback Visual**: Indicadores de tipos correctos/incorrectos
- **Confetti**: Celebración al acertar
- **Diseño Responsivo**: Adaptado para móviles y tablets

## 🎨 Tipos de Pokémon Incluidos

Los 18 tipos con sus colores oficiales:
- Normal, Fire, Water, Electric
- Grass, Ice, Fighting, Poison
- Ground, Flying, Psychic, Bug
- Rock, Ghost, Dragon, Dark
- Steel, Fairy

## 🛠️ Tecnologías Utilizadas

- React 19.2.0
- Framer Motion (animaciones)
- React Confetti (celebración)
- Drag & Drop API nativa de HTML5
- Axios (PokeAPI)
- CSS Modules

## 📁 Estructura de Archivos

```
TypeMatcher/
├── TypeMatcher.jsx          # Componente principal
├── TypeMatcher.module.css   # Estilos
└── README.md               # Documentación
```

## 🎮 Mecánicas del Juego

### Flujo Principal

1. Se muestra un Pokémon aleatorio
2. Se presentan las zonas de drop (tantas como tipos tenga el Pokémon)
3. El jugador arrastra tipos desde el panel inferior
4. Los tipos se colocan en las zonas de drop
5. El jugador puede remover tipos haciendo clic en ellos
6. Al presionar "Verificar", se valida la respuesta
7. Se muestra feedback visual (correcto/incorrecto)
8. Se revelan los tipos correctos
9. El jugador puede continuar con el siguiente Pokémon

### Validación

```javascript
// Correcto:
- Todos los tipos del Pokémon están presentes
- No hay tipos extras
- No importa el orden

// Incorrecto:
- Falta algún tipo
- Hay tipos incorrectos
- Cantidad incorrecta
```

## 🎨 Características de UI/UX

### Drag & Drop
- **Arrastrable**: Todos los tipos en el panel inferior
- **Zonas de Drop**: Una por cada tipo del Pokémon
- **Visual Feedback**: Borde punteado → sólido al soltar
- **Remover**: Clic en el tipo para quitarlo

### Estados Visuales
- **Drop Zone Vacía**: Borde punteado gris
- **Drop Zone Llena**: Borde sólido azul
- **Tipo Correcto**: Borde verde + fondo verde claro
- **Tipo Incorrecto**: Borde rojo + fondo rojo claro

### Animaciones
- Entrada de elementos con fade + slide
- Hover effects en tipos arrastrables
- Scale en botones
- Confetti al acertar

## 📊 Estadísticas

- **Aciertos**: Número de Pokémon adivinados correctamente
- **Intentos**: Total de verificaciones realizadas
- **Tipos Revelados**: Se muestran después de verificar

## 🎯 Navegación

- **Ruta**: `/type-matcher`
- **Botón Inicio**: Esquina superior izquierda (🏠)
- **Botón Reiniciar**: Esquina superior derecha (🔄)

## 🎨 Colores por Tipo

Cada tipo tiene su color oficial según la franquicia Pokémon:

| Tipo      | Color Hex | Ejemplo                    |
|-----------|-----------|----------------------------|
| Fire      | #F08030   | 🔥 Charmander             |
| Water     | #6890F0   | 💧 Squirtle               |
| Grass     | #78C850   | 🌿 Bulbasaur              |
| Electric  | #F8D030   | ⚡ Pikachu                |
| Psychic   | #F85888   | 🔮 Alakazam               |
| Dragon    | #7038F8   | 🐉 Dragonite              |

## 🔄 Funcionalidades Principales

### handleDragStart
Inicia el arrastre, guarda el tipo seleccionado

### handleDrop
Coloca el tipo en la zona de drop correspondiente

### handleRemoveType
Remueve un tipo ya colocado (solo antes de verificar)

### handleCheckAnswer
Valida si los tipos son correctos y muestra feedback

### handleNext
Carga el siguiente Pokémon

## 📱 Responsive

- **Desktop**: Grid de tipos 6-7 columnas
- **Tablet**: Grid de tipos 4-5 columnas
- **Móvil**: 
  - Zonas de drop en columna
  - Grid de tipos 3 columnas
  - Botones flotantes más pequeños

## 🏆 Mejoras Futuras

- [ ] Diferentes niveles de dificultad
- [ ] Modo contra reloj
- [ ] Pistas sobre tipos (fortalezas/debilidades)
- [ ] Selector de generaciones
- [ ] Tabla de mejores rachas
- [ ] Efectos de sonido
- [ ] Animación al arrastrar (ghost image personalizado)
- [ ] Touch events mejorados para móviles
- [ ] Modo multijugador
- [ ] Guardar progreso con Redux Persist
- [ ] Estadísticas detalladas por tipo

## 🎓 Aprendizaje

Este juego ayuda a:
- Memorizar los tipos de Pokémon
- Asociar Pokémon con sus tipos
- Aprender sobre tipeo dual
- Reconocer patrones visuales
