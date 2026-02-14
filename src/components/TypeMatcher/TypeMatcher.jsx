import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { FaHome, FaRedo, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import Confetti from 'react-confetti';
import styles from './TypeMatcher.module.css';

// Todos los tipos de Pokémon con sus colores
const POKEMON_TYPES = [
  { name: 'normal', color: '#A8A878', textColor: '#000' },
  { name: 'fire', color: '#F08030', textColor: '#fff' },
  { name: 'water', color: '#6890F0', textColor: '#fff' },
  { name: 'electric', color: '#F8D030', textColor: '#000' },
  { name: 'grass', color: '#78C850', textColor: '#000' },
  { name: 'ice', color: '#98D8D8', textColor: '#000' },
  { name: 'fighting', color: '#C03028', textColor: '#fff' },
  { name: 'poison', color: '#A040A0', textColor: '#fff' },
  { name: 'ground', color: '#E0C068', textColor: '#000' },
  { name: 'flying', color: '#A890F0', textColor: '#000' },
  { name: 'psychic', color: '#F85888', textColor: '#fff' },
  { name: 'bug', color: '#A8B820', textColor: '#000' },
  { name: 'rock', color: '#B8A038', textColor: '#fff' },
  { name: 'ghost', color: '#705898', textColor: '#fff' },
  { name: 'dragon', color: '#7038F8', textColor: '#fff' },
  { name: 'dark', color: '#705848', textColor: '#fff' },
  { name: 'steel', color: '#B8B8D0', textColor: '#000' },
  { name: 'fairy', color: '#EE99AC', textColor: '#000' }
];

const TypeMatcher = () => {
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [droppedTypes, setDroppedTypes] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedType, setDraggedType] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Obtener Pokémon aleatorio
  const fetchRandomPokemon = async () => {
    setIsLoading(true);
    setIsRevealed(false);
    setDroppedTypes([]);
    setFeedback(null);

    try {
      const randomId = Math.floor(Math.random() * 151) + 1;
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      
      const pokemonData = {
        id: response.data.id,
        name: response.data.name,
        sprite: response.data.sprites.other['official-artwork'].front_default,
        types: response.data.types.map(t => t.type.name)
      };

      setPokemon(pokemonData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar Pokémon:', error);
      setIsLoading(false);
    }
  };

  // Manejar inicio de drag
  const handleDragStart = (e, typeName) => {
    setDraggedType(typeName);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Manejar drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Manejar drop
  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    
    if (!draggedType || isRevealed) return;

    // No permitir más tipos de los que tiene el Pokémon
    if (droppedTypes.length >= pokemon.types.length && !droppedTypes[slotIndex]) {
      return;
    }

    // Crear nueva lista con el tipo en el slot correspondiente
    const newDroppedTypes = [...droppedTypes];
    newDroppedTypes[slotIndex] = draggedType;
    setDroppedTypes(newDroppedTypes);
    setDraggedType(null);
  };

  // Remover tipo droppado
  const handleRemoveType = (index) => {
    if (isRevealed) return;
    const newDroppedTypes = [...droppedTypes];
    newDroppedTypes[index] = null;
    setDroppedTypes(newDroppedTypes.filter(t => t !== null));
  };

  // Verificar respuesta
  const handleCheckAnswer = () => {
    if (droppedTypes.filter(t => t).length !== pokemon.types.length) {
      setFeedback({ type: 'warning', message: '¡Completa todos los tipos!' });
      return;
    }

    setIsRevealed(true);
    setAttempts(prev => prev + 1);

    // Verificar si todos los tipos son correctos (sin importar el orden)
    const correctTypes = pokemon.types.every(type => 
      droppedTypes.includes(type)
    );

    if (correctTypes && droppedTypes.length === pokemon.types.length) {
      setScore(prev => prev + 1);
      setFeedback({ type: 'success', message: '¡Correcto! 🎉' });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setFeedback({ type: 'error', message: '¡Incorrecto! Intenta de nuevo' });
    }
  };

  // Siguiente Pokémon
  const handleNext = () => {
    fetchRandomPokemon();
  };

  // Reiniciar juego
  const handleRestart = () => {
    setScore(0);
    setAttempts(0);
    fetchRandomPokemon();
  };

  // Capitalizar nombre
  const capitalizeName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Obtener objeto de tipo completo
  const getTypeObject = (typeName) => {
    return POKEMON_TYPES.find(t => t.name === typeName);
  };

  // Cargar primer Pokémon
  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <motion.div
            className={styles.pokeball}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            🔴
          </motion.div>
          <p>Cargando Pokémon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      {/* Botón flotante de inicio */}
      <motion.button
        className={styles.homeButton}
        onClick={() => navigate('/')}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Volver al inicio"
      >
        <FaHome />
      </motion.button>

      {/* Botón de reinicio */}
      <motion.button
        className={styles.restartButton}
        onClick={handleRestart}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Reiniciar juego"
      >
        <FaRedo />
      </motion.button>

      <motion.div
        className={styles.gameWrapper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Título */}
        <motion.h1
          className={styles.title}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          Type Matcher
        </motion.h1>

        {/* Estadísticas */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Aciertos</span>
            <span className={styles.statValue}>{score}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Intentos</span>
            <span className={styles.statValue}>{attempts}</span>
          </div>
        </div>

        {/* Pokémon Display */}
        <div className={styles.pokemonSection}>
          <motion.div
            className={styles.pokemonDisplay}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className={styles.pokemonImage}
            />
            <h2 className={styles.pokemonName}>
              {capitalizeName(pokemon.name)}
            </h2>
          </motion.div>

          {/* Instrucciones */}
          <p className={styles.instructions}>
            Arrastra los tipos correctos a las zonas de abajo
          </p>

          {/* Zonas de Drop */}
          <div className={styles.dropZones}>
            {[...Array(pokemon.types.length)].map((_, index) => (
              <motion.div
                key={index}
                className={`${styles.dropZone} ${
                  droppedTypes[index] ? styles.filled : ''
                } ${isRevealed && pokemon.types.includes(droppedTypes[index]) ? styles.correct : ''} ${isRevealed && !pokemon.types.includes(droppedTypes[index]) && droppedTypes[index] ? styles.incorrect : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {droppedTypes[index] ? (
                  <div
                    className={styles.droppedType}
                    style={{
                      backgroundColor: getTypeObject(droppedTypes[index])?.color,
                      color: getTypeObject(droppedTypes[index])?.textColor
                    }}
                    onClick={() => handleRemoveType(index)}
                  >
                    {capitalizeName(droppedTypes[index])}
                    {!isRevealed && <FaTimes className={styles.removeIcon} />}
                    {isRevealed && pokemon.types.includes(droppedTypes[index]) && (
                      <FaCheck className={styles.checkIcon} />
                    )}
                  </div>
                ) : (
                  <span className={styles.dropPlaceholder}>
                    Tipo {index + 1}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                className={`${styles.feedback} ${styles[feedback.type]}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botones de acción */}
          <div className={styles.actionButtons}>
            {!isRevealed ? (
              <motion.button
                className={styles.checkButton}
                onClick={handleCheckAnswer}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Verificar
              </motion.button>
            ) : (
              <motion.button
                className={styles.nextButton}
                onClick={handleNext}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Siguiente Pokémon →
              </motion.button>
            )}
          </div>

          {/* Tipos correctos revelados */}
          {isRevealed && (
            <motion.div
              className={styles.correctTypes}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className={styles.correctLabel}>Tipos correctos:</p>
              <div className={styles.typesList}>
                {pokemon.types.map((type, index) => {
                  const typeObj = getTypeObject(type);
                  return (
                    <div
                      key={index}
                      className={styles.typeChip}
                      style={{
                        backgroundColor: typeObj.color,
                        color: typeObj.textColor
                      }}
                    >
                      {capitalizeName(type)}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Panel de tipos disponibles */}
        <div className={styles.typesPanel}>
          <h3 className={styles.typesPanelTitle}>Tipos Disponibles</h3>
          <div className={styles.typesGrid}>
            {POKEMON_TYPES.map((type) => (
              <motion.div
                key={type.name}
                className={styles.typeCard}
                style={{
                  backgroundColor: type.color,
                  color: type.textColor
                }}
                draggable={!isRevealed}
                onDragStart={(e) => handleDragStart(e, type.name)}
                whileHover={!isRevealed ? { scale: 1.05, cursor: 'grab' } : {}}
                whileTap={!isRevealed ? { scale: 0.95, cursor: 'grabbing' } : {}}
              >
                {capitalizeName(type.name)}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TypeMatcher;
