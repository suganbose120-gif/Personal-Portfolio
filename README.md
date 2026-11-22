# Sugan Bose — Portfolio

This is a responsive, single-page portfolio built with static HTML, CSS and vanilla JavaScript. It can be served directly from this directory on Vercel or any static host; there is no build command or framework runtime.

## Assets and motion

- `sugan-bose-portrait.png` is the original supplied portrait. The site applies grayscale and restrained contrast to the hero image in CSS.
- `assets/` contains the supplied Tazty, TechlyAI and Valar Digital Commerce logos.
- GSAP 3.15.1 and ScrollTrigger, plus Lenis 1.3.27, load from pinned CDN URLs in `index.html`. The site falls back to native scrolling and visible content if those libraries fail to load.
- The showreel and campaign frames are CSS illustrations and a motion preview, not uploaded client videos.
- DM Sans, DM Mono and Playfair Display load from Google Fonts with system fallbacks.

## Replace sample information before presenting as verified work

- The Tazty, TechlyAI and Valar descriptions are based on the supplied project details. Their campaign metrics remain illustrative layout figures; replace these with verified results when available.
- The three certification titles and issuers were supplied for the Certifications section. No certificate URLs were supplied, so the cards do not contain view links.
- No employment history was present in the supplied project, so the Journey timeline describes professional focus and ongoing development without inventing roles or dates.
- The contact email is `suganbose120@gmail.com`.
- The LinkedIn and Instagram links are set to the profiles supplied for Sugan Bose. GitHub links to `suganbose120-gif`.

## Local preview

Serve this directory over HTTP (for example, `npx serve .`) and open the printed local URL. The page can also be hosted as the Vercel project's static output with an empty build command.
