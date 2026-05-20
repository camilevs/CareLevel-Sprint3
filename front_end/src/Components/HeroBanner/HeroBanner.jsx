import { ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from '../Logo/Logo';
import styles from './HeroBanner.module.css';

const slides = [
  {
    id: 'slide-1',
    headlineParts: ['Eleve seu ', 'bem-estar', ' todos os dias'],
    imageSrc: '/banner_idea.png',
    imageAlt: 'Pessoa praticando yoga',
  },
  {
    id: 'slide-2',
    headlineParts: ['','Conquiste',' suas metas de saúde'],
    imageSrc: '/banner_idea2.png',
    imageAlt: 'Pessoa se exercitando',
  },
  {
    id: 'slide-3',
    headlineParts: ['','Cuide',' de você com propósito'],
    imageSrc: '/banner_idea3.png',
    imageAlt: 'Pessoa meditando',
  },
];

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      <div className={styles.blobTopRight} aria-hidden="true" />

      <div
        id="heroBannerCarousel"
        className={`carousel slide ${styles.carousel}`}
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-item ${index === 0 ? 'active' : ''}`}
            >
              <div className={styles.slideInner}>
                {slide.imageSrc ? (
                  <img
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    className={styles.slideBackground}
                  />
                ) : (
                  <div className={styles.imagePlaceholder} aria-label={slide.imageAlt}>
                    <span className={styles.imagePlaceholderText}>{slide.imageAlt}</span>
                  </div>
                )}

                <div className={styles.overlay} aria-hidden="true" />

                <div className={styles.content}>
                  <div className={styles.logoBlock}>
                    <Logo size={36} />
                    <span className={styles.brandName}>CareLevel</span>
                  </div>
                  <h1 className={styles.headline}>
                    {slide.headlineParts ? (
                      <>
                        {slide.headlineParts[0]}
                        <span className={styles.highlight}>{slide.headlineParts[1]}</span>
                        {slide.headlineParts[2]}
                      </>
                    ) : (
                      slide.headline
                    )}
                  </h1>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className={`carousel-control-prev ${styles.navBtn}`}
          type="button"
          data-bs-target="#heroBannerCarousel"
          data-bs-slide="prev"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={32} color="#ffffff" />
        </button>
        <button
          className={`carousel-control-next ${styles.navBtn}`}
          type="button"
          data-bs-target="#heroBannerCarousel"
          data-bs-slide="next"
          aria-label="Próximo slide"
        >
          <ChevronRight size={32} color="#ffffff" />
        </button>

        <div className={`carousel-indicators ${styles.indicators}`}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              data-bs-target="#heroBannerCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : undefined}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}