import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import TypeMatcher from '../TypeMatcher';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    img: (props) => <img {...props} />
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

describe('TypeMatcher Component', () => {
  const mockPokemonResponse = {
    data: {
      id: 6,
      name: 'charizard',
      sprites: {
        other: {
          'official-artwork': {
            front_default: 'https://example.com/charizard.png'
          }
        }
      },
      types: [
        { type: { name: 'fire' } },
        { type: { name: 'flying' } }
      ]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue(mockPokemonResponse);
    
    // Mock Math.random for predictable pokemon ID
    jest.spyOn(Math, 'random').mockReturnValue(0.03); // Will generate ID 6
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      renderWithProviders(<TypeMatcher />);
      
      expect(screen.getByText('Cargando Pokémon...')).toBeInTheDocument();
    });
  });

  describe('Rendered Content', () => {
    it('should render the game title', async () => {
      renderWithProviders(<TypeMatcher />);
      
      await waitFor(() => {
        expect(screen.getByText('Type Matcher')).toBeInTheDocument();
      });
    });

    it('should render pokemon name after loading', async () => {
      renderWithProviders(<TypeMatcher />);
      
      await waitFor(() => {
        expect(screen.getByText('Charizard')).toBeInTheDocument();
      });
    });

    it('should render pokemon image', async () => {
      renderWithProviders(<TypeMatcher />);
      
      await waitFor(() => {
        const img = screen.getByAltText('charizard');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/charizard.png');
      });
    });

    it('should render type buttons', async () => {
      renderWithProviders(<TypeMatcher />);
      
      await waitFor(() => {
        expect(screen.getByText('Fire')).toBeInTheDocument();
        expect(screen.getByText('Water')).toBeInTheDocument();
        expect(screen.getByText('Grass')).toBeInTheDocument();
        expect(screen.getByText('Flying')).toBeInTheDocument();
      });
    });

    it('should render verify button', async () => {
      renderWithProviders(<TypeMatcher />);
      
      await waitFor(() => {
        expect(screen.getByText('Verificar')).toBeInTheDocument();
      });
    });

    it('should render instructions', async () => {
      renderWithProviders(<TypeMatcher />);
      
      await waitFor(() => {
        expect(screen.getByText('Arrastra los tipos correctos a las zonas de abajo')).toBeInTheDocument();
      });
    });
  });

  describe('Statistics Display', () => {
    it('should display score from Redux state', async () => {
      renderWithProviders(<TypeMatcher />, {
        preloadedState: {
          typeMatcher: {
            score: 5,
            attempts: 10,
            bestScore: 8,
            accuracy: 50,
            typeStats: {},
            history: []
          }
        }
      });
      
      await waitFor(() => {
        // Look for the score value
        const statValues = screen.getAllByText('5');
        expect(statValues.length).toBeGreaterThan(0);
      });
    });

    it('should display best score from Redux state', async () => {
      renderWithProviders(<TypeMatcher />, {
        preloadedState: {
          typeMatcher: {
            score: 3,
            attempts: 5,
            bestScore: 12,
            accuracy: 60,
            typeStats: {},
            history: []
          }
        }
      });
      
      await waitFor(() => {
        expect(screen.getByText(/12/)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate home when home button is clicked', async () => {
      renderWithProviders(<TypeMatcher />);
      
      await waitFor(() => {
        const homeButton = screen.getByLabelText('Volver al inicio');
        fireEvent.click(homeButton);
      });
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Game Actions', () => {
    it('should show warning when trying to verify without selecting types', async () => {
      renderWithProviders(<TypeMatcher />);
      
      await waitFor(() => {
        expect(screen.getByText('Verificar')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Verificar'));
      
      await waitFor(() => {
        expect(screen.getByText('¡Completa todos los tipos!')).toBeInTheDocument();
      });
    });

    it('should fetch new pokemon when restart button is clicked', async () => {
      renderWithProviders(<TypeMatcher />);
      
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

  describe('Drop Zones', () => {
    it('should render correct number of drop zones for pokemon types', async () => {
      renderWithProviders(<TypeMatcher />);
      
      await waitFor(() => {
        // Charizard has 2 types
        expect(screen.getByText('Tipo 1')).toBeInTheDocument();
        expect(screen.getByText('Tipo 2')).toBeInTheDocument();
      });
    });
  });
});
