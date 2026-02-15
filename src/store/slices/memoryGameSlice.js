import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  moves: 0,
  time: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  bestTime: null, // menor tiempo en segundos
  bestMoves: null, // menor número de movimientos
  averageMoves: 0,
  averageTime: 0,
  history: []
};

const memoryGameSlice = createSlice({
  name: 'memoryGame',
  initialState,
  reducers: {
    // Incrementar movimientos
    incrementMoves: (state) => {
      state.moves += 1;
    },
    
    // Actualizar tiempo
    setTime: (state, action) => {
      state.time = action.payload;
    },
    
    // Incrementar tiempo en 1 segundo
    incrementTime: (state) => {
      state.time += 1;
    },
    
    // Cuando gana el juego
    gameWon: (state) => {
      state.gamesWon += 1;
      state.gamesPlayed += 1;
      
      // Actualizar mejor tiempo
      if (state.bestTime === null || state.time < state.bestTime) {
        state.bestTime = state.time;
      }
      
      // Actualizar mejores movimientos
      if (state.bestMoves === null || state.moves < state.bestMoves) {
        state.bestMoves = state.moves;
      }
      
      // Calcular promedios
      state.averageTime = Math.round(
        (state.averageTime * (state.gamesWon - 1) + state.time) / state.gamesWon
      );
      state.averageMoves = Math.round(
        (state.averageMoves * (state.gamesWon - 1) + state.moves) / state.gamesWon
      );
      
      // Agregar al historial
      state.history.unshift({
        moves: state.moves,
        time: state.time,
        timestamp: Date.now()
      });
      
      // Mantener solo los últimos 20 resultados
      if (state.history.length > 20) {
        state.history.pop();
      }
    },
    
    // Reiniciar partida actual (moves y time)
    resetCurrentGame: (state) => {
      state.moves = 0;
      state.time = 0;
    },
    
    // Reiniciar estadísticas
    resetStats: (state) => {
      state.gamesPlayed = 0;
      state.gamesWon = 0;
      state.bestTime = null;
      state.bestMoves = null;
      state.averageMoves = 0;
      state.averageTime = 0;
      state.history = [];
    },
    
    // Reiniciar todo
    resetAll: () => initialState
  }
});

export const {
  incrementMoves,
  setTime,
  incrementTime,
  gameWon,
  resetCurrentGame,
  resetStats,
  resetAll
} = memoryGameSlice.actions;

export default memoryGameSlice.reducer;
