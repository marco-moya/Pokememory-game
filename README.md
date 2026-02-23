# 🎮 PokéMemory Game

<div align="center">

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11.2-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-30.2.0-C21325?style=for-the-badge&logo=jest&logoColor=white)

**Una colección de minijuegos de Pokémon interactivos construidos con React**

[Características](#-características) •
[Instalación](#-instalación) •
[Uso](#-uso) •
[Estructura](#-estructura-del-proyecto) •
[Contribuir](#-contribuciones)

</div>

---

## 📖 Descripción del Proyecto

**PokéMemory Game** es una aplicación web interactiva que ofrece tres minijuegos temáticos de Pokémon. El proyecto utiliza la [PokeAPI](https://pokeapi.co/) para obtener datos reales de Pokémon de la primera generación (1-151), proporcionando una experiencia nostálgica y educativa para fans de todas las edades.

### 🎯 Minijuegos Disponibles

| Juego | Descripción |
|-------|-------------|
| 🧠 **Memory Game** | Juego clásico de memoria donde debes encontrar las parejas de Pokémon coincidentes |
| ❓ **¿Quién es ese Pokémon?** | Adivina el Pokémon por su silueta, estilo clásico del anime |
| 🎯 **Type Matcher** | Arrastra y suelta los tipos correctos para cada Pokémon mostrado |

---

## ✨ Características

- 🎨 **Animaciones fluidas** con Framer Motion
- 🎊 **Celebraciones con confetti** al ganar
- 💾 **Persistencia de datos** con Redux Persist
- 📱 **Diseño responsivo** para móviles y tablets
- ⚡ **Rendimiento optimizado** con Vite
- 🧪 **Tests unitarios** con Jest y Testing Library
- 🎮 **Drag & Drop** nativo de HTML5
- 🖼️ **Imágenes reales** de PokeAPI

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.2.0** - Biblioteca de UI
- **React Router 7** - Navegación SPA
- **Redux Toolkit** - Gestión de estado global
- **Redux Persist** - Persistencia del estado
- **Framer Motion** - Animaciones
- **React Confetti** - Efectos de celebración
- **React Icons** - Iconografía
- **Axios** - Cliente HTTP

### Desarrollo
- **Vite** - Build tool y dev server
- **ESLint** - Linting de código
- **Jest** - Framework de testing
- **Testing Library** - Utilidades de testing para React
- **CSS Modules** - Estilos encapsulados

---

## 📦 Instalación

### Prerrequisitos

- Node.js (v18 o superior recomendado)
- npm o yarn

### Pasos

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/pokememory-game.git
   cd pokememory-game
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre en tu navegador**
   ```
   http://localhost:5173
   ```

---

## 🚀 Uso

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta ESLint para verificar código |
| `npm run test` | Ejecuta todos los tests |
| `npm run test:watch` | Ejecuta tests en modo watch |
| `npm run test:coverage` | Genera reporte de cobertura de tests |

### Ejemplos de Uso

#### Juego de Memoria
1. Selecciona "Memory Game" en el menú principal
2. Voltea cartas haciendo clic en ellas
3. Encuentra las 6 parejas de Pokémon
4. ¡Completa el juego en el menor tiempo y movimientos posibles!

#### ¿Quién es ese Pokémon?
1. Selecciona "¿Quién es ese Pokémon?" en el menú
2. Observa la silueta del Pokémon
3. Elige entre las 4 opciones disponibles
4. ¡Mantén tu racha de aciertos lo más alta posible!

#### Type Matcher
1. Selecciona "Type Matcher" en el menú
2. Observa el Pokémon mostrado
3. Arrastra los tipos correctos a las zonas de drop
4. ¡Adivina todos los tipos para ganar puntos!

---

## 📁 Estructura del Proyecto

```
pokememory-game/
├── public/                    # Archivos estáticos
├── src/
│   ├── assets/               # Fuentes y recursos
│   │   └── fonts/           # Tipografías personalizadas
│   ├── components/           # Componentes React
│   │   ├── Card/            # Carta del juego de memoria
│   │   ├── GameBoard/       # Tablero de juego
│   │   ├── GameInfo/        # Información del juego (tiempo, movimientos)
│   │   ├── GameOptions/     # Menú de selección de juegos
│   │   ├── Header/          # Cabecera de la aplicación
│   │   ├── MemoryGame/      # Juego de memoria completo
│   │   ├── TypeMatcher/     # Juego de tipos
│   │   └── WhosThatPokemon/ # Juego de siluetas
│   ├── store/               # Configuración de Redux
│   │   └── slices/          # Redux slices por juego
│   ├── styles/              # Estilos globales y variables CSS
│   ├── App.jsx              # Componente raíz y rutas
│   ├── main.jsx             # Punto de entrada
│   └── test-utils.jsx       # Utilidades para testing
├── __mocks__/               # Mocks para tests
├── coverage/                # Reportes de cobertura
├── jest.config.js           # Configuración de Jest
├── vite.config.js           # Configuración de Vite
└── package.json
```

---

## 🧪 Testing

El proyecto incluye tests unitarios para todos los componentes y slices de Redux.

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar en modo watch
npm run test:watch

# Ver cobertura de código
npm run test:coverage
```

### Cobertura de Tests

Los tests cubren:
- ✅ Componentes de UI
- ✅ Lógica de juegos
- ✅ Redux slices y acciones
- ✅ Interacciones de usuario

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas contribuir al proyecto:

1. **Fork** el repositorio
2. **Crea una rama** para tu feature
   ```bash
   git checkout -b feature/nueva-caracteristica
   ```
3. **Realiza tus cambios** y commitea
   ```bash
   git commit -m "feat: añade nueva característica"
   ```
4. **Push** a tu rama
   ```bash
   git push origin feature/nueva-caracteristica
   ```
5. **Abre un Pull Request**

### Guías de Contribución

- Sigue el estilo de código existente
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación si es necesario
- Usa commits semánticos (feat, fix, docs, style, refactor, test)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- [PokeAPI](https://pokeapi.co/) por proporcionar los datos de Pokémon
- [Nintendo/Game Freak](https://www.pokemon.com/) por crear Pokémon
- La comunidad de React y contributors de las librerías utilizadas

---

<div align="center">

**⭐ Si te gusta el proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ y React

</div>

