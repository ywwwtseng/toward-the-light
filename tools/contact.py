# Tiles out/shots/scene_*.png into out/contact.jpg (needs Pillow).
import glob
from PIL import Image
fs = sorted(glob.glob('out/shots/scene_*.png')); W, H, C = 400, 250, 5
g = Image.new('RGB', (W * C, H * ((len(fs) + C - 1) // C)))
for i, f in enumerate(fs): g.paste(Image.open(f).convert('RGB').resize((W, H)), ((i % C) * W, (i // C) * H))
g.save('out/contact.jpg', quality=88); print('out/contact.jpg', len(fs), 'scenes')
