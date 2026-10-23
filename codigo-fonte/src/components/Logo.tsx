import { useState } from 'react';
import { siteConfig } from '../data/siteConfig';

/** Logotipo oficial (arquivo em /public/logo). Proporção sempre preservada (círculo 1:1). */
export function Logo({ size = 48, className = '' }: { size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    // Só aparece se o arquivo do logo estiver ausente
    return (
      <span className={`logo logo--missing ${className}`} style={{ width: size, height: size }} role="img" aria-label={siteConfig.logo.alt}>
        W
      </span>
    );
  }
  return (
    <picture className={`logo ${className}`}>
      <source srcSet={siteConfig.logo.src} type="image/webp" />
      <img
        src={siteConfig.logo.fallbackSrc}
        alt={siteConfig.logo.alt}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
        decoding="async"
      />
    </picture>
  );
}
