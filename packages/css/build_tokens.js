const fs = require('fs');
const { flavors } = require('@catppuccin/palette');

const colorKeys = [
  'rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon',
  'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender',
  'text', 'subtext1', 'subtext0', 'overlay2', 'overlay1', 'overlay0',
  'surface2', 'surface1', 'surface0', 'base', 'mantle', 'crust'
];

function generateCSSBlock(flavorName, selector) {
  const flavor = flavors[flavorName].colors;
  let block = `/* ${flavorName.charAt(0).toUpperCase() + flavorName.slice(1)} Flavor */\n`;
  block += `${selector} {\n`;
  for (const key of colorKeys) {
    if (flavor[key]) {
      block += `  --ctp-${key}: ${flavor[key].hex};\n`;
    }
  }
  
  block += `  \n  /* Contrast colors */\n`;
  block += `  --ctp-contrast-dark: ${flavors.macchiato.colors.mantle.hex};\n`;
  block += `  --ctp-contrast-light: ${flavors.latte.colors.base.hex};\n`;
  
  block += `  \n  /* Semantic Colors mapped to cozy palette defaults */\n`;
  block += `  --ctp-primary: var(--ctp-mauve);\n`;
  block += `  --ctp-secondary: var(--ctp-lavender);\n`;
  block += `  --ctp-success: var(--ctp-green);\n`;
  block += `  --ctp-warning: var(--ctp-yellow);\n`;
  block += `  --ctp-danger: var(--ctp-red);\n`;
  block += `  --ctp-info: var(--ctp-sky);\n`;
  
  if (flavorName === 'macchiato') {
     block += `  \n  /* Shadow variables */
  --ctp-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ctp-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --ctp-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n`;
  }
  
  block += `}\n\n`;
  return block;
}

let newCSS = `/* Import Google Font for premium feel */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap');

/* Default variables are Macchiato flavor (the image flavor) */
:root {
  --ctp-font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --ctp-font-family-display: 'Geist', var(--ctp-font-family);
  
  /* Shared tokens */
  --ctp-radius-square: 0px;
  --ctp-radius-rounded: 8px;
  --ctp-radius-pill: 9999px;
  
  --ctp-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  --ctp-transition-duration: 0.2s;
  --ctp-transition: all var(--ctp-transition-duration) var(--ctp-transition-timing);

`;

// Add Macchiato variables into :root
const macchiatoFlavor = flavors['macchiato'].colors;
for (const key of colorKeys) {
  if (macchiatoFlavor[key]) {
    newCSS += `  --ctp-${key}: ${macchiatoFlavor[key].hex};\n`;
  }
}
newCSS += `  \n  /* Contrast colors */\n`;
newCSS += `  --ctp-contrast-dark: ${flavors.macchiato.colors.mantle.hex};\n`;
newCSS += `  --ctp-contrast-light: ${flavors.latte.colors.base.hex};\n`;
newCSS += `  \n  /* Semantic Colors mapped to cozy defaults */\n`;
newCSS += `  --ctp-primary: var(--ctp-mauve);\n`;
newCSS += `  --ctp-secondary: var(--ctp-lavender);\n`;
newCSS += `  --ctp-success: var(--ctp-green);\n`;
newCSS += `  --ctp-warning: var(--ctp-yellow);\n`;
newCSS += `  --ctp-danger: var(--ctp-red);\n`;
newCSS += `  --ctp-info: var(--ctp-sky);\n`;
newCSS += `  \n  /* Shadow variables */
  --ctp-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ctp-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --ctp-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

`;

newCSS += generateCSSBlock('mocha', '[data-theme="mocha"]');
newCSS += generateCSSBlock('frappe', '[data-theme="frappe"]');
newCSS += generateCSSBlock('latte', '[data-theme="latte"]');

newCSS += `/* Vercel Flavor (Black & White Dark Mode) */
[data-theme="vercel"] {
  /* Grayscales & Backgrounds */
  --ctp-base: #000000;
  --ctp-mantle: #111111;
  --ctp-crust: #1a1a1a;
  --ctp-surface0: #222222;
  --ctp-surface1: #333333;
  --ctp-surface2: #444444;
  --ctp-overlay0: #555555;
  --ctp-overlay1: #666666;
  --ctp-overlay2: #777777;
  
  /* Text */
  --ctp-text: #ffffff;
  --ctp-subtext1: #a1a1a1;
  --ctp-subtext0: #888888;
  
  /* Status Colors */
  --ctp-red: #ee0000;
  --ctp-maroon: #ee0000;
  --ctp-peach: #f5a623;
  --ctp-yellow: #f5a623;
  --ctp-green: #50e3c2;
  --ctp-teal: #50e3c2;
  
  --ctp-contrast-dark: #000000;
  --ctp-contrast-light: #ffffff;

  /* Vercel Semantic mapping */
  --ctp-primary: var(--ctp-text); /* White */
  --ctp-secondary: var(--ctp-surface2); /* Gray */
  --ctp-success: var(--ctp-green);
  --ctp-warning: var(--ctp-yellow);
  --ctp-danger: var(--ctp-red);
  --ctp-info: var(--ctp-teal);
}

/* Vercel Light Flavor (Black & White Light Mode) */
[data-theme="vercel-light"] {
  /* Grayscales & Backgrounds */
  --ctp-base: #ffffff;
  --ctp-mantle: #fafafa;
  --ctp-crust: #f5f5f5;
  --ctp-surface0: #eaeaea;
  --ctp-surface1: #cccccc;
  --ctp-surface2: #999999;
  --ctp-overlay0: #888888;
  --ctp-overlay1: #666666;
  --ctp-overlay2: #555555;
  
  /* Text */
  --ctp-text: #000000;
  --ctp-subtext1: #666666;
  --ctp-subtext0: #888888;
  
  /* Status Colors */
  --ctp-red: #ee0000;
  --ctp-maroon: #ee0000;
  --ctp-peach: #f5a623;
  --ctp-yellow: #f5a623;
  --ctp-green: #007a22;
  --ctp-teal: #007a22;
  
  --ctp-contrast-dark: #000000;
  --ctp-contrast-light: #ffffff;

  /* Vercel Light Semantic mapping */
  --ctp-primary: var(--ctp-text); /* Black */
  --ctp-secondary: var(--ctp-surface2); /* Gray */
  --ctp-success: var(--ctp-green);
  --ctp-warning: var(--ctp-yellow);
  --ctp-danger: var(--ctp-red);
  --ctp-info: var(--ctp-teal);
}
`;

fs.writeFileSync('src/tokens.css', newCSS);
console.log('tokens.css built successfully from scratch.');
