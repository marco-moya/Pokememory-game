import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { FaHome, FaRedo, FaTrophy } from 'react-icons/fa';
import axios from 'axios';
import Confetti from 'react-confetti';
import GameInfo from '../GameInfo/GameInfo';
import GameBoard from '../GameBoard/GameBoard';
import {
  incrementMoves,
  incrementTime,
  gameWon as gameWonAction,
  resetCurrentGame
} from '../../store/slices/memoryGameSlice';
import styles from './MemoryGame.module.css';

const MemoryGame = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Obtener estado de Redux
  const { moves, time, bestTime, bestMoves } = useSelector(
    (state) => state.memoryGame
  );
  
  // Estados locales (solo para la UI del juego actual)
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Formatear tiempo MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer del juego
  useEffect(() => {
    let interval;
    if (isPlaying && !gameWon) {
      interval = setInterval(() => {
        dispatch(incrementTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameWon, dispatch]);

  // Obtener Pokémon de la API
  const fetchPokemonCards = async () => {
    setIsLoading(true);
    try {
      const numberOfPairs = 6; // 6 pares = 12 cartas
      const pokemonPromises = [];
      const usedIds = new Set();

      // Obtener 6 Pokémon únicos
      while (pokemonPromises.length < numberOfPairs) {
        const randomId = Math.floor(Math.random() * 151) + 1;
        if (!usedIds.has(randomId)) {
          usedIds.add(randomId);
          pokemonPromises.push(
            axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
          );
        }
      }

      const responses = await Promise.all(pokemonPromises);
      
      // Crear pares de cartas
      const pokemonCards = responses.flatMap((response, index) => {
        const pokemon = {
          name: response.data.name,
          image: response.data.sprites.other['official-artwork'].front_default,
          pokemonId: response.data.id
        };
        
        // Crear dos cartas idénticas (un par)
        return [
          { ...pokemon, id: `${index}-a`, isFlipped: false, isMatched: false },
          { ...pokemon, id: `${index}-b`, isFlipped: false, isMatched: false }
        ];
      });

      // Mezclar las cartas
      const shuffledCards = pokemonCards.sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar Pokémon:', error);
      setIsLoading(false);
    }
  };

  // Manejar clic en carta
  const handleCardClick = useCallback((cardId) => {
    // No hacer nada si el juego está ganado o ya hay 2 cartas volteadas
    if (gameWon || flippedCards.length === 2) return;

    // No permitir voltear cartas ya emparejadas o la misma carta dos veces
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isMatched || flippedCards.includes(cardId)) return;

    // Iniciar el juego en el primer clic
    if (!isPlaying) {
      setIsPlaying(true);
    }

    // Voltear la carta
    setCards((prevCards) =>
      prevCards.map((c) =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Si se voltearon 2 cartas, verificar si son iguales
    if (newFlippedCards.length === 2) {
      dispatch(incrementMoves());
      checkForMatch(newFlippedCards);
    }
  }, [cards, flippedCards, isPlaying, gameWon, dispatch]);

  // Verificar si hay coincidencia
  const checkForMatch = (flippedIds) => {
    const [firstId, secondId] = flippedIds;
    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);

    if (firstCard.pokemonId === secondCard.pokemonId) {
      // ¡Coincidencia!
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          )
        );
        setMatchedCards((prev) => [...prev, firstId, secondId]);
        setFlippedCards([]);
      }, 500);
    } else {
      // No coinciden - voltear de nuevo después de un delay
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          )
        );
        setFlippedCards([]);
      }, 1000);
    }
  };

  // Verificar si el juego está ganado
  useEffect(() => {
    if (cards.length > 0 && matchedCards.length === cards.length) {
      setGameWon(true);
      setIsPlaying(false);
      dispatch(gameWonAction());
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [matchedCards, cards, dispatch]);

  // Reiniciar juego
  const handleRestart = () => {
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    dispatch(resetCurrentGame());
    setIsPlaying(false);
    setGameWon(false);
    setShowConfetti(false);
    fetchPokemonCards();
  };

  // Cargar cartas al montar el componente
  useEffect(() => {
    fetchPokemonCards();
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
          <p>Preparando el juego...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
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
        title="Reiniciar juego"
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
          transition={{ duration: 0.3 }}
        >
          Memoria Pokémon
        </motion.h1>

        {/* Información del juego */}
        <GameInfo time={formatTime(time)} moves={moves} />

        {/* Tablero de juego */}
        <GameBoard cards={cards} onCardClick={handleCardClick} />

        {/* Modal de victoria */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              className={styles.victoryModal}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.modalContent}>
                <FaTrophy className={styles.trophyIcon} />
                <h2 className={styles.victoryTitle}>¡Felicidades!</h2>
                <p className={styles.victoryText}>
                  Has completado el juego
                </p>
                <div className={styles.victoryStats}>
                  <div className={styles.victoryStat}>
                    <span className={styles.victoryLabel}>Tiempo</span>
                    <span className={styles.victoryValue}>{formatTime(time)}</span>
                    {bestTime && bestTime < time && (
                      <span className={styles.bestValue}>Mejor: {formatTime(bestTime)}</span>
                    )}
                  </div>
                  <div className={styles.victoryStat}>
                    <span className={styles.victoryLabel}>Movimientos</span>
                    <span className={styles.victoryValue}>{moves}</span>
                    {bestMoves && bestMoves < moves && (
                      <span className={styles.bestValue}>Mejor: {bestMoves}</span>
                    )}
                  </div>
                </div>
                <div className={styles.modalButtons}>
                  <button
                    className={styles.playAgainButton}
                    onClick={handleRestart}
                  >
                    Jugar de nuevo
                  </button>
                  <button
                    className={styles.homeModalButton}
                    onClick={() => navigate('/')}
                  >
                    Volver al inicio
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MemoryGame;
