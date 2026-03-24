const fs = require('fs');
const files = [
  'src/shared/ui/popup/PrivacyPopup.tsx',
  'src/shared/ui/popup/TermsPopup.tsx',
  'src/shared/ui/service/BlankPage.tsx',
  'src/shared/ui/service/BpmnViewer.tsx',
  'src/shared/ui/service/MdiTab.tsx',
  'src/shared/ui/service/PageFooter.tsx',
  'src/shared/ui/service/PageTitle.tsx',
  'src/shared/ui/service/TopUtil.tsx',
];
const suspicious = /(\?[가-힣]|[ìëêíóÃÅ]|�|源|諛|媛|뺤|붽|寃|꾩|쒕|뱀|꾨|섎|젮|留|遺|濡|곗|먮|곸|좎|쭊|짤).{0,30}/g;
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const matches = text.match(suspicious) || [];
  console.log('FILE', file);
  console.log(matches.slice(0, 10).join('\n'));
  console.log('---');
}
