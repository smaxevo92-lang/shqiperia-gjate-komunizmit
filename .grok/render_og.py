#!/usr/bin/env python3
"""Cinematic 16:9 documentary poster for Shqipëria Gjatë Komunizmit."""

from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1920, 1080
CRIMSON = np.array([0x6B, 0x1C, 0x1C], dtype=np.float32)
GOLD = np.array([0xC4, 0xA3, 0x5A], dtype=np.float32)
INK = np.array([0x0C, 0x0A, 0x09], dtype=np.float32)
PARCHMENT = np.array([0xE8, 0xDC, 0xC8], dtype=np.float32)

SERIF_BOLD = "/usr/share/fonts/truetype/freefont/FreeSerifBold.ttf"
SERIF_REG = "/usr/share/fonts/truetype/freefont/FreeSerif.ttf"
SERIF_IT = "/usr/share/fonts/truetype/freefont/FreeSerifItalic.ttf"

OUT = Path("/workspace/.grok/card-raw.jpg")
RNG = np.random.default_rng(1968)


def lerp(a, b, t):
    a = np.asarray(a, dtype=np.float32)
    b = np.asarray(b, dtype=np.float32)
    t = np.clip(np.asarray(t, dtype=np.float32), 0.0, 1.0)
    if t.ndim == 2 and a.ndim == 1:
        a = a.reshape(1, 1, -1)
        b = b.reshape(1, 1, -1)
        t = t[..., None]
    elif t.ndim == 2 and a.ndim == 3:
        t = t[..., None]
    elif t.ndim == 1 and a.ndim == 2:
        t = t[..., None]
    return a * (1.0 - t) + b * t


def smoothstep(t):
    t = np.clip(t, 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def value_noise(h, w, scale, rng):
    gh = max(2, h // scale + 2)
    gw = max(2, w // scale + 2)
    grid = rng.random((gh, gw)).astype(np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    y = yy / scale
    x = xx / scale
    y0 = np.floor(y).astype(np.int32)
    x0 = np.floor(x).astype(np.int32)
    fy = smoothstep(y - y0)
    fx = smoothstep(x - x0)
    n00 = grid[y0, x0]
    n10 = grid[y0, x0 + 1]
    n01 = grid[y0 + 1, x0]
    n11 = grid[y0 + 1, x0 + 1]
    return lerp(lerp(n00, n10, fx), lerp(n01, n11, fx), fy)


def fbm(h, w, rng, octaves=5, base=96):
    acc = np.zeros((h, w), dtype=np.float32)
    amp = 0.5
    total = 0.0
    scale = base
    for _ in range(octaves):
        acc += amp * value_noise(h, w, scale, rng)
        total += amp
        amp *= 0.55
        scale = max(4, scale // 2)
    return acc / total


def ridge_line(width, base, amplitude, rng, octaves=6, roughness=0.42):
    n = 8
    y = np.zeros(width, dtype=np.float32)
    for i in range(octaves):
        freq = n * (2**i)
        amp = amplitude * (roughness**i)
        pts = rng.standard_normal(freq + 2).astype(np.float32)
        xs = np.linspace(0, width - 1, freq + 2)
        y += np.interp(np.arange(width), xs, pts) * amp
    # gentle overall arc so the valley sits under the title
    x = np.linspace(-1.0, 1.0, width)
    y += (x * x) * (amplitude * 0.18)
    return base + y


def sky():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    y = yy / (H - 1)
    x = xx / (W - 1)
    img = np.zeros((H, W, 3), dtype=np.float32)

    top = np.array([18, 8, 8], dtype=np.float32)
    mid = CRIMSON
    warm = np.array([142, 52, 38], dtype=np.float32)
    horizon = np.array([168, 96, 58], dtype=np.float32)

    t1 = smoothstep(y / 0.38)
    t2 = smoothstep((y - 0.38) / 0.22)
    t3 = smoothstep((y - 0.55) / 0.18)
    img = lerp(top, mid, t1)
    img = lerp(img, warm, t2 * (y > 0.38))
    img = lerp(img, horizon, t3 * (y > 0.55))

    # right-hand dusk sun, sitting on the future ridgeline
    sx, sy = 0.78 * W, 0.58 * H
    dist = np.sqrt((xx - sx) ** 2 + (yy - sy) ** 2 * 1.15)
    glow = np.exp(-dist / 220.0)
    glow2 = np.exp(-dist / 90.0)
    img += glow[..., None] * GOLD * 0.42
    img += glow2[..., None] * np.array([255, 210, 140], dtype=np.float32) * 0.28

    # faint left fill so the title side isn't empty
    dist_l = np.sqrt((xx - 0.22 * W) ** 2 + (yy - 0.42 * H) ** 2)
    img += np.exp(-dist_l / 280.0)[..., None] * CRIMSON * 0.12

    n = fbm(H, W, RNG, octaves=5, base=140)
    img += (n[..., None] - 0.5) * 10.0
    # high-altitude haze streaks
    streaks = value_noise(H, W, 220, RNG)
    img += ((streaks - 0.5) * (1.0 - y) * 8.0)[..., None] * np.array(
        [1.0, 0.7, 0.45]
    )

    return np.clip(img, 0, 255)


def fill_ridge(img, ridge, color, noise_amt=8.0):
    h, w, _ = img.shape
    yy = np.arange(h)[:, None]
    mask = yy >= ridge[None, :]
    n = (RNG.random((h, w)) - 0.5) * noise_amt
    col = np.clip(color[None, None, :] + n[..., None], 0, 255)
    img = np.where(mask[..., None], col, img)
    return img


def rim_ridge(img, ridge, color, thickness=3.0, amount=0.4):
    h, w, _ = img.shape
    yy = np.arange(h, dtype=np.float32)[:, None]
    dist = yy - ridge[None, :]
    band = (dist >= 0) & (dist < thickness)
    fade = 1.0 - dist / thickness
    t = np.clip(fade * amount, 0, 1) * band
    return np.where(band[..., None], lerp(img, color, t), img)


def shade_ridge(img, ridge, depth_color, falloff=180.0):
    h, w, _ = img.shape
    yy = np.arange(h, dtype=np.float32)[:, None]
    dist = yy - ridge[None, :]
    mask = dist >= 0
    t = np.clip(dist / falloff, 0, 1)
    t = t * t
    blended = lerp(img, depth_color[None, None, :], t * mask)
    return np.where(mask[..., None], blended, img)


def bunker_sprite(diameter: int, light=0.72) -> Image.Image:
    w = max(16, int(diameter))
    h = int(diameter * 0.90)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx = w * 0.50
    # hemisphere dome sitting on a thick collar — the classic QZ mushroom
    dome_cy = h * 0.46
    rx, ry = w * 0.42, h * 0.46
    nx = (xx - cx) / rx
    ny = (yy - dome_cy) / ry
    dome = (nx * nx + ny * ny <= 1.0) & (yy <= dome_cy + ry * 0.55)

    ring_y0 = dome_cy + ry * 0.18
    ring_y1 = ring_y0 + h * 0.10
    ring = (yy >= ring_y0) & (yy <= ring_y1) & (np.abs(xx - cx) < rx * 1.08)

    skirt_y0 = ring_y1 - 1
    skirt = (yy >= skirt_y0) & (yy <= h * 0.88) & (np.abs(xx - cx) < rx * 0.98)
    body = dome | ring | skirt

    lx, ly = 0.42, -0.72
    nlen = np.sqrt(nx * nx + ny * ny) + 1e-5
    ndx, ndy = nx / nlen, ny / nlen
    lambert = np.clip(ndx * lx + ndy * ly, 0, 1)
    concrete = np.array([110, 106, 100], dtype=np.float32)
    shadow = np.array([42, 38, 36], dtype=np.float32)
    col = lerp(shadow, concrete, 0.28 + 0.72 * lambert)
    rim_mask = np.clip(lambert - 0.48, 0, 1) ** 1.2
    col = lerp(col, GOLD, rim_mask * 0.62 * light)
    # weathered speckle
    spec = RNG.random((h, w)).astype(np.float32)
    col = lerp(col, col * 0.75, (spec > 0.84)[..., None] * body[..., None])

    # gun slit — dark rectangle slightly below dome equator
    slit = (
        (np.abs(xx - cx) < w * 0.10)
        & (yy > dome_cy - ry * 0.08)
        & (yy < dome_cy + ry * 0.18)
        & dome
    )
    col = np.where(slit[..., None], INK[None, None, :], col)

    # ring reads as a lip
    ring_hi = ring & (yy < ring_y0 + h * 0.035)
    col = lerp(col, GOLD * 0.55 + concrete * 0.45, ring_hi[..., None] * 0.35)

    alpha = np.zeros((h, w), dtype=np.float32)
    alpha[body] = 255
    rgba = np.dstack([np.clip(col, 0, 255), alpha]).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def paste_bunker(base: Image.Image, cx, foot_y, diameter, light=0.7):
    spr = bunker_sprite(diameter, light=light)
    # drop shadow
    sh = Image.new("RGBA", spr.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sw, shh = spr.size
    sd.ellipse((sw * 0.12, shh * 0.78, sw * 0.88, shh * 0.98), fill=(12, 10, 9, 140))
    sh = sh.filter(ImageFilter.GaussianBlur(max(2, diameter // 18)))
    x = int(cx - sw / 2)
    y = int(foot_y - shh * 0.70)
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    overlay.paste(sh, (x, y + int(shh * 0.04)), sh)
    overlay.paste(spr, (x, y), spr)
    return Image.alpha_composite(base.convert("RGBA"), overlay)


def tracked_width(font, text, tracking):
    return sum(font.getlength(ch) for ch in text) + tracking * max(0, len(text) - 1)


def draw_tracked(draw, xy_y, text, font, fill, tracking, cx, shadow=True):
    total = tracked_width(font, text, tracking)
    x = cx - total / 2
    y = xy_y
    for ch in text:
        if shadow:
            draw.text((x + 2, y + 3), ch, font=font, fill=(12, 10, 9, 210))
            draw.text((x + 1, y + 1), ch, font=font, fill=(12, 10, 9, 120))
        draw.text((x, y), ch, font=font, fill=fill)
        x += font.getlength(ch) + tracking


def fit_font(path, text, target_w, tracking_ratio, lo=28, hi=140):
    best = ImageFont.truetype(path, lo)
    tracking = 0
    for _ in range(14):
        mid = (lo + hi) // 2
        font = ImageFont.truetype(path, mid)
        tracking = mid * tracking_ratio
        w = tracked_width(font, text, tracking)
        if w < target_w:
            lo = mid + 1
            best = font
        else:
            hi = mid - 1
    tracking = best.size * tracking_ratio
    return best, tracking


def main():
    img = sky()

    # four mountain layers, back → front
    far = ridge_line(W, H * 0.66, H * 0.048, RNG, roughness=0.50)
    mid = ridge_line(W, H * 0.74, H * 0.055, RNG, roughness=0.46)
    near = ridge_line(W, H * 0.84, H * 0.058, RNG, roughness=0.44)
    fg = ridge_line(W, H * 0.93, H * 0.035, RNG, roughness=0.40)

    far_c = np.array([72, 28, 28], dtype=np.float32)
    mid_c = np.array([48, 22, 20], dtype=np.float32)
    near_c = np.array([28, 16, 14], dtype=np.float32)
    fg_c = np.array([16, 12, 11], dtype=np.float32)

    img = fill_ridge(img, far, far_c, 6)
    img = rim_ridge(img, far, GOLD, 4.0, 0.28)
    img = shade_ridge(img, far, np.array([40, 16, 16], dtype=np.float32), 140)
    img = fill_ridge(img, mid, mid_c, 7)
    img = rim_ridge(img, mid, GOLD, 3.5, 0.22)
    img = shade_ridge(img, mid, np.array([24, 12, 12], dtype=np.float32), 160)
    img = fill_ridge(img, near, near_c, 8)
    img = rim_ridge(img, near, np.array([90, 60, 40], dtype=np.float32), 3.0, 0.18)
    img = shade_ridge(img, near, INK, 200)
    img = fill_ridge(img, fg, fg_c, 5)
    img = shade_ridge(img, fg, INK, 120)

    # dry-grass sparkle on foreground
    yy, xx = np.mgrid[0:H, 0:W]
    grass = (yy > fg) & (RNG.random((H, W)) > 0.992)
    img[grass] = lerp(img[grass], GOLD, 0.35)

    base = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB")

    def ridge_y(ridge, x):
        x = int(np.clip(x, 0, W - 1))
        return float(ridge[x])

    # distant silhouettes on the far ridge
    for bx, sc in ((180, 42), (360, 30), (1640, 36), (1788, 28)):
        base = paste_bunker(base, bx, ridge_y(far, bx) + 4, sc, light=0.38)

    # mid-ridge cluster — keep the center column empty for the subtitle
    for bx, sc, lt in (
        (210, 96, 0.58),
        (520, 80, 0.52),
        (1320, 90, 0.64),
        (1525, 68, 0.50),
    ):
        base = paste_bunker(base, bx, ridge_y(mid, bx) + 6, sc, light=lt)

    # near-ground heroes, planted on the slope
    base = paste_bunker(base, 380, ridge_y(near, 380) + 8, 188, light=0.80)
    base = paste_bunker(base, 640, ridge_y(near, 640) + 4, 132, light=0.70)
    base = paste_bunker(base, 1605, ridge_y(near, 1605) + 6, 172, light=0.84)

    arr = np.array(base.convert("RGB"), dtype=np.float32)

    # atmospheric haze over distant layers
    haze = np.clip((H * 0.78 - yy) / (H * 0.35), 0, 1)
    arr = lerp(arr, np.array([90, 40, 32], dtype=np.float32), haze[..., None] * 0.10)

    # film grain
    grain = RNG.normal(0, 7.5, (H, W, 1)).astype(np.float32)
    arr += grain

    # vignette
    vx = (xx / (W - 1) - 0.5) * 1.55
    vy = (yy / (H - 1) - 0.5) * 1.70
    vig = 1.0 - 0.50 * (vx * vx + vy * vy)
    arr *= vig[..., None]

    arr = np.clip(arr, 0, 255).astype(np.uint8)
    poster = Image.fromarray(arr, "RGB").convert("RGBA")

    # soft dark scrim behind the lockup so gold type reads
    scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(scrim)
    sd.ellipse((W * 0.18, H * 0.22, W * 0.82, H * 0.72), fill=(12, 10, 9, 96))
    scrim = scrim.filter(ImageFilter.GaussianBlur(42))
    poster = Image.alpha_composite(poster, scrim)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    cx = W / 2

    line1 = "Shqipëria"
    line2 = "Gjatë Komunizmit"
    sub = "Gjimnazi Vajdin Lamaj  ·  Klasa XI-B"
    target = W * 0.58

    font2, track2 = fit_font(SERIF_BOLD, line2, target, 0.045)
    font1, track1 = fit_font(SERIF_BOLD, line1, target * 0.72, 0.08)
    font_sub = ImageFont.truetype(SERIF_REG, max(22, font2.size // 3))
    track_sub = font_sub.size * 0.12

    # vertical stack centered in the frame
    gap = int(font1.size * 0.12)
    rule_h = 2
    block_h = font1.size + gap + font2.size + int(font2.size * 0.38) + font_sub.size
    y0 = (H - block_h) / 2 - H * 0.07

    gold = (0xC4, 0xA3, 0x5A, 255)
    gold_hi = (0xE2, 0xC9, 0x86, 255)
    parch = (0xE8, 0xDC, 0xC8, 235)

    draw_tracked(draw, y0, line1, font1, gold_hi, track1, cx)
    y1 = y0 + font1.size + gap
    draw_tracked(draw, y1, line2, font2, gold, track2, cx)

    y_rule = y1 + font2.size + int(font2.size * 0.16)
    rule_w = tracked_width(font2, line2, track2) * 0.42
    draw.rectangle(
        (cx - rule_w / 2, y_rule, cx + rule_w / 2, y_rule + rule_h),
        fill=gold,
    )

    y_sub = y_rule + int(font2.size * 0.22)
    draw_tracked(draw, y_sub, sub, font_sub, parch, track_sub, cx, shadow=True)

    poster = Image.alpha_composite(poster, overlay)
    rgb = poster.convert("RGB")
    rgb.save(OUT, "JPEG", quality=94, optimize=True, subsampling=1)
    print(f"wrote {OUT} {rgb.size} {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
