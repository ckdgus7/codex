const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'src');
const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);
const suspicious = /[ìëêíóÃÅ]|\?[가-힣]|�|源|諛|媛|뺤|붽|寃|꾩|쒕|뱀|꾨|섎|젮|留|遺|濡|諛깆|곗|먮|곸|좎|쭊/;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (exts.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

for (const file of walk(root)) {
  const text = fs.readFileSync(file, 'utf8');
  if (suspicious.test(text)) {
    console.log(path.relative(process.cwd(), file));
  }
}
