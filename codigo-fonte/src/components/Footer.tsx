import { useState } from 'react';
import { fullAddress, siteConfig } from '../data/siteConfig';
import { ext, mapsOpenLink, whatsappLink } from '../lib/links';
import { IconInstagram, IconMapPin, IconWhatsApp } from '../lib/icons';
import { scrollToId } from '../lib/motion';
import { NAV } from './Header';
import { Logo } from './Logo';

/** SEÇÃO 11 — Rodapé (sem CNPJ, e-mail ou dados jurídicos não fornecidos) */
export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo size={64} />
          <div>
            <strong>{siteConfig.name}</strong>
            <p>{siteConfig.messages.central}</p>
          </div>
        </div>

        <nav className="footer__nav" aria-label="Seções do site">
          <span className="footer__label">Navegação</span>
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(n.id);
                  }}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__contact">
          <span className="footer__label">Contato</span>
          <a href={whatsappLink('default')} {...ext}>
            <IconWhatsApp size={18} /> {siteConfig.contact.whatsappDisplay}
          </a>
          <a href={siteConfig.contact.instagramUrl} {...ext}>
            <IconInstagram size={18} /> {siteConfig.contact.instagramHandle}
          </a>
          <a href={mapsOpenLink()} {...ext}>
            <IconMapPin size={18} /> {fullAddress()}
          </a>
        </div>
      </div>

      <div className="container footer__legal">
        <p>
          © {year} {siteConfig.name}. Todos os direitos reservados.
        </p>
        <button type="button" className="footer__privacy-btn" aria-expanded={privacyOpen} aria-controls="privacy" onClick={() => setPrivacyOpen((o) => !o)}>
          Política de privacidade
        </button>
      </div>
      <div id="privacy" className="container footer__privacy" hidden={!privacyOpen}>
        <p>
          Este site não usa formulários nem coleta dados pessoais diretamente. Ao clicar nos botões de contato, você é
          direcionado ao WhatsApp, ao Instagram ou ao Google Maps, que têm suas próprias políticas de privacidade. O mapa
          incorporado é fornecido pelo Google. As informações sobre atividade física deste site são gerais e não
          substituem a avaliação de um profissional de saúde.
        </p>
      </div>
    </footer>
  );
}
