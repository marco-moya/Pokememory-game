import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  score: 0,
  attempts: 0,
  bestScore: 0,
  accuracy: 0, // Porcentaje de aciertos
  typeStats: {}, // Estadísticas por tipo
  history: []
};

const typeMatcherSlice = createSlice({
  name: 'typeMatcher',
  initialState,
  reducers: {
    // Incrementar score cuando acierta
    incrementScore: (state) => {
      state.score += 1;
      if (state.score > state.bestScore) {
        state.bestScore = state.score;
      }
      // Calcular accuracy
      state.accuracy = state.attempts > 0 
        ? Math.round((state.score / state.attempts) * 100) 
        : 0;
    },
    
    // Incrementar intentos
    incrementAttempts: (state) => {
      state.attempts += 1;
      // Recalcular accuracy
      state.accuracy = Math.round((state.score / state.attempts) * 100);
    },
    
    // Actualizar estadísticas de tipos
    updateTypeStats: (state, action) => {
      const { types, isCorrect } = action.payload;
      
      types.forEach(type => {
        if (!state.typeStats[type]) {
          state.typeStats[type] = {
            attempts: 0,
            correct: 0,
            accuracy: 0
          };
        }
        
        state.typeStats[type].attempts += 1;
        if (isCorrect) {
          state.typeStats[type].correct += 1;
        }
        
        state.typeStats[type].accuracy = Math.round(
          (state.typeStats[type].correct / state.typeStats[type].attempts) * 100
        );
      });
    },
    
    // Agregar resultado al historial
    addToHistory: (state, action) => {
      state.history.unshift({
        pokemonName: action.payload.pokemonName,
        types: action.payload.types,
        guessedTypes: action.payload.guessedTypes,
        isCorrect: action.payload.isCorrect,
        timestamp: action.payload.timestamp
      });
      
      // Mantener solo los últimos 20 resultados
      if (state.history.length > 20) {
        state.history.pop();
      }
    },
    
    // Reiniciar juego (score y attempts)
    resetGame: (state) => {
      state.score = 0;
      state.attempts = 0;
      state.accuracy = 0;
      // Mantener bestScore, typeStats y history
    },
    
    // Reiniciar estadísticas completas
    resetStats: (state) => {
      state.bestScore = 0;
      state.typeStats = {};
      state.history = [];
    },
    
    // Reiniciar todo
    resetAll: () => initialState
  }
});

export const {
  incrementScore,
  incrementAttempts,
  updateTypeStats,
  addToHistory,
  resetGame,
  resetStats,
  resetAll
} = typeMatcherSlice.actions;

export default typeMatcherSlice.reducer;
