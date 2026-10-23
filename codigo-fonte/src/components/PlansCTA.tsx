import { siteConfig } from '../data/siteConfig';
import { ext, whatsappLink } from '../lib/links';
import { IconWhatsApp } from '../lib/icons';
import { Reveal, useScrollProgress } from '../lib/motion';
import { BrandRings } from './BrandRings';

/** SEÇÃO 7 — Chamada para conhecer os planos (sem preços ou promoções inventados) */
export function PlansCTA() {
  const ref = useScrollProgress<HTMLElement>('through');
  return (
    <section id="planos" ref={ref} className="plans" aria-labelledby="plans-title">
      <div className="plans__band" aria-hidden="true" />
      <BrandRings className="plans__rings" />
      {siteConfig.plansPerson.src && (
        <div className="plans__person">
          <img
            src={siteConfig.plansPerson.src}
            alt={siteConfig.plansPerson.alt}
            width={siteConfig.plansPerson.width}
            height={siteConfig.plansPerson.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="container plans__inner">
        <Reveal as="p" className="eyebrow eyebrow--dark">
          <span className="eyebrow__dot" /> Planos
        </Reveal>
        <Reveal as="h2" id="plans-title" className="plans__title" delay={60}>
          Seu próximo passo <span>começa aqui.</span>
        </Reveal>
        <Reveal as="p" className="plans__text" delay={120}>
          Quer conhecer as opções disponíveis e descobrir como começar a treinar? Nossa equipe pode ajudar você a encontrar
          a melhor forma de iniciar.
        </Reveal>
        <Reveal delay={180}>
          <a className="btn btn--dark btn--lg plans__btn" href={whatsappLink('plans')} {...ext}>
            <IconWhatsApp size={22} /> Consultar planos no WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
