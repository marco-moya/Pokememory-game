import styles from './GameOptions.module.css';
import { FaQuestion, FaBrain, FaPuzzlePiece } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const GameOptions = () => {
  const navigate = useNavigate();
  const gameOptions = [
    {
      id: 1,
      title: '¿Quién es ese Pokémon?',
      icon: FaQuestion,
      description: 'Adivina el Pokémon por su silueta',
      difficulty: 'Fácil',
      color: 'blue',
      path: '/whos-that-pokemon'
    },
    {
      id: 2,
      title: 'Memoria',
      icon: FaBrain,
      description: 'Encuentra las parejas de Pokémon',
      difficulty: 'Medio',
      color: 'red',
      path: '/memory'
    },
    {
      id: 3,
      title: 'Type Matcher',
      icon: FaPuzzlePiece,
      description: 'Combina tipos de Pokémon correctamente',
      difficulty: 'Difícil',
      color: 'yellow',
      path: '/type-matcher'
    }
  ];

  return (
    <section className={styles.gameOptions}>
      <h2 className={styles.sectionTitle}>Elige tu Aventura</h2>
      <div className={styles.optionsGrid}>
        {gameOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <article 
              key={option.id} 
              className={`${styles.optionCard} ${styles[option.color]}`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <IconComponent className={styles.cardIcon} />
                </div>
                <span className={styles.difficulty}>{option.difficulty}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{option.title}</h3>
                <p className={styles.cardDescription}>{option.description}</p>
              </div>
              <button 
                className={styles.playButton}
                onClick={() => navigate(option.path)}
              >
                <span>Jugar Ahora</span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default GameOptions;