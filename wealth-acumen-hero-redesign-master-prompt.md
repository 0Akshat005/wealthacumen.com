# Wealth Acumen — Hero & Homepage Redesign
## Master Implementation Prompt for Antigravity (Stitch MCP)

**How to use this doc:** Everything from the divider down is written to be pasted into Antigravity as one prompt. It's built to run against your existing wealthacumen.in build — it restyles and re-choreographs what's already there (plus one new live mechanic and new imagery direction). It does not invent new claims, numbers, or offers. I've grounded it in a pixel-level teardown of your current hero screenshot and in live research on Groww, AMFI India, and Dezerv, so Antigravity has real reference points instead of "make it look premium" vagueness.

---

# PROMPT START

## ROLE

You are the lead designer and front-end engineer rebuilding the homepage of **Wealth Acumen** (wealthacumen.in) — an AMFI-registered mutual fund distribution practice (ARN 247468), run by a named advisor, Atharva, based out of Mumbai/Nagpur. The current site is competent and conversion-aware but visually generic — it reads as a Tailwind SaaS template with a navy-and-gold skin. Your brief is to rebuild it into something that could sit in an Awwwards "Site of the Day" queue: a distinctive, premium, psychologically sharp design that a boutique wealth advisory — not a mass-market trading app — would commission from a serious design studio.

Treat this as a real client engagement, not a template swap. Every decision below should trace back to who Wealth Acumen actually is: a **human-advisor-led** practice, not a self-serve app.

---

## NON-NEGOTIABLE CONSTRAINTS — READ FIRST

1. **Content is frozen.** Preserve every real fact currently on the site: ARN 247468, EUIN references, NISM-certified-advisor claim, Angel One Channel Partner status, the "11 AMC Partners" and "150M+ Demat Accounts" stats, all testimonials verbatim in meaning, the mission/vision copy, the Insurance and DIY (Angel One) sections, the SIP compounding explainer, and every compliance/disclaimer line that exists anywhere on the site today (e.g. "mutual fund investments are subject to market risk," EUIN disclosures). You are restyling and re-sequencing content, not rewriting facts. Do not invent testimonials, stats, or guarantees.
2. **Functionality is frozen.** SIP calculator, compounding visualizer, WhatsApp floating button, Angel One DIY QR flow, consultation/contact forms, and the nav structure must all keep working — you're changing how they look and move, not what they do.
3. **This is a regulated financial services business.** Any "urgency" mechanic you build must be mathematically real and independently verifiable (full spec in Section 6). Do **not** build countdown timers, fake "X people invested today" counters, or "limited slots" badges. On an investment product, manufactured scarcity is an ethical problem and a plausible AMFI/ASCI advertising-code problem. The honest version — a live, provable cost-of-delay calculation — is more persuasive here anyway, and it's the only kind you're allowed to ship.
4. **Ban list for this rebuild:** no more "rectangle, 1px border, 8px radius, drop-shadow" as the default container for anything. If you catch yourself reaching for `border + rounded-lg + shadow-sm` a third time in the same viewport, stop — use one of the alternative treatments in Section 7 instead. Compliance text itself may stay in a plain, quiet, legible block (see Section 11) — the ban is on decorative boxing, not on the disclaimer's legal legibility.

---

## 1. DIAGNOSIS — WHAT'S ACTUALLY WRONG WITH THE CURRENT HERO

Be precise about what you're fixing, not just "make it nicer":

- **Three stacked utility bars before the hero even starts** (urgency ticker + "Capture Growth" CTA → contact/social row → nav). By the time a visitor reaches the actual headline, a meaningful chunk of the first viewport is gone on any laptop under 900px tall. Consolidate rows 1–2 into one slim bar; give the freed vertical space back to the hero.
- **Competing CTAs.** The top bar's "Capture Growth" button competes with the hero's own "Start Your SIP Today" and "Book Free Consultation" — three asks above the fold split attention instead of focusing it. A hero should carry one dominant action and one lower-commitment alternative, not three.
- **Everything is the same box.** The "Cost of Delay" card, the compounding chart panel, and both buttons all use an identical treatment: flat navy fill, thin border, uniform corner radius. Nothing in the hero tells the eye "this is the important thing" through shape — only color does that work, and color alone is a weak hierarchy signal.
- **The urgency ticker undersells itself.** "You missed ₹0.293122 in growth" is a genuinely clever, honest mechanic — but six decimal places reads as a rounding bug, not a feeling, and it's tucked into a thin top strip that visitors are trained to ignore (banner blindness — this is the exact real estate cookie-notices and promo bars occupy). This is your single best psychological asset on the page and it's currently the least prominent element.
- **The background is a flat color, not a place.** Solid navy with a faint dot scatter reads as "dark mode SaaS dashboard." There's no texture, imagery, or depth cue that this is a wealth practice for people, not a fintech product.
- **The compounding chart panel looks pasted on.** Hard border, drop shadow, floating tooltip pill — it reads as a screenshot dropped into the layout rather than something native to the page.

---

## 2. WHO YOU'RE ACTUALLY COMPETING WITH — AND WHY YOU SHOULDN'T LOOK LIKE THEM

Three reference points, each teaching a different lesson:

**Groww** is the mass-market, self-serve, app-first product. Its homepage leads with "Groww your wealth," a single blunt CTA ("Get started"), minimal text, and a clean flat UI aimed at first-time millennial investors doing everything themselves, with no human in the loop. Lesson to *borrow*: radical clarity and a single dominant CTA. Lesson to *reject*: Wealth Acumen is not trying to be a self-serve product. If this redesign starts to look like a Groww clone, it undercuts the one thing Wealth Acumen actually sells — a named advisor you can call. Don't chase Groww's product-y minimalism; chase its clarity of message.

**AMFI India** (amfiindia.com) is the regulator-adjacent reference — dense data tables, NAV listings, circulars, a utilitarian government-body aesthetic. It has zero design ambition, but it's the single most trust-coded surface in this category: ARN numbers, SEBI language, investor-education framing. Lesson to *borrow*: the specific vocabulary of authority (ARN, NISM, SEBI-adjacent phrasing) that Indian investors are trained to look for before trusting a distributor. Lesson to *reject*: don't borrow its visual flatness or its bureaucratic density — that's the floor, not the ceiling.

**Dezerv** is the closest actual peer in tone — a premium, expert-led wealth platform whose brand line is emotionally aspirational ("You are building India's future, we are building yours") rather than transactional, and whose positioning explicitly separates itself from mass-market, distribution-led platforms by leading with the expertise and track record of its named team. Lesson to *borrow*: aspirational, human, slightly editorial copy register and a founder/expert-forward trust story. This is the closest sibling to what Wealth Acumen's "Call Atharva" nav item is already trying to say — lean into that instead of burying it in a nav dropdown.

**The synthesis:** Wealth Acumen should look like a boutique private-wealth practice that happens to have excellent web design — closer in spirit to Dezerv's aspirational tone, wearing AMFI's specific vocabulary of authority, while being clearer and less cluttered than either. It should not look like a trading app.

---

## 3. THE POSITIONING THIS DESIGN HAS TO EARN

One sentence to hold onto through every decision below: **this is a relationship, not a dashboard.** The nav already has a "Call Atharva" link — that's the actual product. A generic fintech hero (chart card + stat badges + gradient button) undersells that. Every screen should make it feel like there's a specific, reachable, credentialed human behind the numbers — not just an algorithm or a generic "our team."

---

## 4. DESIGN NORTH STAR — AND WHAT TO DELIBERATELY AVOID

Right now, AI-assisted design tends to default to one of three looks, and all three are wrong for this brief:

1. Warm cream background + high-contrast serif + a terracotta/clay accent color. Avoid this — it's a generic "editorial startup" default, and the terracotta reads as an off-brand orange next to Wealth Acumen's navy-gold identity.
2. Near-black background with a single bright neon-green or vermilion accent. Avoid this — it reads as crypto/trading-terminal, which pushes toward the "app" identity you're trying to move away from.
3. Broadsheet-style layout: hairline rules, zero border-radius, dense newspaper columns. Interesting for a media brand, wrong register for a warm advisory relationship.

**Direction for this brief: Editorial Private Wealth.** Keep and deepen the existing ink-navy-and-gold identity (it's already distinctive and on-brand — don't throw it away for one of the three defaults above). Layer in warmth through typography, photography, and one signature motif (Section 5) rather than through a new color story. The reference feeling: a well-designed private bank's digital brand, or a boutique advisory's annual letter — not a fintech app store listing.

---

## 5. TOKEN SYSTEM

### Color

Sampled from your live build, then extended — don't replace the brand, complete it:

| Role | Hex | Notes |
|---|---|---|
| Ink Navy (primary background) | `#0B1B33` | Your current hero base — keep it, it's already distinctive |
| Deep Navy (elevated surfaces) | `#132948` | For panels that need to sit "above" the base without a hard border |
| Signal Gold (primary accent / CTA) | `#C6952E` | Slightly warmed from your current `#BA872F` for stronger contrast on navy |
| Muted Gold (secondary text accent, badges) | `#8C6A2C` | For small labels/eyebrows — full-saturation gold only for the one or two most important elements per screen |
| Mist White (light-section background) | `#EEF2F6` | A cool, navy-tinted off-white for light sections — deliberately *not* the warm cream (`#F4F1EA`)-plus-serif combination called out in Section 4; this keeps light sections tethered to the navy identity instead of drifting into generic-editorial territory |
| Ink on light | `#141C2B` | Body text on Mist White sections |
| Growth Green (positive deltas only) | `#2F8F5B` | Use only for small "+" indicators inside data — never as a background or CTA color |

Gradient for hero background base: `#0B1B33 → #0F263F`, matching what's already there — keep it, but it becomes the *base layer* under new imagery/texture, not the whole story (Section 9).

### Typography

Retire the current single "safe serif + safe sans" pairing for something with more personality, still fully Google-Fonts-hosted so Antigravity can implement it with a single import line:

- **Display (headlines):** Fraunces (variable). Its soft, slightly ink-trap serif detailing gives you the "private bank letterhead" feeling your current serif gestures at but doesn't fully deliver. Use optical size "display" cut for anything above 40px.
- **Body / UI:** Manrope. A geometric-humanist sans with more character than Inter, still completely legible at small sizes for nav, buttons, and body copy.
- **Data / numerals (calculator outputs, the live ticker, chart labels):** Space Grotesk, set with `font-variant-numeric: tabular-nums`. Using a distinct third face for numbers only is the deliberate move here — it makes every rupee figure on the page feel instrument-precise against the warmer serif headlines, which is exactly the contrast a wealth brand wants (emotional promise in the serif, provable numbers in the mono-adjacent grotesk).

Type scale (fluid, `clamp()`-based so it holds up from mobile to ultrawide):

```
--text-hero:      clamp(2.75rem, 6vw, 5.5rem);   /* headline */
--text-h2:         clamp(1.75rem, 3vw, 2.75rem);
--text-h3:         clamp(1.25rem, 2vw, 1.75rem);
--text-body-lg:    clamp(1.05rem, 1.3vw, 1.25rem);
--text-body:       1rem;
--text-eyebrow:    0.8125rem;  /* letter-spacing: 0.12em, uppercase */
--text-data-lg:    clamp(2rem, 4vw, 3.25rem);  /* the compounding-value figure */
```

### Radius & elevation — the anti-boxy rulebook

Stop using one radius value everywhere. Assign radius by *role*, not by habit:

- Buttons and pill badges: full pill (`9999px`) — the one place a hard rounded shape is appropriate, because it reads as "tappable object."
- The hero visual/chart panel: large sweeping radius (`32–48px`) on two corners only (e.g. top-left and bottom-right), asymmetric rather than uniform — signals "crafted," not "component library default."
- Data/ticker elements: near-zero radius (`2–4px`) — a small, deliberate contrast that makes numbers feel like precision instruments next to the soft editorial shapes around them.
- Never repeat the exact same radius + border + shadow combination on more than two elements in a single screen.

Replace flat drop-shadows with **ambient glow elevation**: a soft, large, low-opacity blurred blob (gold or navy, `filter: blur(60–100px)`) positioned behind a panel instead of a hard `box-shadow`. Where a border is still needed for legibility, use a 1px gradient border (`border-image` or a pseudo-element gradient, transparent → gold at ~15% opacity → transparent) instead of a flat gray/white line.

### Signature element

Give the page one memorable, brand-true motif rather than scattering effects everywhere: **the Growth Thread** — a thin, continuous animated gold gradient line (SVG path) that originates at the live cost-of-delay figure in the hero, sweeps behind/through the compounding chart panel, and resurfaces as the section-divider motif further down the page (a quiet echo behind the Services and Testimonials headers). It's a literal, unbroken line of compounding growth — visually tying "Build Wealth, Not Guesswork" to the mechanic that proves it, and it's the one place you spend your "boldness budget" (per the restraint principle: one signature move, everything else quiet).

---

## 6. THE PSYCHOLOGY ENGINE — MAPPING PRINCIPLES TO ELEMENTS

Every persuasive element below must map to something already true and provable. This is a distributor regulated by AMFI — the psychology has to be *honest* psychology, which is also the more durable kind.

| Principle | Where it lives | How |
|---|---|---|
| **Loss aversion** | The live cost-of-delay mechanic | People weigh a provable loss more heavily than an equivalent gain — "what delay costs you" outperforms "what starting gets you." Keep this as the hero's emotional spine (full spec, Section 8). |
| **Anchoring** | The compounding-value figure (₹50,45,755) | A large, specific, non-rounded number anchors the visitor's sense of scale before they've read a word of copy. Keep it specific — "₹50,45,755," not "₹50L+." |
| **Authority / credibility** | Eyebrow line, trust badge row | ARN number, NISM certification, Angel One partnership, AMC count. Give these more typographic weight than they currently have — small caps, wide letter-spacing, Muted Gold — these are the AMFI-style trust vocabulary from Section 2, and Indian mutual-fund investors are specifically trained to look for them. |
| **Social proof** | Testimonials | Keep verbatim. Present as a slow, editorial marquee or a single rotating spotlight quote with attribution — not a row of identical bordered cards. |
| **Von Restorff effect (isolation)** | Primary CTA | Exactly one element on the page should look categorically different from everything around it — the single filled-gold pill CTA. Everything else (including the secondary CTA) should be visually quieter than it, including the outline button, which should be genuinely secondary in weight, not equal-and-opposite. |
| **Zeigarnik effect (open loops)** | SIP calculator | A visitor who has entered even one number into the calculator has started something — design the calculator to visually "hold" partial input (a soft progress indication, or the compounding chart beginning to animate the instant the first field is touched) so leaving mid-task feels like an unfinished thought, not a closed one. |
| **Honest urgency, not fabricated scarcity** | The cost-of-delay ticker only | This is the *only* urgency mechanic on the page. No countdowns, no fake viewer counts (see Non-Negotiable Constraint #3). |

---

## 7. KILLING THE BOXY-CARD PATTERN, SECTION BY SECTION

Go through the whole homepage, not just the hero — the brief called out "boxy cards all the time," and it's a sitewide habit, not a hero-only one.

- **Hero "Cost of Delay" callout:** currently a bordered rectangle. Replace with an inline editorial treatment — no box at all. Set the ₹18.5 Lakhs figure in Signal Gold at `--text-h3` size inline with the sentence, use a thin Growth Thread underline beneath just that figure instead of a border around the whole sentence.
- **Compounding chart panel:** replace the hard-bordered floating card with a frosted-glass panel (`backdrop-filter: blur(20px)`, background a low-opacity navy wash, asymmetric large-radius per Section 5) that looks like a window into the hero's own background rather than an object sitting on top of it. Give it a subtle resting tilt (2–3° perspective transform) with a mouse-parallax micro-tilt on desktop — it should feel dimensional, not flat.
- **Services section:** replace uniform equal-size bordered cards with an asymmetric bento arrangement — vary card sizes by actual importance (the flagship service gets a visibly larger tile), and differentiate surfaces with subtle background-image texture or gradient wash rather than identical borders on every tile.
- **Testimonials:** drop the bordered-card grid entirely. Use a single large rotating spotlight quote (editorial pull-quote typography in Fraunces italic) with a small attribution line, cycling through the real testimonials — feels premium and human rather than "review widget."
- **Trust badge row (ARN / NISM / Angel One / demat count / AMC partners):** currently five identical icon+text blocks in a straight row. Keep the row rhythm (it works for scanning) but drop the implied box around each — use a thin vertical Growth-Thread-colored divider between items instead of individual card boundaries, and give the icons a refined, consistent line-icon treatment rather than flat gold glyphs.
- **Footer:** if it currently uses bordered link-list boxes, flatten to plain typographic columns with generous spacing — footers are exactly where "boxy" habits accumulate invisibly.

---

## 8. THE LIVE URGENCY MECHANIC — FULL SPEC

This is your single best asset — it just needs to be built properly and shown prominently instead of hidden in a thin top strip.

**The math (keep it real):** for a SIP of amount `A` per month at annual rate `r` compounded monthly, the future value after `n` months is the standard SIP future-value formula. The "cost of waiting" is the marginal future value contributed by *this specific session's elapsed time* — i.e., the derivative of that future-value curve with respect to time, evaluated at the current point in the investor's hypothetical 15-year horizon, multiplied by seconds elapsed on page. In plain terms: show how much *additional* future wealth a ₹10,000/month SIP earns for every second it isn't delayed, given the 12% p.a. assumption already stated on the page. This is legitimate, disclosed, calculable math — not a dark pattern.

**Presentation fixes:**
- Round to 2 decimal places, not 6. Use an odometer-style rolling-digit animation (digits tick upward smoothly, not a jarring re-render) at roughly 10 updates/second — this is what makes a live number feel *alive* rather than glitchy.
- Move it out of the thin top strip and into the hero itself as a genuine design element — a dedicated, generously sized live counter sitting near the headline or integrated into the chart panel, large enough to be read without squinting, using the Space Grotesk data face at `--text-data-lg`.
- Keep the existing rate/assumption disclosure ("at 12% p.a. on a ₹10k/mo SIP") visible and legible right next to the number, every time — this is both good practice and a compliance necessity (Constraint #3, Section 11).
- Retire the separate "Capture Growth" CTA competing in the old top bar (Constraint on competing CTAs, Section 1) — the mechanic itself, sitting inside the hero, should flow directly into the hero's single primary CTA rather than having its own competing button.

---

## 9. HERO BANNER — FULL REBUILD SPEC

**Layout:** Keep the proven two-column shape (copy left, visual right) — it's a sound convention, not a boxy-card problem — but rebalance vertical rhythm now that rows 1–2 have been consolidated (Section 1), giving the headline more air above the fold.

**Background:** This is the one place the brief specifically asked for a photographic/textural layer instead of a flat color. Layer a background image *under* the existing navy gradient (image at low opacity / color-graded to sit within the Ink Navy family, gradient overlay on top for text legibility — never let the image compete with headline contrast). Three directions, ready to generate:

**Option A — "Golden Hour Skyline"** (grounds the brand in Mumbai, aspirational but restrained)
> A wide cinematic photograph of the Mumbai skyline and Bandra-Worli Sea Link at dusk, silhouetted buildings against a deep navy-to-indigo sky, warm golden light reflecting off the water and glass towers, soft atmospheric haze, ultra-minimal composition with generous negative space at the top third of the frame, muted and desaturated except for warm gold highlights, shot on a long lens, shallow depth suggesting distance, editorial and understated — not a tourist postcard.
- *Midjourney:* append `--ar 16:9 --style raw --v 6 --stylize 150`
- *DALL·E 3:* lead with "editorial photograph, muted color grade, cinematic," avoid "vibrant" or "colorful" in the prompt
- *Adobe Firefly:* set Style → Photo, Color & Tone → Cool, add "long exposure, minimalist"
- *Stable Diffusion:* add negative prompt `oversaturated, cartoon, illustration, people, text, watermark`

**Option B — "Ascending Light Trails"** (abstract, ties directly to the compounding-growth narrative)
> Abstract long-exposure light-trail photography on a deep navy-black background, a single sweeping arc of warm gold and amber light trails rising from bottom-left to upper-right like an ascending growth curve, soft bokeh particles scattered in the negative space, shallow depth of field, no recognizable objects, extremely minimal and elegant, financial-editorial mood rather than futuristic/sci-fi.
- *Midjourney:* `--ar 16:9 --style raw --v 6`
- *DALL·E 3:* emphasize "long exposure light trail photography, not digital render"
- *Adobe Firefly:* Style → Abstract, Lighting → Dramatic
- *Stable Diffusion:* negative prompt `neon, cyberpunk, text, logo, oversharpened`

**Option C — "Textural Wealth"** (most private-bank, least "app")
> Extreme close-up macro photograph of brushed dark navy metal or polished stone with a single fine hairline vein of gold running diagonally through the frame like marble veining, soft directional light from the upper left, extremely shallow depth of field, tactile and quiet, no text, no objects — pure premium texture.
- *Midjourney:* `--ar 16:9 --style raw --v 6 --stylize 50`
- *DALL·E 3:* "macro photography, tactile texture, no digital artifacts"
- *Adobe Firefly:* Style → Photo, Effects → Macro
- *Stable Diffusion:* negative prompt `text, jewelry, ring, illustration, cartoon`

Recommend Option A as primary (it's the most on-brand for a Mumbai-based advisory and gives the strongest "human place, not app" signal); B works well as an alternate hero for a campaign/landing variant; C is the most restrained choice if a client review favors minimalism.

**Headline treatment:** Keep "Build Wealth, Not Guesswork." as the core line — it's a strong, benefit-driven, five-word thesis in the same register as the best hero headlines in the research above (short, declarative, no jargon). Set it in Fraunces display cut at `--text-hero`, tight leading, with "Not Guesswork" in Signal Gold to make the actual point of differentiation (disciplined process over speculation) the visually loudest phrase in the sentence — right now both lines are the same white weight, which buries the thesis.

**CTA hierarchy:** One dominant filled-gold pill ("Start Your SIP Today"), one visually quieter secondary action (ghost-style, no full outline box — a text link with an arrow, or a thin single-line underline on hover rather than a bordered rectangle sitting at equal visual weight to the primary button).

**Chart panel:** Per Section 7 — frosted glass, asymmetric radius, ambient glow instead of drop shadow, subtle parallax tilt, Growth Thread motif running through it.

---

## 10. MOTION & MICRO-INTERACTIONS

Choreograph, don't decorate:

- **Page load:** a single orchestrated sequence — eyebrow line fades in first, headline rises with a slight stagger per line, then the CTA and chart panel settle in last. One clear sequence, not simultaneous fade-ins on everything.
- **Scroll:** sections reveal with a restrained upward fade (12–16px translate, 400–500ms, ease-out) — no bouncing, no rotation-on-scroll gimmicks.
- **Hover:** buttons get a soft glow bloom (not a color swap); the chart panel responds to cursor position with a few degrees of parallax tilt only on pointer-capable devices.
- **The live ticker:** continuous, ambient, always running — it's the one element allowed to move without user interaction, because its whole job is to feel alive.
- Respect `prefers-reduced-motion` throughout — disable parallax and odometer-rolling in favor of a plain incrementing number when it's set.

---

## 11. ACCESSIBILITY, COMPLIANCE & PERFORMANCE GUARDRAILS

- **Contrast:** any text laid over the new background imagery must maintain WCAG AA contrast (4.5:1 body / 3:1 large text) against the navy gradient overlay — test with the darkest and lightest crop of the chosen image, not just the average.
- **Disclaimers stay legible, not decorative.** Wherever a compliance line exists today (market-risk disclaimer, EUIN, "read scheme documents"), it must remain fully legible at a normal body text size and contrast — never shrink it, gray it out to near-invisibility, or bury it inside a decorative element. This is both a trust signal (Section 6) and a regulatory floor.
- **Honesty of the urgency figure:** the rate assumption must always be visible beside the number (Section 8) — never show the compounding figure without its stated assumption in the same viewport.
- **Mobile:** the two-column hero stacks vertically with the chart panel below the headline/CTA, not above — copy and action must be reachable before any decorative visual on small screens.
- **Performance:** the hero background image should be served responsively (srcset, WebP/AVIF with a JPEG fallback), lazy-loaded below the immediate first paint only if it isn't the LCP element — since it likely *is* the LCP element here, preload it and keep it under ~200KB at delivery weight through compression.

---

## 12. BUILD NOTES FOR STITCH MCP

- Keep the existing component/tech stack conventions already established for this build (Tailwind utility classes, Chart.js for the compounding visualizer, Swiper.js if still used elsewhere, vanilla JS or a lightweight animation approach for the odometer/parallax effects — no need to introduce a new framework for this).
- Implement the type scale and color tokens in Section 5 as CSS custom properties / Tailwind theme extensions first, before touching any component, so every section pulls from the same system instead of one-off values.
- Build the Growth Thread as a single reusable inline SVG component with a `stroke-dashoffset` animation, so it can be dropped into the hero and reused as the section-divider motif without re-drawing it each time.
- Ship the hero first, get it reviewed, then apply Section 7's card treatments to the rest of the homepage in the same pass.

---

## 13. FINAL QA CHECKLIST BEFORE YOU SHIP

- [ ] Every real stat, ARN number, testimonial, and disclaimer from the current live site is still present and unchanged in meaning.
- [ ] SIP calculator, compounding visualizer, WhatsApp FAB, and DIY/Angel One flow all still function.
- [ ] No fabricated urgency, scarcity, or social-proof numbers anywhere on the page.
- [ ] No single container style (border+radius+shadow combo) repeats more than twice in one viewport.
- [ ] Exactly one CTA per screen reads as visually dominant; every other action is deliberately quieter.
- [ ] Contrast checked against the actual chosen background image, not just the flat navy fallback.
- [ ] Rate/assumption text is visible next to the live cost-of-delay figure at all times.
- [ ] Reduced-motion users get a calm, static-but-correct experience.
- [ ] Mobile hero puts copy and the primary CTA before any decorative visual.

# PROMPT END
