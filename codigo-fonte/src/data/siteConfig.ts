/**
 * ============================================================
 *  WORKOUT ACADEMIA — CONFIGURAÇÃO CENTRAL DO SITE
 * ============================================================
 *  Todos os dados comerciais, textos, imagens e arquivos do
 *  tour 360° ficam aqui. Altere este arquivo para atualizar o
 *  site sem mexer nos componentes.
 *
 *  Regra do projeto: nada aqui é inventado. Campos sem
 *  informação confirmada ficam vazios ('' ou []) e o site
 *  exibe uma alternativa elegante até o conteúdo chegar.
 * ============================================================
 */

export type PanoramaHotspot = {
  /** Ângulo horizontal em graus (0 = centro da imagem, positivo = direita) */
  yaw: number;
  /** Ângulo vertical em graus (positivo = para cima) */
  pitch: number;
  label: string;
  /** id de outra cena para navegar ao clicar (opcional) */
  targetScene?: string;
};

export type PanoramaScene = {
  id: string;
  title: string;
  /** Caminho da imagem EQUIRRETANGULAR 360° (proporção 2:1). Ex.: 'panorama/recepcao.jpg' */
  src: string;
  /** Miniatura opcional para a lista de ambientes */
  thumb?: string;
  /** Direção inicial da câmera, em graus */
  initialYaw?: number;
  initialPitch?: number;
  hotspots?: PanoramaHotspot[];
};

export type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

export const siteConfig = {
  name: 'Workout Academia',
  shortName: 'Workout',

  /** Logo extraído do perfil do Instagram (versão provisória em baixa resolução).
   *  Substitua por um PNG/SVG oficial em alta resolução, mantendo o mesmo caminho. */
  logo: {
    src: 'logo/workout-logo.webp',
    fallbackSrc: 'logo/workout-logo.png',
    alt: 'Logotipo da Workout Academia',
  },

  /** Exibe avisos visíveis nas áreas que ainda aguardam conteúdo.
   *  Mude para false antes de publicar a versão final. */
  showPlaceholderNotes: true,

  messages: {
    central: 'Musculação orientada de verdade.',
    support1: 'Para quem parou ou quer treinar com segurança.',
    support2: 'Sem pressão. Sem comparação. No seu ritmo.',
  },

  contact: {
    /** Somente dígitos, com DDI 55 */
    whatsappNumber: '554396812157',
    whatsappDisplay: '(43) 9681-2157',
    instagramUrl: 'https://www.instagram.com/workoutacademiaap/',
    instagramHandle: '@workoutacademiaap',
  },

  /** Mensagens pré-preenchidas do WhatsApp, por origem do clique */
  whatsappMessages: {
    default: 'Olá! Vim pelo site da Workout Academia e gostaria de mais informações.',
    start: 'Olá! Conheci a Workout Academia pelo site e quero começar a treinar. Como funciona?',
    plans:
      'Olá! Conheci a Workout Academia pelo site e gostaria de saber mais sobre os planos, horários e como posso começar a treinar.',
    restart: 'Olá! Fiquei um tempo sem treinar e quero recomeçar com orientação. Podem me ajudar?',
    visit: 'Olá! Gostaria de agendar uma visita ou aula experimental na Workout Academia.',
    location: 'Olá! Pode me ajudar a chegar até a Workout Academia?',
    floating: 'Olá! Vim pelo site da Workout Academia.',
  },

  address: {
    /** Endereço publicado pela própria academia em post do Instagram.
     *  ATENÇÃO: um diretório on-line mostra "Av. Jaboti, 16". Confirme o número. */
    street: 'Av. Jaboti, 243',
    neighborhood: 'Jardim Menegazzo',
    /** Cidade indicada em diretório on-line e no perfil (@...ap). Confirme. */
    city: 'Apucarana',
    state: 'PR',
    /** CEP não confirmado — deixe vazio até a academia informar */
    postalCode: '',
    country: 'BR',
  },

  maps: {
    /** Link oficial enviado pelo cliente */
    shareUrl: 'https://maps.app.goo.gl/twWQGz6PdZPvL9676',
    /** Mapa incorporado (Google Maps, sem chave de API) gerado a partir do endereço.
     *  Para usar o "Incorporar mapa" oficial do Google, cole aqui o src do iframe. */
    embedUrl: '',
  },

  hours: {
    /** Publicado no Instagram: "Treine de segunda a sábado". Horários exatos não informados. */
    days: 'Segunda a sábado',
    /** Ex.: [{ label: 'Segunda a sexta', value: '06h às 22h' }] — preencha quando confirmado */
    detailed: [] as { label: string; value: string }[],
  },

  /**
   * TOUR VIRTUAL 360°
   * Coloque as imagens equirretangulares em /public/panorama/ e cadastre
   * cada ambiente abaixo. A primeira cena abre na capa do site.
   *
   * Exemplo:
   * { id: 'salao', title: 'Salão de musculação', src: 'panorama/salao.jpg',
   *   hotspots: [{ yaw: 90, pitch: -5, label: 'Ir para a recepção', targetScene: 'recepcao' }] }
   */
  panorama: {
    scenes: [
      {
        id: 'salao',
        title: 'Salão de musculação',
        // Panorama enviado pela academia (equirretangular 2:1).
        // Substitua pelo arquivo original em alta resolução, mantendo o nome.
        src: 'panorama/academia-360.jpg',
        initialYaw: 0,
        initialPitch: -4,
      },
    ] as PanoramaScene[],
    /** Tour externo (Matterport, Kuula, Google Street View etc.). Se informado,
     *  aparece no visualizador quando não houver cenas locais. */
    externalTourUrl: '',
    /** true se o serviço externo permitir incorporação por iframe */
    externalTourEmbeddable: false,
  },

  /** Fotos reais da academia para a galeria (pasta /public/images/galeria/) */
  gallery: [] as GalleryImage[],
  /** Quantidade de espaços reservados exibidos enquanto a galeria está vazia */
  galleryPlaceholderSlots: 6,

  /** Seção "Para quem quer começar ou recomeçar" — foto ou vídeo da modelo fitness */
  model: {
    /** true = imagem recortada (fundo transparente), exibida solta com movimento na rolagem */
    cutout: true,
    /** Foto principal. Com cutout: PNG/WebP com fundo transparente. */
    imageFull: 'images/modelo-mulher.webp',
    /** Foto em plano médio (opcional) para a transição de enquadramento */
    imageMedium: '',
    /** Vídeo real (opcional, mp4/webm). Tem prioridade sobre as fotos. */
    video: '',
    alt: 'Mulher sorrindo, sentada com uma garrafa de água, depois do treino',
    width: 840,
    height: 1534,
  },

  /** Pessoa recortada que aparece na seção de planos (fundo laranja) */
  plansPerson: {
    src: 'images/modelo-homem.webp',
    alt: 'Homem conferindo o relógio esportivo durante o treino',
    width: 730,
    height: 1674,
  },

  /** Imagem de fundo da chamada final (foto real da academia) */
  finalCtaImage: '',

  seo: {
    title: 'Workout Academia | Musculação Orientada e Tour Virtual 360°',
    description:
      'Conheça a Workout Academia, explore nosso espaço em um tour virtual 360° e fale com nossa equipe para descobrir como começar a treinar.',
    /** Preencha com o domínio definitivo, ex.: https://www.workoutacademia.com.br/ */
    canonicalUrl: '',
    /** Imagem para compartilhamento (1200x630) em /public/og-image.jpg */
    ogImage: '',
  },
};

export type SiteConfig = typeof siteConfig;

export const fullAddress = () => {
  const a = siteConfig.address;
  return [a.street, a.neighborhood, a.city && `${a.city} - ${a.state}`].filter(Boolean).join(', ');
};
