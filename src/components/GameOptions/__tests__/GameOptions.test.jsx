import { render, screen, fireEvent } from '@testing-library/react';
import GameOptions from '../GameOptions';

// Mock react-router
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  BrowserRouter: ({ children }) => <>{children}</>,
  MemoryRouter: ({ children }) => <>{children}</>,
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaQuestion: () => <span data-testid="icon-question">?</span>,
  FaBrain: () => <span data-testid="icon-brain">🧠</span>,
  FaPuzzlePiece: () => <span data-testid="icon-puzzle">🧩</span>,
}));

describe('GameOptions Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<GameOptions />);
      expect(screen.getByText('Elige tu Aventura')).toBeInTheDocument();
    });

    it('should render section title', () => {
      render(<GameOptions />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Elige tu Aventura');
    });

    it('should render all three game options', () => {
      render(<GameOptions />);
      
      expect(screen.getByText('¿Quién es ese Pokémon?')).toBeInTheDocument();
      expect(screen.getByText('Memoria')).toBeInTheDocument();
      expect(screen.getByText('Type Matcher')).toBeInTheDocument();
    });
  });

  describe('Game Cards Content', () => {
    it('should display descriptions for each game', () => {
      render(<GameOptions />);
      
      expect(screen.getByText('Adivina el Pokémon por su silueta')).toBeInTheDocument();
      expect(screen.getByText('Encuentra las parejas de Pokémon')).toBeInTheDocument();
      expect(screen.getByText('Combina tipos de Pokémon correctamente')).toBeInTheDocument();
    });

    it('should display difficulty levels', () => {
      render(<GameOptions />);
      
      expect(screen.getByText('Fácil')).toBeInTheDocument();
      expect(screen.getByText('Medio')).toBeInTheDocument();
      expect(screen.getByText('Difícil')).toBeInTheDocument();
    });

    it('should display icons for each game', () => {
      render(<GameOptions />);
      
      expect(screen.getByTestId('icon-question')).toBeInTheDocument();
      expect(screen.getByTestId('icon-brain')).toBeInTheDocument();
      expect(screen.getByTestId('icon-puzzle')).toBeInTheDocument();
    });

    it('should render play buttons for each game', () => {
      render(<GameOptions />);
      
      const playButtons = screen.getAllByText('Jugar Ahora');
      expect(playButtons).toHaveLength(3);
    });
  });

  describe('Navigation', () => {
    it('should navigate to /whos-that-pokemon when first game is clicked', () => {
      render(<GameOptions />);
      
      const playButtons = screen.getAllByText('Jugar Ahora');
      fireEvent.click(playButtons[0]);
      
      expect(mockNavigate).toHaveBeenCalledWith('/whos-that-pokemon');
    });

    it('should navigate to /memory when second game is clicked', () => {
      render(<GameOptions />);
      
      const playButtons = screen.getAllByText('Jugar Ahora');
      fireEvent.click(playButtons[1]);
      
      expect(mockNavigate).toHaveBeenCalledWith('/memory');
    });

    it('should navigate to /type-matcher when third game is clicked', () => {
      render(<GameOptions />);
      
      const playButtons = screen.getAllByText('Jugar Ahora');
      fireEvent.click(playButtons[2]);
      
      expect(mockNavigate).toHaveBeenCalledWith('/type-matcher');
    });
  });

  describe('Structure', () => {
    it('should render as a section element', () => {
      const { container } = render(<GameOptions />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render game cards as articles', () => {
      render(<GameOptions />);
      
      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(3);
    });

    it('should render game titles as h3 headings', () => {
      render(<GameOptions />);
      
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(3);
      expect(headings[0]).toHaveTextContent('¿Quién es ese Pokémon?');
      expect(headings[1]).toHaveTextContent('Memoria');
      expect(headings[2]).toHaveTextContent('Type Matcher');
    });
  });

  describe('Accessibility', () => {
    it('should have buttons for each game option', () => {
      render(<GameOptions />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('should have clickable buttons', () => {
      render(<GameOptions />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toBeDisabled();
      });
    });
  });
});
