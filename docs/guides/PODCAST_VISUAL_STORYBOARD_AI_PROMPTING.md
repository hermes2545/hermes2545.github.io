---
name: podcast-visual-storyboard-ai-prompting
description: "Use when making podcast storyboard image prompts."
version: 1.0.0-public
visibility: public
---

# Podcast Visual Storyboard & AI Image Prompting

Use this skill when a user supplies a podcast script, narration, transcript, article, or audio transcript and asks for a visual storyboard, AI image prompts, explainer-video scenes, or a prompt package for another AI system.

## Mission

Turn narration into a coherent visual storytelling system:

```text
Narration/transcript → story beats → visual metaphors → shot list → consistent image prompts → generated image sequence → video timeline
```

Do not make random beautiful images. Every image must answer:

> What idea in the narration does this visual help the viewer understand?

## Inputs and defaults

Required or inferred:

- Narration, script, transcript, or article text.
- Target duration if known.
- Image frequency; default one image every 6–10 seconds.
- Audience and topic domain if inferable.
- Visual style; default to Style 01 unless the user selects another preset or supplies a custom style.
- Aspect ratio; default 16:9 for YouTube-style video.
- Character/location continuity needs.
- Text overlay policy; default avoid important generated text and add overlays later.

## Default negative prompt

Use or adapt this negative prompt unless the selected production tool requires another format:

```text
photorealistic, 3D render, anime, childish cartoon, glossy, plastic, hyperreal, oversaturated colors, chaotic composition, unreadable text, misspelled text, fake letters, real brand logos, watermark, stock photo, cinematic action movie, distorted hands, extra fingers, deformed faces
```

## Style selection rule

The visual style is configurable. Select one of the numbered presets below, combine presets when useful, or create a custom style bible if the user asks for a direction not covered by the presets.

When recommending styles, refer to styles by their stable number and name. Choose based on topic, audience, emotional arc, and desired channel identity.

## Numbered preset style library

### 01. Default 2D Hand-Drawn Editorial Explainer
Best for: general narrated explainers, business stories, policy, everyday systems.
Visual traits: clean ink outlines, muted pastel watercolor shading, soft paper texture, realistic but simplified people and objects.
Avoid: photorealism, 3D render, anime, brand logos, clutter.
Style bible: 2D hand-drawn editorial illustration for a narrated explainer video, clean ink outlines, muted pastel watercolor shading, soft paper texture, realistic but simplified people and objects, calm documentary tone, subtle cinematic composition, warm neutral lighting, low contrast, detailed but uncluttered environments, no photorealism, no 3D render, no anime, no brand logos, 16:9 frame.

### 02. Hand-Drawn Editorial Business Explainer
Best for: economics, business, logistics, policy, workplace systems.
Visual traits: mature editorial drawing, office objects, invoices, charts as abstract shapes, supply-chain props.
Avoid: childish cartoons, fake brands, tiny chart labels.
Style bible: Hand-drawn editorial business explainer, clean ink lines, muted corporate watercolor palette, simplified realistic workers and business objects, calm analytical mood, subtle cinematic composition, no readable small text, no real logos, 16:9.

### 03. Flat Vector Explainer
Best for: SaaS, technical workflows, startup/process videos, product education.
Visual traits: clean geometric shapes, simple icons, strong hierarchy, controlled palette.
Avoid: over-detailed UI text, real product logos, generic stock-vector blandness.
Style bible: Flat vector explainer illustration, clean geometric forms, restrained modern palette, simple symbolic people and interface-like shapes, clear process flow, generous negative space, no real logos, no tiny readable UI text, 16:9.

### 04. Cinematic Storyboard Frames
Best for: dramatic history, biography, geopolitics, crisis narratives.
Visual traits: filmic composition, strong foreground/background staging, dramatic but restrained lighting.
Avoid: action-movie excess, photorealistic celebrity likenesses, gore.
Style bible: Cinematic storyboard frame illustration, painterly but non-photorealistic, dramatic composition, restrained color palette, realistic simplified people and places, documentary seriousness, soft film grain, no real logos, no copyrighted characters, 16:9.

### 05. Vintage Engraving / Newspaper
Best for: historical, legal, political, archival topics.
Visual traits: engraving lines, old newspaper texture, archival composition, sepia/black palette.
Avoid: readable real mastheads, copyrighted newspaper scans, fake exact quotes.
Style bible: Vintage engraving and newspaper editorial style, etched linework, aged paper texture, sepia and black palette, archival documentary tone, symbolic documents and portraits, no readable real newspaper text, no logos, 16:9.

### 06. Isometric Infographic
Best for: systems, infrastructure, supply chains, cities, networks.
Visual traits: isometric buildings/objects, network paths, tidy spatial systems.
Avoid: dense labels, tiny arrows that cannot be read, game-like 3D gloss.
Style bible: Isometric infographic illustration, clean angled perspective, simplified buildings, vehicles, routes and system nodes, muted professional palette, precise but uncluttered layout, no readable tiny labels, no brand logos, 16:9.

### 07. Minimal Documentary Sketch
Best for: essays, philosophy, psychology, social commentary.
Visual traits: sparse pencil/ink linework, large negative space, symbolic everyday objects.
Avoid: decorative emptiness without metaphor, over-rendering.
Style bible: Minimal documentary sketch, sparse black pencil and ink linework, soft gray shading, large negative space, simple symbolic objects and human gestures, contemplative mood, no logos, no text, 16:9.

### 08. Editorial Collage Documentary
Best for: investigative business, politics, corruption, historical explainers.
Visual traits: layered paper cutouts, archival photo textures, annotation marks, muted beige and charcoal palette.
Avoid: real newspaper mastheads, readable copyrighted text, actual logos.
Style bible: Editorial documentary collage, layered paper cutouts, archival photo textures, handwritten annotation marks, muted beige and charcoal palette, investigative journalism mood, realistic but stylized, no real logos, no readable small text, 16:9.

### 09. Ink Wash Historical Chronicle
Best for: history, philosophy, biography, war, political memory.
Visual traits: expressive black ink, aged paper, restrained sepia background, solemn scenes.
Avoid: modern glossy effects, excessive fantasy, unreadable calligraphy.
Style bible: Ink wash historical chronicle style, expressive black ink strokes, aged paper texture, sparse composition, muted sepia background, solemn documentary mood, cinematic framing, no modern logos, no readable text, 16:9.

### 10. Modern Museum Exhibit Illustration
Best for: science, history, economics, geopolitics, institutional explainers.
Visual traits: curated exhibit-panel composition, refined flat shapes, elegant educational layout.
Avoid: dense labels, real museum branding, overstuffed panels.
Style bible: Modern museum exhibit illustration, clean educational display composition, refined flat shapes, subtle labels as abstract blocks only, calm neutral palette, elegant lighting, curated documentary tone, spacious layout, 16:9.

### 11. Soft Clay Editorial Diorama
Best for: complex or sensitive topics that need a tactile, approachable feeling.
Visual traits: handmade miniature scenes, matte clay texture, warm soft lighting.
Avoid: glossy 3D render, toy-like childish exaggeration.
Style bible: Soft clay editorial diorama, handmade miniature scene, matte clay texture, warm soft lighting, simplified realistic objects, gentle documentary tone, tactile and approachable, no glossy 3D render, no logos, 16:9.

### 12. Blueprint Systems Visualization
Best for: infrastructure, AI, logistics, workflows, policy systems.
Visual traits: dark navy background, cyan/white linework, elegant technical schematic objects.
Avoid: technical labels that need to be accurate, cluttered wiring diagrams.
Style bible: Blueprint systems visualization, dark navy background, fine cyan and white linework, schematic objects, flow arrows as simple shapes, technical but elegant, no tiny readable text, clean composition, 16:9.

### 13. Paper Theater Storybook
Best for: narrative podcast, history, culture, human stories.
Visual traits: layered cut-paper foreground/background, warm handcrafted shadows, theatrical staging.
Avoid: childish fairy-tale tone unless requested, excessive decorative flourishes.
Style bible: Layered paper theater illustration, cut-paper foreground and background, handcrafted shadows, warm muted colors, storybook documentary tone, cinematic stage composition, gentle depth, no childish cartoon, 16:9.

### 14. Noir Investigative Sketch
Best for: crime, grey-market business, corruption, mystery, crisis.
Visual traits: black-and-white ink, strong shadows, desk lamps, rain-streaked windows, documents as abstract forms.
Avoid: gore, sensationalism, readable sensitive documents.
Style bible: Noir investigative sketch style, black and white ink drawing, strong shadows, rain-streaked windows, desk lamps, documents as abstract forms, tense journalistic mood, cinematic composition, no readable text, 16:9.

### 15. Warm Humanist Documentary Illustration
Best for: society, psychology, biography, education, family and community stories.
Visual traits: empathetic simplified realistic people, soft pencil outlines, warm earth tones.
Avoid: sentimental clichés, exaggerated cartoon expressions.
Style bible: Warm humanist documentary illustration, simplified realistic people, soft pencil outlines, gentle watercolor shading, warm earth tones, natural gestures, empathetic mood, uncluttered background, no logos, 16:9.

### 16. Minimal Monochrome Explainer
Best for: philosophy, productivity, abstract ideas, essays.
Visual traits: sparse black linework, grayscale palette, simple symbolic objects.
Avoid: scenes so empty they fail to explain the narration.
Style bible: Minimal monochrome explainer illustration, sparse black linework, large negative space, simple symbolic objects, grayscale palette, contemplative mood, clean editorial composition, no text, no logos, 16:9.

### 17. Data Journalism Editorial Graphics
Best for: economics, markets, public policy, number-heavy stories.
Visual traits: abstract charts, symbolic numbers through objects, newspaper-quality visual explanation.
Avoid: asking image models to render accurate axes, labels, or tables.
Style bible: Data journalism editorial graphic style, clean charts represented as abstract shapes, restrained color palette, newspaper-quality visual explanation, symbolic numbers through objects, no accurate small labels, no readable text, 16:9.

### 18. Cinematic Watercolor Documentary
Best for: travel, history, biography, nature, geopolitics, opening and transition beats.
Visual traits: wide atmospheric scenes, muted natural colors, painterly people/places, paper texture.
Avoid: photorealistic travel-poster gloss, oversaturated sunsets.
Style bible: Cinematic watercolor documentary frame, wide composition, soft atmospheric perspective, muted natural colors, subtle paper texture, realistic but painterly people and places, calm serious mood, no photorealism, 16:9.

### 19. Retro Public Information Film
Best for: policy, public health, economics, social systems, civic explainers.
Visual traits: mid-century educational poster style, limited palette, print grain.
Avoid: propaganda symbols, real agency seals, outdated stereotypes.
Style bible: Retro public information film illustration, mid-century educational poster style, limited muted palette, simple geometric people and objects, grainy print texture, clear visual metaphor, no readable text, 16:9.

### 20. Architectural Cutaway Explainer
Best for: organizations, cities, companies, institutions, hidden systems.
Visual traits: cross-section buildings or systems, layered rooms, pathways, small simplified figures.
Avoid: tiny labels, overly busy dollhouse scenes.
Style bible: Architectural cutaway explainer illustration, building or system shown in cross-section, small simplified human figures, layered rooms and pathways, clean editorial detail, muted colors, no labels, 16:9.

### 21. Symbolic Surreal Editorial
Best for: philosophy, psychology, economics, hidden incentives, paradoxes.
Visual traits: realistic simplified objects in impossible but calm scenes, metaphor-first composition.
Avoid: horror, chaos, dream imagery unrelated to the narration.
Style bible: Symbolic surreal editorial illustration, realistic simplified objects arranged in an impossible but calm scene, muted colors, soft shadows, metaphor-driven composition, thoughtful mood, no horror, no chaos, 16:9.

### 22. Courtroom / Legal Sketch Documentary
Best for: law, lawsuits, regulation, policy, contracts, institutional accountability.
Visual traits: pencil and watercolor legal sketch, desks, folders, official silhouettes.
Avoid: fake seals, readable case files, real judge/lawyer likenesses unless rights-safe.
Style bible: Courtroom documentary sketch style, pencil and watercolor lines, legal desks, folders, silhouettes of officials, serious institutional mood, restrained beige and navy palette, no readable text, no real logos, 16:9.

### 23. Supply Chain Map Illustration
Best for: logistics, trade, manufacturing, agriculture, global economy.
Visual traits: map-like routes connecting warehouses, ships, trucks, farms or factories.
Avoid: real company logos, literal geographic precision unless supplied separately.
Style bible: Supply chain map illustration, simplified map-like composition, routes connecting warehouses, ships, trucks, farms or factories, muted editorial colors, clean icons but hand-drawn texture, no real brand logos, 16:9.

### 24. Desk Objects Metaphor Series
Best for: business, finance, decision-making, productivity, personal risk.
Visual traits: tabletop close-ups, coins, clocks, folders, keys, receipts, coffee cups as recurring motifs.
Avoid: repetitive identical close-ups, readable sensitive documents.
Style bible: Editorial desk-object metaphor style, close-up tabletop compositions, symbolic objects like coins, clocks, folders, keys, receipts and coffee cups, soft natural light, shallow but illustrated depth, muted palette, no readable text, 16:9.

### 25. Children's Book for Adults
Best for: explaining difficult subjects simply while keeping emotional warmth.
Visual traits: gentle hand-drawn characters, textured gouache colors, simple symbolic scenes, mature tone.
Avoid: childish exaggeration, cute mascots unless requested.
Style bible: Sophisticated children's-book-for-adults illustration, gentle hand-drawn characters, textured gouache colors, simple symbolic scenes, warm but mature tone, emotionally clear, not childish, no cartoon exaggeration, 16:9.

### 26. High-Contrast Editorial Poster
Best for: hooks, opening frames, key claims, dramatic turns, thumbnail candidates.
Visual traits: bold simplified shapes, limited palette, strong silhouette, print grain.
Avoid: overcrowding, unreadable typographic posters generated by AI.
Style bible: High-contrast editorial poster style, bold simplified shapes, limited color palette, strong silhouette, dramatic but clean composition, one clear visual idea, print grain texture, no readable text, no logos, 16:9.

### 27. Quiet Luxury Business Documentary
Best for: premium business, finance, leadership, strategy, markets.
Visual traits: refined magazine-like editorial scenes, charcoal/ivory/brass/deep green palette, premium lighting.
Avoid: luxury brand logos, stock-photo boardroom clichés, excessive gloss.
Style bible: Quiet luxury business documentary illustration, elegant editorial composition, refined muted palette of charcoal, ivory, brass and deep green, soft premium lighting, simplified realistic people and office objects, calm analytical mood, no logos, 16:9.

## Output schema

Each storyboard scene should include:

```json
{
  "scene_id": "001",
  "timestamp_start": "00:00",
  "timestamp_end": "00:08",
  "narration_excerpt": "...",
  "core_idea": "...",
  "visual_function": "concrete depiction | visual metaphor | process diagram | emotional scene | number visualization | contrast shot | establishing shot | transition shot",
  "visual_description": "...",
  "selected_style": "01. Default 2D Hand-Drawn Editorial Explainer",
  "image_prompt": "...",
  "negative_prompt": "...",
  "motion_direction": "...",
  "text_overlay": "...",
  "continuity_notes": "..."
}
```

## Image prompt template

```text
[SELECTED_STYLE_BIBLE]

Scene: [specific location]
Subject: [main object/person]
Action / idea: [what this image communicates]
Composition: [close-up / medium shot / wide shot / overhead / low angle]
Details: [props, environment, symbolic objects, time of day]
Mood: [calm / tense / analytical / reflective / urgent]
Lighting: [soft office light / dusk / morning / warehouse fluorescent]
Continuity: [same character/object/location notes]
Constraints: no real logos, no important readable text, leave space for overlays, 16:9.
```

## Quality checklist

Before delivering a storyboard or prompt package, verify:

- The full narration is covered.
- Each scene maps to a specific beat and one core idea.
- Each prompt uses the selected numbered style bible or a clearly stated custom style bible.
- Exact text/numbers are separated into `text_overlay` where possible.
- Recurring characters, props, locations, and palette are consistent.
- No prompt asks for broken/unreadable text, real logos, watermarks, or copyrighted characters by default.
- Each image can be understood in 2–3 seconds.
- Motion suggestions are included.
- The result can be handed directly to an image-generation/editorial workflow.
