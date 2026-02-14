import Card from '../Card/Card';
import styles from './GameBoard.module.css';

const GameBoard = ({ cards = [], onCardClick }) => {
  const handleCardClick = (id) => {
    if (onCardClick) {
      onCardClick(id);
    }
  };

  return (
    <main className={styles.gameBoard}>
      <div className={styles.cardsGrid}>
        {cards.map((card) => (
          <Card
            key={card.id}
            pokemon={card}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </main>
  );
};

export default GameBoard;
