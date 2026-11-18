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
- Local: `python serve.py` (porta 8080; entrega `/sobre` como `sobre.html`, igual ao GitHub Pages)
- Deploy: GitHub Pages (pasta `public`), sempre `noindex` enquanto for proposta.

## Regras do projeto
pt-BR, sem travessões, sem emojis, números concretos, botões dizem a ação.
Links internos sem `.html` (pedido do Fabiano): `sobre`, `contato#consultoria`, home = `./`. Os arquivos continuam `.html`.

## Estado atual
- 2026-11-17: v1 completa (5 páginas + `public/auditoria.html`), QA de navegador feito e corrigido
  (overflow no contato, reset de ol, X do modal, lightbox por teclado, "Ver mais" na galeria, contraste do laranja:
  botões `--laranja-btn #BF560B`, texto laranja `--laranja-forte #A84A08`).
- 2026-11-17: publicado. Repo público https://github.com/fabianohirtzz/nextep-prototipo , GitHub Pages via
  `.github/workflows/pages.yml` (publica `public/` a cada push na `main`).
  Site: https://fabianohirtzz.github.io/nextep-prototipo/ . Auditoria: .../auditoria.html
- 2026-11-17, rodada v2 (pedido do Fabiano): menu com pílula deslizante e topo que encolhe e some ao descer
  (mobile: cortina com links em cascata); botões com varredura de cor e texto que rola (só em hover);
  hero da home dimensionada pela altura da tela; números com contagem e traço; logos reais de clientes
  (`public/assets/img/clientes/`: Juntapel, Unisuper SVG, Wollmann, Deltaville, baixados dos sites oficiais);
  processo com linha que preenche pela rolagem; seção Instagram com card de perfil e reels com play translúcido;
  rodapé com frase grande, ícones sociais, wordmark e assinatura Freela In Home (`logo/freela-in-home.png`),
  com efeito de revelar (`html.cortina`) só quando cabe na tela; heros de Sobre e Projetos no padrão da home;
  trilhas "Início / ..." removidas. CSS v2 fica no fim de `site.css`. Build carimba `?v=` nos links de CSS/JS.
- 2026-11-18, rodada v3 (pedido do Fabiano): menu com "Início" e sem "Agendar consultoria"; Área do cliente virou
  pílula navy com LED online (destaque do topo). Hero da home sem selo de 15 anos e sem depoimento. Case Juntapel da
  home com vídeo (capa + player do IG no lugar, `[data-video]`), fotos só em projetos.html#juntapel.
  Heros de Soluções/Projetos/Sobre com `.mosaico` (6 fotos em grade irregular, entrada em sequência, profundidade
  leve com o mouse); o mural deslizante ficou só na home. Fundo `canvas.rede[data-rede]` (trilhas tipo placa com
  pulsos de luz) em números, processo, varejo (soluções), linha do tempo (sobre) e rodapé; pausa fora da tela e
  respeita reduced-motion. Rodapé com wordmark inteiro, hover do "Abrir chamado" corrigido e assinatura
  "Soluções conectadas por Freela In Home" (cabo que pluga numa porta com LED; pisca dados no hover; sem logo).
  Trabalhe conosco: popup `[data-vagasbox]` (abre por qualquer `[data-vagas]`, com anexo de currículo PDF/Word até
  5 MB) no rodapé e seção `#trabalhe` no Sobre. CSS v3 no fim de `site.css`.
- 2026-11-18, v4: topo `position: fixed` (body com padding-top 80/68) e esconder/mostrar só após 60/40 px
  acumulados (o sticky encolhendo fazia o menu pular); case da home sem a citação do Pedro (fica em Projetos),
  título equilibrado em 3 linhas, números em 4 colunas; `.linha` (Sobre e Projetos) vira `.linha--viva` com traço
  preenchido pela rolagem; wordmark do rodapé em até 560 px.
- 2026-11-18, v5: serviços da home em mosaico `.bento[data-bento]` (escolha do Fabiano, opção "C1": Gestão e
  Infraestrutura em card largo com foto, os outros 4 compactos em navy com ícone; tags em pílulas laranja com ícone,
  sempre em uma linha, tamanho ajustado por JS ao card mais apertado). Seção cabe numa tela (padding reduzido).
  Tags encurtadas: Presencial, Redundância, Filiais. Faixa de marcas movida para depois do case Juntapel.
- 2026-11-18, v6: divisores entre as soluções (solucoes.html) viraram `.cabo` (linha com conectores navy nas pontas;
  dois feixes laranja saem das pontas, se encontram no centro e acendem um ponto; loop de 4 s com atraso diferente
  por divisor; parado com reduced-motion). Escolha do Fabiano entre 4 variações (opção "B").
- Pesquisa de clientes (legendas do IG em 2026-11-18): Kern (Ivoti, cliente há 5+ anos), Flesch (Gravataí?),
  Ideal fica em Florianópolis/SC (não RS, 5 lojas), Deltaville abriu loja em Biguaçu/SC, Kawa Bar e Tapas y Besos
  (Cais Embarcadero, POA). Sem site oficial com logo para Kern, Flesch, Ideal, Tapas; Industrial bloqueia (Cloudflare).
  Kawa Bar tem logo em `_logos-raw/novos/kawa-bar.png` (fundo opaco, não entrou na faixa).
- Logos que faltam (sem site ou download bloqueado): Supermercado Industrial (Canoas), Kern, Flesch, Super Ideal.
- Próximo: Fabiano revisa a v2; depois envia ao dono da Nextep.
- Auditoria: medições de 2026-11-17 (TTFB 2 a 5 s com pico de 78 s, HTML 613 KB, 15 imagens base64, 25 CSS + 17 JS, sem H1/description/OG).
- 3CX dá erro de CORS em localhost; testar no domínio publicado (pode exigir liberar o domínio no 3CX).
