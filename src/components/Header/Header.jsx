import styles from './Header.module.css';
import { FaMoon, FaSun, FaTrophy, FaHome } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Lógica para cambiar el tema se implementará después
  };

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
          <button 
            className={styles.controlButton}
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Activar modo claro" : "Activar modo oscuro"}
            title={isDarkMode ? "Modo claro" : "Modo oscuro"}
          >
            {isDarkMode ? <FaSun className={styles.icon} /> : <FaMoon className={styles.icon} />}
          </button>
          <button 
            className={styles.controlButton}
            aria-label="Ver puntuaciones"
            title="Puntuaciones"
          >
            <FaTrophy className={styles.icon} />
          </button>
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