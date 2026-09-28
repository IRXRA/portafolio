import re

with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

with open('temp_network.txt', 'r', encoding='utf-8') as f:
    network_svg = f.read()

pattern = re.compile(r'<g class="world-dma" id="water-asset-network">.*?</g>\s*<g class="world-telemetry"', re.DOTALL)
replacement = f'<g class="world-dma" id="water-asset-network">\n{network_svg}\n          </g>\n          <g class="world-telemetry"'

new_index = pattern.sub(replacement, index_html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_index)

print("Successfully injected SVG using Python!")
