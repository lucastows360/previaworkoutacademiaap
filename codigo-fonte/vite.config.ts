import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // caminhos relativos: funciona no GitHub Pages (usuario.github.io/repositorio/) e em qualquer pasta
  base: './',
  plugins: [react()],
  define: {
    // true apenas na prévia hospedada (iframes externos bloqueados)
    __ARTIFACT__: 'false',
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
});
