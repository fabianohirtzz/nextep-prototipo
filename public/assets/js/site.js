(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* topo: borda ao rolar */
  const topo = $('[data-topo]');

  /* menu mobile */
  const burger = $('[data-burger]');
  const menu = $('#menu');
  if (burger && menu) {
    const rotulo = $('.sr', burger);
    const definir = aberto => {
      burger.setAttribute('aria-expanded', String(aberto));
      menu.classList.toggle('is-aberto', aberto);
      document.body.classList.toggle('is-travado', aberto);
      rotulo.textContent = aberto ? 'Fechar menu' : 'Abrir menu';
    };
    const fechar = () => { if (burger.getAttribute('aria-expanded') === 'true') definir(false); };
    burger.addEventListener('click', () => definir(burger.getAttribute('aria-expanded') !== 'true'));
    $$('a', menu).forEach(a => a.addEventListener('click', fechar));
    addEventListener('keydown', e => { if (e.key === 'Escape') fechar(); });
    document.addEventListener('click', e => { if (!menu.contains(e.target) && !burger.contains(e.target)) fechar(); });
  }

  /* mural do hero: duplica as fotos para o loop ficar contínuo */
  $$('.mural__col').forEach(col => {
    $$('img', col).forEach(img => {
      const c = img.cloneNode(true);
      c.alt = '';
      c.setAttribute('aria-hidden', 'true');
      col.appendChild(c);
    });
  });

  /* trava rolagem com modal aberto */
  let ultimoFoco = null;
  const abrirModal = el => { ultimoFoco = document.activeElement; el.hidden = false; document.body.classList.add('is-travado'); $('button', el)?.focus(); };
  const fecharModal = el => { el.hidden = true; document.body.classList.remove('is-travado'); ultimoFoco?.focus(); };

  /* reels: player oficial do Instagram em modal */
  const reelbox = $('[data-reelbox]');
  const frame = $('[data-reel-frame]');
  $$('[data-reel]').forEach(b => b.addEventListener('click', () => {
    const code = b.dataset.reel;
    frame.innerHTML = `<iframe src="https://www.instagram.com/reel/${code}/embed/" title="Vídeo da Nextep no Instagram" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    abrirModal(reelbox);
  }));
  const fecharReel = () => { fecharModal(reelbox); frame.innerHTML = ''; };
  $$('[data-reel-fechar]').forEach(b => b.addEventListener('click', fecharReel));

  /* setas do trilho de reels */
  $$('[data-reels-nav]').forEach(nav => {
    const trilho = document.getElementById(nav.dataset.reelsNav);
    $$('button', nav).forEach(b => b.addEventListener('click', () => {
      trilho.scrollBy({ left: (b.dataset.dir === 'prox' ? 1 : -1) * trilho.clientWidth * .8, behavior: 'smooth' });
    }));
  });

  /* galeria: lightbox */
  const fotobox = $('[data-fotobox]');
  const fotoImg = $('[data-foto-img]');
  let lista = [], atual = 0;
  const mostra = i => {
    atual = (i + lista.length) % lista.length;
    const img = $('img', lista[atual]);
    fotoImg.src = img.dataset.full || img.src;
    fotoImg.alt = img.alt;
  };
  $$('[data-galeria]').forEach(gal => {
    $$('figure', gal).forEach(fig => {
      fig.tabIndex = 0;
      fig.setAttribute('role', 'button');
      fig.setAttribute('aria-label', 'Ampliar foto: ' + ($('img', fig)?.alt || ''));
    });
    const abrir = fig => {
      lista = $$('figure:not([hidden]):not(.is-extra)', gal);
      mostra(lista.indexOf(fig));
      abrirModal(fotobox);
    };
    gal.addEventListener('click', e => { const fig = e.target.closest('figure'); if (fig) abrir(fig); });
    gal.addEventListener('keydown', e => {
      const fig = e.target.closest('figure');
      if (fig && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); abrir(fig); }
    });
    /* mostra só as primeiras fotos e libera o resto no botão */
    const limite = Number(gal.dataset.limite || 0);
    const figs = $$('figure', gal);
    if (limite && figs.length > limite) {
      figs.slice(limite).forEach(f => f.classList.add('is-extra'));
      const box = document.createElement('div');
      box.className = 'galeria-mais';
      box.innerHTML = `<button class="btn btn--linha" type="button">Ver mais ${figs.length - limite} fotos</button>`;
      gal.after(box);
      const liberar = foco => { figs.forEach(f => f.classList.toggle('is-extra', false)); box.hidden = true; if (foco === true) figs[limite].focus(); };
      $('button', box).addEventListener('click', () => liberar(true));
      gal._liberar = liberar;
    }
  });
  $$('[data-foto-fechar]').forEach(b => b.addEventListener('click', () => fecharModal(fotobox)));
  $('[data-foto-ant]')?.addEventListener('click', () => mostra(atual - 1));
  $('[data-foto-prox]')?.addEventListener('click', () => mostra(atual + 1));

  /* mantém o Tab dentro do modal aberto */
  addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const aberto = [reelbox, fotobox, $('[data-vagasbox]')].find(m => m && !m.hidden);
    if (!aberto) return;
    const foco = $$('button, iframe, input, select, textarea, a[href]', aberto).filter(el => el.offsetParent !== null || el.type === 'file');
    if (!foco.length) return;
    const primeiro = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  });

  addEventListener('keydown', e => {
    if (reelbox && !reelbox.hidden && e.key === 'Escape') fecharReel();
    if (fotobox && !fotobox.hidden) {
      if (e.key === 'Escape') fecharModal(fotobox);
      if (e.key === 'ArrowLeft') mostra(atual - 1);
      if (e.key === 'ArrowRight') mostra(atual + 1);
    }
  });

  /* filtros da galeria */
  $$('[data-filtros]').forEach(f => {
    const gal = document.getElementById(f.dataset.filtros);
    $$('button', f).forEach(b => b.addEventListener('click', () => {
      $$('button', f).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const cat = b.dataset.cat;
      if (cat !== 'todos' && gal._liberar) gal._liberar();
      $$('figure', gal).forEach(fig => { fig.hidden = cat !== 'todos' && fig.dataset.cat !== cat; });
    }));
  });

  /* formulário (protótipo): valida e confirma sem enviar */
  $$('[data-form]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    form.classList.add('is-enviado');
    const ok = $('.form__ok', form);
    ok.textContent = form.dataset.ok || 'Recebemos seus dados. Um especialista da Nextep vai falar com você em até 1 dia útil.';
    ok.setAttribute('tabindex', '-1');
    ok.focus();
    form.reset();
    form.dispatchEvent(new Event('limpo'));
  }));

  /* máscara simples de telefone */
  $$('input[type="tel"]').forEach(inp => inp.addEventListener('input', () => {
    const d = inp.value.replace(/\D/g, '').slice(0, 11);
    let v = d;
    if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    inp.value = v;
  }));

  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* topo: some ao descer, volta ao subir (com folga para não ficar piscando) */
  let ultimoY = scrollY, acumulado = 0;
  const cuidaTopo = () => {
    if (!topo) return;
    const y = Math.max(scrollY, 0);
    const delta = y - ultimoY;
    ultimoY = y;
    topo.classList.toggle('is-rolado', y > 24);
    if (document.body.classList.contains('is-travado') || calmo || y < 320) { topo.classList.toggle('is-escondido', false); acumulado = 0; return; }
    /* soma o deslocamento na mesma direção; troca de direção zera */
    acumulado = (Math.sign(delta) === Math.sign(acumulado) || acumulado === 0) ? acumulado + delta : delta;
    if (acumulado > 60) topo.classList.add('is-escondido');
    else if (acumulado < -40) topo.classList.toggle('is-escondido', false);
  };
  addEventListener('scroll', cuidaTopo, { passive: true });
  topo?.addEventListener('focusin', () => topo.classList.remove('is-escondido'));

  /* pílula que desliza entre os links do menu */
  const menuLista = $('[data-menu-lista]');
  const pilula = $('.menu__pilula', menuLista || document);
  if (menuLista && pilula) {
    const atual = $('a[aria-current]', menuLista);
    const moveA = a => {
      if (!a) { menuLista.classList.remove('tem-pilula'); return; }
      pilula.style.width = a.offsetWidth + 'px';
      pilula.style.transform = `translateX(${a.offsetLeft}px)`;
      menuLista.classList.add('tem-pilula');
    };
    $$('a', menuLista).forEach(a => {
      a.addEventListener('mouseenter', () => moveA(a));
      a.addEventListener('focus', () => moveA(a));
    });
    menuLista.addEventListener('mouseleave', () => moveA(atual));
    addEventListener('resize', () => moveA(atual));
    requestAnimationFrame(() => moveA(atual));
  }

  /* botões: texto duplicado para o efeito de rolar */
  $$('.btn').forEach(b => {
    if (b.children.length) return;
    const t = b.textContent.trim();
    b.textContent = '';
    const fora = document.createElement('span');
    fora.className = 'btn__rola';
    const dentro = document.createElement('span');
    dentro.dataset.t = t;
    dentro.textContent = t;
    fora.appendChild(dentro);
    b.appendChild(fora);
  });

  /* números: contagem ao entrar na tela */
  const numeros = $('[data-numeros]');
  if (numeros) {
    const conta = el => {
      const fim = Number(el.dataset.conta);
      if (calmo) { el.textContent = fim.toLocaleString('pt-BR'); return; }
      const ini = performance.now(), dur = 1600 + Math.min(fim, 5000) / 10;
      const passo = agora => {
        const t = Math.min((agora - ini) / dur, 1);
        const e = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.round(fim * e).toLocaleString('pt-BR');
        if (t < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    };
    const nums = $$('[data-conta]', numeros);
    if (!calmo) nums.forEach(n => { n.textContent = '0'; });
    new IntersectionObserver((ents, obs) => {
      if (!ents[0].isIntersecting) return;
      numeros.classList.add('is-visivel');
      nums.forEach(conta);
      obs.disconnect();
    }, { threshold: .4 }).observe(numeros);
  }

  /* processo: a linha se preenche com a rolagem e acende cada etapa */
  $$('[data-passos]').forEach(wrap => {
    const passos = $$('.passo', wrap);
    const atualiza = () => {
      let prog = 1;
      if (!calmo) {
        const r = wrap.getBoundingClientRect();
        const vh = innerHeight;
        const ini = vh * .8, fim = vh * .35;
        const vertical = matchMedia('(max-width: 900px)').matches;
        prog = vertical
          ? (ini - r.top) / Math.max(r.height + ini - fim - vh * .2, 1)
          : (ini - r.top) / (ini - fim);
        prog = Math.min(Math.max(prog, 0), 1);
      }
      wrap.style.setProperty('--prog', prog.toFixed(3));
      passos.forEach((p, i) => p.classList.toggle('is-ativo', prog >= (i / passos.length) + .02 || prog === 1));
    };
    addEventListener('scroll', atualiza, { passive: true });
    addEventListener('resize', atualiza);
    atualiza();
  });

  /* linhas do tempo (sobre, projetos): traço que desce com a rolagem e acende cada marco */
  $$('.linha').forEach(ol => {
    const itens = $$('li', ol);
    ol.classList.add('linha--viva');
    const atualiza = () => {
      let prog = 1;
      if (!calmo) {
        const r = ol.getBoundingClientRect();
        const alvo = innerHeight * .62;
        prog = Math.min(Math.max((alvo - r.top) / Math.max(r.height, 1), 0), 1);
      }
      ol.style.setProperty('--prog', prog.toFixed(3));
      itens.forEach(li => {
        const topoItem = li.offsetTop / Math.max(ol.offsetHeight, 1);
        li.classList.toggle('is-ativo', prog >= topoItem + .01 || prog === 1);
      });
    };
    addEventListener('scroll', atualiza, { passive: true });
    addEventListener('resize', atualiza);
    atualiza();
  });

  /* rodapé-cortina: só quando o rodapé cabe inteiro na tela */
  const rodape = $('[data-rodape]');
  const cortina = () => {
    if (!rodape) return;
    const cabe = innerWidth > 900 && rodape.offsetHeight < innerHeight - 40;
    document.documentElement.classList.toggle('cortina', cabe && !calmo);
  };
  addEventListener('resize', cortina);
  addEventListener('load', cortina);
  cortina();

  /* reels: arrastar com o mouse */
  $$('[data-arrasta]').forEach(trilho => {
    let x0 = 0, s0 = 0, ativo = false, moveu = false;
    trilho.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      ativo = true; moveu = false; x0 = e.clientX; s0 = trilho.scrollLeft;
    });
    addEventListener('pointermove', e => {
      if (!ativo) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 5) { moveu = true; trilho.classList.add('is-arrastando'); }
      if (moveu) trilho.scrollLeft = s0 - dx;
    });
    addEventListener('pointerup', () => { ativo = false; trilho.classList.remove('is-arrastando'); });
    trilho.addEventListener('click', e => { if (moveu) { e.preventDefault(); e.stopImmediatePropagation(); moveu = false; } }, true);
  });

  /* trabalhe conosco: popup com currículo */
  const vagasbox = $('[data-vagasbox]');
  if (vagasbox) {
    $$('[data-vagas]').forEach(b => b.addEventListener('click', e => {
      e.preventDefault();
      abrirModal(vagasbox);
      $('input', vagasbox)?.focus();
    }));
    const fecharVagas = () => fecharModal(vagasbox);
    $$('[data-vagas-fechar]', vagasbox).forEach(b => b.addEventListener('click', fecharVagas));
    addEventListener('keydown', e => { if (!vagasbox.hidden && e.key === 'Escape') fecharVagas(); });
  }

  /* campo de arquivo: nome, tamanho, tipo e arrastar */
  $$('[data-arquivo]').forEach(box => {
    const inp = $('input[type="file"]', box);
    const txt = $('[data-arquivo-txt]', box);
    const zona = $('.arquivo__zona', box);
    const padrao = txt.innerHTML;
    const valida = () => {
      const f = inp.files[0];
      inp.setCustomValidity('');
      box.classList.toggle('tem-arquivo', false);
      box.classList.toggle('tem-erro', false);
      if (!f) { txt.innerHTML = padrao; return; }
      const okTipo = /\.(pdf|docx?)$/i.test(f.name);
      const okTam = f.size <= 5 * 1024 * 1024;
      if (!okTipo) inp.setCustomValidity('Envie o currículo em PDF ou Word.');
      else if (!okTam) inp.setCustomValidity('O arquivo passa de 5 MB. Envie uma versão menor.');
      const kb = f.size / 1024;
      const tam = kb > 1024 ? (kb / 1024).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(kb)) + ' KB';
      txt.innerHTML = '';
      const b = document.createElement('b'); b.textContent = f.name;
      txt.append(b, ' ' + (inp.validationMessage || tam + '. Clique para trocar.'));
      box.classList.add(inp.validationMessage ? 'tem-erro' : 'tem-arquivo');
    };
    inp.addEventListener('change', valida);
    inp.form?.addEventListener('limpo', valida);
    ['dragenter', 'dragover'].forEach(t => zona.addEventListener(t, e => { e.preventDefault(); box.classList.add('is-sobre'); }));
    ['dragleave', 'drop'].forEach(t => zona.addEventListener(t, () => box.classList.toggle('is-sobre', false)));
    zona.addEventListener('drop', e => {
      e.preventDefault();
      if (!e.dataTransfer.files.length) return;
      inp.files = e.dataTransfer.files;
      valida();
    });
  });

  /* vídeo do case: troca a capa pelo player no lugar */
  $$('[data-video]').forEach(box => {
    $('button', box).addEventListener('click', () => {
      box.innerHTML = `<iframe src="https://www.instagram.com/reel/${box.dataset.video}/embed/" title="Vídeo do projeto no Instagram" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      box.classList.add('is-tocando');
      $('iframe', box).focus();
    });
  });

  /* assinatura: o cabo encaixa quando o rodapé aparece */
  const assina = $('[data-assina]');
  if (assina) {
    if (calmo) assina.classList.add('is-ligado');
    else new IntersectionObserver((ents, obs) => {
      if (!ents[0].isIntersecting) return;
      setTimeout(() => assina.classList.add('is-ligado'), 300);
      obs.disconnect();
    }, { threshold: 1 }).observe(assina);
  }

  /* mosaico das heros internas: profundidade leve seguindo o mouse */
  $$('[data-mosaico]').forEach(m => {
    if (calmo || !matchMedia('(hover: hover)').matches) return;
    const pecas = $$('img, .mosaico__no', m);
    let raf = 0;
    m.closest('.hero')?.addEventListener('pointermove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = m.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        pecas.forEach((p, i) => {
          const f = 6 + (i % 3) * 5;
          p.style.setProperty('--px', (x * -f).toFixed(1) + 'px');
          p.style.setProperty('--py', (y * -f).toFixed(1) + 'px');
        });
      });
    });
  });

  /* fundo de rede: cabos em trilhas ortogonais com pulsos de luz */
  $$('[data-rede]').forEach(cv => {
    const ctx = cv.getContext('2d');
    const host = cv.parentElement;
    const claro = cv.dataset.rede === 'claro';
    const corLinha = claro ? 'rgba(20, 36, 90, .09)' : 'rgba(255, 255, 255, .07)';
    const corNo = claro ? 'rgba(20, 36, 90, .16)' : 'rgba(255, 255, 255, .14)';
    const cores = claro ? ['#E8701A', '#1D3270'] : ['#E8701A', '#8FB0FF'];
    const PASSO = 56, CAUDA = 70;
    let W = 0, H = 0, rotas = [], nos = [], pulsos = [], visivel = false, ult = 0, prox = 0, raf = 0;
    const sorteia = n => Math.floor(Math.random() * n);
    const monta = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = host.clientWidth; H = host.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = Math.max(1, Math.floor(W / PASSO)), lins = Math.max(1, Math.floor(H / PASSO));
      const qtd = Math.round(Math.min(28, Math.max(8, (W * H) / 24000)));
      nos = []; rotas = []; pulsos = [];
      for (let i = 0; i < qtd * 2 && rotas.length < qtd; i++) {
        const a = { x: (sorteia(cols) + .5) * PASSO, y: (sorteia(lins) + .5) * PASSO };
        const dx = (sorteia(9) - 4) * PASSO, dy = (sorteia(5) - 2) * PASSO;
        const b = { x: Math.min(Math.max(a.x + dx, PASSO / 2), W - PASSO / 2), y: Math.min(Math.max(a.y + dy, PASSO / 2), H - PASSO / 2) };
        if (Math.abs(a.x - b.x) < PASSO * 2) continue;
        /* trilha estilo placa: reto, chanfro de 45 graus, reto */
        const sx = Math.sign(b.x - a.x), sy = Math.sign(b.y - a.y);
        const diag = Math.min(Math.abs(b.x - a.x) * .5, Math.abs(b.y - a.y));
        const meio = a.x + (b.x - a.x) * (.3 + Math.random() * .4);
        const pts = [a, { x: meio - sx * diag / 2, y: a.y }, { x: meio + sx * diag / 2, y: a.y + sy * diag }, { x: b.x, y: a.y + sy * diag }];
        if (Math.abs(pts[3].y - b.y) > 1) pts.push({ x: b.x, y: b.y });
        const segs = [];
        let tam = 0;
        for (let k = 1; k < pts.length; k++) {
          const l = Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y);
          segs.push({ a: pts[k - 1], b: pts[k], l, ini: tam }); tam += l;
        }
        const na = { ...a, brilho: 0 }, nb = { x: pts[pts.length - 1].x, y: pts[pts.length - 1].y, brilho: 0 };
        nos.push(na, nb);
        rotas.push({ pts, segs, tam, fim: nb });
      }
    };
    const ponto = (r, d) => {
      d = Math.min(Math.max(d, 0), r.tam);
      const s = r.segs.find(s => d <= s.ini + s.l) || r.segs[r.segs.length - 1];
      const t = s.l ? (d - s.ini) / s.l : 0;
      return { x: s.a.x + (s.b.x - s.a.x) * t, y: s.a.y + (s.b.y - s.a.y) * t };
    };
    const desenha = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1; ctx.strokeStyle = corLinha; ctx.lineJoin = 'round';
      rotas.forEach(r => { ctx.beginPath(); r.pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); });
      nos.forEach(n => {
        ctx.fillStyle = corNo; ctx.fillRect(n.x - 3, n.y - 3, 6, 6);
        if (n.brilho > .02) {
          ctx.fillStyle = `rgba(232, 112, 26, ${n.brilho.toFixed(3)})`;
          ctx.fillRect(n.x - 3, n.y - 3, 6, 6);
          ctx.globalAlpha = n.brilho * .35;
          ctx.beginPath(); ctx.arc(n.x, n.y, 4 + (1 - n.brilho) * 10, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
          n.brilho *= .95;
        }
      });
      pulsos.forEach(p => {
        ctx.fillStyle = p.cor;
        for (let k = 9; k >= 0; k--) {
          const q = ponto(p.r, p.d - (k / 10) * CAUDA);
          ctx.globalAlpha = (1 - k / 10) * .8;
          ctx.beginPath(); ctx.arc(q.x, q.y, 1.9 - k * .12, 0, Math.PI * 2); ctx.fill();
        }
        const c = ponto(p.r, p.d);
        ctx.globalAlpha = 1; ctx.shadowColor = p.cor; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(c.x, c.y, 2.3, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      });
    };
    const quadro = agora => {
      const dt = ult ? Math.min((agora - ult) / 1000, .05) : 0; ult = agora;
      if (agora > prox && rotas.length && pulsos.length < 5) {
        pulsos.push({ r: rotas[sorteia(rotas.length)], d: 0, v: 80 + Math.random() * 90, cor: cores[Math.random() < .55 ? 0 : 1] });
        prox = agora + 600 + Math.random() * 1000;
      }
      pulsos.forEach(p => {
        p.d += p.v * dt;
        if (p.d >= p.r.tam && !p.aceso) { p.r.fim.brilho = .9; p.aceso = true; }
      });
      pulsos = pulsos.filter(p => p.d - CAUDA <= p.r.tam);
      desenha();
      if (visivel) raf = requestAnimationFrame(quadro);
    };
    monta(); desenha();
    if (calmo) return;
    new IntersectionObserver(ents => {
      visivel = ents[0].isIntersecting;
      cancelAnimationFrame(raf);
      if (visivel) { ult = 0; raf = requestAnimationFrame(quadro); }
    }).observe(host);
    let t, largura = W;
    new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => { if (Math.abs(host.clientWidth - largura) < 2 && Math.abs(host.clientHeight - H) < 2) return; largura = host.clientWidth; monta(); desenha(); }, 150);
    }).observe(host);
  });
  /* mosaico de serviços: pílulas sempre em uma linha, mesmo tamanho em todos os cards */
  $$('[data-bento]').forEach(bento => {
    const listas = $$('.pilulas', bento);
    const ajusta = () => {
      let fs = 13;
      bento.style.setProperty('--pil', fs + 'px');
      while (fs > 9 && listas.some(l => l.scrollWidth > l.clientWidth + .5)) {
        fs -= .25;
        bento.style.setProperty('--pil', fs + 'px');
      }
    };
    let espera;
    addEventListener('resize', () => { clearTimeout(espera); espera = setTimeout(ajusta, 120); });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(ajusta);
    ajusta();
  });

  cuidaTopo();
})();
