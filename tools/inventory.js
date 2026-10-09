// Model inventory: builds every scene in headless Chromium and writes, per scene, the triangle count
// (instanced meshes multiplied by their count), meshes, instanced meshes, lines/points, lights and the
// heaviest meshes with their geometry type, tone and position. Hero meshes are counted separately.
// Usage: node tools/inventory.js            -> out/inventory.json + out/inventory.md
//        OUT=out/inv_v40 node tools/inventory.js   (another build: run it from that checkout)
const fs = require('fs');
const { launch, openSite } = require('./browser');
(async () => {
  const browser = await launch();
  const p = await openSite(browser);
  const data = await p.evaluate(() => {
    const hex = c => c ? '#' + c.getHexString() : null;
    const tris = g => !g ? 0 : g.index ? g.index.count / 3 : (g.attributes.position ? g.attributes.position.count / 3 : 0);
    return SCENES.map((s, i) => {
      const sc = s.inst.scene; sc.updateMatrixWorld(true);
      const out = { i, key: s.key, tris: 0, heroTris: 0, meshes: 0, instanced: 0, instances: 0, lines: 0, points: 0, sprites: 0, lights: [], materials: new Set(), top: [] };
      const rows = [];
      sc.traverse(o => {
        let hero = false; for (let a = o; a; a = a.parent) if (a.userData && a.userData.stroll) { hero = true; break; }
        if (o.isLight) { out.lights.push(o.type.replace('Light', '') + (o.color ? ' ' + hex(o.color) : '') + ' ' + (+o.intensity).toFixed(2)); return; }
        if (o.isSprite) { out.sprites++; return; }
        if (o.isPoints) { out.points += o.geometry.attributes.position.count; return; }
        if (o.isLine || o.isLineSegments) { out.lines++; return; }
        if (!o.isMesh) return;
        const n = o.isInstancedMesh ? o.count : 1, t = tris(o.geometry) * n;
        out.meshes++; if (o.isInstancedMesh) { out.instanced++; out.instances += n; }
        if (hero) out.heroTris += t; else out.tris += t;
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (m) out.materials.add(m.uuid);
        if (!hero) { const w = o.getWorldPosition(new THREE.Vector3());
          rows.push({ geo: o.geometry.type.replace('Geometry', '').replace('Buffer', 'Buffer'), tris: t, per: tris(o.geometry), n, color: m && m.color ? hex(m.color) : null,
            emissive: m && m.emissive && m.emissiveIntensity && m.emissive.getHex() ? hex(m.emissive) : undefined, lit: m ? !m.isMeshBasicMaterial : null,
            pos: [w.x, w.y, w.z].map(v => +v.toFixed(2)), vis: o.visible }); }
      });
      out.materials = out.materials.size;
      out.top = rows.sort((a, b) => b.tris - a.tris).slice(0, 12);
      return out;
    });
  });
  const dir = process.env.OUT || 'out/inventory';
  fs.writeFileSync(dir + '.json', JSON.stringify(data, null, 1));
  let md = '| # | key | scene tris | hero tris | meshes | instanced (instances) | lines | points | lights |\n|---|---|---|---|---|---|---|---|---|\n';
  for (const s of data) md += `| ${s.i} | ${s.key} | ${s.tris} | ${s.heroTris} | ${s.meshes} | ${s.instanced} (${s.instances}) | ${s.lines} | ${s.points} | ${s.lights.length} |\n`;
  fs.writeFileSync(dir + '.md', md);
  console.log(md);
  await browser.close();
})();
