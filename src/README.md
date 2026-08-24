# Ten Rooms source tree

`src` is the editable source of the game. The numbered `game_N.html` files are
self-contained builds and local version archives; `index.html` remains the
published GitHub Pages build.

## Layout

- `index.html` contains the document markup and build placeholders.
- `styles` contains CSS in build order.
- `js/00-core` through `js/99-main` contain JavaScript in dependency order.
- `scripts/build.ps1` concatenates and inlines these files without external
  runtime dependencies.
- `scripts/validate-build.ps1` checks that the numbered build matches `src` and
  validates its inline JavaScript syntax.

The numeric directory and filename prefixes are significant. The code still
shares one strict-mode script scope after bundling, which preserves the behavior
of the former single-file implementation while giving each subsystem a clear
home.

## Make the next game change

1. Run `.agents/skills/ten-rooms-release/scripts/new_version.ps1` before editing.
2. Note the new number, for example `game_28.html`.
3. Edit files below `src`; do not edit the numbered build directly.
4. Build it with `scripts/build.ps1 -Version 28`.
5. Validate it with `scripts/validate-build.ps1 -Version 28` and exercise the
   changed behavior in a browser.

Do not run `extract-source.ps1` again during normal development. It is the
one-time migration utility that created this tree from `game_27.html`.

Do not replace `index.html`, commit, push, or publish unless the user explicitly
asks to publish the latest version.
