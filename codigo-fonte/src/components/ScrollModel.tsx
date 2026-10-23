import { siteConfig } from '../data/siteConfig';
import { ext, whatsappLink } from '../lib/links';
import { IconArrowRight, IconImage, IconWhatsApp } from '../lib/icons';
import { Reveal, scrollToId, useScrollProgress } from '../lib/motion';
import { BrandRings } from './BrandRings';

const STEPS = [
  { kicker: 'Ficou um tempo parado?', text: 'Recomeçar faz parte. Você parte do ponto em que está hoje, sem cobrança pelo tempo que passou.' },
  { kicker: 'Nunca treinou?', text: 'Ninguém nasce sabendo usar os aparelhos. Você aprende com orientação, um passo de cada vez.' },
  { kicker: 'Já treina?', text: 'Siga evoluindo com acompanhamento, constância e um ambiente que respeita o seu ritmo.' },
];

/**
 * SEÇÃO 4 — Para quem quer começar ou recomeçar.
 * Modelo fitness com movimento sincronizado à rolagem (desktop: palco fixo enquanto a seção rola).
 * A variável --p (0→1) controla: entrada com máscara, deslocamento lateral/vertical,
 * troca de enquadramento (corpo inteiro → plano médio), giro dos anéis e destaque dos textos.
 * Nenhuma deformação anatômica: apenas transformações da imagem inteira.
 */
export function ScrollModel() {
  const ref = useScrollProgress<HTMLElement>('sticky');
  // progresso próprio da imagem: usado no celular, onde não há palco fixo
  const mediaRef = useScrollProgress<HTMLDivElement>('through', '--q');
  const m = siteConfig.model;
  const hasMedia = Boolean(m.video || m.imageFull);
  const isCutout = Boolean(m.cutout && m.imageFull && !m.video);

  return (
    <section id="comece" ref={ref} className="model" aria-labelledby="model-title">
      <div className="model__sticky">
        <div className="container model__grid">
          <div ref={mediaRef} className={`model__media ${isCutout ? 'model__media--cutout' : ''}`}>
            <BrandRings className="model__rings" />
            {isCutout ? (
              <div className="model__cutout">
                <span className="model__cutout-word" aria-hidden="true">
                  NO SEU
                  <br />
                  RITMO
                </span>
                <span className="model__cutout-glow" aria-hidden="true" />
                <img
                  className="model__cutout-img"
                  src={m.imageFull}
                  alt={m.alt}
                  width={m.width}
                  height={m.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
            <div className="model__frame">
              {m.video ? (
                <video
                  className="model__img"
                  src={m.video}
                  poster={m.imageFull || undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={m.alt}
                />
              ) : m.imageFull ? (
                <>
                  <img
                    className="model__img model__img--full"
                    src={m.imageFull}
                    alt={m.alt}
                    width={m.width}
                    height={m.height}
                    loading="lazy"
                    decoding="async"
                  />
                  {m.imageMedium && (
                    <img
                      className="model__img model__img--medium"
                      src={m.imageMedium}
                      alt=""
                      width={m.width}
                      height={m.height}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </>
              ) : (
                <div className="model__placeholder" aria-hidden={!siteConfig.showPlaceholderNotes}>
                  <div className="model__placeholder-beam" />
                  <span className="model__placeholder-word">RECO<br />MEÇO</span>
                  {siteConfig.showPlaceholderNotes && (
                    <p className="placeholder-note">
                      <IconImage size={16} /> Foto ou vídeo da modelo: preencha <code>siteConfig.model</code>
                    </p>
                  )}
                </div>
              )}
              <div className="model__frame-shade" aria-hidden="true" />
            </div>
            )}
            <div className="model__tag" aria-hidden="true">
              <span>Seu ritmo</span>
              <strong>{hasMedia ? 'Sua evolução' : 'Seu recomeço'}</strong>
            </div>
          </div>

          <div className="model__text">
            <Reveal as="p" className="eyebrow">
              <span className="eyebrow__dot" /> Começar ou recomeçar
            </Reveal>
            <Reveal as="h2" id="model-title" className="h2" delay={60}>
              Você não precisa estar em forma <em>para começar.</em>
            </Reveal>
            <Reveal as="p" className="lead" delay={120}>
              Se você ficou um tempo sem treinar ou está dando os primeiros passos, este pode ser o momento de retomar. Na
              Workout, a proposta é respeitar seu ritmo e buscar evolução com orientação.
            </Reveal>

            <ol className="model__steps">
              {STEPS.map((s, i) => (
                <li key={s.kicker} className="model__step" style={{ ['--i' as string]: i }}>
                  <span className="model__step-bar" aria-hidden="true" />
                  <div>
                    <strong>{s.kicker}</strong>
                    <span>{s.text}</span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="model__ctas">
              <a className="btn btn--primary btn--lg" href={whatsappLink('restart')} {...ext}>
                <IconWhatsApp size={20} /> Vamos conversar
              </a>
              <a
                className="btn btn--link"
                href="#planos"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId('planos');
                }}
              >
                Conhecer os planos <IconArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="model__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
