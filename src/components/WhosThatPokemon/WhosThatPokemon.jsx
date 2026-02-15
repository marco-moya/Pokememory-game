import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { FaHome } from 'react-icons/fa';
import axios from 'axios';
import {
  incrementScore,
  resetStreak,
  incrementTotalPlayed,
  addToHistory,
  resetGame
} from '../../store/slices/whosThatPokemonSlice';
import styles from './WhosThatPokemon.module.css';

const WhosThatPokemon = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Obtener estado de Redux
  const { score, totalPlayed, streak, bestStreak } = useSelector(
    (state) => state.whosThatPokemon
  );
  
  // Estados locales (solo para la UI del juego actual)
  const [pokemon, setPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  // Obtener un Pokémon aleatorio
  const fetchRandomPokemon = async () => {
    setIsLoading(true);
    setIsRevealed(false);
    setSelectedOption(null);
    setShowFeedback(false);

    try {
      // Generar un ID aleatorio entre 1 y 151 (primera generación)
      const randomId = Math.floor(Math.random() * 151) + 1;
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      
      const correctPokemon = {
        id: response.data.id,
        name: response.data.name,
        sprite: response.data.sprites.other['official-artwork'].front_default,
        types: response.data.types.map(t => t.type.name)
      };

      setPokemon(correctPokemon);

      // Generar opciones incorrectas
      const wrongOptions = await generateWrongOptions(randomId);
      
      // Mezclar las opciones
      const allOptions = [
        { name: correctPokemon.name, isCorrect: true },
        ...wrongOptions
      ].sort(() => Math.random() - 0.5);
      
      setOptions(allOptions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar el Pokémon:', error);
      setIsLoading(false);
    }
  };

  // Generar 3 opciones incorrectas
  const generateWrongOptions = async (correctId) => {
    const wrongOptions = [];
    const usedIds = new Set([correctId]);

    while (wrongOptions.length < 3) {
      const randomId = Math.floor(Math.random() * 151) + 1;
      
      if (!usedIds.has(randomId)) {
        usedIds.add(randomId);
        try {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
          wrongOptions.push({
            name: response.data.name,
            isCorrect: false
          });
        } catch (error) {
          console.error('Error al cargar opciones:', error);
        }
      }
    }

    return wrongOptions;
  };

  // Manejar la selección de una opción
  const handleOptionSelect = (option) => {
    if (selectedOption || isRevealed) return;

    setSelectedOption(option);
    setIsRevealed(true);
    setShowFeedback(true);
    
    // Actualizar Redux
    dispatch(incrementTotalPlayed());

    if (option.isCorrect) {
      dispatch(incrementScore());
      dispatch(addToHistory({
        pokemonName: pokemon.name,
        isCorrect: true,
        timestamp: Date.now()
      }));
    } else {
      dispatch(resetStreak());
      dispatch(addToHistory({
        pokemonName: pokemon.name,
        isCorrect: false,
        timestamp: Date.now()
      }));
    }
  };

  // Siguiente Pokémon
  const handleNextPokemon = () => {
    fetchRandomPokemon();
  };

  // Reiniciar juego
  const handleRestart = () => {
    dispatch(resetGame());
    fetchRandomPokemon();
  };

  // Cargar el primer Pokémon al montar el componente
  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  // Capitalizar nombre
  const capitalizeName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

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
      {/* Botón flotante de regreso */}
      <motion.button
        className={styles.homeButton}
        onClick={() => navigate('/')}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Volver al inicio"
        title="Volver al inicio"
      >
        <FaHome />
      </motion.button>

      <motion.div
        className={styles.gameWrapper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header con estadísticas */}
        <div className={styles.header}>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Puntuación</span>
              <span className={styles.statValue}>{score}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Racha</span>
              <span className={styles.statValue}>🔥 {streak}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Mejor Racha</span>
              <span className={styles.statValue}>⭐ {bestStreak}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total</span>
              <span className={styles.statValue}>{totalPlayed}</span>
            </div>
          </div>
          <button className={styles.restartButton} onClick={handleRestart}>
            🔄 Reiniciar
          </button>
        </div>

        {/* Título del juego */}
        <motion.h1
          className={styles.title}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          ¿Quién es ese Pokémon?
        </motion.h1>

        {/* Imagen del Pokémon */}
        <motion.div
          className={styles.pokemonDisplay}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {pokemon && (
              <motion.img
                key={pokemon.id}
                src={pokemon.sprite}
                alt="Pokemon"
                className={`${styles.pokemonImage} ${!isRevealed ? styles.silhouette : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Círculo decorativo de fondo */}
          <div className={styles.pokemonCircle}></div>
        </motion.div>

        {/* Feedback de respuesta */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              className={`${styles.feedback} ${selectedOption?.isCorrect ? styles.correct : styles.incorrect}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {selectedOption?.isCorrect ? '¡Correcto! 🎉' : '¡Incorrecto! 😢'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Opciones de respuesta */}
        <div className={styles.optionsGrid}>
          {options.map((option, index) => {
            const isSelected = selectedOption?.name === option.name;
            const shouldShowCorrect = isRevealed && option.isCorrect;
            const shouldShowIncorrect = isRevealed && isSelected && !option.isCorrect;

            return (
              <motion.button
                key={option.name}
                className={`${styles.optionButton} 
                  ${shouldShowCorrect ? styles.correctOption : ''} 
                  ${shouldShowIncorrect ? styles.incorrectOption : ''}`}
                onClick={() => handleOptionSelect(option)}
                disabled={selectedOption !== null}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={!selectedOption ? { scale: 1.05 } : {}}
                whileTap={!selectedOption ? { scale: 0.95 } : {}}
              >
                {capitalizeName(option.name)}
                {shouldShowCorrect && ' ✓'}
                {shouldShowIncorrect && ' ✗'}
              </motion.button>
            );
          })}
        </div>

        {/* Botón siguiente */}
        <AnimatePresence>
          {isRevealed && (
            <motion.button
              className={styles.nextButton}
              onClick={handleNextPokemon}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Siguiente Pokémon →
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default WhosThatPokemon;
