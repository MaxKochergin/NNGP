import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import TimelineIcon from '@mui/icons-material/Timeline';
import styles from './styles.module.css';

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className={styles.features__container}>
        <div className={styles.features__item}>
          <div className={styles.features__icon}>
            <FolderOpenOutlinedIcon />
          </div>
          <h2 className={styles.features__title}>БОЛЬШАЯ БАЗА ВОПРОСОВ</h2>
          <p className={styles.features__description}>
            Изучай технологии по актуальным теоретическим вопросам
          </p>
        </div>

        <div className={`${styles.features__item} ${styles['features__item--highlighted']}`}>
          <div className={styles.features__icon}>
            <TimelineIcon />
          </div>
          <h2 className={styles.features__title}>ПРОГРЕСС ОБУЧЕНИЯ</h2>
          <p className={styles.features__description}>
            Смотрите аналитику по пройденным темам, повторяйте изученные
          </p>
        </div>

        <div className={styles.features__item}>
          <div className={styles.features__icon}>
            <ChairOutlinedIcon />
          </div>
          <h2 className={styles.features__title}>УДОБНЫЙ ТРЕНАЖЁР</h2>
          <p className={styles.features__description}>
            Улучшайте свои навыки в нашем тренажёре по запоминанию вопросов
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
