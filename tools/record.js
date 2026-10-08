// Deterministic frame-by-frame capture of the whole site (no dropped frames despite slow software WebGL).
// requestAnimationFrame is replaced so the page only advances when we call __step(ms); each frame we set the
// scroll position, step once with a fake clock, and screenshot. Output: out/frames/f00000.jpg ...
//   PER=4.5 (seconds per scene)  FPS=24  W=1280 H=720  LIMIT=n (stop early for a test)
const fs = require('fs');
const { launch } = require('./browser');
const FPS = +process.env.FPS || 24, PER = +process.env.PER || 4.5, W = +process.env.W || 1280, H = +process.env.H || 720, LIMIT = +process.env.LIMIT || 1e9;
(async () => {
  fs.mkdirSync('out/frames', { recursive: true });
  const b = await launch(), p = await b.newPage({ viewport: { width: W, height: H } });
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  await p.addInitScript(() => {
    const real = window.requestAnimationFrame.bind(window); let cbs = []; window.__manual = false;
    window.requestAnimationFrame = cb => { if (window.__manual) { cbs.push(cb); return 1; } return real(cb); };
    window.__step = ms => { const c = cbs; cbs = []; c.forEach(f => f(ms)); };
  });
  await p.goto('file://' + process.cwd() + '/dist/test.html'); await p.waitForTimeout(800);
  await p.click('#begin');
  await p.waitForFunction(() => document.querySelector('#loader').classList.contains('gone'), null, { timeout: 180000 });
  const N = await p.evaluate(() => { document.querySelector('#sound').style.display = 'none'; window.__manual = true; return SCENES.length; });
  await p.waitForTimeout(300);
  const scrollFrames = Math.round(N * PER * FPS), total = scrollFrames + FPS * 4, t0 = Date.now();
  for (let f = 0; f < total && f < LIMIT; f++) {
    const prog = Math.min(1, f / scrollFrames);
    await p.evaluate(([prog, ms]) => { const m = document.documentElement.scrollHeight - innerHeight; scrollTo(0, Math.max(5, prog * m)); window.__step(ms); }, [prog, 10000 + f * 1000 / FPS]);
    await p.screenshot({ path: `out/frames/f${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 88 });
    if (f % 100 === 0) console.log(f, '/', total, Math.round((Date.now() - t0) / 1000) + 's');
  }
  await b.close();
})();
