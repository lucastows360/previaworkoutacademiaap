import { useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import { ext } from '../lib/links';
import { IconChevronLeft, IconChevronRight, IconClose, IconImage, IconInstagram } from '../lib/icons';
import { Reveal } from '../lib/motion';

/**
 * SEÇÃO 6 — Estrutura e ambiente.
 * Galeria com fotos REAIS cadastradas em siteConfig.gallery. Lightbox com teclado (← → Esc),
 * gesto de arraste no celular e foco preso dentro do diálogo.
 * Sem fotos cadastradas, mostra espaços reservados identificados (nenhuma foto inventada).
 */
export function Gallery() {
  const images = siteConfig.gallery;
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef(0);

  const open = (i: number) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setIndex(i);
  };
  const close = useCallback(() => {
    setIndex(null);
    lastFocus.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLElement>('.lightbox__close')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>('button');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [index, close, step]);

  const current = index !== null ? images[index] : null;

  return (
    <section id="estrutura" className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <div className="gallery__head">
          <Reveal as="p" className="eyebrow">
            <span className="eyebrow__dot" /> Estrutura
          </Reveal>
          <Reveal as="h2" id="gallery-title" className="h2" delay={60}>
            Conheça de perto o <em>ambiente da Workout.</em>
          </Reveal>
        </div>

        {images.length ? (
          <ul className="gallery__grid">
            {images.map((img, i) => (
              <Reveal as="li" key={img.src} className={`gallery__item gallery__item--${(i % 5) + 1}`} variant="scale" delay={(i % 3) * 80}>
                <button type="button" onClick={() => open(i)} aria-label={`Ampliar foto: ${img.alt}`}>
                  <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" />
                  {img.caption && <span className="gallery__caption">{img.caption}</span>}
                </button>
              </Reveal>
            ))}
          </ul>
        ) : (
          <>
            <ul className="gallery__grid gallery__grid--empty" aria-label="Espaços reservados para fotos da academia">
              {Array.from({ length: siteConfig.galleryPlaceholderSlots }).map((_, i) => (
                <li key={i} className={`gallery__item gallery__item--${(i % 5) + 1} gallery__slot`}>
                  <IconImage size={28} />
                  <span>Foto real {i + 1}</span>
                </li>
              ))}
            </ul>
            <div className="gallery__empty-cta">
              <p>As fotos do espaço estão a caminho. Por enquanto, acompanhe o dia a dia da academia no Instagram.</p>
              <a className="btn btn--ghost" href={siteConfig.contact.instagramUrl} {...ext}>
                <IconInstagram size={18} /> {siteConfig.contact.instagramHandle}
              </a>
            </div>
            {siteConfig.showPlaceholderNotes && (
              <p className="placeholder-note">
                Adicione as fotos em <code>public/images/galeria/</code> e cadastre em <code>siteConfig.gallery</code>.
              </p>
            )}
          </>
        )}
      </div>

      {current && (
        <div
          ref={dialogRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${index! + 1} de ${images.length}: ${current.alt}`}
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          <button type="button" className="lightbox__close icon-btn" onClick={close} aria-label="Fechar foto">
            <IconClose />
          </button>
          {images.length > 1 && (
            <button type="button" className="lightbox__nav lightbox__nav--prev icon-btn" onClick={() => step(-1)} aria-label="Foto anterior">
              <IconChevronLeft />
            </button>
          )}
          <figure className="lightbox__figure" key={current.src}>
            <img src={current.src} alt={current.alt} width={current.width} height={current.height} />
            <figcaption>
              {current.caption ?? current.alt}
              <span>
                {index! + 1} / {images.length}
              </span>
            </figcaption>
          </figure>
          {images.length > 1 && (
            <button type="button" className="lightbox__nav lightbox__nav--next icon-btn" onClick={() => step(1)} aria-label="Próxima foto">
              <IconChevronRight />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
