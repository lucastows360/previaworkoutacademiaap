import type { SVGProps } from 'react';

/**
 * Ícones em SVG inline (traço 2px, estilo linear).
 * Sem dependências externas: carregam junto com o HTML e herdam a cor do texto.
 */
type P = SVGProps<SVGSVGElement> & { size?: number };

const Base = ({ size = 22, children, ...rest }: P & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
);

export const IconMenu = (p: P) => <Base {...p}><path d="M4 7h16M4 12h16M4 17h10" /></Base>;
export const IconClose = (p: P) => <Base {...p}><path d="M6 6l12 12M18 6L6 18" /></Base>;
export const IconChevronDown = (p: P) => <Base {...p}><path d="M6 9l6 6 6-6" /></Base>;
export const IconChevronLeft = (p: P) => <Base {...p}><path d="M15 6l-6 6 6 6" /></Base>;
export const IconChevronRight = (p: P) => <Base {...p}><path d="M9 6l6 6-6 6" /></Base>;
export const IconChevronUp = (p: P) => <Base {...p}><path d="M6 15l6-6 6 6" /></Base>;
export const IconPlus = (p: P) => <Base {...p}><path d="M12 5v14M5 12h14" /></Base>;
export const IconMinus = (p: P) => <Base {...p}><path d="M5 12h14" /></Base>;
export const IconArrowRight = (p: P) => <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>;
export const IconMaximize = (p: P) => (
  <Base {...p}><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" /></Base>
);
export const IconMinimize = (p: P) => (
  <Base {...p}><path d="M3 8h5V3M21 8h-5V3M16 21v-5h5M8 21v-5H3" /></Base>
);
export const IconRotate = (p: P) => (
  <Base {...p}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 3v6h6" /></Base>
);
export const IconPause = (p: P) => <Base {...p}><path d="M9 5v14M15 5v14" /></Base>;
export const IconPlay = (p: P) => <Base {...p}><path d="M7 5l12 7-12 7z" /></Base>;
export const IconMapPin = (p: P) => (
  <Base {...p}><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.6" /></Base>
);
export const IconRoute = (p: P) => (
  <Base {...p}><circle cx="6" cy="19" r="2.5" /><circle cx="18" cy="5" r="2.5" /><path d="M8.5 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.5" /></Base>
);
export const IconInstagram = (p: P) => (
  <Base {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" /></Base>
);
export const IconWhatsApp = ({ size = 22, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...rest}>
    <path
      fill="currentColor"
      d="M12 2.2A9.7 9.7 0 0 0 3.7 16.9L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3z"
    />
  </svg>
);
export const IconShare = (p: P) => (
  <Base {...p}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" /></Base>
);
export const IconDumbbell = (p: P) => (
  <Base {...p}><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" /></Base>
);
export const IconHeartPulse = (p: P) => (
  <Base {...p}><path d="M19.5 12.6 12 20l-7.5-7.4A4.9 4.9 0 0 1 12 6a4.9 4.9 0 0 1 7.5 6.6z" /><path d="M4 12h4l1.5-2.5 3 5L14 12h6" /></Base>
);
export const IconHome = (p: P) => (
  <Base {...p}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></Base>
);
export const IconTrending = (p: P) => (
  <Base {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></Base>
);
export const IconBolt = (p: P) => <Base {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></Base>;
export const IconCalendarCheck = (p: P) => (
  <Base {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18M9 15l2 2 4-4" /></Base>
);
export const IconClock = (p: P) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Base>;
export const IconMove = (p: P) => (
  <Base {...p}><path d="M5 9l-3 3 3 3M19 9l3 3-3 3M2 12h20" /></Base>
);
export const IconImage = (p: P) => (
  <Base {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></Base>
);
export const Icon360 = (p: P) => (
  <Base {...p}><ellipse cx="12" cy="12" rx="10" ry="4.5" /><path d="M12 7.5c2.5 0 4.5 2 4.5 4.5" /><path d="M15 9.5l1.5 2.5 2-2" /></Base>
);
export const IconSprout = (p: P) => (
  <Base {...p}><path d="M12 21v-8" /><path d="M12 13C12 9 9 6 4 6c0 4 3 7 8 7z" /><path d="M12 11c0-3.5 2.5-6 7-6 0 3.5-2.5 6-7 6z" /></Base>
);
export const IconCopy = (p: P) => (
  <Base {...p}><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></Base>
);
