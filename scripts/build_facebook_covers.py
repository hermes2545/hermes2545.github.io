#!/usr/bin/env python3
"""Build vertical reading-book covers from matched Facebook post artwork."""

from __future__ import annotations

import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "books.json"
SOURCE_DIR = ROOT / "assets" / "covers" / "facebook-source"
OUTPUT_DIR = ROOT / "assets" / "covers" / "facebook"
SERIF = "/usr/share/fonts/truetype/noto/NotoSerifThai-Regular.ttf"
SANS = "/usr/share/fonts/truetype/noto/NotoSansThai-Regular.ttf"
LATIN_SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
LATIN_SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
W, H = 600, 900


def hex_color(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return (int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16))


def split_runs(text: str) -> list[tuple[str, bool]]:
    runs: list[tuple[str, bool]] = []
    for char in text:
        thai = "\u0e00" <= char <= "\u0e7f"
        if runs and runs[-1][1] == thai:
            runs[-1] = (runs[-1][0] + char, thai)
        else:
            runs.append((char, thai))
    return runs


def mixed_width(draw: ImageDraw.ImageDraw, text: str, thai_font: ImageFont.FreeTypeFont, latin_font: ImageFont.FreeTypeFont) -> float:
    return sum(draw.textlength(run, font=thai_font if thai else latin_font) for run, thai in split_runs(text))


def draw_mixed_centered(draw: ImageDraw.ImageDraw, center_x: int, y: int, text: str, thai_font: ImageFont.FreeTypeFont, latin_font: ImageFont.FreeTypeFont, fill: str) -> None:
    x = center_x - mixed_width(draw, text, thai_font, latin_font) / 2
    for run, thai in split_runs(text):
        font = thai_font if thai else latin_font
        draw.text((x, y), run, font=font, fill=fill, anchor="la")
        x += draw.textlength(run, font=font)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, thai_font: ImageFont.FreeTypeFont, latin_font: ImageFont.FreeTypeFont, max_width: int, max_lines: int = 3) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if mixed_width(draw, candidate, thai_font, latin_font) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
            if len(lines) == max_lines - 1:
                break
    if current and len(lines) < max_lines:
        remaining_start = len(" ".join(lines + [current]).split())
        remaining = words[remaining_start:]
        if remaining and len(lines) == max_lines - 1:
            ellipsis = current
            for word in remaining:
                candidate = f"{ellipsis} {word}"
                if mixed_width(draw, candidate + "…", thai_font, latin_font) > max_width:
                    break
                ellipsis = candidate
            current = ellipsis + "…"
        lines.append(current)
    return lines[:max_lines]


def rounded_image(source: Image.Image, size: tuple[int, int], radius: int = 16) -> Image.Image:
    fitted = ImageOps.contain(source.convert("RGB"), size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, "#e9e0cf")
    x = (size[0] - fitted.width) // 2
    y = (size[1] - fitted.height) // 2
    canvas.paste(fitted, (x, y))
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    canvas.putalpha(mask)
    return canvas


def build_cover(book: dict) -> Path:
    source_path = SOURCE_DIR / f'{book["id"]}.jpg'
    if not source_path.exists():
        raise FileNotFoundError(source_path)
    accent = hex_color(book["accent"])
    cover = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(cover)
    for y in range(H):
        mix = y / H
        base = (19, 39, 33)
        dark = (8, 17, 14)
        row = tuple(int(base[i] * (1 - mix) + dark[i] * mix) for i in range(3))
        draw.line((0, y, W, y), fill=row)
    draw.rectangle((0, 0, 12, H), fill=accent)
    draw.rectangle((28, 28, W - 28, H - 28), outline=(*accent,), width=3)
    brand_thai = ImageFont.truetype(SANS, 18)
    brand_latin = ImageFont.truetype(LATIN_SANS, 18)
    title_font_size = 42 if len(book["short_title"]) < 25 else 35
    title_thai = ImageFont.truetype(SERIF, title_font_size)
    title_latin = ImageFont.truetype(LATIN_SERIF, title_font_size)
    category_thai = ImageFont.truetype(SANS, 17)
    category_latin = ImageFont.truetype(LATIN_SANS, 17)
    draw_mixed_centered(draw, W // 2, 43, "THE KNOWLEDGE SHELF", brand_thai, brand_latin, "#e8cb8d")
    with Image.open(source_path) as source:
        art = rounded_image(source, (520, 480))
    cover.paste(art, (40, 100), art)
    draw.rounded_rectangle((39, 99, 561, 581), radius=18, outline="#efdba9", width=3)
    draw.line((68, 620, 532, 620), fill=accent, width=5)
    draw_mixed_centered(draw, W // 2, 635, book["category"].upper(), category_thai, category_latin, "#d5c8b1")
    lines = wrap_text(draw, book["short_title"], title_thai, title_latin, 500, 3)
    line_height = title_font_size + 15
    total = len(lines) * line_height
    start_y = 700 + max(0, (120 - total) // 2)
    for i, line in enumerate(lines):
        draw_mixed_centered(draw, W // 2, start_y - 15 + i * line_height, line, title_thai, title_latin, "#fff5e4")
    draw_mixed_centered(draw, W // 2, 839, "ORIGINAL POST ARTWORK", category_thai, category_latin, "#b8ab98")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_DIR / f'{book["id"]}.webp'
    cover.save(output, "WEBP", quality=90, method=6)
    return output


def main() -> int:
    books = json.loads(CATALOG.read_text(encoding="utf-8"))
    outputs = [build_cover(book) for book in books]
    print(f"Built {len(outputs)} Facebook artwork covers in {OUTPUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
