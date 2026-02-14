import styles from './Card.module.css';

const Card = ({ pokemon, isFlipped, isMatched, onClick }) => {
  return (
    <article 
      className={`${styles.card} ${isFlipped ? styles.flipped : ''} ${isMatched ? styles.matched : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Carta de ${pokemon?.name || 'Pokémon'}`}
    >
      <div className={styles.cardInner}>
        {/* Front - Back of card (Pokéball) */}
        <div className={styles.cardFront}>
          <div className={styles.pokeball}>
            <div className={styles.pokeballTop}></div>
            <div className={styles.pokeballMiddle}>
              <div className={styles.pokeballButton}></div>
            </div>
            <div className={styles.pokeballBottom}></div>
          </div>
        </div>
        
        {/* Back - Face of card (Pokémon) */}
        <div className={styles.cardBack}>
          <div className={styles.cardContent}>
            {pokemon?.image ? (
              <img 
                src={pokemon.image} 
                alt={pokemon.name}
                className={styles.pokemonImage}
              />
            ) : (
              <div className={styles.placeholder}>?</div>
            )}
            {pokemon?.name && (
              <h3 className={styles.pokemonName}>{pokemon.name}</h3>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
