import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_thumbnail():
    width = 1200
    height = 800  # Exact 3:2 ratio
    
    # 1. Base dark canvas
    img = Image.new("RGBA", (width, height), (3, 7, 4, 255))
    draw = ImageDraw.Draw(img)

    # 2. Radial ambient glow in center/top
    glow_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_img)
    center_x, center_y = width // 2, height // 3
    for radius in range(500, 50, -30):
        alpha = int((1 - radius / 500) * 45)
        glow_draw.ellipse(
            [center_x - radius, center_y - radius, center_x + radius, center_y + radius],
            fill=(16, 185, 129, alpha)
        )
    img = Image.alpha_composite(img, glow_img)
    draw = ImageDraw.Draw(img)

    # 3. Try to load monospace fonts, fallback to default
    try:
        font_title = ImageFont.truetype("courbd.ttf", 68)
        font_subtitle = ImageFont.truetype("cour.ttf", 24)
        font_badge = ImageFont.truetype("courbd.ttf", 16)
        font_matrix = ImageFont.truetype("courbd.ttf", 14)
        font_addr = ImageFont.truetype("cour.ttf", 12)
    except Exception:
        try:
            font_title = ImageFont.truetype("arialbd.ttf", 64)
            font_subtitle = ImageFont.truetype("arial.ttf", 22)
            font_badge = ImageFont.truetype("arialbd.ttf", 16)
            font_matrix = ImageFont.truetype("cour.ttf", 13)
            font_addr = ImageFont.truetype("cour.ttf", 11)
        except Exception:
            font_title = font_subtitle = font_badge = font_matrix = font_addr = ImageFont.load_default()

    # 4. Draw Header Badges
    badges = [
        ("🏆 KIROWEEN 2026", (245, 158, 11), (50, 20, 5)),
        ("⚡ RESURRECTION CATEGORY", (168, 85, 247), (35, 10, 45)),
        ("🤖 KIRO CREW MULTI-AGENT", (52, 211, 153), (10, 35, 20)),
        ("🛡️ ZERO-CRASH PBT VERIFIED", (56, 189, 248), (10, 25, 40)),
    ]
    badge_x = 70
    badge_y = 45
    for text, border_col, bg_col in badges:
        bbox = draw.textbbox((0, 0), text, font=font_badge)
        bw = bbox[2] - bbox[0] + 20
        bh = bbox[3] - bbox[1] + 10
        draw.rounded_rectangle([badge_x, badge_y, badge_x + bw, badge_y + bh], radius=4, fill=bg_col, outline=border_col, width=1)
        draw.text((badge_x + 10, badge_y + 4), text, font=font_badge, fill=border_col)
        badge_x += bw + 14

    # 5. Main Title & Pitch
    title_text = "DEFRAG84"
    draw.text((70, 95), title_text, font=font_title, fill=(51, 255, 102))
    
    sub_title = "The Autonomous Cloud Memory Garbage Collector"
    draw.text((72, 175), sub_title, font=font_subtitle, fill=(209, 250, 229))

    hook_text = "Resurrecting 1984 2D Bin-Packing & MS-DOS DEFRAG to Solve Kubernetes & LLM KV-Cache Bloat"
    draw.text((72, 212), hook_text, font=font_addr, fill=(110, 231, 183))

    # 6. Central CRT Terminal Frame & Matrix Display
    crt_x = 70
    crt_y = 250
    crt_w = 420
    crt_h = 500
    
    # CRT outer bezel
    draw.rounded_rectangle([crt_x, crt_y, crt_x + crt_w, crt_y + crt_h], radius=16, fill=(10, 15, 12), outline=(39, 39, 42), width=3)
    # Screen bezel header
    draw.line([crt_x, crt_y + 35, crt_x + crt_w, crt_y + 35], fill=(39, 39, 42), width=1)
    draw.ellipse([crt_x + 16, crt_y + 12, crt_x + 26, crt_y + 22], fill=(16, 185, 129))
    draw.text((crt_x + 36, crt_y + 10), "ELEKTRONIKA-60 [PHYSICAL HEAP 0x0000 - 0x2600]", font=font_addr, fill=(113, 113, 122))
    draw.text((crt_x + crt_w - 95, crt_y + 10), "60 FPS • DAS", font=font_addr, fill=(52, 211, 153))

    # Draw grid rows
    grid_left = crt_x + 60
    grid_top = crt_y + 48
    cell_size = 21
    cols = 10
    rows = 20

    # Hex address rail on left
    for r in range(rows):
        addr_str = f"0x{r * 0x0200:04X}"
        draw.text((crt_x + 10, grid_top + r * cell_size + 4), addr_str, font=font_addr, fill=(74, 222, 128, 160))

    # Simulated heap allocations
    heap_cells = [
        # (r, c, type, fill_col)
        # bottom rows compacted
        (19, c, 'WRK_MEM', (234, 179, 8)) for c in range(10)
    ] + [
        (18, c, 'BUF_POOL', (6, 182, 212)) for c in range(10)
    ] + [
        (17, c, 'HEAP_OBJ', (249, 115, 22)) for c in [0, 1, 2, 3, 4, 5, 6, 7, 8] # column 9 open for sweep!
    ] + [
        (16, c, 'KV_CACHE', (34, 197, 94)) for c in [0, 1, 2, 3, 5, 6, 7]
    ] + [
        (15, c, 'SOCK_FD', (168, 85, 247)) for c in [0, 1, 2, 4, 5]
    ] + [
        (14, c, 'STK_FRM', (59, 130, 246)) for c in [1, 2, 3]
    ] + [
        (13, c, 'DOM_NODE', (239, 68, 68)) for c in [2, 3]
    ]

    # Falling active piece: T-Piece (SOCK_FD)
    active_cells = [(7, 4), (8, 3), (8, 4), (8, 5)]

    # Draw grid background cells
    for r in range(rows):
        for c in range(cols):
            x0 = grid_left + c * cell_size
            y0 = grid_top + r * cell_size
            draw.rectangle([x0, y0, x0 + cell_size - 1, y0 + cell_size - 1], outline=(24, 24, 27), fill=(5, 10, 7))

    # Fill occupied cells
    for r, c, tag, col in heap_cells:
        x0 = grid_left + c * cell_size
        y0 = grid_top + r * cell_size
        draw.rectangle([x0 + 1, y0 + 1, x0 + cell_size - 2, y0 + cell_size - 2], fill=col, outline=(255, 255, 255, 60))
        # Inner square tag
        draw.rectangle([x0 + 5, y0 + 5, x0 + cell_size - 6, y0 + cell_size - 6], outline=(0, 0, 0, 120))

    # Draw active falling piece with glow
    for r, c in active_cells:
        x0 = grid_left + c * cell_size
        y0 = grid_top + r * cell_size
        draw.rectangle([x0 + 1, y0 + 1, x0 + cell_size - 2, y0 + cell_size - 2], fill=(168, 85, 247), outline=(236, 72, 153), width=2)
        draw.text((x0 + 4, y0 + 3), "T", font=font_matrix, fill=(255, 255, 255))

    # Floating DEALLOC tokens
    draw.text((grid_left + 70, grid_top + 16 * cell_size - 15), "FREE +256KB", font=font_badge, fill=(52, 211, 153))
    draw.text((grid_left + 10, grid_top + 17 * cell_size - 25), "0x00 DEALLOC", font=font_badge, fill=(56, 189, 248))

    # 7. Right Side Panels: eBPF Telemetry & Kiro Crew Protocol Stack
    p_x = 520
    p_y = 250
    p_w = 610
    
    # Box 1: eBPF Heap Observability Gauge
    draw.rounded_rectangle([p_x, p_y, p_x + p_w, p_y + 225], radius=12, fill=(12, 14, 18), outline=(39, 39, 42), width=2)
    draw.text((p_x + 20, p_y + 15), "📊 REAL-TIME HEAP FORENSICS & TELEMETRY", font=font_badge, fill=(56, 189, 248))
    
    metrics = [
        ("RAM RECLAIMED (GC SWEEPS):", "24.8 MB", (52, 211, 153)),
        ("HEAP PRESSURE:", "58.4% (14,950 / 25,600 KB)", (245, 158, 11)),
        ("FRAGMENTATION RATIO:", "18.2% (OPTIMAL)", (52, 211, 153)),
        ("MAJOR COMPACTIONS (4-LINE):", "18 CYCLES", (168, 85, 247)),
        ("AUTONOMOUS GC ALGORITHM:", "Pierre Dellacherie 2D Bin-Packing", (209, 250, 229)),
        ("LIVE HOST MEMORY BRIDGE:", "Connected to Chromium V8 Heap", (56, 189, 248)),
    ]
    my = p_y + 45
    for label, val, val_col in metrics:
        draw.text((p_x + 20, my), label, font=font_addr, fill=(161, 161, 170))
        draw.text((p_x + 300, my), val, font=font_badge, fill=val_col)
        my += 28

    # Box 2: The 3-Tier Multi-Agent Protocol Stack (MCP + A2A + AG-UI)
    p2_y = p_y + 245
    draw.rounded_rectangle([p_x, p2_y, p_x + p_w, p2_y + 255], radius=12, fill=(12, 14, 18), outline=(39, 39, 42), width=2)
    draw.text((p_x + 20, p2_y + 15), "🤖 3-TIER AGENT PROTOCOL STACK (OCT 2026)", font=font_badge, fill=(168, 85, 247))

    # 3 Protocol Cards
    protocols = [
        ("Layer 1: MCP", "Model Context Protocol", "Tools & Memory API (.kiro/mcp.json)", (234, 88, 12), (30, 15, 10)),
        ("Layer 2: A2A", "Agent2Agent Protocol", "Daemon Consensus: GC vs Chaos Monkey", (59, 130, 246), (10, 20, 35)),
        ("Layer 3: AG-UI", "Agent-User Interaction", "Live Reactive HUD & Holographic AI Ghost", (168, 85, 247), (25, 10, 35)),
    ]
    card_y = p2_y + 42
    for p_name, p_full, p_desc, p_col, p_bg in protocols:
        draw.rounded_rectangle([p_x + 15, card_y, p_x + p_w - 15, card_y + 60], radius=8, fill=p_bg, outline=p_col, width=1)
        draw.text((p_x + 28, card_y + 8), p_name, font=font_badge, fill=p_col)
        draw.text((p_x + 160, card_y + 8), f"— {p_full}", font=font_addr, fill=(212, 212, 216))
        draw.text((p_x + 28, card_y + 32), p_desc, font=font_addr, fill=(161, 161, 170))
        card_y += 68

    # CRT Scanline overlay effect across the image
    for y in range(0, height, 4):
        draw.line([(0, y), (width, y)], fill=(0, 0, 0, 30), width=1)

    # Save PNG
    output_path = r"c:\Users\yuvan\OneDrive\Desktop\necro-tetris\thumbnail.png"
    img.save(output_path, "PNG")
    print(f"Thumbnail created successfully at: {output_path}")

if __name__ == "__main__":
    create_thumbnail()
