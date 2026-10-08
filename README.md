# Devesh Kumar Sharma — Portfolio

A standard personal portfolio built with React, TypeScript, and Vinext. It includes a professional introduction, About with award recognition, Experience, Projects, Community, Skills, Education, and Contact sections. All content is directly visible, including both GitHub accounts. The design adapts the supplied HTML reference with a dark grid, sky-blue and violet gradients, a replayable profile terminal, a decorative 2D network, an experience timeline, glass cards, scroll animations, and three optimized editorial images. The availability badge is omitted.

## Run locally

Requires Node.js 22.13 or later.

```sh
npm install
npm run dev
```

Open the local URL printed by the server, normally `http://localhost:5173`.

## Content

`../details.md` is the source. `npm run content:sync` extracts its data into `content/portfolio.json` and updates `content/details.md`, the fallback for standalone checkouts. Synchronization runs before development and builds. Citation placeholders are removed and social profile URLs are resolved in generated content. Edit the Markdown source rather than the generated JSON.

## Community

The “Giving back to the community” section links to [Developer Tool Box](https://100devtools.pages.dev/) and [Online Chess](https://shatranj.pages.dev/). Both links open in a new tab.

It also links to [Mock Server](https://mockapi-server.pages.dev/): configurable mock APIs, Google SSO and optional password login, owner UUID API keys, security controls, and deployment details.

## Motion

Sections reveal once as they enter the viewport, with staggered cards, subtle image parallax, animated section rules, and a reading progress line. Animation uses native browser APIs and CSS with no extra dependencies. Scrolling remains native. Content is readable before JavaScript loads, keyboard focus reveals content immediately, and reduced-motion preferences disable moving effects, including when changed while viewing the page.

## Reference design

The supplied HTML is a visual reference. The name, experience, projects, skills, award, education, and social links remain sourced from Devesh’s details. No sample employer, email, or production-system statistics are used. Plus Jakarta Sans and JetBrains Mono are bundled locally; no Tailwind CDN or Google Fonts request is needed. The terminal presents profile information and supports Replay. The network responds subtly to the pointer, pauses in hidden tabs, and remains still with reduced motion; the terminal shows its complete output immediately with that preference.

## Music

The optional music toggle starts an original ambient Web Audio score with soft chord pads, melody, and reverb. Playback requires a visitor’s click. Volume is adjustable, music fades out when switched off, and playback pauses while the browser tab is hidden. No external audio downloads are required.

## Structure

- `app/page.tsx`: server-rendered portfolio content.
- `app/globals.css`: responsive styling.
- `app/layout.tsx`: title, description, and favicon.
- `components/PortfolioHeader.tsx`: navigation and mobile menu.
- `components/ProfileTerminal.tsx`: progressive profile output and Replay.
- `components/NetworkBackground.tsx`: decorative 2D network with motion and visibility controls.
- `components/ProfileLinks.tsx`: LinkedIn and both GitHub profiles.
- `components/ScrollMotion.tsx`, `lib/scroll-motion.ts`: scroll reveals and image movement.
- `components/AmbientMusic.tsx`, `lib/ambient-score.ts`: music controls and synthesis.
- `scripts/sync-content.mjs`: content extraction.
- `public/images/`: optimized WebP imagery.
- `build/`, `.openai/`: Worker build and Sites hosting configuration.

## Validate

```sh
npm run typecheck
npm run build
npm test
npm run test:browser
```

Build before running tests. Motion tests additionally verify keyboard focus, one-time reveals, bounded image movement, preference changes, and listener cleanup. The production-render checks verify source content, section anchors, profile links, optimized image assets, and removal of game and 3D output. Browser checks cover terminal replay, decorative canvas, navigation, music controls, mobile menus, viewport overflow, image movement, reduced-motion preferences, and content without JavaScript. They route the built Worker and assets in memory, so no preview server is required.

Browser checks use Google Chrome on macOS. Set `PORTFOLIO_BROWSER` to a compatible Chromium executable elsewhere. Screenshots are saved to ignored `outputs/`. Restricted environments may prevent browser launches or access to the Sites source server.

## Cleanup

Unused starter UI components, database examples, connector and authentication helpers, vendored styles, pnpm-specific scripts, and the empty `next.config.ts` have been removed. Vinext uses its default configuration and the project’s `vite.config.ts`. npm and `package-lock.json` remain the package management source. Generated `dist/`, TypeScript caches, and empty runtime folders can be removed safely. Run `npm run build` before `npm start` or `npm test` after clearing build output. Installed dependencies in `node_modules/` remain available for local development and can be restored with `npm ci`.

## Portfolio imagery

Three original editorial images generated with the built-in image_gen tool (text-to-image generation), then resized and encoded as WebP for the website. They illustrate infrastructure, developer tools, and chess; they are not photographs of the author’s workplace or screenshots of the linked projects.

### Exact generation prompts

#### server-infrastructure.webp

```text
Use case: photorealistic-natural
Asset type: backend software engineer portfolio hero image, wide landscape 3:2.
Primary request: Architectural editorial photograph of a beautifully organized data-center aisle, black modular server racks and fine fiber optic paths with restrained cyan lighting.
Composition/framing: Wide landscape 3:2; subject centered to the right, dark negative space at the edges for flexible cropping.
Style/medium: Premium realistic editorial photography, dramatic but grounded.
Lighting/mood: Controlled cinematic lighting, restrained electric cyan accents and warm white practical highlights, believable illumination.
Color palette: Deep midnight navy, graphite, silver, restrained electric cyan.
Materials/textures: Visible physical detail, finely machined rack surfaces, real cables, realistic metal and glass.
Constraints: No people, no logos, no text, no watermarks, no UI screenshots, no matrix code, no exaggerated sci-fi effects.
```

#### developer-toolbox.webp

```text
Use case: photorealistic-natural
Asset type: community Developer Tool Box portfolio card, wide landscape 16:9.
Primary request: Macro editorial photograph of a dark sophisticated engineering desk: close-up black mechanical keyboard, organized small silver electronic components and a finely patterned circuit board with a restrained cyan LED.
Composition/framing: Wide landscape 16:9, beautifully composed close-up, shallow depth of field.
Style/medium: Premium realistic editorial photography; evocative artwork for a developer toolbox, not a screenshot of the toolbox.
Lighting/mood: Controlled premium lighting, restrained electric cyan LED and soft warm white practical highlights.
Color palette: Deep midnight navy, graphite, silver, restrained electric cyan.
Materials/textures: Realistic keyboard plastic, finely machined electronic components and intricate physical circuit board detail.
Constraints: No people, no logos, no text, no watermarks, no UI screenshots, no matrix code, no exaggerated sci-fi effects. Keyboard legends should be absent; unbranded blank black keycaps.
```

#### online-chess.webp

```text
Use case: photorealistic-natural
Asset type: community online chess portfolio card, wide landscape 16:9.
Primary request: Overhead/three-quarter close-up editorial photograph of a refined physical chessboard, graphite and ivory chess pieces, restrained cyan edge light on a midnight navy setting.
Composition/framing: Wide landscape 16:9; beautifully composed close view of tangible chessboard and realistically formed chess pieces.
Style/medium: Premium realistic editorial photography; illustrative artwork for online chess, not a screenshot of the chess game.
Lighting/mood: Controlled premium lighting with restrained electric cyan edge light and soft practical highlights.
Color palette: Deep midnight navy, graphite, ivory, silver, restrained electric cyan.
Materials/textures: Realistic texture and detail, refined matte graphite and ivory pieces, tactile polished chessboard.
Constraints: No people, no logos, no text, no watermarks, no UI screenshots, no matrix code, no exaggerated sci-fi effects.
```
