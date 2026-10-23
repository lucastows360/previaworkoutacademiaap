import { IconBolt, IconCalendarCheck, IconDumbbell, IconHeartPulse } from '../lib/icons';
import { Reveal } from '../lib/motion';

/** Benefícios gerais da atividade física regular — sem promessas nem números de transformação */
const ITEMS = [
  { icon: IconBolt, title: 'Mais disposição para o dia a dia', text: 'A prática regular de exercícios costuma ajudar a enfrentar a rotina com mais energia.' },
  { icon: IconDumbbell, title: 'Desenvolvimento de força', text: 'A musculação trabalha força e resistência, o que facilita tarefas simples do cotidiano.' },
  { icon: IconHeartPulse, title: 'Apoio à saúde e ao bem-estar', text: 'Movimento frequente é um aliado da saúde física e de um dia com menos tensão.' },
  { icon: IconCalendarCheck, title: 'Construção de hábitos saudáveis', text: 'Treinar com constância cria uma rotina que se sustenta, semana após semana.' },
];

/** SEÇÃO 5 — Benefícios de uma rotina de treinamento */
export function Benefits() {
  return (
    <section id="beneficios" className="section benefits" aria-labelledby="benefits-title">
      <div className="container">
        <div className="benefits__head">
          <Reveal as="p" className="eyebrow">
            <span className="eyebrow__dot" /> Rotina de treino
          </Reveal>
          <Reveal as="h2" id="benefits-title" className="h2" delay={60}>
            Pequenos passos. <em>Grandes mudanças na rotina.</em>
          </Reveal>
        </div>
        <ul className="benefits__grid">
          {ITEMS.map((it, i) => (
            <Reveal as="li" key={it.title} className="benefit" variant={i % 2 ? 'right' : 'left'} delay={i * 90}>
              <span className="benefit__icon">
                <it.icon size={28} />
              </span>
              <h3 className="benefit__title">{it.title}</h3>
              <p className="benefit__text">{it.text}</p>
            </Reveal>
          ))}
        </ul>
        <p className="benefits__disclaimer">
          Resultados variam de pessoa para pessoa. Em caso de condição de saúde, consulte um profissional antes de iniciar.
        </p>
      </div>
    </section>
  );
}
