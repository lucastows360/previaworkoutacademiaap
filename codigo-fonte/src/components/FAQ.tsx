import { useId, useState, type ReactNode } from 'react';
import { fullAddress, siteConfig } from '../data/siteConfig';
import { ext, mapsOpenLink, whatsappLink } from '../lib/links';
import { IconPlus } from '../lib/icons';
import { Reveal } from '../lib/motion';

/** Respostas usam somente informações publicadas pela academia; o resto é direcionado ao WhatsApp */
const QA: { q: string; a: ReactNode }[] = [
  {
    q: 'Como faço para começar a treinar?',
    a: (
      <>
        Chame a equipe no{' '}
        <a href={whatsappLink('start')} {...ext}>WhatsApp</a>. Eles explicam como funciona o início e ajudam você a
        encontrar o melhor caminho para a sua rotina.
      </>
    ),
  },
  {
    q: 'Como posso conhecer os planos?',
    a: (
      <>
        Os planos e valores são apresentados diretamente pela equipe. É só{' '}
        <a href={whatsappLink('plans')} {...ext}>enviar uma mensagem</a> contando um pouco da sua rotina.
      </>
    ),
  },
  {
    q: 'Posso conhecer a academia antes de me matricular?',
    a: (
      <>
        Sim. A Workout divulga a possibilidade de agendar uma aula experimental. Combine o melhor dia pelo{' '}
        <a href={whatsappLink('visit')} {...ext}>WhatsApp</a>.
      </>
    ),
  },
  {
    q: 'Como entro em contato com a equipe?',
    a: (
      <>
        Pelo WhatsApp <a href={whatsappLink('default')} {...ext}>{siteConfig.contact.whatsappDisplay}</a> ou pelo
        Instagram <a href={siteConfig.contact.instagramUrl} {...ext}>{siteConfig.contact.instagramHandle}</a>.
      </>
    ),
  },
  {
    q: 'Onde fica a Workout Academia?',
    a: (
      <>
        {fullAddress()}. Funcionamos de {siteConfig.hours.days.toLowerCase()}.{' '}
        <a href={mapsOpenLink()} {...ext}>Abrir no Google Maps</a>.
      </>
    ),
  },
];

/** SEÇÃO 9 — Dúvidas frequentes (acordeão acessível com animação de altura) */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  return (
    <section id="duvidas" className="section faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__head">
          <Reveal as="p" className="eyebrow">
            <span className="eyebrow__dot" /> Dúvidas
          </Reveal>
          <Reveal as="h2" id="faq-title" className="h2" delay={60}>
            Perguntas <em>frequentes.</em>
          </Reveal>
          <Reveal as="p" className="lead" delay={120}>
            Não encontrou o que procurava? <a href={whatsappLink('default')} {...ext}>Fale com a equipe</a>.
          </Reveal>
        </div>
        <div className="faq__list">
          {QA.map((item, i) => {
            const isOpen = open === i;
            const btnId = `${uid}-b${i}`;
            const panelId = `${uid}-p${i}`;
            return (
              <Reveal key={item.q} className={`faq__item ${isOpen ? 'is-open' : ''}`} delay={i * 60}>
                <h3>
                  <button
                    type="button"
                    id={btnId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="faq__icon" aria-hidden="true">
                      <IconPlus size={20} />
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={btnId} className="faq__panel" inert={!isOpen ? true : undefined}>
                  <div className="faq__panel-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
