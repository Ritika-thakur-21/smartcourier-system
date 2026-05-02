const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Remove generic interfaces
  content = content.replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '');
  
  // Remove React.FC<Props> and React.FC
  content = content.replace(/: React\.FC<[^>]+>/g, '');
  content = content.replace(/: React\.FC/g, '');
  
  // Remove useState generics
  content = content.replace(/useState<[^>]+>\(/g, 'useState(');
  
  // Remove types from imports
  content = content.replace(/import\s+type\s+.*?;\n?/g, '');
  content = content.replace(/import\s+\{.*?(?:Role|Delivery|TrackingEvent|Metrics|DeliveryResponse).*?\}\s+from\s+['"].*?\/types\/.*?['"];?\n?/g, '');
  
  // Clean up stray colons before equals, eg. `({ status }: { status: string })`
  content = content.replace(/:\s*\{[^}]+\}\s*=/g, ' =');
  content = content.replace(/:\s*\w+(\[\])?\s*=/g, ' =');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Stripped TS from', file);
  }
});
