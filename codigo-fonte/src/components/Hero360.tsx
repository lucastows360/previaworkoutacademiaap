import { useCallback, useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import { ext, whatsappLink } from '../lib/links';
import { Icon360, IconArrowRight, IconChevronDown, IconClose, IconMove, IconWhatsApp } from '../lib/icons';
import { scrollToId, useScrollProgress } from '../lib/motion';
import { PanoramaViewer } from './PanoramaViewer';
import { BrandRings } from './BrandRings';

/**
 * SEÇÃO 1 — Capa imersiva.
 * O panorama 360° real (primeira cena do siteConfig) ocupa toda a primeira dobra.
 * Sem panorama cadastrado, a capa exibe uma composição gráfica da marca e um aviso
 * (visível só enquanto showPlaceholderNotes = true) indicando o arquivo necessário.
 */
export function Hero360() {
  const scenes = siteConfig.panorama.scenes;
  const hasPano = scenes.length > 0;
  const [exploring, setExploring] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useScrollProgress<HTMLElement>('through');
  const onReady = useCallback(() => setReady(true), []);

  const fallback = (
    <div className="hero-fallback" aria-hidden="true">
      <div className="hero-fallback__glow" />
      <BrandRings className="hero-fallback__rings" />
      <div className="hero-fallback__word">WORKOUT</div>
      <div className="hero-fallback__grid" />
    </div>
  );

  return (
    <section
      id="inicio"
      ref={ref}
      className={`hero ${exploring ? 'is-exploring' : ''} ${ready ? 'is-ready' : ''}`}
      aria-labelledby="hero-title"
    >
      <div className="hero__media">
        <PanoramaViewer
          scenes={scenes.slice(0, 1)}
          fallback={fallback}
          autoRotate
          showThumbs={false}
          showControls={exploring}
          allowPageScroll={!exploring}
          label="Panorama 360° da Workout Academia"
          onReady={onReady}
        />
      </div>
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__content">
        <p className="eyebrow hero__eyebrow">
          <span className="eyebrow__dot" /> {siteConfig.name}
        </p>
        <h1 id="hero-title" className="hero__title">
          <span className="hero__line">Musculação</span>
          <span className="hero__line">orientada</span>
          <span className="hero__line hero__line--accent">de verdade.</span>
        </h1>
        <p className="hero__tagline">Seu treino. Seu ritmo. Sua evolução.</p>
        <p className="hero__lead">
          {hasPano
            ? 'Conheça nosso espaço em uma experiência imersiva 360° e descubra um ambiente preparado para acompanhar sua jornada.'
            : `${siteConfig.messages.support1} Conheça nosso espaço e descubra um ambiente preparado para acompanhar sua jornada.`}
        </p>
        <div className="hero__ctas">
          <a className="btn btn--primary btn--lg" href={whatsappLink('start')} {...ext}>
            <IconWhatsApp size={20} /> Quero começar
          </a>
          <a
            className="btn btn--ghost btn--lg"
            href="#tour"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('tour');
            }}
          >
            Conhecer a academia <IconArrowRight size={18} />
          </a>
        </div>
        {hasPano && (
          <button type="button" className="hero__explore" onClick={() => setExploring(true)}>
            <Icon360 size={22} /> Explorar a academia
          </button>
        )}
        <p className="hero__support">{siteConfig.messages.support2}</p>
      </div>

      {hasPano && ready && !exploring && (
        <div className="hero__hint" aria-hidden="true">
          <IconMove size={18} /> Arraste para olhar ao redor
        </div>
      )}

      {exploring && (
        <button type="button" className="hero__back btn btn--dark btn--sm" onClick={() => setExploring(false)}>
          <IconClose size={18} /> Fechar exploração
        </button>
      )}

      {!hasPano && siteConfig.showPlaceholderNotes && (
        <p className="placeholder-note hero__note">
          <Icon360 size={16} /> Panorama 360° aguardando arquivo: cadastre a imagem equirretangular em
          <code>siteConfig.panorama.scenes</code>
        </p>
      )}

      <a
        className="hero__scroll"
        href="#sobre"
        onClick={(e) => {
          e.preventDefault();
          scrollToId('sobre');
        }}
        aria-label="Rolar para a próxima seção"
      >
        <span>Role</span>
        <IconChevronDown size={18} />
      </a>
    </section>
  );
}
