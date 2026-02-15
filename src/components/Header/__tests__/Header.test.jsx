import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

// Mock react-router
const mockNavigate = jest.fn();
let mockPathname = '/';

jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
  BrowserRouter: ({ children }) => <>{children}</>,
  MemoryRouter: ({ children }) => <>{children}</>,
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaHome: () => <span data-testid="icon-home">🏠</span>,
}));

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/';
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Header />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should render the title', () => {
      render(<Header />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('PokéMemory');
    });

    it('should render the subtitle', () => {
      render(<Header />);
      expect(screen.getByText('Entrena tu mente, captura recuerdos')).toBeInTheDocument();
    });
  });

  describe('Home Button Visibility', () => {
    it('should not show home button on home page', () => {
      mockPathname = '/';
      render(<Header />);
      
      expect(screen.queryByLabelText('Volver al inicio')).not.toBeInTheDocument();
    });

    it('should show home button on /memory page', () => {
      mockPathname = '/memory';
      render(<Header />);
      
      expect(screen.getByLabelText('Volver al inicio')).toBeInTheDocument();
    });

    it('should show home button on /whos-that-pokemon page', () => {
      mockPathname = '/whos-that-pokemon';
      render(<Header />);
      
      expect(screen.getByLabelText('Volver al inicio')).toBeInTheDocument();
    });

    it('should show home button on /type-matcher page', () => {
      mockPathname = '/type-matcher';
      render(<Header />);
      
      expect(screen.getByLabelText('Volver al inicio')).toBeInTheDocument();
    });

    it('should show home icon when not on home page', () => {
      mockPathname = '/memory';
      render(<Header />);
      
      expect(screen.getByTestId('icon-home')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to home when home button is clicked', () => {
      mockPathname = '/memory';
      render(<Header />);
      
      const homeButton = screen.getByLabelText('Volver al inicio');
      fireEvent.click(homeButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to home from any page', () => {
      mockPathname = '/type-matcher';
      render(<Header />);
      
      fireEvent.click(screen.getByLabelText('Volver al inicio'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Branding Elements', () => {
    it('should render pokeball logo elements', () => {
      const { container } = render(<Header />);
      
      expect(container.querySelector('[class*="pokeball"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="pokeballTop"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="pokeballMiddle"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="pokeballBottom"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="pokeballButton"]')).toBeInTheDocument();
    });

    it('should render logo container', () => {
      const { container } = render(<Header />);
      
      expect(container.querySelector('[class*="logoContainer"]')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have header landmark', () => {
      render(<Header />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should have navigation landmark when not on home', () => {
      mockPathname = '/memory';
      render(<Header />);
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have aria-label on navigation', () => {
      mockPathname = '/memory';
      render(<Header />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Controles del juego');
    });

    it('should have title attribute on home button', () => {
      mockPathname = '/memory';
      render(<Header />);
      
      const homeButton = screen.getByLabelText('Volver al inicio');
      expect(homeButton).toHaveAttribute('title', 'Inicio');
    });
  });

  describe('Structure', () => {
    it('should render as a header element', () => {
      render(<Header />);
      
      const header = document.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should have branding section', () => {
      const { container } = render(<Header />);
      
      expect(container.querySelector('[class*="branding"]')).toBeInTheDocument();
    });

    it('should have container wrapper', () => {
      const { container } = render(<Header />);
      
      expect(container.querySelector('[class*="container"]')).toBeInTheDocument();
    });
  });
});
