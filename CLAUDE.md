# Site Nextep Soluções em TI (protótipo de proposta)

Projeto Freela In Home conduzido pelo `/site` (freela-method).

## O que é
Protótipo multipáginas do novo site da Nextep Soluções em TI (Porto Alegre/RS), feito **sem contratação**:
o dono da Nextep foi mentor do Fabiano. O protótipo vai junto de uma auditoria do site atual,
e se ele gostar, abre-se a negociação. Precisa impressionar pelo nível, sem exagero de animação.

## Cliente
- **Negócio:** terceirização e infraestrutura de TI para empresas (MSP). Consultoria e gestão de TI,
  administração de redes, segurança da informação, conectividade, projetos de infraestrutura
  (cabeamento estruturado, racks, servidores, Wi-Fi, CFTV IP com IA), suporte técnico.
- **Vertical forte:** supermercados e varejo (redes, servidores, CFTV, sonorização, automação de frente de caixa),
  muito via o grupo **Sintonia Fina** (@sintoniafinars, mais de 30 empresas especialistas).
- **Fundação:** 11/11/2011 (15 anos em nov/2026). Começou com duas pessoas numa sala pequena.
- **Números (Instagram, nov/2026):** +100 mil chamados, +5.000 dispositivos gerenciados, 4 estados.
  Site antigo: 1.500 estações, 500 servidores, 100 projetos, 98% SLA no prazo.
- **Case Juntapel** (sede nova inaugurada em 17/10/2026, cabeamento da parceira Montele): 324 pontos em 19 patch panels
  Cat6 Furukawa, fibra entre racks com uplinks 10 Gb, Ubiquiti + Dream Machine Pro, 24 APs Wi-Fi 6 com Wi-Fi Survey,
  CFTV IP Full HD Intelbras com IA, rack temporário na mudança. Depoimento em vídeo do Pedro (Gerente Comercial):
  "15 minutos, alguém já te chama."
- **Contato:** (51) 3103-9943, comercial@nextepsolucoes.com.br, Av. Saturnino de Brito 30, Sala 401, Porto Alegre/RS.
  Área do cliente: https://nextep.suport.cloud/ . Instagram @nextepsolucoes, LinkedIn /company/nextepsolucoes.
- **3CX:** `<call-us-selector phonesystem-url="https://tel-mastercloud2.my3cx.com.br:5001" party="LiveChat12344">`
  + `callus.js`. Mantido no protótipo para mostrar a integração (é o chat real deles).
- **Confirmar com o cliente:** lista de clientes exibida (Juntapel, Unisuper, Industrial, Ideal, Wollmann, Kern,
  Flesch, Deltaville), quais são os 4 estados, número de WhatsApp comercial.

## Stack
HTML/CSS/JS estático. Páginas em `src/pages/*.html` com partials em `src/partials/`;
`python build.py` gera `public/*.html`. Assets ficam direto em `public/assets/`.

## Design
- Sem design skill dedicada ainda (protótipo). Tokens em `public/assets/css/site.css` (`:root`).
- Navy `#14245A`, navy profundo `#0B1636`, laranja `#E8701A`, laranja suave `#FFEBD9`, fundo frio `#F3F6FB`.
- Tipografia única: Schibsted Grotesk (Google Fonts).
- Assinatura: mural de fotos reais em colunas deslizando no hero (único movimento automático; respeita reduced-motion).
- Numeração só no processo (sequência real). Sem eyebrows em caixa alta, sem setas em botões.

## Conteúdo
- Fotos: curadoria do Instagram em `public/assets/img/ig/{infra,campo,equipe,varejo}-NNN.webp`
  (rodapé cortado para tirar a marca d'água). Capas de reels em `public/assets/img/reels/<shortcode>.webp`.
- Brutos e lista de shortcodes em `_ig-raw/` (fora do git).
- Reels abrem em modal com o player oficial (`https://www.instagram.com/reel/<code>/embed/`).

## Comandos
- Build: `python build.py`
- Local: `python -m http.server 8080 -d public`
- Deploy: Vercel (pasta `public`), sempre `noindex` enquanto for proposta.

## Regras do projeto
pt-BR, sem travessões, sem emojis, números concretos, botões dizem a ação.

## Estado atual
- 2026-11-17: v1 completa (5 páginas + `public/auditoria.html`), QA de navegador feito e corrigido
  (overflow no contato, reset de ol, X do modal, lightbox por teclado, "Ver mais" na galeria, contraste do laranja:
  botões `--laranja-btn #BF560B`, texto laranja `--laranja-forte #A84A08`).
- Commit local feito na `main`. Deploy previsto: repo público `fabianohirtzz/nextep-prototipo` + GitHub Pages via
  `.github/workflows/pages.yml` (publica `public/`). A criação do repo foi bloqueada pela permissão automática; aguarda o Fabiano.
- Auditoria: medições de 2026-11-17 (TTFB 2 a 5 s com pico de 78 s, HTML 613 KB, 15 imagens base64, 25 CSS + 17 JS, sem H1/description/OG).
- 3CX dá erro de CORS em localhost; testar no domínio publicado (pode exigir liberar o domínio no 3CX).
