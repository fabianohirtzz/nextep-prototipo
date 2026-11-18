"""Monta public/*.html a partir de src/pages + src/partials.

Cada página começa com um bloco de metadados:
<!--meta
title: ...
description: ...
active: home
-->
"""
import pathlib
import re
import time

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "public"
PARTIALS = {p.stem: p.read_text(encoding="utf-8") for p in (SRC / "partials").glob("*.html")}
VERSAO = str(int(time.time()))
MENU = ["solucoes", "projetos", "sobre", "contato"]


PLAY = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>'
IG = ('<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" '
      'fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" '
      'stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3" fill="currentColor"/></svg>')
REELS = [
    ("Df0EhBzBWkr", "Quem responde é o cliente", "Pedro, da Juntapel, conta como é terceirizar a TI."),
    ("DfCj1MDJpsc", "Do projeto à inauguração", "Dez meses de obra da nova sede da Juntapel."),
    ("DfqFC5FpESv", "Da indicação ao contrato", "Como a parceria com a Montele chegou à Juntapel."),
    ("DW65IeGpGh-", "Transformação completa", "TI, som e câmeras de um supermercado em Canoas."),
    ("DWjt-ZaJebS", "Uma loja inteira de lugar", "Cabeamento, rede e servidores saindo do zero."),
    ("DXKWdf0pe6Q", "TI para supermercados", "Redes, CFTV, som e frente de caixa."),
    ("DYpZid6p599", "Visita técnica em Biguaçu", "O coração da infraestrutura de um cliente em SC."),
    ("DO_a1DNjdaK", "Reestruturação de rack", "Mais segurança e continuidade para o cliente."),
    ("DfmwL0EpU2J", "15 anos de Nextep", "11/11/2011, o dia em que tudo começou."),
    ("DfSIqmvBoqI", "O time alinhado", "A reunião semanal da liderança da Nextep."),
]
CATS = {
    "infra": ("Racks e servidores", "Rack, servidores e cabeamento montados pela Nextep"),
    "campo": ("Em campo", "Equipe da Nextep em instalação de campo"),
    "varejo": ("Varejo", "Supermercado e loja atendidos pela Nextep"),
    "equipe": ("Equipe", "Time da Nextep no dia a dia"),
}


def reels_html(codes=None) -> str:
    out = []
    for code, tit, txt in REELS:
        if codes and code not in codes:
            continue
        out.append(
            f'<button class="reel" type="button" data-reel="{code}" aria-label="Assistir: {tit}"><span class="reel__capa">'
            f'<img src="assets/img/reels/{code}.webp" alt="" loading="lazy" width="720" height="1280" draggable="false">'
            f'<span class="reel__ig">{IG}Reel</span><span class="reel__play">{PLAY}</span></span>'
            f'<span class="reel__txt"><b>{tit}</b>{txt}</span></button>'
        )
    return "\n      ".join(out)


def galeria_html() -> tuple[str, str]:
    fotos = sorted((OUT / "assets/img/ig").glob("*.webp"))
    # intercala categorias para a galeria não ficar em blocos
    por_cat = {c: [f for f in fotos if f.name.startswith(c)] for c in CATS}
    ordem = []
    while any(por_cat.values()):
        for c in ["infra", "campo", "equipe", "infra", "varejo"]:
            if por_cat[c]:
                ordem.append(por_cat[c].pop(0))
    figs = []
    for f in ordem:
        cat = f.name.split("-")[0]
        figs.append(
            f'<figure data-cat="{cat}"><img src="assets/img/ig/{f.name}" alt="{CATS[cat][1]}" loading="lazy" width="1080" height="1161"></figure>'
        )
    filtros = [f'<button type="button" data-cat="todos" aria-pressed="true">Todas <span>{len(fotos)}</span></button>']
    for c, (rot, _) in CATS.items():
        n = sum(1 for f in fotos if f.name.startswith(c))
        filtros.append(f'<button type="button" data-cat="{c}" aria-pressed="false">{rot} <span>{n}</span></button>')
    return "\n      ".join(figs), "\n      ".join(filtros)


def render(name: str) -> str:
    raw = (SRC / "pages" / f"{name}.html").read_text(encoding="utf-8")
    m = re.match(r"<!--meta\n(.*?)\n-->\n", raw, re.S)
    meta = dict(line.split(": ", 1) for line in m.group(1).splitlines())
    body = raw[m.end():]
    if "<!--GALERIA-->" in body:
        figs, filtros = galeria_html()
        body = body.replace("<!--GALERIA-->", figs).replace("<!--FILTROS-->", filtros)
    body = body.replace("<!--REELS-->", reels_html())
    html = PARTIALS["layout"]
    html = html.replace("{{head}}", PARTIALS["head"]).replace("{{header}}", PARTIALS["header"])
    html = html.replace("{{footer}}", PARTIALS["footer"]).replace("{{content}}", body)
    for key in MENU + ["home"]:
        attr = ' aria-current="page"' if meta.get("active") == key else ""
        html = html.replace("{{cur:" + key + "}}", attr)
    html = html.replace("{{title}}", meta["title"]).replace("{{description}}", meta["description"])
    html = html.replace("{{v}}", VERSAO)
    html = html.replace("{{page}}", meta.get("active", name))
    html = html.replace("{{path}}", "" if name == "index" else name + ".html")
    return html


for page in sorted((SRC / "pages").glob("*.html")):
    (OUT / page.name).write_text(render(page.stem), encoding="utf-8")
    print("ok", page.name)
