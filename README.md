# Skills For Real Engineers, an interactive reference

A cinematic, searchable reference to the 35 agent skills published by Matt Pocock at
[mattpocock/skills](https://github.com/mattpocock/skills), and the software design
argument behind them.

**Live page:** https://subhojit-bhattacharya.github.io/skills-reference/

## Attribution

The skills, their text, and the argument summarised here are the work of **Matt
Pocock**, published under the MIT License, copyright 2026 Matt Pocock. The talk is
[Skills For Real Engineers](https://youtu.be/v4F1gFy-hqg).

These are study notes. The organisation and the page are mine. The ideas are his.
For the authoritative text of any skill, read its `SKILL.md` in the original
repository. The original license is included as `LICENSE-mattpocock-skills.txt`.

## Stack

React 18, TypeScript, Vite 8, Tailwind CSS 3, GSAP, lucide-react.

`@vitejs/plugin-react` must stay on 6 or later. Version 4 accepts nothing above
Vite 7, and the resulting mismatch prints a warning rather than failing the
build, so it is easy to carry for a long time without noticing.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # serve the production build
npm run data     # regenerate src/data.ts from the Markdown
```

## Publishing to GitHub Pages

Deployment is automated. On every push to `main`, the workflow in
`.github/workflows/deploy.yml` builds the site and publishes `dist`.

One setting is required first:

1. Push this repository to GitHub.
2. Go to **Settings**, then **Pages**.
3. Under Source, choose **GitHub Actions**. Do not choose a branch.
4. Push once more, or run the workflow manually from the Actions tab.

`vite.config.ts` uses `base: "./"`, so the build works at any path without editing.

## Background video

Two files, served by viewport orientation:

| Viewport | File | Size |
| --- | --- | --- |
| Landscape (desktop) | `public/bg-landscape.mp4` (1280x720) | 970 KB |
| Portrait (mobile) | `public/bg-portrait.mp4` (720x1280) | 900 KB |

Each has a matching poster frame that paints instantly while the video loads.

Switching happens in `VideoBackground.tsx` using `matchMedia`, not in markup. The
`media` attribute on `<source>` is not supported for `<video>` in any current
browser, so a JavaScript switch is the only reliable method. The element is keyed
on its source so React remounts it when orientation changes, which is what makes
the browser fetch the new file.

Everything configurable lives in `src/config.ts`:

```ts
VIDEO                 // the two file paths and their posters
PORTRAIT_QUERY        // default "(orientation: portrait)"
VIDEO_ON_PORTRAIT     // false serves the poster image instead, saving ~900 KB
VIDEO_PLAYBACK_RATE   // default 1.25
```

Source files were re-encoded for web: audio stripped, CRF 27, `+faststart` so
playback begins before download completes, and the generation watermark removed
with ffmpeg's `delogo` filter. To replace them, keep the same filenames and rerun:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p \
  -an -movflags +faststart public/bg-landscape.mp4
ffmpeg -i public/bg-landscape.mp4 -vframes 1 -q:v 6 public/poster-landscape.jpg
```

Reduced-motion users are served the still poster rather than a loop, since a
looping background is motion.

## Where the content comes from

`src/data.ts` is generated from `public/Skills-For-Real-Engineers-Reference.md` by
`scripts/generate-data.mjs`. Edit the Markdown and run `npm run data` rather than
editing `data.ts` by hand, so the page, the PDF, and the Markdown cannot drift
apart. `npm run data:check` fails if the two have parted company, which makes it
usable as a gate.

Every skill record carries a `source` field holding the record exactly as the
Markdown writes it. That is what the copy button on each card puts on the
clipboard, so a reader takes the authoritative text away rather than the page's
rendering of it.

## The crab

There is a crab in the background footage, and it is not accidental scenery.

A crab lives on the tideline, which is neither land nor sea. **Seam** is a core
term in this reference: Michael Feathers' word for the place where behaviour can
be altered, where a module's interface lives, where you test. The crab is working
a seam. So does the tool this page was written with, which has a small crab of
its own that turns up at the top of a session.

All the copy for this lives in `src/crab.ts`. Change it there or delete that file's
imports to remove it entirely. It appears in four places:

| Where | What |
| --- | --- |
| Vocabulary, `Seam` | The note that explains the footage |
| Footer colophon | The line that points at it, linking to `#seam` |
| Tab title | Changes once the reader switches away |
| Console | One note for anyone who opens developer tools |

There is deliberately **no illustrated crab in the interface**. Anthropic treats
its Claude Code mascot as its own trademark, and enforced that in January 2026.
A photorealistic crab in ambient footage is allusion. A pixel sprite would be an
impression of somebody else's mark. Keep it in the footage and in the copy.

## Accessibility notes

- `prefers-reduced-motion` disables the parallax, the reveals, and smooth scrolling.
- All controls are keyboard reachable with a visible focus ring.
- Press `/` to focus search, `Escape` to clear it.
