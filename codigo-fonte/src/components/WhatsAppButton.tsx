import { useEffect, useState } from 'react';
import { ext, whatsappLink } from '../lib/links';
import { IconWhatsApp } from '../lib/icons';

/** Botão flutuante do WhatsApp (canto inferior direito). Some sobre o rodapé para não cobrir conteúdo. */
export function WhatsAppButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 160;
      setShow(window.scrollY > window.innerHeight * 0.6 && !nearBottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <a
      className={`wa-float ${show ? 'is-visible' : ''}`}
      href={whatsappLink('floating')}
      {...ext}
      aria-label="Conversar com a Workout Academia no WhatsApp (abre em nova aba)"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
    >
      <IconWhatsApp size={28} />
      <span className="wa-float__label">Fale com a gente</span>
    </a>
  );
}

/** Barra de progresso de leitura no topo */
export function ScrollProgress() {
  useEffect(() => {
    let raf = 0;
    const el = document.documentElement;
    const fn = () => {
      raf = 0;
      const max = el.scrollHeight - window.innerHeight;
      el.style.setProperty('--read', String(max > 0 ? window.scrollY / max : 0));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(fn);
    };
    fn();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  return <div className="read-progress" aria-hidden="true" />;
}
