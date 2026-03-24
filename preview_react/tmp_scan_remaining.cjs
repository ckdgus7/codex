const fs = require('fs');
const path = require('path');
const roots = ['src', 'public'];
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.json']);
const suspicious = /\?[가-힣]|[ìëêíóÃÅ]|�|源|諛|媛|뺤|붽|寃|꾩|쒕|뱀|꾨|섎|젮|留|遺|濡|곗|먮|곸|좎|쭊|짤/;
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (exts.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const text = fs.readFileSync(file, 'utf8');
    if (suspicious.test(text)) console.log(file);
  }
}
