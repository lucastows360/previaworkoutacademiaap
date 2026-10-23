import { useEffect, useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import { ext, whatsappLink } from '../lib/links';
import { IconClose, IconInstagram, IconMenu, IconWhatsApp } from '../lib/icons';
import { scrollToId } from '../lib/motion';
import { Logo } from './Logo';

export const NAV = [
  { id: 'sobre', label: 'A Workout' },
  { id: 'tour', label: 'Tour 360°' },
  { id: 'comece', label: 'Comece' },
  { id: 'beneficios', label: 'Benefícios' },
  { id: 'estrutura', label: 'Estrutura' },
  { id: 'localizacao', label: 'Localização' },
  { id: 'duvidas', label: 'Dúvidas' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Destaca o item do menu da seção visível
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="header__inner">
        <a href="#inicio" className="header__brand" onClick={go('inicio')} aria-label="Workout Academia — voltar ao início">
          <Logo size={44} />
          <span className="header__name">
            Workout<small>Academia</small>
          </span>
        </a>

        <nav className="header__nav" aria-label="Navegação principal">
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={go(n.id)} aria-current={active === n.id ? 'true' : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <a className="icon-btn" href={siteConfig.contact.instagramUrl} {...ext} aria-label="Instagram da Workout Academia (abre em nova aba)">
            <IconInstagram size={20} />
          </a>
          <a className="btn btn--primary btn--sm header__cta" href={whatsappLink('start')} {...ext}>
            <IconWhatsApp size={18} /> Quero treinar
          </a>
          <button
            type="button"
            className="icon-btn header__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Navegação do celular">
          <ul>
            {NAV.map((n, i) => (
              <li key={n.id} style={{ ['--i' as string]: i }}>
                <a href={`#${n.id}`} onClick={go(n.id)}>
                  <span className="mobile-menu__num">{String(i + 1).padStart(2, '0')}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__foot">
          <a className="btn btn--primary btn--block" href={whatsappLink('start')} {...ext}>
            <IconWhatsApp size={20} /> Falar no WhatsApp
          </a>
          <a className="btn btn--ghost btn--block" href={siteConfig.contact.instagramUrl} {...ext}>
            <IconInstagram size={20} /> {siteConfig.contact.instagramHandle}
          </a>
        </div>
      </div>
    </header>
  );
}
