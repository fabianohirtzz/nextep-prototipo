"""Servidor local que imita o GitHub Pages: /sobre entrega public/sobre.html.

Uso: python serve.py [porta]   (padrão 8080)
"""
import http.server
import pathlib
import sys

PUBLIC = pathlib.Path(__file__).parent / "public"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC), **kwargs)

    def translate_path(self, path):
        caminho = super().translate_path(path)
        p = pathlib.Path(caminho)
        if not p.exists() and p.suffix == "" and p.with_suffix(".html").exists():
            return str(p.with_suffix(".html"))
        return caminho


porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
print(f"http://localhost:{porta}/")
http.server.ThreadingHTTPServer(("", porta), Handler).serve_forever()
