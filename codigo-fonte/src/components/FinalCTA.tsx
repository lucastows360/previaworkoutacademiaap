import { siteConfig } from '../data/siteConfig';
import { ext, whatsappLink } from '../lib/links';
import { Icon360, IconWhatsApp } from '../lib/icons';
import { Reveal, scrollToId, useScrollProgress } from '../lib/motion';
import { BrandRings } from './BrandRings';
import { Logo } from './Logo';

/** SEÇÃO 10 — Chamada final */
export function FinalCTA() {
  const ref = useScrollProgress<HTMLElement>('through');
  const img = siteConfig.finalCtaImage;
  return (
    <section ref={ref} className="final" aria-labelledby="final-title">
      <div className="final__bg" aria-hidden="true">
        {img ? <img src={img} alt="" loading="lazy" decoding="async" width={1920} height={1080} /> : <div className="final__bg-fallback" />}
      </div>
      <BrandRings className="final__rings" />
      <div className="container final__inner">
        <Reveal variant="scale">
          <Logo size={88} className="final__logo" />
        </Reveal>
        <Reveal as="h2" id="final-title" className="final__title" delay={80}>
          Não espere o momento perfeito. <span>Dê o primeiro passo.</span>
        </Reveal>
        <Reveal as="p" className="final__sub" delay={140}>
          {siteConfig.messages.support2}
        </Reveal>
        <Reveal className="final__ctas" delay={200}>
          <a className="btn btn--primary btn--lg" href={whatsappLink('start')} {...ext}>
            <IconWhatsApp size={20} /> Começar pelo WhatsApp
          </a>
          <a
            className="btn btn--ghost btn--lg"
            href="#tour"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('tour');
            }}
          >
            <Icon360 size={20} /> Explorar tour 360°
          </a>
        </Reveal>
      </div>
    </section>
  );
}
