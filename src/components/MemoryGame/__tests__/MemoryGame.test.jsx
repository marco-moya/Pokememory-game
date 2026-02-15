import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import MemoryGame from '../MemoryGame';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    article: ({ children, ...props }) => <article {...props}>{children}</article>
  },
  AnimatePresence: ({ children }) => <>{children}</>
}));

// Mock react-confetti
jest.mock('react-confetti', () => {
  return function MockConfetti() {
    return null;
  };
});

// Mock react-router
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  BrowserRouter: ({ children }) => <>{children}</>,
  MemoryRouter: ({ children }) => <>{children}</>,
  Routes: ({ children }) => <>{children}</>,
  Route: () => null
}));

describe('MemoryGame Component', () => {
  const createMockPokemonResponse = (id, name) => ({
    data: {
      id,
      name,
      sprites: {
        other: {
          'official-artwork': {
            front_default: `https://example.com/${name}.png`
          }
        }
      }
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Mock Math.random for predictable card generation
    let randomCounter = 0;
    jest.spyOn(Math, 'random').mockImplementation(() => {
      randomCounter++;
      return (randomCounter % 151) / 151;
    });

    // Mock axios to return pokemon data
    axios.get.mockImplementation((url) => {
      const id = parseInt(url.split('/').pop());
      const names = ['bulbasaur', 'charmander', 'squirtle', 'pikachu', 'jigglypuff', 'meowth'];
      return Promise.resolve(createMockPokemonResponse(id, names[id % names.length] || `pokemon${id}`));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      renderWithProviders(<MemoryGame />);
      
      expect(screen.getByText('Preparando el juego...')).toBeInTheDocument();
    });
  });

  describe('Rendered Content', () => {
    it('should render home button', async () => {
      renderWithProviders(<MemoryGame />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Volver al inicio')).toBeInTheDocument();
      });
    });

    it('should render restart button', async () => {
      renderWithProviders(<MemoryGame />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Reiniciar juego')).toBeInTheDocument();
      });
    });

    it('should render game info with time', async () => {
      renderWithProviders(<MemoryGame />);
      
      await waitFor(() => {
        expect(screen.getByText('Tiempo')).toBeInTheDocument();
      });
    });

    it('should render game info with moves', async () => {
      renderWithProviders(<MemoryGame />);
      
      await waitFor(() => {
        expect(screen.getByText('Movimientos')).toBeInTheDocument();
      });
    });
  });

  describe('Redux Integration', () => {
    it('should display moves from Redux state', async () => {
      renderWithProviders(<MemoryGame />, {
        preloadedState: {
          memoryGame: {
            moves: 10,
            time: 60,
            gamesPlayed: 5,
            gamesWon: 3,
            bestTime: 45,
            bestMoves: 12,
            averageMoves: 15,
            averageTime: 50,
            history: []
          }
        }
      });
      
      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate home when home button is clicked', async () => {
      renderWithProviders(<MemoryGame />);
      
      await waitFor(() => {
        const homeButton = screen.getByLabelText('Volver al inicio');
        fireEvent.click(homeButton);
      });
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Game Actions', () => {
    it('should fetch pokemon when component mounts', async () => {
      renderWithProviders(<MemoryGame />);
      
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
    });

    it('should reset game when restart button is clicked', async () => {
      renderWithProviders(<MemoryGame />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Reiniciar juego')).toBeInTheDocument();
      });
      
      // Clear mock to track new calls
      axios.get.mockClear();
      
      fireEvent.click(screen.getByLabelText('Reiniciar juego'));
      
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
    });
  });

  describe('Best Records Display', () => {
    it('should have records section structure', async () => {
      renderWithProviders(<MemoryGame />, {
        preloadedState: {
          memoryGame: {
            moves: 0,
            time: 0,
            gamesPlayed: 5,
            gamesWon: 3,
            bestTime: 120,
            bestMoves: 14,
            averageMoves: 18,
            averageTime: 150,
            history: []
          }
        }
      });
      
      await waitFor(() => {
        // Verify the game info section exists with time and moves labels
        expect(screen.getByText('Tiempo')).toBeInTheDocument();
        expect(screen.getByText('Movimientos')).toBeInTheDocument();
      });
    });

    it('should display game title', async () => {
      renderWithProviders(<MemoryGame />, {
        preloadedState: {
          memoryGame: {
            moves: 0,
            time: 0,
            gamesPlayed: 5,
            gamesWon: 3,
            bestTime: 120,
            bestMoves: 14,
            averageMoves: 18,
            averageTime: 150,
            history: []
          }
        }
      });
      
      await waitFor(() => {
        // Verify the game title exists
        expect(screen.getByText('Memoria Pokémon')).toBeInTheDocument();
      });
    });
  });
});
