# Workout Academia — Landing page

Landing page com tour virtual 360°, feita em **React 19 + TypeScript + Vite**, sem bibliotecas pesadas de terceiros:
o visualizador 360° é WebGL puro (mais leve que Three.js para um panorama) e as animações usam
IntersectionObserver + variáveis CSS ligadas à rolagem.

## Como rodar

Requisitos: Node.js 18 ou mais recente.

```bash
npm install
npm run dev        # ambiente de desenvolvimento em http://localhost:5173
npm run build      # gera a versão final em /dist
npm run preview    # testa a versão final localmente
```

Para publicar, envie o conteúdo da pasta `dist/` para qualquer hospedagem estática
(Vercel, Netlify, Hostinger, Cloudflare Pages etc.).

## Onde editar

Tudo que é dado comercial está em **`src/data/siteConfig.ts`**: WhatsApp e mensagens pré-preenchidas,
Instagram, endereço, link do mapa, horários, imagens, cenas do tour 360°, textos e SEO.

| O que | Onde |
|---|---|
| Panorama 360° (capa e tour) | arquivos em `public/panorama/` + `siteConfig.panorama.scenes` |
| Tour externo (Matterport, Kuula…) | `siteConfig.panorama.externalTourUrl` |
| Fotos da galeria | arquivos em `public/images/galeria/` + `siteConfig.gallery` |
| Foto/vídeo da modelo | `siteConfig.model` |
| Logo | substituir `public/logo/workout-logo.webp` e `.png` |
| Avisos de “aguardando arquivo” | `siteConfig.showPlaceholderNotes = false` antes de publicar |
| Meta tags, canonical, imagem de compartilhamento, dados estruturados | `index.html` |

### Exemplo de cena 360°

```ts
scenes: [
  {
    id: 'salao',
    title: 'Salão de musculação',
    src: '/panorama/salao.jpg',       // equirretangular 2:1
    initialYaw: 0,
    hotspots: [{ yaw: 90, pitch: -5, label: 'Ir para a recepção', targetScene: 'recepcao' }],
  },
  { id: 'recepcao', title: 'Recepção', src: '/panorama/recepcao.jpg' },
],
```

A primeira cena abre na capa. Com duas ou mais cenas, o tour mostra as miniaturas dos ambientes.
Se a imagem não tiver proporção 2:1, o visualizador **não** a apresenta como 360° e mostra um aviso.
Panoramas maiores que o limite da placa de vídeo do aparelho são reduzidos automaticamente.

## Estrutura

```
index.html                 SEO, Open Graph, dados estruturados (ExerciseGym), fontes
public/
  logo/                    logo (versão provisória extraída do Instagram)
  panorama/                panorâmicas 360° (vazia)
  images/galeria/          fotos reais (vazia)
src/
  data/siteConfig.ts       configuração central
  lib/links.ts             WhatsApp, Google Maps, links externos
  lib/motion.tsx           Reveal, progresso de rolagem, movimento reduzido
  lib/icons.tsx            ícones SVG
  components/
    Header.tsx             menu fixo (transparente → escuro), menu do celular
    Hero360.tsx            SEÇÃO 1 — capa com panorama 360°
    PanoramaViewer.tsx     visualizador WebGL (arraste, pinça, teclado, hotspots, tela cheia, progresso)
    About.tsx              SEÇÃO 2 — Conheça a Workout
    VirtualTour.tsx        SEÇÃO 3 — tour interativo, compartilhar, mapa
    ScrollModel.tsx        SEÇÃO 4 — começar/recomeçar com modelo animada pela rolagem
    Benefits.tsx           SEÇÃO 5 — benefícios
    Gallery.tsx            SEÇÃO 6 — galeria com lightbox
    PlansCTA.tsx           SEÇÃO 7 — planos (WhatsApp)
    Location.tsx           SEÇÃO 8 — localização, mapa, rota
    FAQ.tsx                SEÇÃO 9 — acordeão
    FinalCTA.tsx           SEÇÃO 10 — chamada final
    Footer.tsx             SEÇÃO 11 — rodapé e política de privacidade
    WhatsAppButton.tsx     botão flutuante + barra de leitura
  styles/global.css        identidade visual e responsividade
```

## Imagens já incluídas

- `public/panorama/academia-360.jpg`: panorama enviado (ampliado para 4096×2048). Substitua pelo arquivo original em alta resolução com o mesmo nome.
- `public/images/modelo-mulher.webp` e `modelo-homem.webp`: pessoas recortadas dos posts, com fundo transparente. As bordas onde o corpo era cortado pelo quadro recebem um degradê suave.

## Pendências (dependem da academia)

1. **Panorama em resolução original**: o arquivo recebido tem 1456 px de largura e fica levemente desfocado em telas grandes. O ideal é 6000 px ou mais.
2. **Número do endereço**: o Instagram mostra *Av. Jaboti, 243*; um diretório on-line mostra *Av. Jaboti, 16*. Confirmar. Confirmar também a cidade (Apucarana - PR) e informar o CEP.
3. **Horários** de funcionamento (o Instagram informa apenas “segunda a sábado”).
4. **Fotos reais** da academia para a galeria e para o fundo da chamada final.
5. **Foto ou vídeo da modelo** com licença de uso.
6. **Logo em alta resolução** (PNG transparente ou SVG).
7. **Domínio** definitivo (canonical) e imagem de compartilhamento 1200×630.
