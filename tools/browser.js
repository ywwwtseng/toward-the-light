// Shared headless-Chromium launcher. WebGL runs on SwiftShader (software), so expect 3–9 fps.
// Set CHROMIUM=/path/to/chrome to override the browser binary (Claude cloud sessions: /opt/pw-browsers/chromium).
const { chromium } = require('playwright');
const fs = require('fs');
async function launch() {
  const opts = { args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] };
  const guess = process.env.CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : null);
  if (guess) opts.executablePath = guess;
  return chromium.launch(opts);
}
// Opens dist/test.html, presses BEGIN and waits until the loader has built every scene.
async function openSite(browser, { width = 1280, height = 720 } = {}) {
  const p = await browser.newPage({ viewport: { width, height } });
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  await p.goto('file://' + process.cwd() + '/dist/test.html');
  await p.waitForTimeout(600);
  await p.click('#begin');
  await p.waitForFunction(() => document.querySelector('#loader').classList.contains('gone'), null, { timeout: 180000 });
  return p;
}
module.exports = { launch, openSite };
