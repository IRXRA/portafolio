def make_rect(x, y, w, h):
    return f'M{x} {y} h{w} v{h} h{-w} Z'

svg = []

# Boundary
svg.append('<!-- Boundary -->')
svg.append('<path class="wd-boundary" fill="rgba(62,151,141,0.05)" stroke="#3aa39f" stroke-dasharray="10 10" stroke-width="2" d="M720 2740l252-95 325 102 65 376-284 161-341-135z" />')

# Streets Base
street_paths = "M730 2860 H1240 M820 2710 H1200 M820 3010 H1200 M820 2710 V3120 M970 2620 V3120 M1120 2710 V3060"
svg.append('<path stroke="#587c79" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" fill="none" d="{}" />'.format(street_paths))
svg.append('<path stroke="#a4c3c0" stroke-width="2" stroke-dasharray="8 12" stroke-linecap="round" fill="none" d="{}" />'.format(street_paths))

# Crosswalks
cw_d = []
for i in range(-12, 13, 6): cw_d.append(f"M805 {2860+i} h30")
for i in range(-12, 13, 6): cw_d.append(f"M{970+i} 2845 v30")
for i in range(-12, 13, 6): cw_d.append(f"M{970+i} 2995 v30")
for i in range(-12, 13, 6): cw_d.append(f"M{1120+i} 2845 v30")
svg.append('<path stroke="#d8e5df" stroke-width="2" stroke-dasharray="2 4" fill="none" d="{}" />'.format(" ".join(cw_d)))

# Houses Group
svg.append('<g class="wd-houses-complex">') # Use new class to avoid bad CSS interference!
style = 'stroke="#1c3e3b" stroke-width="2" stroke-linejoin="round"'

# Block 1 (Top-Left, Hospital) - Box: 835-955, 2725-2845
svg.append(f'<path {style} fill="#a4c3c0" d="{make_rect(840, 2740, 105, 95)}" />')
svg.append(f'<path {style} fill="#8baea9" d="{make_rect(850, 2730, 85, 10)}" />')
svg.append(f'<path {style} fill="#d8e5df" d="{make_rect(870, 2720, 45, 10)}" />')
for y in range(2755, 2825, 15):
    svg.append(f'<path stroke="#1c3e3b" stroke-width="4" stroke-dasharray="10 5" fill="none" d="M850 {y} h85" />')

# Block 2 (Top-Right, Houses) - Box: 985-1105, 2725-2845
# We can fit 4 houses: 2 columns, 2 rows.
hx_list = [995, 1050]
hy_list = [2740, 2795]
for hx in hx_list:
    for hy in hy_list:
        svg.append(f'<path {style} fill="#8baea9" d="{make_rect(hx, hy+20, 40, 30)}" />') # Base
        svg.append(f'<path {style} fill="#d8e5df" d="M{hx-5} {hy+20} L{hx+20} {hy} L{hx+45} {hy+20} Z" />') # Roof
        svg.append(f'<path {style} fill="#6bf0a6" stroke-width="1.5" d="{make_rect(hx+6, hy+30, 10, 10)}" />') # Window 1
        svg.append(f'<path {style} fill="#6bf0a6" stroke-width="1.5" d="{make_rect(hx+24, hy+30, 10, 10)}" />') # Window 2

# Block 3 (Mid-Left, Park) - Box: 835-955, 2875-2995
svg.append(f'<path {style} fill="#6bf0a6" d="{make_rect(840, 2880, 105, 105)}" />')
svg.append(f'<path stroke="#a4c3c0" stroke-width="12" fill="none" d="M840 2932 h105 M892 2880 v105 M840 2880 L945 2985 M945 2880 L840 2985" />')
# Trees (using circles inside the park)
for tx, ty in [(860, 2905), (920, 2905), (860, 2960), (920, 2960), (875, 2945), (910, 2920)]:
    svg.append(f'<circle cx="{tx}" cy="{ty}" r="6" fill="#2a6f68" stroke="#1c3e3b" stroke-width="1.5" />')

# Block 4 (Mid-Right, Skyscrapers) - Box: 985-1105, 2875-2995
# Need to make sure they do NOT cross 2875!
svg.append(f'<path {style} fill="#8baea9" d="{make_rect(990, 2880, 45, 115)}" />')
svg.append(f'<path {style} fill="#d8e5df" d="{make_rect(995, 2870, 35, 10)}" />')
for y in range(2890, 2985, 8):
    svg.append(f'<path stroke="#1c3e3b" stroke-width="3" stroke-dasharray="6 2" fill="none" d="M995 {y} h35" />')

svg.append(f'<path {style} fill="#a4c3c0" d="{make_rect(1050, 2890, 45, 105)}" />')
svg.append(f'<path {style} fill="#d8e5df" d="{make_rect(1055, 2880, 35, 10)}" />')
for y in range(2900, 2985, 8):
    svg.append(f'<path stroke="#1c3e3b" stroke-width="3" stroke-dasharray="6 2" fill="none" d="M1055 {y} h35" />')

# Block 5 (Bottom-Left, Commercial) - Box: 835-955, 3025-3100
svg.append(f'<path {style} fill="#d8e5df" d="{make_rect(840, 3035, 105, 60)}" />')
svg.append(f'<path {style} fill="#8baea9" d="{make_rect(850, 3025, 85, 10)}" />')
for y in range(3050, 3085, 10):
    svg.append(f'<path stroke="#1c3e3b" stroke-width="4" stroke-dasharray="10 5" fill="none" d="M850 {y} h85" />')

# Block 6 (Bottom-Right, L-Shape) - Box: 985-1105, 3025-3100
svg.append(f'<path {style} fill="#a4c3c0" d="M1010 3035 h85 v65 h-40 v-35 h-45 z" />')
svg.append(f'<path {style} fill="#8baea9" d="{make_rect(1020, 3045, 35, 15)}" />')

svg.append('</g>')

# Pipes Overlay
svg.append('<!-- Tuberias matrices -->')
svg.append(f'<path stroke="#6bf0a6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" d="{street_paths}" />')
svg.append(f'<path class="pipe-flow-anim" stroke="#fff" stroke-width="2" stroke-dasharray="8 12" stroke-linecap="round" stroke-linejoin="round" fill="none" d="{street_paths}" />')

# Nodes
svg.append('<!-- Nodos -->')
nodes = [
    (970, 2860, 14), (820, 2860, 10), (1120, 2860, 10),
    (820, 2710, 8), (970, 2710, 8), (1120, 2710, 8),
    (820, 3010, 8), (970, 3010, 8), (1120, 3010, 8),
    (730, 2860, 6), (1240, 2860, 6), (1200, 2710, 6), (1200, 3010, 6),
    (970, 2620, 6), (820, 3120, 6), (970, 3120, 6), (1120, 3060, 6)
]
svg.append('<g stroke="#6bf0a6" stroke-width="3" fill="#fff">')
for nx, ny, nr in nodes:
    svg.append(f'<circle cx="{nx}" cy="{ny}" r="{nr}" />')
svg.append('</g>')

# Pulses
svg.append('<!-- Pulses -->')
svg.append('<circle class="wd-pulse" stroke="#6bf0a6" stroke-width="2" fill="none" cx="970" cy="2860" r="32" />')
svg.append('<circle class="wd-pulse" stroke="#6bf0a6" stroke-width="1" fill="none" cx="970" cy="2860" r="16" style="animation-delay: 0.8s" />')
svg.append('<circle class="wd-pulse" stroke="#a0dacd" stroke-width="1.5" fill="none" cx="1120" cy="2860" r="20" style="animation-delay: 0.5s" />')
svg.append('<circle class="wd-pulse" stroke="#a0dacd" stroke-width="1.5" fill="none" cx="820" cy="2860" r="20" style="animation-delay: 1.2s" />')

out = "\\n".join(["            " + line for line in svg])
with open("temp_network.txt", "w", encoding="utf-8") as f:
    f.write(out)

