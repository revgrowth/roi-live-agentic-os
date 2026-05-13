# HyperFrames Composition Template for L2S Clips

Reference for building HTML+CSS+GSAP compositions that render L2S short-form clips via `viz-hyperframes`. Claude generates the HTML dynamically per clip from word timestamps and pipeline config.

---

## Root Composition

- Canvas: 1080x1920 (9:16 portrait)
- Duration: clip length in seconds (from reframed clip metadata)
- FPS: 30
- Timeline name: `l2s-clip`

---

## Layer Stack (z-index bottom to top)

### Video Base (z: 0)

```html
<video id="base-video" src="./reframed-clip.mp4" muted
  style="position:absolute; top:0; left:0; width:1080px; height:1920px; object-fit:cover; z-index:0;">
</video>
```

Copy the reframed clip into the HyperFrames project directory. The video element is muted — HyperFrames handles audio muxing from the source video automatically.

### Captions (z: 10)

Word-level timestamps from transcription drive per-word highlight animation.

**Phrase grouping:** Split words into 3-4 word phrase groups. Each phrase group is a `<div>` containing `<span>` elements per word.

```html
<div class="phrase-group" id="phrase-1"
  style="position:absolute; bottom:350px; left:0; width:100%; text-align:center;
         font-family:'Montserrat',sans-serif; font-size:80px; font-weight:800;
         color:#FFFFFF; text-shadow:0 4px 12px rgba(0,0,0,0.7);
         opacity:0; z-index:10;">
  <span class="word" data-start="1.2" data-end="1.5">Every</span>
  <span class="word" data-start="1.5" data-end="1.8">single</span>
  <span class="word" data-start="1.8" data-end="2.2">skill</span>
</div>
```

**GSAP timeline:** For each phrase group:
1. Fade in the group (`opacity: 0 -> 1`) at the first word's start time
2. For each word, tween `color` from white to `highlight_color` at `data-start`, back to white at `data-end`
3. Fade out the group (`opacity: 1 -> 0`) after the last word ends (or when the next group starts)

```js
const tl = window.__timelines["l2s-clip"];

// Phrase 1
tl.to("#phrase-1", { opacity: 1, duration: 0.15 }, 1.2);
tl.to("#phrase-1 .word:nth-child(1)", { color: "#FF6B00", duration: 0.15 }, 1.2);
tl.to("#phrase-1 .word:nth-child(1)", { color: "#FFFFFF", duration: 0.15 }, 1.5);
tl.to("#phrase-1 .word:nth-child(2)", { color: "#FF6B00", duration: 0.15 }, 1.5);
// ... continue for each word
tl.to("#phrase-1", { opacity: 0, duration: 0.15 }, 2.4);
```

**Config mapping:**
- `editing.subtitle_font` -> `font-family`
- `editing.subtitle_size` -> `font-size` (px)
- `editing.highlight_color` -> highlight tween target color
- `editing.subtitle_box_style: "pill"` -> add `background: rgba(0,0,0,0.6); border-radius: 12px; padding: 8px 24px;` to phrase group

### Hook Text (z: 20)

The clip's title/hook line from `clip_definitions.json`. Animated entrance at t=0.

```html
<div id="hook-text"
  style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) scale(0.8);
         font-family:'Montserrat',sans-serif; font-size:96px; font-weight:900;
         color:#FFFFFF; text-align:center; width:90%;
         text-shadow:0 6px 20px rgba(0,0,0,0.8);
         opacity:0; z-index:20;">
  The hook text here
</div>
```

**Animation:** Scale up + fade in at t=0, hold for 3s, fade out over 0.5s. Subtitles begin 0.7s after hook disappears.

```js
tl.to("#hook-text", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" }, 0);
tl.to("#hook-text", { opacity: 0, duration: 0.5 }, 3.0);
```

### Speaker Card (z: 30)

Lower-third name card. Only if `speaker_card_enabled: true` and speaker name exists.

```html
<div id="speaker-card"
  style="position:absolute; bottom:180px; left:50%; transform:translateX(-50%) translateY(20px);
         background:rgba(0,0,0,0.7); backdrop-filter:blur(12px);
         border-radius:16px; padding:16px 32px;
         font-family:'Montserrat',sans-serif; font-size:36px; font-weight:600;
         color:#FFFFFF; opacity:0; z-index:30;">
  <div class="speaker-name">Speaker Name</div>
  <div class="speaker-handle" style="font-size:24px; color:rgba(255,255,255,0.7);">@handle</div>
</div>
```

**Animation:** Slide up + fade in at t=0.5, hold until t=4, slide down + fade out.

```js
tl.to("#speaker-card", { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.5);
tl.to("#speaker-card", { opacity: 0, y: 20, duration: 0.4 }, 4.0);
```

### Illustrations (z: 40)

Overlay illustration PNGs at timed moments from `moments.json`.

**Spotlight mode** (`illustration_mode: "spotlight"`):
```html
<div class="illustration-overlay" id="illust-1"
  style="position:absolute; top:0; left:0; width:100%; height:100%;
         background:rgba(0,0,0,0.5); opacity:0; z-index:40;
         display:flex; align-items:center; justify-content:center;">
  <img src="./illustrations/moment-1.png"
    style="width:800px; height:800px; object-fit:contain; transform:scale(0.8);">
</div>
```

Animation: dim backdrop fades in, image scales from 0.8 to 1.0 with `back.out` easing, holds for duration, fades out.

**Float mode** (`illustration_mode: "float"`):
```html
<img class="illustration-float" id="illust-1"
  src="./illustrations/moment-1.png"
  style="position:absolute; top:120px; right:-300px; width:280px; height:280px;
         object-fit:contain; opacity:0; z-index:40;">
```

Animation: slide in from right (`right: -300 -> 40px`) + fade in, hold for duration, slide out + fade out.

### CTA Overlay (z: 50)

End-screen call-to-action. Only if `cta_enabled: true`.

```html
<div id="cta-overlay"
  style="position:absolute; bottom:0; left:0; width:100%; height:auto;
         background:linear-gradient(transparent, rgba(0,0,0,0.85));
         padding:60px 40px 80px; text-align:center;
         transform:translateY(100%); opacity:0; z-index:50;">
  <div style="font-family:'Montserrat',sans-serif; font-size:40px; font-weight:700; color:#FFFFFF;">
    Watch the full video
  </div>
  <div style="font-size:28px; color:rgba(255,255,255,0.7); margin-top:12px;">
    @handle
  </div>
</div>
```

**Animation:** Slide up from bottom at `clip_duration - cta_duration`, hold until end.

```js
const ctaStart = clipDuration - ctaDuration;
tl.to("#cta-overlay", { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, ctaStart);
```

---

## Layout-Specific Caption Positioning

Map existing ASS alignment values to CSS positioning:

| Layout | Caption CSS | Hook CSS |
|--------|------------|----------|
| `face-track` | `bottom: 350px; text-align: center;` | `top: 50%; transform: translateY(-50%);` |
| `cursor-track` | `bottom: 350px; text-align: center;` | `top: 50%; transform: translateY(-50%);` |
| `split-screen` | `top: 50%; transform: translateY(-50%);` | `top: 320px; text-align: center;` |

---

## Audio Handling

Do NOT add audio tracks in the HTML composition. HyperFrames automatically extracts audio from the `<video>` source and muxes it into the final render. If the video element is muted (as above), audio is still pulled from the source file.

---

## Timeline Contract

The composition must expose a single paused GSAP timeline:

```js
window.__timelines = window.__timelines || {};
window.__timelines["l2s-clip"] = gsap.timeline({ paused: true });
```

HyperFrames advances this timeline frame-by-frame during render. All animations must be on this timeline — no independent `gsap.to()` calls outside it.
