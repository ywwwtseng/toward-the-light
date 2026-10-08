// Screenshots of chosen scroll positions.
//   node tools/shots.js 3.5 14.6 21.85      -> out/shots/s_3.5.png ...  (numbers are scene positions: 3.5 = middle of scene index 3)
//   node tools/shots.js --all               -> out/shots/scene_00.png ... one per scene at its midpoint
// The page eases toward the scroll target (cur += (target-cur)*.07 per frame) and SwiftShader is slow,
// so each shot waits WAIT ms (default 8000). Shots taken too early show the previous scene.
const fs = require('fs');
const { launch, openSite } = require('./browser');
(async () => {
  const args = process.argv.slice(2), WAIT = +process.env.WAIT || 8000;
  fs.mkdirSync('out/shots', { recursive: true });
  const b = await launch(), p = await openSite(b, { width: 1000, height: 625 });
  const n = await p.evaluate(() => SCENES.length);
  const pos = args[0] === '--all' ? [...Array(n)].map((_, i) => i + .5) : args.map(Number);
  for (const f of pos) {
    await p.evaluate(([f, n]) => { const m = document.documentElement.scrollHeight - innerHeight; scrollTo(0, Math.max(5, m * f / n)); }, [f, n]);
    await p.waitForTimeout(WAIT);
    const name = args[0] === '--all' ? `scene_${String(Math.floor(f)).padStart(2, '0')}` : `s_${f}`;
    await p.screenshot({ path: `out/shots/${name}.png` });
    console.log('saved', name);
  }
  await b.close();
})();
