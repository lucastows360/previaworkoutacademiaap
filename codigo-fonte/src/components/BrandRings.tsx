/**
 * Elemento gráfico de anéis concêntricos inspirado nas peças da marca no Instagram
 * (arcos laranja em torno do símbolo). Decorativo.
 */
export function BrandRings({ className = '' }: { className?: string }) {
  return (
    <svg className={`brand-rings ${className}`} viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <circle cx="200" cy="200" r="190" fill="none" stroke="var(--orange)" strokeWidth="18" strokeDasharray="820 380" strokeLinecap="round" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="var(--orange)" strokeOpacity=".55" strokeWidth="10" strokeDasharray="520 420" strokeLinecap="round" />
      <circle cx="200" cy="200" r="112" fill="none" stroke="var(--steel)" strokeOpacity=".5" strokeWidth="2" strokeDasharray="4 10" />
    </svg>
  );
}
