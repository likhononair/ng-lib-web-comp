const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist/hello-world-element/browser');
const outputDir = path.join(__dirname, '../dist/web-component');

console.log('[Bundle] Starting concatenation...');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read all JS files from the dist directory
const files = fs.readdirSync(distDir).filter(file => file.endsWith('.js'));

console.log(`[Bundle] Found ${files.length} JS files to concatenate`);

// Sort files: polyfills first, then main
const sortedFiles = files.sort((a, b) => {
  if (a.startsWith('polyfills')) return -1;
  if (b.startsWith('polyfills')) return 1;
  if (a.startsWith('main')) return 1;
  if (b.startsWith('main')) return -1;
  return 0;
});

console.log('[Bundle] File order:', sortedFiles);

// Concatenate all files
let bundleContent = `/**
 * Hello World Web Component
 * Built with Angular Elements
 *
 * Usage:
 * <script src="hello-world-element.js"></script>
 * <hello-world-element
 *   title="My Counter"
 *   message="A custom message"
 *   initial-value="10"
 *   min-value="0"
 *   max-value="100"
 *   step="1">
 * </hello-world-element>
 *
 * Events:
 * - actionTriggered: Fired when any button is clicked
 * - counterChanged: Fired when the counter value changes
 */
`;

sortedFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  bundleContent += `\n// Source: ${file}\n${content}\n`;
  console.log(`[Bundle] Added: ${file}`);
});

// Write the concatenated bundle
const outputFile = path.join(outputDir, 'hello-world-element.js');
fs.writeFileSync(outputFile, bundleContent);

console.log(`[Bundle] Bundle created: ${outputFile}`);

// Copy index.html for demo
const srcIndex = path.join(__dirname, '../dist/hello-world-element/browser/index.html');
const destIndex = path.join(outputDir, 'index.html');

if (fs.existsSync(srcIndex)) {
  let indexContent = fs.readFileSync(srcIndex, 'utf8');

  // Replace the script tags with a single bundle reference
  indexContent = indexContent.replace(
    /<script[^>]*src="[^"]*\.js"[^>]*><\/script>/g,
    ''
  );

  // Add our bundle script before closing body
  indexContent = indexContent.replace(
    '</body>',
    '<script src="hello-world-element.js"></script>\n</body>'
  );

  fs.writeFileSync(destIndex, indexContent);
  console.log('[Bundle] Demo index.html created');
}

// Copy any CSS files
const cssFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.css'));
cssFiles.forEach(file => {
  fs.copyFileSync(
    path.join(distDir, file),
    path.join(outputDir, file)
  );
  console.log(`[Bundle] Copied CSS: ${file}`);
});

console.log('[Bundle] Concatenation complete!');
console.log(`[Bundle] Output directory: ${outputDir}`);

