# CLAUDE.md

Repository instructions for agents working in this repository.

## What this is

An interactive web reference to 35 agent skills. `package.json` sits at the
repository root, so every npm command runs from there.

**The skills, their text, and the argument the site makes are the work of Matt
Pocock**, published at `github.com/mattpocock/skills` under the MIT License. This
site is study notes: a reorganisation, not original work.

Attribution is not decoration here. It appears in the hero, the footer, the
README, and `LICENSE-mattpocock-skills.txt`. Do not remove, shorten, or bury any
of it. If a change would make the site read as though the ideas originated here,
do not make it.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build, outputs to dist/
npm run preview    # serve the production build
npm run data       # regenerate src/data.ts from the Markdown
npm run data:check # fail if src/data.ts is out of date
```

Always run `npm run build`, not just `npm run dev`, before calling a change done.
Deployment runs `npm ci && npm run build`. A working dev server proves nothing
about whether the site deploys.

## Never run this

```bash
npm audit fix --force
```

It has already broken this project twice, jumping Vite across three major versions
and leaving `@vitejs/plugin-react` with an unsatisfiable peer dependency. Every
advisory here is in `devDependencies`, meaning build tooling that never ships.
The output is static HTML, CSS, and JavaScript with no server and no user input.

Check the installed versions before assuming: `npm ls vite @vitejs/plugin-react`.
The pair must satisfy each other. Vite 8 needs `@vitejs/plugin-react` 6 or later,
because version 4 accepts nothing above Vite 7. The mismatch does not fail the
build, it only prints a warning, so `npm ls` is the check that catches it.

## Content comes from one file

```
public/Skills-For-Real-Engineers-Reference.md    source of truth
        |
        v  scripts/generate-data.mjs  (npm run data)
src/data.ts                                       generated, do not hand-edit
```

`src/data.ts` carries a "generated" header. Editing it directly makes the page
disagree with the PDF and the Markdown, which is the exact failure the pipeline
exists to prevent. To change content, change the Markdown, then run `npm run data`.

The generator refuses to write a file it cannot vouch for. It cross-checks every
record against the appendix in Section 14 and throws if a skill is missing from
it, or if a record's stated mode disagrees with the mode listed there.

`data.ts` exports `skills` (35), `vocab` (35), `failures`, `flow`, `onramps`,
and `books`. Counts must be derived from these arrays, never typed out. See
`DeepShallow.tsx`, where the toggle labels read `DEEP_BOXES.length`, and
`SkillBrowser.tsx`, where every filter chip counts its own bucket.

Each skill also carries `source`, the exact contents of that skill's own
`SKILL.md` from the upstream `mattpocock/skills` repo, vendored under
`scripts/skill-sources/<name>.md` rather than fetched at build time, so a
build never depends on GitHub being reachable. That is what the copy button
on a card puts on the clipboard and what the "SOURCE TEXT" block on an
expanded card shows, so a reader lifts the authoritative upstream text rather
than this page's paraphrase of it. If a skill is added or renamed, its vendored
file must be added or renamed to match, or `npm run data` throws.

Text out of `data.ts` goes through `inline()` in `src/markdown.tsx`, which
renders the backtick, bold, and italic markup the reference uses. Printing such
a string straight into JSX shows the reader the backticks.

## Four traps specific to this codebase

### 1. Custom classes must stay in `@layer components`

`src/index.css` defines `.liquid-glass`, `.glass-panel`, and `.reveal` inside
`@layer components`. This is load-bearing. Defined at the top level they land
after `@tailwind utilities` with equal specificity, so they silently beat every
Tailwind class touching the same property. `.liquid-glass` sets `position`,
`background`, `border`, `box-shadow`, and `overflow`.

This already caused one bug: `absolute` on the header nav did nothing, so the nav
overlapped the button beside it.

Symptom to watch for: a Tailwind class appears to do nothing on an element that
also carries `liquid-glass` or `glass-panel`. Check the layer before assuming the
class name is wrong.

### 2. Tailwind opacity steps 8 and 12 are registered manually

The default scale jumps 5, 10, 20. `tailwind.config.js` adds 2, 3, 8, 12, and 15
because the glass treatment needs finer steps. Using an unregistered value such
as `border-white/7` generates no CSS at all and fails silently.

After any styling change, verify the classes actually compiled:

```bash
npm run build
grep -o 'border-white\\/[0-9]*' dist/assets/*.css | sort -u
```

Compare that against what the source uses. A class in the source but absent from
the CSS is an invisible border.

### 3. Video switching cannot be done in markup

The `media` attribute on `<source>` is not supported for `<video>` in any current
browser. `VideoBackground.tsx` switches between `bg-landscape.mp4` and
`bg-portrait.mp4` with `matchMedia`, and keys the element on its source so React
remounts it. Setting `src` alone leaves the old file playing.

Configuration lives in `src/config.ts`: `VIDEO`, `PORTRAIT_QUERY`,
`VIDEO_ON_PORTRAIT`, `VIDEO_PLAYBACK_RATE`.

### 4. `.reveal` hides an element until something reveals it

`.reveal` sets `opacity: 0`. The class is inert on its own. `useReveal` in
`src/hooks.ts` is what adds `.is-visible` and brings the element back, and it
watches its container with a `MutationObserver` so that nodes mounted after the
first render are picked up too.

This matters because filtering and searching unmount cards and mount fresh ones.
An earlier version read the `.reveal` elements once, on mount. Clearing a search
then left twenty-nine of the thirty-five skill cards sitting in the DOM at
`opacity: 0`, present to every query and to the screen reader, invisible to the
eye, and reported by nobody because nothing throws.

Two consequences worth holding on to. Any new list that filters must sit inside
the container `useReveal` watches, which today is the wrapper in `App.tsx`.
And a card being absent from the page is not evidence that it is absent from the
data: check `opacity` before going looking in `data.ts`.

Symptom to watch for: content that renders on first load, disappears after a
filter is cleared, and comes back on reload.

## The crab

There is a crab in the background footage and it is deliberate. A crab lives on
the tideline, which is neither land nor sea, and **seam** is a core term in this
reference. The crab is working a seam. The tool this was built with has a small
crab of its own that appears at the top of a session, which is the second layer.

All copy lives in `src/crab.ts` and surfaces in four places: the `Seam` entry in
Vocabulary, the footer colophon, the tab title when the reader looks away, and a
console note.

**Never add an illustrated crab to the interface.** Anthropic treats its Claude
Code mascot as its own trademark and enforced that in January 2026. A
photorealistic crab in ambient footage is allusion. A pixel sprite would be an
impression of somebody else's mark. Keep it in the footage and the copy.

## Header breakpoints

The nav pill is about 495px wide and collides with the wordmark at 1024px. It is
therefore gated at `xl` (1280px), not `lg`. Three classes must change together in
`Header.tsx`, or both the pill and the hamburger show at once:

- the desktop `<nav>`: `xl:flex`
- the hamburger `<button>`: `xl:hidden`
- the mobile `<nav>`: `xl:hidden`

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes `dist` to GitHub Pages.

One manual setting is required once: Settings, then Pages, then Source set to
**GitHub Actions**, not a branch. Choosing a branch is the usual cause of a 404
after a successful build.

`vite.config.ts` sets `base: "./"`, so the build works at any path. Do not change
this to an absolute path.

If the Actions run fails on a Node version error, raise `node-version` in the
workflow rather than downgrading Vite.

## Writing style

Applies to all prose in the site, the README, and commit messages.

- No em-dashes. Use commas, colons, or separate sentences.
- No contractions. Write "do not", "it is", "cannot".
- No corporate vocabulary: leverage, spearheaded, robust, seamless, pivotal,
  meticulous, dynamic, synergy.
- Plain verbs: used, built, led, wrote, fixed.
- Vary sentence length. Do not write every sentence to the same rhythm.

## Working style

- Confirm before proceeding to the next step of a multi-step change.
- Beginner-friendly patterns. Avoid clever constructs where a plain one works.
- Comment only where a reader would otherwise be misled, such as the four traps
  above. Do not narrate what the code already says.
- Verify claims rather than asserting them. Build it, grep the output, read the
  result.

## Accessibility

Do not regress these. They were deliberate.

- `prefers-reduced-motion` disables parallax and reveals, and serves the poster
  image instead of a looping video.
- Pointer parallax is skipped on touch devices.
- Every control is keyboard reachable with a visible focus ring.
- `/` focuses search, `Escape` clears it.

## Further detail

`README.md` in the project root covers stack, local development, the video
encoding commands, and the publishing steps. Read it before changing build
configuration or replacing the footage.
