import styles from './GameInfo.module.css';
import { FaClock, FaGamepad } from 'react-icons/fa';

const GameInfo = ({ time = '00:00', moves = 0 }) => {
  return (
    <section className={styles.gameInfo}>
      <div className={styles.infoCard}>
        <FaClock className={styles.icon} />
        <div className={styles.infoContent}>
          <span className={styles.label}>Tiempo</span>
          <span className={styles.value}>{time}</span>
        </div>
      </div>
      <div className={styles.infoCard}>
        <FaGamepad className={styles.icon} />
        <div className={styles.infoContent}>
          <span className={styles.label}>Movimientos</span>
          <span className={styles.value}>{moves}</span>
        </div>
      </div>
    </section>
  );
};

export default GameInfo;
