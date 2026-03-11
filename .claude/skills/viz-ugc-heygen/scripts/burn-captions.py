# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow>=10.0", "numpy>=1.24"]
# ///
"""
Burn branded .ass captions onto a video using Pillow + ffmpeg (no libass needed).

Usage:
    uv run burn-captions.py <video.mp4> <captions.ass> <output.mp4>

Pipeline:
1. Parse .ass subtitle file for timing + text
2. Render each subtitle frame as a transparent PNG overlay using Pillow
3. Use ffmpeg to composite overlays onto the video frame-by-frame

Brand styling is read from the .ass Style line (font, size, colors, outline).
"""
import sys
import os
import re
import struct
import subprocess
import tempfile
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


def parse_ass_color(color_str: str) -> tuple:
    """Parse ASS color format &HAABBGGRR to (R, G, B, A)."""
    color_str = color_str.strip("&H")
    if len(color_str) == 8:
        aa = int(color_str[0:2], 16)
        bb = int(color_str[2:4], 16)
        gg = int(color_str[4:6], 16)
        rr = int(color_str[6:8], 16)
        return (rr, gg, bb, 255 - aa)
    elif len(color_str) == 6:
        bb = int(color_str[0:2], 16)
        gg = int(color_str[2:4], 16)
        rr = int(color_str[4:6], 16)
        return (rr, gg, bb, 255)
    return (255, 255, 255, 255)


def parse_ass_style(content: str) -> dict:
    """Extract style from .ass file."""
    style = {}
    for line in content.splitlines():
        if line.startswith("Style: Default,"):
            parts = line.split(",")
            # Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,
            # OutlineColour,BackColour,Bold,Italic,...,BorderStyle,Outline,Shadow,
            # Alignment,MarginL,MarginR,MarginV,Encoding
            style["font"] = parts[1]
            style["size"] = float(parts[2])
            style["primary_color"] = parse_ass_color(parts[3])
            style["outline_color"] = parse_ass_color(parts[5])
            style["back_color"] = parse_ass_color(parts[6])
            style["bold"] = int(parts[7]) == 1
            style["border_style"] = int(parts[15])
            style["outline_width"] = float(parts[16])
            style["alignment"] = int(parts[18])
            style["margin_v"] = int(parts[21])
            break
    return style


def parse_ass_dialogues(content: str) -> list:
    """Extract dialogue lines with timing from .ass file."""
    dialogues = []
    for line in content.splitlines():
        if line.startswith("Dialogue:"):
            # Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
            match = re.match(
                r"Dialogue:\s*\d+,(\d+:\d+:\d+\.\d+),(\d+:\d+:\d+\.\d+),.*?,.*?,\d+,\d+,\d+,.*?,(.*)",
                line,
            )
            if match:
                start = parse_ass_time(match.group(1))
                end = parse_ass_time(match.group(2))
                text = match.group(3).replace("\\n", "\n").replace("\\N", "\n").strip()
                dialogues.append({"start": start, "end": end, "text": text})
    return dialogues


def parse_ass_time(time_str: str) -> float:
    """Parse ASS time format H:M:S.CS to seconds."""
    parts = time_str.split(":")
    h = int(parts[0])
    m = int(parts[1])
    s = float(parts[2])
    return h * 3600 + m * 60 + s


def find_font(font_name: str, bold: bool) -> str:
    """Try to find the font, fall back to system defaults."""
    # Common font paths on macOS
    font_dirs = [
        "/System/Library/Fonts",
        "/Library/Fonts",
        os.path.expanduser("~/Library/Fonts"),
    ]

    # Try exact match first
    font_variants = []
    base = font_name.replace("-Bold", "").replace("-Regular", "")
    if bold:
        font_variants = [
            f"{font_name}.ttf",
            f"{base}-Bold.ttf",
            f"{base}Bold.ttf",
            f"{base}-Bold.otf",
        ]
    else:
        font_variants = [
            f"{font_name}.ttf",
            f"{base}-Regular.ttf",
            f"{base}.ttf",
            f"{base}-Regular.otf",
        ]

    for d in font_dirs:
        for variant in font_variants:
            path = os.path.join(d, variant)
            if os.path.exists(path):
                return path

    # Fallback: Helvetica Bold (always on macOS)
    for d in font_dirs:
        for fallback in ["HelveticaNeue-Bold.otf", "Helvetica-Bold.otf", "Helvetica.ttc", "Arial Bold.ttf"]:
            path = os.path.join(d, fallback)
            if os.path.exists(path):
                return path

    return None


def render_subtitle(
    text: str, style: dict, video_width: int, video_height: int
) -> Image.Image:
    """Render a subtitle line as a transparent RGBA image."""
    # Scale font size for video resolution (ASS uses script resolution)
    scale = video_height / 384  # ASS default script height
    font_size = int(style["size"] * scale)

    font_path = find_font(style["font"], style["bold"])
    if font_path:
        try:
            font = ImageFont.truetype(font_path, font_size)
        except Exception:
            font = ImageFont.load_default()
    else:
        font = ImageFont.load_default()

    # Create temp image to measure text
    tmp = Image.new("RGBA", (1, 1))
    draw = ImageDraw.Draw(tmp)

    # Split into lines
    lines = text.split("\n")
    line_bboxes = []
    for line in lines:
        bbox = draw.textbbox((0, 0), line.strip(), font=font)
        line_bboxes.append((bbox[2] - bbox[0], bbox[3] - bbox[1]))

    max_width = max(w for w, h in line_bboxes)
    total_height = sum(h for w, h in line_bboxes) + (len(lines) - 1) * 4

    # Padding for outline and background
    outline_w = int(style["outline_width"] * scale)
    pad_x = outline_w + 16
    pad_y = outline_w + 10

    img_w = max_width + pad_x * 2
    img_h = total_height + pad_y * 2

    img = Image.new("RGBA", (img_w, img_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw background box if border_style == 3
    if style["border_style"] == 3:
        bg_color = style["back_color"]
        draw.rounded_rectangle(
            [0, 0, img_w, img_h],
            radius=8,
            fill=bg_color,
        )

    # Draw text with outline
    y_offset = pad_y
    for line in lines:
        line = line.strip()
        bbox = draw.textbbox((0, 0), line, font=font)
        text_w = bbox[2] - bbox[0]
        x = (img_w - text_w) // 2

        # Outline
        if outline_w > 0:
            outline_color = style["outline_color"]
            for dx in range(-outline_w, outline_w + 1):
                for dy in range(-outline_w, outline_w + 1):
                    if dx * dx + dy * dy <= outline_w * outline_w:
                        draw.text((x + dx, y_offset + dy), line, font=font, fill=outline_color)

        # Primary text
        draw.text((x, y_offset), line, font=font, fill=style["primary_color"])
        y_offset += bbox[3] - bbox[1] + 4

    return img


def get_video_info(video_path: str) -> dict:
    """Get video dimensions and fps using ffprobe."""
    result = subprocess.run(
        [
            "ffprobe", "-v", "quiet", "-print_format", "json",
            "-show_streams", video_path,
        ],
        capture_output=True, text=True,
    )
    data = json.loads(result.stdout)
    for stream in data["streams"]:
        if stream["codec_type"] == "video":
            fps_parts = stream["r_frame_rate"].split("/")
            fps = float(fps_parts[0]) / float(fps_parts[1])
            return {
                "width": int(stream["width"]),
                "height": int(stream["height"]),
                "fps": fps,
                "duration": float(stream.get("duration", 0)),
            }
    return {}


def main():
    if len(sys.argv) != 4:
        print("Usage: uv run burn-captions.py <video.mp4> <captions.ass> <output.mp4>")
        sys.exit(1)

    video_path = sys.argv[1]
    ass_path = sys.argv[2]
    output_path = sys.argv[3]

    print(f"Reading subtitles from {ass_path}...")
    with open(ass_path, "r") as f:
        ass_content = f.read()

    style = parse_ass_style(ass_content)
    dialogues = parse_ass_dialogues(ass_content)
    print(f"  Found {len(dialogues)} subtitle segments")
    print(f"  Style: {style.get('font', 'default')} {style.get('size', '?')}pt, bold={style.get('bold', False)}")

    video_info = get_video_info(video_path)
    width = video_info["width"]
    height = video_info["height"]
    fps = video_info["fps"]
    print(f"  Video: {width}x{height} @ {fps:.1f}fps")

    # Pre-render all unique subtitle images
    print("Rendering subtitle overlays...")
    with tempfile.TemporaryDirectory() as tmpdir:
        overlay_dir = os.path.join(tmpdir, "overlays")
        os.makedirs(overlay_dir)

        # Create a transparent blank frame
        blank = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        blank_path = os.path.join(overlay_dir, "blank.png")
        blank.save(blank_path)

        # For each dialogue, render and save the overlay
        overlay_map = {}  # frame_num -> overlay_path
        total_frames = int(video_info.get("duration", dialogues[-1]["end"] + 1) * fps)

        for i, d in enumerate(dialogues):
            sub_img = render_subtitle(d["text"], style, width, height)

            # Position: bottom center with margin
            margin_v = int(style.get("margin_v", 30) * (height / 384))
            canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
            x = (width - sub_img.width) // 2
            y = height - sub_img.height - margin_v
            canvas.paste(sub_img, (x, y), sub_img)

            overlay_path = os.path.join(overlay_dir, f"sub_{i:04d}.png")
            canvas.save(overlay_path)

            start_frame = int(d["start"] * fps)
            end_frame = int(d["end"] * fps)
            for f in range(start_frame, end_frame + 1):
                overlay_map[f] = overlay_path

        # Build ffmpeg complex filter with enable/disable per subtitle
        # Strategy: create one overlay input per subtitle, enable each during its time range
        print("Building ffmpeg command...")

        inputs = ["-i", video_path]
        filter_parts = []

        for i, d in enumerate(dialogues):
            overlay_path = os.path.join(overlay_dir, f"sub_{i:04d}.png")
            inputs.extend(["-i", overlay_path])

        # Chain overlays: [0:v][1:v]overlay=...[tmp1]; [tmp1][2:v]overlay=...[tmp2]; ...
        prev = "0:v"
        for i, d in enumerate(dialogues):
            out_label = f"tmp{i}" if i < len(dialogues) - 1 else "v"
            enable = f"between(t,{d['start']:.3f},{d['end']:.3f})"
            filter_parts.append(
                f"[{prev}][{i+1}:v]overlay=0:0:enable='{enable}'[{out_label}]"
            )
            prev = out_label

        filter_str = ";".join(filter_parts)

        cmd = [
            "ffmpeg", "-y",
            *inputs,
            "-filter_complex", filter_str,
            "-map", "[v]",
            "-map", "0:a",
            "-c:a", "copy",
            "-c:v", "h264",
            output_path,
        ]

        print(f"Running ffmpeg with {len(dialogues)} overlay inputs...")
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"ffmpeg error: {result.stderr[-500:]}")
            sys.exit(1)

        print(f"Done! Saved to {output_path}")


if __name__ == "__main__":
    main()
