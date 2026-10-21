# Parker Dingle — portfolio

Live at https://parkerdingle.github.io/Portfolio-Website/

A one-page site drawn as a leather ring binder, with Home, About, Work and Contact spreads. It deploys to GitHub Pages through `.github/workflows/static.yml` on every push to `main`.

- `index.html` is generated from `src/page.html` with `python3 src/build.py index.html`. The build adds the document head, Open Graph tags, the self-hosted fonts and the local copy of rough.js. Edit `src/page.html`, then rebuild.
- `Parker_Dingle_Resume.pdf` is the file behind every resume link. To update it, replace it with a file of the same name.
- `img/` holds the project screenshots and the leather and paper textures. `og.png` is the image shown when the link is shared.
- The charts are drawn in the browser with rough.js from each project's own figures: the Fight Camp projection code and the KNN grid search. The confusion matrix is the real output of the Titanic project.
- Fonts (Freckle Face, Schoolbell, Patrick Hand, Courier Prime) use the SIL Open Font License, and rough.js uses the MIT license. Their license texts are in `fonts/LICENSES.txt` and `js/`.
