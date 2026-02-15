import { render, screen } from '@testing-library/react';
import GameInfo from '../GameInfo';

describe('GameInfo Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<GameInfo />);
      expect(screen.getByText('Tiempo')).toBeInTheDocument();
      expect(screen.getByText('Movimientos')).toBeInTheDocument();
    });

    it('should display default time value', () => {
      render(<GameInfo />);
      expect(screen.getByText('00:00')).toBeInTheDocument();
    });

    it('should display default moves value', () => {
      render(<GameInfo />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should display provided time value', () => {
      render(<GameInfo time="05:30" />);
      expect(screen.getByText('05:30')).toBeInTheDocument();
    });

    it('should display provided moves value', () => {
      render(<GameInfo moves={15} />);
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('should display both time and moves correctly', () => {
      render(<GameInfo time="10:45" moves={42} />);
      expect(screen.getByText('10:45')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  describe('Labels', () => {
    it('should display Tiempo label', () => {
      render(<GameInfo />);
      expect(screen.getByText('Tiempo')).toBeInTheDocument();
    });

    it('should display Movimientos label', () => {
      render(<GameInfo />);
      expect(screen.getByText('Movimientos')).toBeInTheDocument();
    });
  });
});
