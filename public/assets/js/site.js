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
    const aberto = [reelbox, fotobox].find(m => m && !m.hidden);
    if (!aberto) return;
    const foco = $$('button, iframe', aberto).filter(el => el.offsetParent !== null);
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
    ok.textContent = 'Recebemos seus dados. Um especialista da Nextep vai falar com você em até 1 dia útil.';
    ok.setAttribute('tabindex', '-1');
    ok.focus();
    form.reset();
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

  /* topo: some ao descer, volta ao subir */
  let ultimoY = scrollY;
  const cuidaTopo = () => {
    if (!topo) return;
    const y = scrollY;
    topo.classList.toggle('is-rolado', y > 8);
    const menuAberto = document.body.classList.contains('is-travado');
    if (!menuAberto && !calmo) topo.classList.toggle('is-escondido', y > 320 && y > ultimoY + 4);
    if (y < ultimoY - 4 || y < 320) topo.classList.remove('is-escondido');
    ultimoY = y;
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
  cuidaTopo();
})();
