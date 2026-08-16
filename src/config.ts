// Every value you are likely to change lives here.

/**
 * Background footage.
 *
 * Two files, because a 16:9 clip cropped to a phone screen loses most of its
 * composition. The landscape file serves landscape viewports, the portrait file
 * serves portrait ones. Switching happens in VideoBackground via matchMedia:
 * the `media` attribute on <source> is not supported for <video> in browsers,
 * so this cannot be done in markup.
 *
 * Both files live in /public and are copied to the site root at build time.
 * They were re-encoded for web delivery: audio stripped (the video is muted),
 * faststart enabled so playback begins before the file finishes downloading,
 * and the generation watermark removed.
 */
export const VIDEO = {
  landscape: {
    src: "./bg-landscape.mp4",
    poster: "./poster-landscape.jpg",
  },
  portrait: {
    src: "./bg-portrait.mp4",
    poster: "./poster-portrait.jpg",
  },
};

/** Which media query selects the portrait file. */
export const PORTRAIT_QUERY = "(orientation: portrait)";

/**
 * Set false to serve the poster image instead of video on portrait screens.
 * Saves roughly 900 KB on a cellular connection and removes the motion from
 * the smallest viewport, where the copy has the least room to breathe.
 */
export const VIDEO_ON_PORTRAIT = true;

export const VIDEO_PLAYBACK_RATE = 1.25;

export const SOURCE_REPO = "https://github.com/mattpocock/skills";
export const SOURCE_TALK = "https://youtu.be/v4F1gFy-hqg";
export const PDF_HREF = "./Skills-For-Real-Engineers-Reference.pdf";
export const MD_HREF = "./Skills-For-Real-Engineers-Reference.md";

export const NAV = [
  { label: "ARGUMENT", href: "#argument" },
  { label: "FLOW", href: "#flow" },
  { label: "SKILLS", href: "#skills" },
  { label: "VOCABULARY", href: "#vocabulary" },
];
