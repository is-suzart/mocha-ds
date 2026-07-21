const fs = require('fs');
const { flavors } = require('@catppuccin/palette');

const cssFilePath = 'src/tokens.css';
let cssContent = fs.readFileSync(cssFilePath, 'utf-8');

const colorKeys = [
  'rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon',
  'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender',
  'text', 'subtext1', 'subtext0', 'overlay2', 'overlay1', 'overlay0',
  'surface2', 'surface1', 'surface0', 'base', 'mantle', 'crust'
];

function replaceColorsInBlock(content, selector, flavorName) {
  const flavor = flavors[flavorName].colors;
  
  // Find the block
  const blockRegex = new RegExp(`(${selector.replace(/\\[/g, '\\\\[').replace(/\\]/g, '\\\\]')}\\s*\\{[\\s\\S]*?\\})`, 'i');
  const match = content.match(blockRegex);
  if (!match) return content;
  
  let blockContent = match[0];
  
  for (const key of colorKeys) {
    if (flavor[key]) {
      const hex = flavor[key].hex;
      // Regex to match: --ctp-key: oklch(...); or --ctp-key: #...;
      const keyRegex = new RegExp(`(--ctp-${key}:\\s*)(oklch\\(.*?\\)|#[0-9a-fA-F]{3,6})(;)`, 'g');
      blockContent = blockContent.replace(keyRegex, `$1${hex}$3`);
    }
  }
  
  // Update contrast colors
  let darkContrast = flavors.macchiato.colors.mantle.hex;
  let lightContrast = flavors.latte.colors.base.hex;
  blockContent = blockContent.replace(/(--ctp-contrast-dark:\s*)(oklch\(.*?\)|#[0-9a-fA-F]{3,6})(;)/g, `$1${darkContrast}$3`);
  blockContent = blockContent.replace(/(--ctp-contrast-light:\s*)(oklch\(.*?\)|#[0-9a-fA-F]{3,6})(;)/g, `$1${lightContrast}$3`);

  return content.replace(blockRegex, blockContent);
}

cssContent = replaceColorsInBlock(cssContent, ':root', 'macchiato');
cssContent = replaceColorsInBlock(cssContent, '[data-theme="mocha"]', 'mocha');
cssContent = replaceColorsInBlock(cssContent, '[data-theme="frappe"]', 'frappe');
cssContent = replaceColorsInBlock(cssContent, '[data-theme="latte"]', 'latte');

fs.writeFileSync(cssFilePath, cssContent);
console.log('Successfully updated tokens.css to use standard Hex codes for all themes.');
