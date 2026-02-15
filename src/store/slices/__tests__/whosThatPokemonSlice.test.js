import whosThatPokemonReducer, {
  incrementScore,
  resetStreak,
  incrementTotalPlayed,
  addToHistory,
  resetGame,
  resetAll
} from '../whosThatPokemonSlice';

describe('whosThatPokemonSlice', () => {
  const initialState = {
    score: 0,
    totalPlayed: 0,
    streak: 0,
    bestStreak: 0,
    history: []
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(whosThatPokemonReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('incrementScore', () => {
    it('should increment score by 1', () => {
      const state = whosThatPokemonReducer(initialState, incrementScore());
      expect(state.score).toBe(1);
    });

    it('should increment streak by 1', () => {
      const state = whosThatPokemonReducer(initialState, incrementScore());
      expect(state.streak).toBe(1);
    });

    it('should update bestStreak when current streak exceeds it', () => {
      const stateWithStreak = { ...initialState, streak: 4, bestStreak: 4 };
      const state = whosThatPokemonReducer(stateWithStreak, incrementScore());
      
      expect(state.streak).toBe(5);
      expect(state.bestStreak).toBe(5);
    });

    it('should not update bestStreak when current streak is less', () => {
      const stateWithBestStreak = { ...initialState, streak: 2, bestStreak: 10 };
      const state = whosThatPokemonReducer(stateWithBestStreak, incrementScore());
      
      expect(state.streak).toBe(3);
      expect(state.bestStreak).toBe(10);
    });
  });

  describe('resetStreak', () => {
    it('should reset streak to 0', () => {
      const stateWithStreak = { ...initialState, streak: 5 };
      const state = whosThatPokemonReducer(stateWithStreak, resetStreak());
      
      expect(state.streak).toBe(0);
    });

    it('should preserve bestStreak when resetting', () => {
      const stateWithStreak = { ...initialState, streak: 5, bestStreak: 10 };
      const state = whosThatPokemonReducer(stateWithStreak, resetStreak());
      
      expect(state.streak).toBe(0);
      expect(state.bestStreak).toBe(10);
    });
  });

  describe('incrementTotalPlayed', () => {
    it('should increment totalPlayed by 1', () => {
      const state = whosThatPokemonReducer(initialState, incrementTotalPlayed());
      expect(state.totalPlayed).toBe(1);
    });

    it('should increment totalPlayed from existing value', () => {
      const stateWithPlayed = { ...initialState, totalPlayed: 15 };
      const state = whosThatPokemonReducer(stateWithPlayed, incrementTotalPlayed());
      
      expect(state.totalPlayed).toBe(16);
    });
  });

  describe('addToHistory', () => {
    it('should add entry to history', () => {
      const entry = {
        pokemonName: 'pikachu',
        isCorrect: true,
        timestamp: Date.now()
      };
      
      const state = whosThatPokemonReducer(initialState, addToHistory(entry));
      
      expect(state.history).toHaveLength(1);
      expect(state.history[0].pokemonName).toBe('pikachu');
      expect(state.history[0].isCorrect).toBe(true);
    });

    it('should add new entries at the beginning (unshift)', () => {
      const firstEntry = {
        pokemonName: 'bulbasaur',
        isCorrect: true,
        timestamp: Date.now()
      };
      
      let state = whosThatPokemonReducer(initialState, addToHistory(firstEntry));
      
      const secondEntry = {
        pokemonName: 'charmander',
        isCorrect: false,
        timestamp: Date.now() + 1000
      };
      
      state = whosThatPokemonReducer(state, addToHistory(secondEntry));
      
      expect(state.history[0].pokemonName).toBe('charmander');
      expect(state.history[1].pokemonName).toBe('bulbasaur');
    });

    it('should keep only last 20 entries in history', () => {
      let state = { ...initialState };
      
      for (let i = 0; i < 25; i++) {
        state = whosThatPokemonReducer(state, addToHistory({
          pokemonName: `pokemon${i}`,
          isCorrect: true,
          timestamp: Date.now() + i
        }));
      }
      
      expect(state.history.length).toBeLessThanOrEqual(20);
    });
  });

  describe('resetGame', () => {
    it('should reset score, totalPlayed and streak', () => {
      const stateWithProgress = {
        ...initialState,
        score: 10,
        totalPlayed: 15,
        streak: 5,
        bestStreak: 8,
        history: [{ pokemonName: 'test', isCorrect: true }]
      };
      
      const state = whosThatPokemonReducer(stateWithProgress, resetGame());
      
      expect(state.score).toBe(0);
      expect(state.totalPlayed).toBe(0);
      expect(state.streak).toBe(0);
      // Should preserve bestStreak and history
      expect(state.bestStreak).toBe(8);
      expect(state.history).toHaveLength(1);
    });
  });

  describe('resetAll', () => {
    it('should reset everything to initial state', () => {
      const complexState = {
        score: 10,
        totalPlayed: 20,
        streak: 5,
        bestStreak: 15,
        history: [{ pokemonName: 'test', isCorrect: true }]
      };
      
      const state = whosThatPokemonReducer(complexState, resetAll());
      
      expect(state).toEqual(initialState);
    });
  });
});
