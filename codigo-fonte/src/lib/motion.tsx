import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type RefObject,
} from 'react';

/**
 * Camada de animação leve do site.
 * - Reveal: entrada de elementos ao aparecerem na tela (fade + deslocamento / escala / lateral).
 * - useScrollProgress: escreve a variável CSS --p (0 → 1) conforme a rolagem, sem re-render.
 * - Respeita prefers-reduced-motion em tudo.
 */

const isoLayout = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const fn = () => setReduced(mq.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
  }, []);
  return reduced;
}

type RevealProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  /** up (padrão) | left | right | scale | fade */
  variant?: 'up' | 'left' | 'right' | 'scale' | 'fade';
  delay?: number;
  style?: CSSProperties;
  [key: string]: unknown;
};

/**
 * O elemento começa visível (página completa mesmo sem JS).
 * Só fica "armado" para animar se estiver abaixo da área visível no carregamento.
 */
export function Reveal({ as = 'div', children, className = '', variant = 'up', delay = 0, style, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'rest' | 'armed' | 'in'>('rest');

  isoLayout(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92) return; // já está na tela: fica parado e visível
    setState('armed');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('in');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      className: `reveal reveal--${variant} ${state === 'armed' ? 'is-armed' : ''} ${state === 'in' ? 'is-in' : ''} ${className}`.trim(),
      style: { ...style, transitionDelay: state === 'in' ? `${delay}ms` : undefined },
      ...rest,
    },
    children,
  );
}

/**
 * Escreve --p (ou outra variável) de 0 a 1 no elemento conforme ele atravessa a viewport.
 * mode 'through': 0 quando o topo entra por baixo, 1 quando a base sai por cima.
 * mode 'sticky': 0 quando o topo encosta no topo da tela, 1 quando a base encosta na base.
 */
export function useScrollProgress<T extends HTMLElement>(
  mode: 'through' | 'sticky' = 'through',
  varName = '--p',
): RefObject<T> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty(varName, mode === 'sticky' ? '1' : '0.5');
      return;
    }
    let raf = 0;
    let visible = true;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === 'sticky') {
        const total = r.height - vh;
        p = total > 0 ? -r.top / total : 0;
      } else {
        p = (vh - r.top) / (vh + r.height);
      }
      p = Math.min(1, Math.max(0, p));
      el.style.setProperty(varName, p.toFixed(4));
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(el);
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mode, varName]);
  return ref;
}

/** Rolagem suave até uma âncora, respeitando movimento reduzido e a altura do menu */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  // move o foco para a seção (acessibilidade de teclado)
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
