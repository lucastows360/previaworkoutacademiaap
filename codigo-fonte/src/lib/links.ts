import { siteConfig, fullAddress } from '../data/siteConfig';

type MessageKey = keyof typeof siteConfig.whatsappMessages;

/** Link do WhatsApp com mensagem pré-preenchida conforme a origem do clique */
export const whatsappLink = (key: MessageKey = 'default') =>
  `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappMessages[key],
  )}`;

export const mapsOpenLink = () =>
  siteConfig.maps.shareUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteConfig.name}, ${fullAddress()}`)}`;

export const mapsRouteLink = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress())}`;

export const mapsEmbedLink = () =>
  siteConfig.maps.embedUrl ||
  `https://www.google.com/maps?q=${encodeURIComponent(fullAddress())}&z=16&output=embed`;

/** Atributos padrão para links externos em nova aba */
export const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;
