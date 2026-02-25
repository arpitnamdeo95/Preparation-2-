
import os

file_path = r'f:\gate tracker\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Search for substrings
search_start = 'const generateCareerRoadmapPDF = (userName = "Velosify User") => {'
search_end = 'doc.save("velosify-career-roadmap-2026.pdf");'

start_idx = content.find(search_start)
end_idx = content.find(search_end)

print(f"Start index: {start_idx}")
print(f"End index: {end_idx}")

if start_idx != -1:
    print(f"Start text: {repr(content[start_idx:start_idx+50])}")
if end_idx != -1:
    print(f"End text: {repr(content[end_idx:end_idx+50])}")
