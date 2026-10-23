import { useState } from 'react';
import { fullAddress, siteConfig } from '../data/siteConfig';
import { ext, mapsEmbedLink, mapsOpenLink, mapsRouteLink, whatsappLink } from '../lib/links';
import { IconClock, IconCopy, IconMapPin, IconRoute, IconWhatsApp } from '../lib/icons';
import { Reveal } from '../lib/motion';


/** SEÇÃO 8 — Localização e como chegar */
export function Location() {
  const [copied, setCopied] = useState(false);
  const address = fullAddress();
  const { hours } = siteConfig;
  // Na prévia hospedada, iframes externos são bloqueados; o cartão do mapa assume o lugar
  const canEmbed = typeof __ARTIFACT__ === 'undefined' || !__ARTIFACT__;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      const sel = window.getSelection();
      const el = document.getElementById('address-text');
      if (sel && el) {
        const r = document.createRange();
        r.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(r);
      }
    }
  };

  return (
    <section id="localizacao" className="section location" aria-labelledby="location-title">
      <div className="container location__grid">
        <div className="location__info">
          <Reveal as="p" className="eyebrow">
            <span className="eyebrow__dot" /> Localização
          </Reveal>
          <Reveal as="h2" id="location-title" className="h2" delay={60}>
            Estamos <em>esperando por você.</em>
          </Reveal>

          <Reveal as="address" className="location__card" delay={120}>
            <span className="location__icon">
              <IconMapPin size={24} />
            </span>
            <div>
              <span className="location__label">Endereço</span>
              <p id="address-text" className="location__address">
                {siteConfig.address.street}
                <br />
                {siteConfig.address.neighborhood}
                {siteConfig.address.city && (
                  <>
                    <br />
                    {siteConfig.address.city} - {siteConfig.address.state}
                  </>
                )}
              </p>
              <button type="button" className="location__copy" onClick={copy}>
                <IconCopy size={15} /> {copied ? 'Endereço copiado' : 'Copiar endereço'}
              </button>
            </div>
          </Reveal>

          <Reveal className="location__card" delay={160}>
            <span className="location__icon">
              <IconClock size={24} />
            </span>
            <div>
              <span className="location__label">Funcionamento</span>
              {hours.detailed.length ? (
                <dl className="location__hours">
                  {hours.detailed.map((h) => (
                    <div key={h.label}>
                      <dt>{h.label}</dt>
                      <dd>{h.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="location__address">
                  {hours.days}
                  <small>Consulte os horários com a equipe pelo WhatsApp.</small>
                </p>
              )}
            </div>
          </Reveal>

          <Reveal className="location__ctas" delay={200}>
            <a className="btn btn--primary" href={mapsOpenLink()} {...ext}>
              <IconMapPin size={18} /> Abrir no Google Maps
            </a>
            <a className="btn btn--ghost" href={mapsRouteLink()} {...ext}>
              <IconRoute size={18} /> Traçar rota
            </a>
            <a className="btn btn--link" href={whatsappLink('location')} {...ext}>
              <IconWhatsApp size={18} /> Pedir ajuda pelo WhatsApp
            </a>
          </Reveal>
        </div>

        <Reveal className="location__map" variant="scale" delay={100}>
          {canEmbed ? (
            <iframe
              src={mapsEmbedLink()}
              title={`Mapa: ${siteConfig.name}, ${address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <a className="map-card" href={mapsOpenLink()} {...ext} aria-label="Abrir a localização no Google Maps">
              <span className="map-card__grid" aria-hidden="true" />
              <span className="map-card__pin" aria-hidden="true">
                <IconMapPin size={30} />
              </span>
              <span className="map-card__text">
                <strong>{siteConfig.address.street}</strong>
                <span>Toque para abrir o mapa</span>
              </span>
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
