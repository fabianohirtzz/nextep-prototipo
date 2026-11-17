(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* topo: borda ao rolar */
  const topo = $('[data-topo]');
  const marcaTopo = () => topo && topo.classList.toggle('is-rolado', scrollY > 8);
  addEventListener('scroll', marcaTopo, { passive: true });
  marcaTopo();

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
})();
