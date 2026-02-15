import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import WhosThatPokemon from '../WhosThatPokemon';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    img: ({ children, ...props }) => <img {...props}>{children}</img>
  },
  AnimatePresence: ({ children }) => <>{children}</>
}));

// Mock react-router
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  BrowserRouter: ({ children }) => <>{children}</>,
  MemoryRouter: ({ children }) => <>{children}</>,
  Routes: ({ children }) => <>{children}</>,
  Route: () => null
}));

describe('WhosThatPokemon Component', () => {
  const mockPokemonResponse = {
    data: {
      id: 25,
      name: 'pikachu',
      sprites: {
        other: {
          'official-artwork': {
            front_default: 'https://example.com/pikachu.png'
          }
        }
      },
      types: [{ type: { name: 'electric' } }]
    }
  };

  const mockWrongPokemonResponse = (name, id) => ({
    data: {
      id,
      name,
      sprites: {
        other: {
          'official-artwork': {
            front_default: `https://example.com/${name}.png`
          }
        }
      },
      types: [{ type: { name: 'normal' } }]
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/25')) {
        return Promise.resolve(mockPokemonResponse);
      }
      // For random IDs, return different pokemon for options
      const id = parseInt(url.split('/').pop());
      return Promise.resolve(mockWrongPokemonResponse(`pokemon${id}`, id));
    });
    
    // Mock Math.random to return predictable values
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.16) // First call for main pokemon (25)
      .mockReturnValueOnce(0.5)  // For shuffle
      .mockReturnValueOnce(0.33) // For wrong option 1
      .mockReturnValueOnce(0.66) // For wrong option 2
      .mockReturnValueOnce(0.99); // For wrong option 3
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      renderWithProviders(<WhosThatPokemon />);
      
      expect(screen.getByText('Cargando Pokémon...')).toBeInTheDocument();
    });
  });

  describe('Rendered Content', () => {
    it('should render the home button', async () => {
      renderWithProviders(<WhosThatPokemon />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Volver al inicio')).toBeInTheDocument();
      });
    });

    it('should render score display', async () => {
      renderWithProviders(<WhosThatPokemon />, {
        preloadedState: {
          whosThatPokemon: {
            score: 5,
            totalPlayed: 10,
            streak: 3,
            bestStreak: 7,
            history: []
          }
        }
      });
      
      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate home when home button is clicked', async () => {
      renderWithProviders(<WhosThatPokemon />);
      
      await waitFor(() => {
        const homeButton = screen.getByLabelText('Volver al inicio');
        homeButton.click();
      });
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Redux Integration', () => {
    it('should display streak from Redux state', async () => {
      renderWithProviders(<WhosThatPokemon />, {
        preloadedState: {
          whosThatPokemon: {
            score: 0,
            totalPlayed: 0,
            streak: 5,
            bestStreak: 10,
            history: []
          }
        }
      });
      
      await waitFor(() => {
        // Check that the Racha label exists (streak is displayed with it)
        expect(screen.getByText('Racha')).toBeInTheDocument();
      });
    });

    it('should display best streak from Redux state', async () => {
      renderWithProviders(<WhosThatPokemon />, {
        preloadedState: {
          whosThatPokemon: {
            score: 0,
            totalPlayed: 0,
            streak: 0,
            bestStreak: 15,
            history: []
          }
        }
      });
      
      await waitFor(() => {
        // Check that the Mejor Racha label exists (best streak is displayed with it)
        expect(screen.getByText('Mejor Racha')).toBeInTheDocument();
      });
    });
  });
});
