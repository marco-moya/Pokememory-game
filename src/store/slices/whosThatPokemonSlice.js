import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  score: 0,
  totalPlayed: 0,
  streak: 0,
  bestStreak: 0,
  history: []
};

const whosThatPokemonSlice = createSlice({
  name: 'whosThatPokemon',
  initialState,
  reducers: {
    // Incrementar score cuando acierta
    incrementScore: (state) => {
      state.score += 1;
      state.streak += 1;
      if (state.streak > state.bestStreak) {
        state.bestStreak = state.streak;
      }
    },
    
    // Resetear racha cuando falla
    resetStreak: (state) => {
      state.streak = 0;
    },
    
    // Incrementar total jugado
    incrementTotalPlayed: (state) => {
      state.totalPlayed += 1;
    },
    
    // Agregar resultado al historial
    addToHistory: (state, action) => {
      state.history.unshift({
        pokemonName: action.payload.pokemonName,
        isCorrect: action.payload.isCorrect,
        timestamp: action.payload.timestamp
      });
      // Mantener solo los últimos 20 resultados
      if (state.history.length > 20) {
        state.history.pop();
      }
    },
    
    // Reiniciar juego (score, streak, totalPlayed)
    resetGame: (state) => {
      state.score = 0;
      state.totalPlayed = 0;
      state.streak = 0;
      // Mantener bestStreak y history
    },
    
    // Reiniciar todo incluyendo records
    resetAll: () => initialState
  }
});

export const {
  incrementScore,
  resetStreak,
  incrementTotalPlayed,
  addToHistory,
  resetGame,
  resetAll
} = whosThatPokemonSlice.actions;

export default whosThatPokemonSlice.reducer;
