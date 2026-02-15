import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from '../GameBoard';

// Mock del componente Card para simplificar los tests
jest.mock('../../Card/Card', () => {
  return function MockCard({ pokemon, isFlipped, isMatched, onClick }) {
    return (
      <div 
        data-testid={`card-${pokemon.id}`}
        data-flipped={isFlipped}
        data-matched={isMatched}
        onClick={onClick}
      >
        {pokemon.name}
      </div>
    );
  };
});

describe('GameBoard Component', () => {
  const mockCards = [
    { id: '1-a', name: 'pikachu', image: 'pikachu.png', isFlipped: false, isMatched: false },
    { id: '1-b', name: 'pikachu', image: 'pikachu.png', isFlipped: false, isMatched: false },
    { id: '2-a', name: 'charizard', image: 'charizard.png', isFlipped: true, isMatched: false },
    { id: '2-b', name: 'charizard', image: 'charizard.png', isFlipped: false, isMatched: true }
  ];

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<GameBoard />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render with empty cards array by default', () => {
      render(<GameBoard />);
      const cards = screen.queryAllByTestId(/^card-/);
      expect(cards).toHaveLength(0);
    });

    it('should render all provided cards', () => {
      render(<GameBoard cards={mockCards} />);
      
      expect(screen.getByTestId('card-1-a')).toBeInTheDocument();
      expect(screen.getByTestId('card-1-b')).toBeInTheDocument();
      expect(screen.getByTestId('card-2-a')).toBeInTheDocument();
      expect(screen.getByTestId('card-2-b')).toBeInTheDocument();
    });

    it('should display pokemon names', () => {
      render(<GameBoard cards={mockCards} />);
      
      const pikachuCards = screen.getAllByText('pikachu');
      const charizardCards = screen.getAllByText('charizard');
      
      expect(pikachuCards).toHaveLength(2);
      expect(charizardCards).toHaveLength(2);
    });
  });

  describe('Card Props', () => {
    it('should pass isFlipped prop correctly', () => {
      render(<GameBoard cards={mockCards} />);
      
      expect(screen.getByTestId('card-1-a')).toHaveAttribute('data-flipped', 'false');
      expect(screen.getByTestId('card-2-a')).toHaveAttribute('data-flipped', 'true');
    });

    it('should pass isMatched prop correctly', () => {
      render(<GameBoard cards={mockCards} />);
      
      expect(screen.getByTestId('card-1-a')).toHaveAttribute('data-matched', 'false');
      expect(screen.getByTestId('card-2-b')).toHaveAttribute('data-matched', 'true');
    });
  });

  describe('User Interactions', () => {
    it('should call onCardClick with correct id when card is clicked', () => {
      const onCardClickMock = jest.fn();
      render(<GameBoard cards={mockCards} onCardClick={onCardClickMock} />);
      
      fireEvent.click(screen.getByTestId('card-1-a'));
      
      expect(onCardClickMock).toHaveBeenCalledTimes(1);
      expect(onCardClickMock).toHaveBeenCalledWith('1-a');
    });

    it('should call onCardClick with different id for each card', () => {
      const onCardClickMock = jest.fn();
      render(<GameBoard cards={mockCards} onCardClick={onCardClickMock} />);
      
      fireEvent.click(screen.getByTestId('card-1-a'));
      fireEvent.click(screen.getByTestId('card-2-a'));
      
      expect(onCardClickMock).toHaveBeenCalledTimes(2);
      expect(onCardClickMock).toHaveBeenNthCalledWith(1, '1-a');
      expect(onCardClickMock).toHaveBeenNthCalledWith(2, '2-a');
    });

    it('should not throw error when clicking card without onCardClick handler', () => {
      render(<GameBoard cards={mockCards} />);
      
      expect(() => {
        fireEvent.click(screen.getByTestId('card-1-a'));
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have main landmark', () => {
      render(<GameBoard cards={mockCards} />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Grid Layout', () => {
    it('should render cards inside cardsGrid container', () => {
      const { container } = render(<GameBoard cards={mockCards} />);
      
      const cardsGrid = container.querySelector('[class*="cardsGrid"]');
      expect(cardsGrid).toBeInTheDocument();
      expect(cardsGrid.children).toHaveLength(4);
    });
  });
});
