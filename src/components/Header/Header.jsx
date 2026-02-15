import styles from './Header.module.css';
import { FaHome } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.controls} aria-label="Controles del juego">
          {!isHome && (
            <button 
              className={styles.controlButton}
              onClick={() => navigate('/')}
              aria-label="Volver al inicio"
              title="Inicio"
            >
              <FaHome className={styles.icon} />
            </button>
          )}
        </nav>

        <div className={styles.branding}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <div className={styles.pokeball}>
                <div className={styles.pokeballTop}></div>
                <div className={styles.pokeballMiddle}>
                  <div className={styles.pokeballButton}></div>
                </div>
                <div className={styles.pokeballBottom}></div>
              </div>
            </div>
          </div>
          <h1 className={styles.title}>PokéMemory</h1>
          <p className={styles.subtitle}>Entrena tu mente, captura recuerdos</p>
        </div>
      </div>
    </header>
  );
};

export default Header;