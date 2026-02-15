import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  const mockPokemon = {
    name: 'Pikachu',
    image: 'https://example.com/pikachu.png'
  };

  const defaultProps = {
    pokemon: mockPokemon,
    isFlipped: false,
    isMatched: false,
    onClick: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Card {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should have correct aria-label with pokemon name', () => {
      render(<Card {...defaultProps} />);
      expect(screen.getByLabelText('Carta de Pikachu')).toBeInTheDocument();
    });

    it('should have default aria-label when pokemon is undefined', () => {
      render(<Card {...defaultProps} pokemon={undefined} />);
      expect(screen.getByLabelText('Carta de Pokémon')).toBeInTheDocument();
    });
  });

  describe('Card States', () => {
    it('should not have flipped class when isFlipped is false', () => {
      render(<Card {...defaultProps} isFlipped={false} />);
      const card = screen.getByRole('button');
      expect(card.className).not.toContain('flipped');
    });

    it('should have flipped class when isFlipped is true', () => {
      render(<Card {...defaultProps} isFlipped={true} />);
      const card = screen.getByRole('button');
      expect(card.className).toContain('flipped');
    });

    it('should have matched class when isMatched is true', () => {
      render(<Card {...defaultProps} isMatched={true} />);
      const card = screen.getByRole('button');
      expect(card.className).toContain('matched');
    });

    it('should not have matched class when isMatched is false', () => {
      render(<Card {...defaultProps} isMatched={false} />);
      const card = screen.getByRole('button');
      expect(card.className).not.toContain('matched');
    });
  });

  describe('Pokemon Display', () => {
    it('should display pokemon image when provided', () => {
      render(<Card {...defaultProps} />);
      const img = screen.getByAltText('Pikachu');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/pikachu.png');
    });

    it('should display pokemon name when provided', () => {
      render(<Card {...defaultProps} />);
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    it('should display placeholder when no pokemon image', () => {
      render(<Card {...defaultProps} pokemon={{ name: 'Test', image: null }} />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when card is clicked', () => {
      const onClickMock = jest.fn();
      render(<Card {...defaultProps} onClick={onClickMock} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should be focusable via keyboard', () => {
      render(<Card {...defaultProps} />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });
});
