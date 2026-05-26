const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'components', 'themes');

const variantMapping = {
  'ViewfinderTheme.tsx': 'viewfinder',
  'SplitTheme.tsx': 'split',
  'SpatialTheme.tsx': 'spatial',
  'MonolithTheme.tsx': 'monolith',
  'MidnightEmulsionTheme.tsx': 'midnight',
  'CinematicTheme.tsx': 'cinematic',
  'BrutalismTheme.tsx': 'brutalism',
  'BentoGrid.tsx': 'bento',
  'AuraKineticTheme.tsx': 'aura',
  'AbsoluteNoirTheme.tsx': 'noir',
  'AcidTheme.tsx': 'acid'
};

Object.entries(variantMapping).forEach(([file, variant]) => {
  const filePath = path.join(themesDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace PenpotShowcase variant
    content = content.replace(/<PenpotShowcase([^>]+)variant="[^"]+"/g, `<PenpotShowcase$1variant="${variant}"`);
    
    // Replace CanvaShowcase variant
    content = content.replace(/<CanvaShowcase([^>]+)variant="[^"]+"/g, `<CanvaShowcase$1variant="${variant}"`);
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file} to use variant="${variant}"`);
  }
});
