const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'src');
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (exts.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function count(text, regex) {
  const m = text.match(regex);
  return m ? m.length : 0;
}

for (const file of walk(root)) {
  const text = fs.readFileSync(file, 'utf8');
  const repaired = Buffer.from(text, 'latin1').toString('utf8');
  if (repaired === text) continue;

  const originalHangul = count(text, /[가-힣]/g);
  const repairedHangul = count(repaired, /[가-힣]/g);
  const originalMojibake = count(text, /[ìëêíó]/g);
  const repairedMojibake = count(repaired, /[ìëêíó]/g);

  if ((repairedHangul > originalHangul || originalMojibake > repairedMojibake) && /[가-힣]/.test(repaired)) {
    console.log(path.relative(process.cwd(), file));
  }
}
