# Workout Academia — site

Site pronto para publicar. Os arquivos da raiz desta pasta já são a versão final: não é preciso instalar nada.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (por exemplo, `workout-academia`).
2. Envie **todo o conteúdo desta pasta** para a raiz do repositório (botão *Add file → Upload files*, arrastando os arquivos e pastas, ou pelo GitHub Desktop).
3. No repositório, abra **Settings → Pages**.
4. Em *Build and deployment*, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)**, e clique em **Save**.
5. Em um ou dois minutos o site fica no ar em `https://SEU-USUARIO.github.io/workout-academia/`.

Para usar um domínio próprio (ex.: `www.workoutacademia.com.br`), preencha o campo *Custom domain* na mesma tela e siga as instruções de DNS do GitHub.

> Atenção ao enviar pelo navegador: o arquivo `.nojekyll` começa com ponto e pode ficar oculto no seu computador. Ele não é obrigatório, mas ajuda o GitHub a publicar os arquivos exatamente como estão.

## O que tem aqui

| Pasta / arquivo | Conteúdo |
|---|---|
| `index.html` | página do site |
| `assets/` | código e estilos compilados |
| `logo/` | logotipo |
| `panorama/academia-360.jpg` | foto 360° da capa e do tour |
| `images/` | pessoas recortadas (sem fundo) |
| `favicon.png` | ícone da aba do navegador |
| `codigo-fonte/` | projeto React + TypeScript + Vite, para fazer alterações |

## Trocar imagens sem mexer no código

Substitua o arquivo mantendo **o mesmo nome**:

- `panorama/academia-360.jpg`: panorama 360° (proporção 2:1, ideal 6000 px de largura ou mais)
- `images/modelo-mulher.webp` e `images/modelo-homem.webp`: pessoas com fundo transparente
- `logo/workout-logo.webp` e `logo/workout-logo.png`: logotipo

## Alterar textos, endereço, horários ou adicionar fotos

Edite `codigo-fonte/src/data/siteConfig.ts` e gere a versão final novamente:

```bash
cd codigo-fonte
npm install
npm run build
```

Depois copie o conteúdo de `codigo-fonte/dist/` para a raiz do repositório, substituindo `index.html` e a pasta `assets/`.

## Antes de divulgar

- Em `siteConfig.ts`, `showPlaceholderNotes` está `true`: os avisos de "aguardando fotos" aparecem na galeria. Mude para `false` e gere o build quando quiser escondê-los.
- Confirme o número do endereço (Av. Jaboti, 243 ou 16), a cidade e os horários.
