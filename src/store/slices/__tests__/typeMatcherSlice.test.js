import typeMatcherReducer, {
  incrementScore,
  incrementAttempts,
  updateTypeStats,
  addToHistory,
  resetGame,
  resetStats,
  resetAll
} from '../typeMatcherSlice';

describe('typeMatcherSlice', () => {
  const initialState = {
    score: 0,
    attempts: 0,
    bestScore: 0,
    accuracy: 0,
    typeStats: {},
    history: []
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(typeMatcherReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('incrementScore', () => {
    it('should increment score by 1', () => {
      const stateWithAttempts = { ...initialState, attempts: 1 };
      const state = typeMatcherReducer(stateWithAttempts, incrementScore());
      expect(state.score).toBe(1);
    });

    it('should update bestScore if new score is higher', () => {
      const stateWithScore = { ...initialState, score: 4, bestScore: 4, attempts: 5 };
      const state = typeMatcherReducer(stateWithScore, incrementScore());
      
      expect(state.score).toBe(5);
      expect(state.bestScore).toBe(5);
    });

    it('should not update bestScore if current best is higher', () => {
      const stateWithScore = { ...initialState, score: 3, bestScore: 10, attempts: 4 };
      const state = typeMatcherReducer(stateWithScore, incrementScore());
      
      expect(state.score).toBe(4);
      expect(state.bestScore).toBe(10);
    });

    it('should calculate accuracy correctly', () => {
      const stateWithAttempts = { ...initialState, score: 2, attempts: 4 };
      const state = typeMatcherReducer(stateWithAttempts, incrementScore());
      
      // (3/4) * 100 = 75%
      expect(state.accuracy).toBe(75);
    });
  });

  describe('incrementAttempts', () => {
    it('should increment attempts by 1', () => {
      const state = typeMatcherReducer(initialState, incrementAttempts());
      expect(state.attempts).toBe(1);
    });

    it('should recalculate accuracy', () => {
      const stateWithScore = { ...initialState, score: 1, attempts: 1 };
      const state = typeMatcherReducer(stateWithScore, incrementAttempts());
      
      // (1/2) * 100 = 50%
      expect(state.accuracy).toBe(50);
    });
  });

  describe('updateTypeStats', () => {
    it('should create stats for new type', () => {
      const state = typeMatcherReducer(
        initialState, 
        updateTypeStats({ types: ['fire'], isCorrect: true })
      );
      
      expect(state.typeStats.fire).toBeDefined();
      expect(state.typeStats.fire.attempts).toBe(1);
      expect(state.typeStats.fire.correct).toBe(1);
      expect(state.typeStats.fire.accuracy).toBe(100);
    });

    it('should update existing type stats on correct answer', () => {
      const stateWithStats = {
        ...initialState,
        typeStats: {
          fire: { attempts: 2, correct: 1, accuracy: 50 }
        }
      };
      const state = typeMatcherReducer(
        stateWithStats, 
        updateTypeStats({ types: ['fire'], isCorrect: true })
      );
      
      expect(state.typeStats.fire.attempts).toBe(3);
      expect(state.typeStats.fire.correct).toBe(2);
      expect(state.typeStats.fire.accuracy).toBe(67); // Math.round(2/3 * 100)
    });

    it('should update existing type stats on incorrect answer', () => {
      const stateWithStats = {
        ...initialState,
        typeStats: {
          water: { attempts: 3, correct: 2, accuracy: 67 }
        }
      };
      const state = typeMatcherReducer(
        stateWithStats, 
        updateTypeStats({ types: ['water'], isCorrect: false })
      );
      
      expect(state.typeStats.water.attempts).toBe(4);
      expect(state.typeStats.water.correct).toBe(2);
      expect(state.typeStats.water.accuracy).toBe(50);
    });

    it('should handle multiple types at once', () => {
      const state = typeMatcherReducer(
        initialState, 
        updateTypeStats({ types: ['fire', 'flying'], isCorrect: true })
      );
      
      expect(state.typeStats.fire).toBeDefined();
      expect(state.typeStats.flying).toBeDefined();
      expect(state.typeStats.fire.correct).toBe(1);
      expect(state.typeStats.flying.correct).toBe(1);
    });
  });

  describe('addToHistory', () => {
    it('should add entry to history', () => {
      const entry = {
        pokemonName: 'charizard',
        types: ['fire', 'flying'],
        guessedTypes: ['fire', 'flying'],
        isCorrect: true,
        timestamp: Date.now()
      };
      
      const state = typeMatcherReducer(initialState, addToHistory(entry));
      
      expect(state.history).toHaveLength(1);
      expect(state.history[0].pokemonName).toBe('charizard');
      expect(state.history[0].isCorrect).toBe(true);
    });

    it('should add new entries at the beginning', () => {
      const firstEntry = {
        pokemonName: 'pikachu',
        types: ['electric'],
        guessedTypes: ['electric'],
        isCorrect: true,
        timestamp: Date.now()
      };
      
      let state = typeMatcherReducer(initialState, addToHistory(firstEntry));
      
      const secondEntry = {
        pokemonName: 'bulbasaur',
        types: ['grass', 'poison'],
        guessedTypes: ['grass'],
        isCorrect: false,
        timestamp: Date.now() + 1000
      };
      
      state = typeMatcherReducer(state, addToHistory(secondEntry));
      
      expect(state.history[0].pokemonName).toBe('bulbasaur');
      expect(state.history[1].pokemonName).toBe('pikachu');
    });

    it('should keep only last 20 entries', () => {
      let state = { ...initialState };
      
      for (let i = 0; i < 25; i++) {
        state = typeMatcherReducer(state, addToHistory({
          pokemonName: `pokemon${i}`,
          types: ['normal'],
          guessedTypes: ['normal'],
          isCorrect: true,
          timestamp: Date.now() + i
        }));
      }
      
      expect(state.history.length).toBeLessThanOrEqual(20);
    });
  });

  describe('resetGame', () => {
    it('should reset score, attempts and accuracy', () => {
      const stateWithProgress = {
        ...initialState,
        score: 5,
        attempts: 10,
        accuracy: 50,
        bestScore: 8,
        typeStats: { fire: { attempts: 5, correct: 3, accuracy: 60 } },
        history: [{ pokemonName: 'test', isCorrect: true }]
      };
      
      const state = typeMatcherReducer(stateWithProgress, resetGame());
      
      expect(state.score).toBe(0);
      expect(state.attempts).toBe(0);
      expect(state.accuracy).toBe(0);
      // Should preserve bestScore, typeStats, and history
      expect(state.bestScore).toBe(8);
      expect(state.typeStats.fire).toBeDefined();
      expect(state.history).toHaveLength(1);
    });
  });

  describe('resetStats', () => {
    it('should reset bestScore, typeStats and history', () => {
      const stateWithStats = {
        ...initialState,
        score: 5,
        attempts: 10,
        bestScore: 15,
        typeStats: { fire: { attempts: 5, correct: 3, accuracy: 60 } },
        history: [{ pokemonName: 'test', isCorrect: true }]
      };
      
      const state = typeMatcherReducer(stateWithStats, resetStats());
      
      expect(state.bestScore).toBe(0);
      expect(state.typeStats).toEqual({});
      expect(state.history).toEqual([]);
    });
  });

  describe('resetAll', () => {
    it('should reset everything to initial state', () => {
      const complexState = {
        score: 10,
        attempts: 20,
        bestScore: 15,
        accuracy: 50,
        typeStats: { fire: { attempts: 5, correct: 3, accuracy: 60 } },
        history: [{ pokemonName: 'test', isCorrect: true }]
      };
      
      const state = typeMatcherReducer(complexState, resetAll());
      
      expect(state).toEqual(initialState);
    });
  });
});
