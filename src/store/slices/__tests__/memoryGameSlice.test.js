import memoryGameReducer, {
  incrementMoves,
  setTime,
  incrementTime,
  gameWon,
  resetCurrentGame,
  resetStats,
  resetAll
} from '../memoryGameSlice';

describe('memoryGameSlice', () => {
  const initialState = {
    moves: 0,
    time: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    bestTime: null,
    bestMoves: null,
    averageMoves: 0,
    averageTime: 0,
    history: []
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(memoryGameReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('incrementMoves', () => {
    it('should increment moves by 1', () => {
      const state = memoryGameReducer(initialState, incrementMoves());
      expect(state.moves).toBe(1);
    });

    it('should increment moves from existing value', () => {
      const stateWithMoves = { ...initialState, moves: 5 };
      const state = memoryGameReducer(stateWithMoves, incrementMoves());
      expect(state.moves).toBe(6);
    });
  });

  describe('setTime', () => {
    it('should set time to provided value', () => {
      const state = memoryGameReducer(initialState, setTime(120));
      expect(state.time).toBe(120);
    });
  });

  describe('incrementTime', () => {
    it('should increment time by 1', () => {
      const state = memoryGameReducer(initialState, incrementTime());
      expect(state.time).toBe(1);
    });

    it('should increment time from existing value', () => {
      const stateWithTime = { ...initialState, time: 30 };
      const state = memoryGameReducer(stateWithTime, incrementTime());
      expect(state.time).toBe(31);
    });
  });

  describe('gameWon', () => {
    it('should increment gamesWon and gamesPlayed', () => {
      const stateWithGame = { ...initialState, moves: 10, time: 60 };
      const state = memoryGameReducer(stateWithGame, gameWon());
      
      expect(state.gamesWon).toBe(1);
      expect(state.gamesPlayed).toBe(1);
    });

    it('should set bestTime when it is first win', () => {
      const stateWithGame = { ...initialState, moves: 10, time: 60 };
      const state = memoryGameReducer(stateWithGame, gameWon());
      
      expect(state.bestTime).toBe(60);
    });

    it('should set bestMoves when it is first win', () => {
      const stateWithGame = { ...initialState, moves: 10, time: 60 };
      const state = memoryGameReducer(stateWithGame, gameWon());
      
      expect(state.bestMoves).toBe(10);
    });

    it('should update bestTime if new time is better', () => {
      const stateWithRecord = { 
        ...initialState, 
        moves: 10, 
        time: 45,
        bestTime: 60,
        bestMoves: 12,
        gamesWon: 1
      };
      const state = memoryGameReducer(stateWithRecord, gameWon());
      
      expect(state.bestTime).toBe(45);
    });

    it('should not update bestTime if new time is worse', () => {
      const stateWithRecord = { 
        ...initialState, 
        moves: 10, 
        time: 90,
        bestTime: 60,
        bestMoves: 12,
        gamesWon: 1
      };
      const state = memoryGameReducer(stateWithRecord, gameWon());
      
      expect(state.bestTime).toBe(60);
    });

    it('should update bestMoves if new moves is better', () => {
      const stateWithRecord = { 
        ...initialState, 
        moves: 8, 
        time: 60,
        bestTime: 60,
        bestMoves: 12,
        gamesWon: 1
      };
      const state = memoryGameReducer(stateWithRecord, gameWon());
      
      expect(state.bestMoves).toBe(8);
    });

    it('should add entry to history', () => {
      const stateWithGame = { ...initialState, moves: 10, time: 60 };
      const state = memoryGameReducer(stateWithGame, gameWon());
      
      expect(state.history).toHaveLength(1);
      expect(state.history[0].moves).toBe(10);
      expect(state.history[0].time).toBe(60);
      expect(state.history[0].timestamp).toBeDefined();
    });

    it('should keep only last 20 entries in history', () => {
      let state = { ...initialState, moves: 10, time: 60 };
      
      // Simulate 25 game wins
      for (let i = 0; i < 25; i++) {
        state = memoryGameReducer(state, gameWon());
        state = { ...state, moves: 10, time: 60 }; // Reset for next game
      }
      
      expect(state.history.length).toBeLessThanOrEqual(20);
    });
  });

  describe('resetCurrentGame', () => {
    it('should reset moves and time to 0', () => {
      const stateWithProgress = { 
        ...initialState, 
        moves: 15, 
        time: 120,
        gamesWon: 5,
        bestTime: 60 
      };
      const state = memoryGameReducer(stateWithProgress, resetCurrentGame());
      
      expect(state.moves).toBe(0);
      expect(state.time).toBe(0);
      // Should preserve other stats
      expect(state.gamesWon).toBe(5);
      expect(state.bestTime).toBe(60);
    });
  });

  describe('resetStats', () => {
    it('should reset all statistics but not current game', () => {
      const stateWithStats = { 
        ...initialState, 
        moves: 5,
        time: 30,
        gamesPlayed: 10,
        gamesWon: 8,
        bestTime: 45,
        bestMoves: 10,
        averageMoves: 12,
        averageTime: 60,
        history: [{ moves: 10, time: 60, timestamp: Date.now() }]
      };
      const state = memoryGameReducer(stateWithStats, resetStats());
      
      expect(state.gamesPlayed).toBe(0);
      expect(state.gamesWon).toBe(0);
      expect(state.bestTime).toBeNull();
      expect(state.bestMoves).toBeNull();
      expect(state.averageMoves).toBe(0);
      expect(state.averageTime).toBe(0);
      expect(state.history).toEqual([]);
    });
  });

  describe('resetAll', () => {
    it('should reset everything to initial state', () => {
      const complexState = { 
        moves: 15,
        time: 120,
        gamesPlayed: 10,
        gamesWon: 8,
        bestTime: 45,
        bestMoves: 10,
        averageMoves: 12,
        averageTime: 60,
        history: [{ moves: 10, time: 60, timestamp: Date.now() }]
      };
      const state = memoryGameReducer(complexState, resetAll());
      
      expect(state).toEqual(initialState);
    });
  });
});
