import { useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import { ext, mapsOpenLink, whatsappLink } from '../lib/links';
import { Icon360, IconCopy, IconInstagram, IconMapPin, IconShare, IconWhatsApp } from '../lib/icons';
import { Reveal } from '../lib/motion';
import { PanoramaViewer } from './PanoramaViewer';
import { BrandRings } from './BrandRings';

/**
 * SEÇÃO 3 — Tour virtual interativo.
 * Ordem de prioridade: cenas locais (siteConfig.panorama.scenes) → tour externo incorporável
 * → botão para abrir tour externo → estado "em preparação" com convite para visita presencial.
 */
export function VirtualTour() {
  const { scenes, externalTourUrl, externalTourEmbeddable } = siteConfig.panorama;
  const [shareMsg, setShareMsg] = useState('');

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#tour`;
    const data = { title: 'Tour 360° — Workout Academia', text: 'Conheça o espaço da Workout Academia:', url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMsg('Link do tour copiado.');
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setShareMsg(`Copie o link: ${url}`);
    }
    window.setTimeout(() => setShareMsg(''), 4000);
  };

  const fallback = (
    <div className="tour-empty">
      <BrandRings className="tour-empty__rings" />
      <div className="tour-empty__body">
        <span className="tour-empty__badge">
          <Icon360 size={18} /> Tour 360° em preparação
        </span>
        <p className="tour-empty__title">Enquanto o tour não fica pronto, venha conhecer o espaço pessoalmente.</p>
        <p className="tour-empty__text">
          Agende uma visita ou aula experimental pelo WhatsApp, ou veja o dia a dia da academia no Instagram.
        </p>
        <div className="tour-empty__ctas">
          <a className="btn btn--primary" href={whatsappLink('visit')} {...ext}>
            <IconWhatsApp size={18} /> Agendar visita
          </a>
          <a className="btn btn--ghost" href={siteConfig.contact.instagramUrl} {...ext}>
            <IconInstagram size={18} /> Ver no Instagram
          </a>
        </div>
        {siteConfig.showPlaceholderNotes && (
          <p className="placeholder-note">
            Para ativar: coloque as panorâmicas 2:1 em <code>public/panorama/</code> e cadastre em{' '}
            <code>siteConfig.panorama.scenes</code>, ou informe um link em <code>externalTourUrl</code>.
          </p>
        )}
      </div>
    </div>
  );

  let viewer;
  if (scenes.length) {
    viewer = <PanoramaViewer scenes={scenes} fallback={fallback} autoRotate={false} label="Tour virtual 360° da Workout Academia" />;
  } else if (externalTourUrl && externalTourEmbeddable) {
    viewer = (
      <div className="pano">
        <iframe
          className="tour__iframe"
          src={externalTourUrl}
          title="Tour virtual 360° da Workout Academia"
          loading="lazy"
          allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
          allowFullScreen
        />
      </div>
    );
  } else {
    viewer = <div className="pano pano--empty">{fallback}</div>;
  }

  return (
    <section id="tour" className="section tour" aria-labelledby="tour-title">
      <div className="container">
        <div className="tour__head">
          <div>
            <Reveal as="p" className="eyebrow">
              <span className="eyebrow__dot" /> Tour virtual
            </Reveal>
            <Reveal as="h2" id="tour-title" className="h2" delay={60}>
              Entre, explore e <em>conheça nosso espaço.</em>
            </Reveal>
          </div>
          <Reveal className="tour__actions" delay={120}>
            {externalTourUrl && (
              <a className="btn btn--ghost btn--sm" href={externalTourUrl} {...ext}>
                <Icon360 size={18} /> Abrir tour completo
              </a>
            )}
            <button type="button" className="btn btn--ghost btn--sm" onClick={share}>
              {shareMsg ? <IconCopy size={18} /> : <IconShare size={18} />} Compartilhar
            </button>
            <a className="btn btn--ghost btn--sm" href={mapsOpenLink()} {...ext}>
              <IconMapPin size={18} /> Ver no mapa
            </a>
          </Reveal>
        </div>
        <p className="sr-live" role="status" aria-live="polite">
          {shareMsg}
        </p>

        <Reveal className="tour__stage" variant="scale">
          {viewer}
        </Reveal>

        {scenes.length > 0 && (
          <p className="tour__help">
            Arraste para olhar ao redor · use as setas do teclado · <kbd>+</kbd>/<kbd>−</kbd> para aproximar
          </p>
        )}
      </div>
    </section>
  );
}
