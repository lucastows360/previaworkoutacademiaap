import { IconDumbbell, IconHome, IconTrending } from '../lib/icons';
import { Reveal, useScrollProgress } from '../lib/motion';

const PILLARS = [
  {
    icon: IconDumbbell,
    title: 'Treino com orientação',
    text: 'Você não fica sozinho diante dos aparelhos. A proposta é treinar com direção e segurança, do primeiro dia em diante.',
  },
  {
    icon: IconHome,
    title: 'Ambiente acolhedor',
    text: 'Um espaço sem julgamentos, para quem está começando, recomeçando ou já treina há anos.',
  },
  {
    icon: IconTrending,
    title: 'Evolução no seu ritmo',
    text: 'Cada pessoa tem a sua história. O progresso respeita o seu tempo, a sua rotina e o seu corpo.',
  },
];

/** SEÇÃO 2 — Conheça a Workout */
export function About() {
  const ref = useScrollProgress<HTMLElement>('through');
  return (
    <section id="sobre" ref={ref} className="section about" aria-labelledby="about-title">
      <div className="about__bgword" aria-hidden="true">NO SEU RITMO</div>
      <div className="container">
        <div className="about__head">
          <Reveal as="p" className="eyebrow">
            <span className="eyebrow__dot" /> Conheça a Workout
          </Reveal>
          <Reveal as="h2" id="about-title" className="h2" delay={60}>
            Mais do que treinar. <em>Uma nova forma de cuidar de você.</em>
          </Reveal>
          <Reveal as="p" className="lead" delay={120}>
            Na Workout Academia, acreditamos que cada pessoa tem seu próprio ritmo e sua própria história. Nosso
            propósito é tornar a musculação mais acessível, orientada e acolhedora, para que você possa cuidar da sua
            saúde e evoluir com confiança.
          </Reveal>
        </div>

        <ul className="pillars">
          {PILLARS.map((p, i) => (
            <Reveal as="li" key={p.title} className="pillar" variant="left" delay={i * 110}>
              <span className="pillar__icon">
                <p.icon size={26} />
              </span>
              <h3 className="pillar__title">{p.title}</h3>
              <p className="pillar__text">{p.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
