import NavigationButton from '../../../components/common/SmartButton/NavigationButton';
import styles from './styles.module.css';

function HeroBanner() {
  return (
    <section className={styles.heroBanner}>
      <div className={styles.heroBanner__content}>
        <h1 className={styles.heroBanner__title}>ННГП-ТВОЙ РОСТ, НАШИ ВОЗМОЖНОСТИ</h1>
        <p className={styles.heroBanner__description}>
          Развивайтесь на одной платформе: изучайте новое, готовьтесь к собеседованиям, углубляйте
          знания и совершенствуйтесь с ННГП.
        </p>
        <NavigationButton
          to="/auth/login"
          color="error"
          size="large"
          sx={{
            fontSize: '1.1rem',
            padding: '12px 24px',
            height: '48px',
          }}
        >
          Присоединиться
        </NavigationButton>
      </div>
    </section>
  );
}

export default HeroBanner;
