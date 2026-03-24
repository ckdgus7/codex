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

function countHangul(text) {
  const m = text.match(/[가-힣]/g);
  return m ? m.length : 0;
}

function countMojibake(text) {
  const m = text.match(/[ìëêíó]/g);
  return m ? m.length : 0;
}

for (const file of walk(root)) {
  const text = fs.readFileSync(file, 'utf8');
  const repaired = Buffer.from(text, 'latin1').toString('utf8');
  if (repaired !== text) {
    const originalHangul = countHangul(text);
    const repairedHangul = countHangul(repaired);
    const originalMojibake = countMojibake(text);
    const repairedMojibake = countMojibake(repaired);
    if ((repairedHangul > originalHangul || originalMojibake > repairedMojibake) && repaired.includes('요') || repaired.includes('검') || repaired.includes('승') || repaired.includes('반') || repaired.includes('작성')) {
      console.log(path.relative(process.cwd(), file));
    }
  }
}
