"""Arma la carpeta preview/ a partir de una rama de trabajo.

La idea: el sitio publicado sale de main y no se toca. Debajo, en
preview/, vive una copia navegable de la rama, para que C pueda
verla en el celular antes de decidir si se publica.

Lo único delicado es el peso. La carpeta assets/ pasa de 120 MB,
así que copiarla en cada empujón engordaría el repositorio sin
control. En vez de eso, cada referencia a assets/ se resuelve una
por una:

  - si el archivo es idéntico al que ya está publicado, la
    referencia pasa a /assets/... y el preview reutiliza el
    publicado, sin copiar nada;
  - si la rama lo cambió o es nuevo, ese archivo, y solo ese, se
    copia dentro de preview/assets/.

Así el preview siempre se ve como se verá, y lo que se guarda en
git es lo que de verdad cambió.
"""

import hashlib
import pathlib
import re
import shutil
import sys

EXTENSIONES = (".html", ".css", ".js", ".json")

NOINDEX = '<meta name="robots" content="noindex, nofollow">'

REGLA_ROBOTS = "User-agent: *\nDisallow: /preview/\n"


def firma(ruta):
    return hashlib.sha256(ruta.read_bytes()).hexdigest()


def main(origen, destino):
    rama = pathlib.Path(origen)
    sitio = pathlib.Path(destino)
    preview = sitio / "preview"

    if preview.exists():
        shutil.rmtree(preview)
    preview.mkdir(parents=True)

    copiados = []
    for archivo in sorted(rama.iterdir()):
        if archivo.is_file() and archivo.suffix in EXTENSIONES:
            shutil.copy2(archivo, preview / archivo.name)
            copiados.append(archivo.name)

    # Cada referencia a assets/ se resuelve contra lo publicado
    patron = re.compile(r'(?<=[("\'])assets/([A-Za-z0-9._@/-]+)')
    reutilizados = set()
    propios = set()

    for nombre in copiados:
        ruta = preview / nombre
        texto = ruta.read_text(encoding="utf-8")

        def resolver(m):
            relativo = m.group(1)
            publicado = sitio / "assets" / relativo
            enRama = rama / "assets" / relativo
            if (
                publicado.is_file()
                and enRama.is_file()
                and firma(publicado) == firma(enRama)
            ):
                reutilizados.add(relativo)
                return "/assets/" + relativo
            if enRama.is_file():
                propios.add(relativo)
            return m.group(0)

        texto = patron.sub(resolver, texto)

        # Que ningún buscador indexe el preview
        if nombre.endswith(".html") and "noindex" not in texto:
            texto = texto.replace("<head>", "<head>\n" + NOINDEX, 1)

        ruta.write_text(texto, encoding="utf-8")

    for relativo in sorted(propios):
        origen_asset = rama / "assets" / relativo
        destino_asset = preview / "assets" / relativo
        destino_asset.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(origen_asset, destino_asset)

    robots = sitio / "robots.txt"
    if not robots.exists():
        robots.write_text(REGLA_ROBOTS, encoding="utf-8")
    elif "/preview/" not in robots.read_text(encoding="utf-8"):
        with robots.open("a", encoding="utf-8") as f:
            f.write("\n" + REGLA_ROBOTS)

    peso = sum(p.stat().st_size for p in preview.rglob("*") if p.is_file())
    print(f"archivos del sitio copiados: {len(copiados)}")
    print(f"assets reutilizados del publicado: {len(reutilizados)}")
    print(f"assets propios del preview: {len(propios)} {sorted(propios)}")
    print(f"peso de preview/: {peso / 1024:.0f} KB")

    if peso > 8 * 1024 * 1024:
        print("AVISO: el preview pasa de 8 MB. Revisa qué asset cambió.")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
