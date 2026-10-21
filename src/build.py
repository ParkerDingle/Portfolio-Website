"""Wrap page.html (the artifact fragment) into index.html for GitHub Pages:
adds the document head and Open Graph tags, self-hosts the fonts and rough.js."""
import pathlib, re, sys
src = pathlib.Path(__file__).with_name("page.html").read_text()
head, body = src.split("<!--BODY-->", 1)
head = head.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', "")
faces = [("Freckle Face", 400, "freckle-face-latin-400-normal"),
         ("Schoolbell", 400, "schoolbell-latin-400-normal"),
         ("Patrick Hand", 400, "patrick-hand-latin-400-normal"),
         ("Courier Prime", 400, "courier-prime-latin-400-normal"),
         ("Courier Prime", 700, "courier-prime-latin-700-normal")]
fontcss = "<style>\n" + "\n".join(
    f'@font-face {{ font-family: "{n}"; font-style: normal; font-weight: {w}; font-display: swap; src: url("fonts/{f}.woff2") format("woff2"); }}'
    for n, w, f in faces) + "\n</style>\n"
preload = "".join(f'<link rel="preload" href="fonts/{f}.woff2" as="font" type="font/woff2" crossorigin>\n'
                  for f in ["freckle-face-latin-400-normal", "schoolbell-latin-400-normal", "patrick-hand-latin-400-normal"])
head = re.sub(r'<link rel="preconnect"[^>]*>\n', "", head)
head = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>\n', preload + fontcss, head)
body = body.replace('<script src="https://cdn.jsdelivr.net/npm/roughjs@4.6.6/bundled/rough.js"></script>', '<script src="js/rough.js"></script>')
assert "fonts.googleapis" not in head and "jsdelivr" not in body
favicon = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E"
           "%3Ccircle cx='50' cy='50' r='48' fill='%23141414'/%3E%3Ccircle cx='50' cy='50' r='36' fill='none' stroke='%23333' stroke-width='3'/%3E"
           "%3Ccircle cx='50' cy='50' r='17' fill='%23c51b25'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%23f4f1ea'/%3E%3C/svg%3E")
meta = f"""<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#fbf8f1">
<link rel="icon" href="{favicon}">
<meta property="og:type" content="website">
<meta property="og:title" content="Parker Dingle">
<meta property="og:description" content="Computer science student at Georgia Southern building machine-learning models and the data pipelines that feed them.">
<meta property="og:url" content="https://parkerdingle.github.io/Portfolio-Website/">
<meta property="og:image" content="https://parkerdingle.github.io/Portfolio-Website/og.png">
<meta name="twitter:card" content="summary_large_image">
"""
out = f"<!doctype html>\n<html lang=\"en\">\n<head>\n{meta}{head.strip()}\n</head>\n<body>\n{body.strip()}\n</body>\n</html>\n"
pathlib.Path(sys.argv[1]).write_text(out)
print("wrote", sys.argv[1], len(out))
