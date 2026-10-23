import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { PanoramaScene } from '../data/siteConfig';
import {
  IconChevronLeft,
  IconChevronRight,
  IconMaximize,
  IconMinimize,
  IconMinus,
  IconPause,
  IconPlay,
  IconPlus,
  IconChevronUp,
  IconChevronDown,
} from '../lib/icons';
import { prefersReducedMotion } from '../lib/motion';

/**
 * Visualizador panorâmico 360° em WebGL puro.
 * - Recebe imagens equirretangulares (proporção 2:1) e as projeta numa esfera virtual.
 * - Arraste (mouse/toque), pinça e roda do mouse para zoom, setas do teclado, botões de controle.
 * - Hotspots navegáveis entre ambientes, tela cheia, carregamento com progresso.
 * - Recusa fotos comuns: se a imagem não tiver proporção 2:1, não é apresentada como 360°.
 */

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main(){ v_uv = a_pos; gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_tanHalf;
uniform float u_aspect;
const float PI = 3.141592653589793;
void main(){
  float cy = cos(u_yaw), sy = sin(u_yaw), cp = cos(u_pitch), sp = sin(u_pitch);
  vec3 f = vec3(sy*cp, sp, -cy*cp);
  vec3 r = vec3(cy, 0.0, sy);
  vec3 u = vec3(-sy*sp, cp, cy*sp);
  vec3 d = normalize(f + v_uv.x*u_tanHalf*u_aspect*r + v_uv.y*u_tanHalf*u);
  float lon = atan(d.x, -d.z);
  float lat = asin(clamp(d.y, -1.0, 1.0));
  vec2 tc = vec2(0.5 + lon/(2.0*PI), 0.5 - lat/PI);
  gl_FragColor = texture2D(u_tex, tc);
}`;

const DEG = Math.PI / 180;
const MIN_FOV = 35 * DEG;
const MAX_FOV = 100 * DEG;
const MAX_PITCH = 85 * DEG;

type Status = 'idle' | 'loading' | 'ready' | 'error' | 'not-panorama' | 'no-webgl';

type Props = {
  scenes: PanoramaScene[];
  /** Conteúdo exibido quando não há cenas ou ocorre um erro */
  fallback: ReactNode;
  autoRotate?: boolean;
  /** Mostra miniaturas dos ambientes */
  showThumbs?: boolean;
  /** Mostra os controles de giro/zoom */
  showControls?: boolean;
  className?: string;
  label: string;
  /** Na capa, não captura a rolagem vertical do celular */
  allowPageScroll?: boolean;
  onReady?: () => void;
};

function loadImageWithProgress(src: string, onProgress: (p: number) => void, signal: AbortSignal) {
  return new Promise<HTMLImageElement>(async (resolve, reject) => {
    try {
      let url = src;
      // Usa fetch com streaming para medir o progresso quando o servidor informa o tamanho
      if (typeof ReadableStream !== 'undefined' && !src.startsWith('data:')) {
        const res = await fetch(src, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const total = Number(res.headers.get('content-length')) || 0;
        if (res.body && total) {
          const reader = res.body.getReader();
          const chunks: Uint8Array[] = [];
          let received = 0;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;
            onProgress(Math.min(0.98, received / total));
          }
          url = URL.createObjectURL(new Blob(chunks));
        } else {
          url = URL.createObjectURL(await res.blob());
        }
      }
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        onProgress(1);
        resolve(img);
      };
      img.onerror = () => reject(new Error('Falha ao decodificar a imagem'));
      img.src = url;
    } catch (e) {
      reject(e);
    }
  });
}

function PanoramaViewerImpl({
  scenes,
  fallback,
  autoRotate = true,
  showThumbs = true,
  showControls = true,
  className = '',
  label,
  allowPageScroll = false,
  onReady,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hotspotLayer = useRef<HTMLDivElement>(null);
  const glRef = useRef<{
    gl: WebGLRenderingContext;
    tex: WebGLTexture;
    loc: Record<string, WebGLUniformLocation | null>;
  } | null>(null);
  const view = useRef({ yaw: 0, pitch: 0, fov: 80 * DEG, vyaw: 0, vpitch: 0 });
  const dirty = useRef(true);
  const rotating = useRef(autoRotate && !prefersReducedMotion());
  const visible = useRef(true);

  const [sceneIdx, setSceneIdx] = useState(0);
  const [status, setStatus] = useState<Status>(scenes.length ? 'idle' : 'error');
  const [progress, setProgress] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const [isRotating, setIsRotating] = useState(rotating.current);
  const [errorMsg, setErrorMsg] = useState('');

  const scene = scenes[sceneIdx];

  /* ---------- WebGL ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !scenes.length) return;
    const gl = (canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false }) ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) {
      setStatus('no-webgl');
      return;
    }
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
      return s;
    };
    try {
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(prog, 'a_pos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      const loc = {
        yaw: gl.getUniformLocation(prog, 'u_yaw'),
        pitch: gl.getUniformLocation(prog, 'u_pitch'),
        tanHalf: gl.getUniformLocation(prog, 'u_tanHalf'),
        aspect: gl.getUniformLocation(prog, 'u_aspect'),
      };
      glRef.current = { gl, tex, loc };
    } catch {
      setStatus('no-webgl');
    }
    return () => {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      glRef.current = null;
    };
  }, [scenes.length]);

  /* ---------- carregamento da cena ---------- */
  useEffect(() => {
    if (!scene || !glRef.current) return;
    const ctrl = new AbortController();
    setStatus('loading');
    setProgress(0);
    loadImageWithProgress(scene.src, setProgress, ctrl.signal)
      .then((img) => {
        if (ctrl.signal.aborted || !glRef.current) return;
        const ratio = img.naturalWidth / img.naturalHeight;
        if (Math.abs(ratio - 2) > 0.08) {
          // Foto comum: não apresentamos como se fosse um panorama 360°
          setErrorMsg(
            `A imagem "${scene.src}" tem proporção ${ratio.toFixed(2)}:1. Um panorama 360° equirretangular precisa ter proporção 2:1.`,
          );
          setStatus('not-panorama');
          return;
        }
        const { gl, tex } = glRef.current;
        const max = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
        let source: TexImageSource = img;
        if (img.naturalWidth > max) {
          // Reduz panoramas maiores que o limite da GPU (comum em celulares)
          const c = document.createElement('canvas');
          c.width = max;
          c.height = max / 2;
          c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
          source = c;
        }
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
        if (img.src.startsWith('blob:')) URL.revokeObjectURL(img.src);
        view.current.yaw = (scene.initialYaw ?? 0) * DEG;
        view.current.pitch = (scene.initialPitch ?? 0) * DEG;
        dirty.current = true;
        setStatus('ready');
        onReady?.();
      })
      .catch((e: Error) => {
        if (ctrl.signal.aborted) return;
        setErrorMsg(`Não foi possível carregar "${scene.src}" (${e.message}).`);
        setStatus('error');
      });
    return () => ctrl.abort();
  }, [scene, onReady]);

  /* ---------- loop de renderização ---------- */
  useEffect(() => {
    if (status !== 'ready') return;
    const canvas = canvasRef.current!;
    const ctx = glRef.current;
    if (!ctx) return;
    const { gl, loc } = ctx;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        dirty.current = true;
      }
    };

    const placeHotspots = () => {
      const layer = hotspotLayer.current;
      if (!layer) return;
      const v = view.current;
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      const t = Math.tan(v.fov / 2);
      const aspect = W / H;
      const cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pitch), sp = Math.sin(v.pitch);
      const f = [sy * cp, sp, -cy * cp];
      const r = [cy, 0, sy];
      const u = [-sy * sp, cp, cy * sp];
      layer.querySelectorAll<HTMLElement>('[data-yaw]').forEach((el) => {
        const hy = Number(el.dataset.yaw) * DEG;
        const hp = Number(el.dataset.pitch) * DEG;
        const d = [Math.sin(hy) * Math.cos(hp), Math.sin(hp), -Math.cos(hy) * Math.cos(hp)];
        const df = d[0] * f[0] + d[1] * f[1] + d[2] * f[2];
        if (df <= 0.05) {
          el.style.visibility = 'hidden';
          return;
        }
        const sx = (d[0] * r[0] + d[1] * r[1] + d[2] * r[2]) / df / (t * aspect);
        const syy = (d[0] * u[0] + d[1] * u[1] + d[2] * u[2]) / df / t;
        el.style.visibility = Math.abs(sx) > 1.1 || Math.abs(syy) > 1.1 ? 'hidden' : 'visible';
        el.style.transform = `translate(${((sx + 1) / 2) * W}px, ${((1 - syy) / 2) * H}px) translate(-50%, -50%)`;
      });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible.current) return;
      const v = view.current;
      if (rotating.current) {
        v.yaw += dt * 4 * DEG;
        dirty.current = true;
      }
      if (Math.abs(v.vyaw) > 1e-4 || Math.abs(v.vpitch) > 1e-4) {
        v.yaw += v.vyaw;
        v.pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, v.pitch + v.vpitch));
        v.vyaw *= 0.9;
        v.vpitch *= 0.9;
        dirty.current = true;
      }
      resize();
      if (!dirty.current) return;
      dirty.current = false;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(loc.yaw, v.yaw);
      gl.uniform1f(loc.pitch, v.pitch);
      gl.uniform1f(loc.tanHalf, Math.tan(v.fov / 2));
      gl.uniform1f(loc.aspect, canvas.width / canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      placeHotspots();
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (visible.current) dirty.current = true;
    });
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [status]);

  /* ---------- interação ---------- */
  const stopAuto = useCallback(() => {
    rotating.current = false;
    setIsRotating(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || status !== 'ready') return;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchDist = 0;
    let startX = 0;
    let startY = 0;
    let axisLocked: 'h' | 'v' | null = null;

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      startX = e.clientX;
      startY = e.clientY;
      axisLocked = null;
      if (e.pointerType !== 'touch' || !allowPageScroll) canvas.setPointerCapture(e.pointerId);
      stopAuto();
      view.current.vyaw = view.current.vpitch = 0;
      canvas.classList.add('is-dragging');
    };
    const move = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const v = view.current;
      if (pointers.size === 2) {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDist) zoomBy((pinchDist - dist) * 0.004);
        pinchDist = dist;
        return;
      }
      // Na capa, gestos verticais no celular continuam rolando a página
      if (e.pointerType === 'touch' && allowPageScroll && !axisLocked) {
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx + dy > 8) axisLocked = dx > dy ? 'h' : 'v';
      }
      if (axisLocked === 'v') return;
      const H = canvas.clientHeight || 1;
      const dyaw = (-(e.clientX - prev.x) / H) * v.fov;
      const dpitch = ((e.clientY - prev.y) / H) * v.fov;
      v.yaw += dyaw;
      if (!(e.pointerType === 'touch' && allowPageScroll)) {
        v.pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, v.pitch + dpitch));
        v.vpitch = dpitch * 0.6;
      }
      v.vyaw = dyaw * 0.6;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      dirty.current = true;
    };
    const up = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchDist = 0;
      if (!pointers.size) canvas.classList.remove('is-dragging');
    };
    const wheel = (e: WheelEvent) => {
      // Zoom pela roda apenas com o cursor sobre o tour e fora da capa (não sequestra a rolagem)
      if (allowPageScroll && !e.ctrlKey) return;
      e.preventDefault();
      stopAuto();
      zoomBy(e.deltaY * 0.0015);
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', wheel, { passive: false });
    return () => {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('wheel', wheel);
    };
  }, [status, allowPageScroll, stopAuto]);

  const zoomBy = (delta: number) => {
    const v = view.current;
    v.fov = Math.max(MIN_FOV, Math.min(MAX_FOV, v.fov * (1 + delta)));
    dirty.current = true;
  };
  const rotateBy = (dyaw: number, dpitch = 0) => {
    stopAuto();
    const v = view.current;
    v.vyaw = (dyaw * DEG) / 8;
    v.vpitch = (dpitch * DEG) / 8;
  };

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, () => void> = {
      ArrowLeft: () => rotateBy(-20),
      ArrowRight: () => rotateBy(20),
      ArrowUp: () => rotateBy(0, 12),
      ArrowDown: () => rotateBy(0, -12),
      '+': () => zoomBy(-0.12),
      '=': () => zoomBy(-0.12),
      '-': () => zoomBy(0.12),
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      stopAuto();
      fn();
    }
  };

  /* ---------- tela cheia ---------- */
  useEffect(() => {
    const fn = () => setIsFull(document.fullscreenElement === wrapRef.current);
    document.addEventListener('fullscreenchange', fn);
    return () => document.removeEventListener('fullscreenchange', fn);
  }, []);
  const toggleFull = async () => {
    const el = wrapRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    if (!el) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (el.requestFullscreen) await el.requestFullscreen();
      else el.webkitRequestFullscreen?.();
    } catch {
      /* alguns navegadores (iPhone) não permitem tela cheia em elementos */
    }
  };

  const toggleRotate = () => {
    rotating.current = !rotating.current;
    setIsRotating(rotating.current);
  };

  if (!scenes.length) return <div className={`pano pano--empty ${className}`}>{fallback}</div>;

  const failed = status === 'error' || status === 'not-panorama' || status === 'no-webgl';

  return (
    <div
      ref={wrapRef}
      className={`pano ${className} ${isFull ? 'is-full' : ''}`}
      role="region"
      aria-roledescription="visualizador panorâmico 360 graus"
      aria-label={label}
    >
      <canvas
        ref={canvasRef}
        className={`pano__canvas ${allowPageScroll ? 'pano__canvas--scrollable' : ''}`}
        tabIndex={0}
        aria-label={`${scene?.title ?? 'Panorama'} — arraste para olhar ao redor; use as setas do teclado para girar e + ou − para aproximar`}
        onKeyDown={onKey}
      />

      {/* Hotspots */}
      <div ref={hotspotLayer} className="pano__hotspots">
        {status === 'ready' &&
          scene?.hotspots?.map((h, i) => {
            const target = h.targetScene ? scenes.findIndex((s) => s.id === h.targetScene) : -1;
            return (
              <button
                key={`${scene.id}-${i}`}
                type="button"
                className="pano__hotspot"
                data-yaw={h.yaw}
                data-pitch={h.pitch}
                onClick={() => target >= 0 && setSceneIdx(target)}
                aria-label={h.label}
              >
                <span className="pano__hotspot-dot" />
                <span className="pano__hotspot-label">{h.label}</span>
              </button>
            );
          })}
      </div>

      {status === 'loading' && (
        <div className="pano__loading" role="status" aria-live="polite">
          <div className="pano__ring" style={{ ['--prog' as string]: progress }} />
          <span>Carregando tour 360° · {Math.round(progress * 100)}%</span>
        </div>
      )}

      {failed && (
        <div className="pano__error">
          {fallback}
          {errorMsg && <p className="pano__error-msg">{errorMsg}</p>}
          {status === 'no-webgl' && (
            <p className="pano__error-msg">Seu navegador não oferece suporte ao modo 360°.</p>
          )}
        </div>
      )}

      {status === 'ready' && showControls && (
        <div className="pano__controls" role="toolbar" aria-label="Controles do tour 360°">
          <button type="button" onClick={() => rotateBy(-25)} aria-label="Girar para a esquerda"><IconChevronLeft /></button>
          <button type="button" onClick={() => rotateBy(0, 14)} aria-label="Olhar para cima"><IconChevronUp /></button>
          <button type="button" onClick={() => rotateBy(0, -14)} aria-label="Olhar para baixo"><IconChevronDown /></button>
          <button type="button" onClick={() => rotateBy(25)} aria-label="Girar para a direita"><IconChevronRight /></button>
          <span className="pano__sep" aria-hidden="true" />
          <button type="button" onClick={() => zoomBy(-0.15)} aria-label="Aproximar"><IconPlus /></button>
          <button type="button" onClick={() => zoomBy(0.15)} aria-label="Afastar"><IconMinus /></button>
          <button type="button" onClick={toggleRotate} aria-label={isRotating ? 'Pausar rotação automática' : 'Ativar rotação automática'} aria-pressed={isRotating}>
            {isRotating ? <IconPause /> : <IconPlay />}
          </button>
          <button type="button" onClick={toggleFull} aria-label={isFull ? 'Sair da tela cheia' : 'Ver em tela cheia'}>
            {isFull ? <IconMinimize /> : <IconMaximize />}
          </button>
        </div>
      )}

      {showThumbs && scenes.length > 1 && (
        <div className="pano__thumbs" role="tablist" aria-label="Ambientes da academia">
          {scenes.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === sceneIdx}
              className={`pano__thumb ${i === sceneIdx ? 'is-active' : ''}`}
              onClick={() => setSceneIdx(i)}
            >
              {s.thumb ? <img src={s.thumb} alt="" width={96} height={54} loading="lazy" /> : null}
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const PanoramaViewer = memo(PanoramaViewerImpl);
