const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const atImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const prefixer = require('./postcss-prefixer');

const srcPath = path.resolve(__dirname, '../src/index.css');
const distDir = path.resolve(__dirname, '../dist');

const css = fs.readFileSync(srcPath, 'utf8');

const builds = [
  { prefix: 'ctp', output: 'catppuccin.css', minify: true },
  { prefix: '',    output: 'neutral.css',      minify: true },
];

async function runBuilds() {
  fs.mkdirSync(distDir, { recursive: true });

  for (const build of builds) {
    const plugins = [
      atImport(),
      prefixer({ prefix: build.prefix }),
      autoprefixer(),
    ];

    if (build.minify) {
      plugins.push(cssnano({ preset: 'default' }));
    }

    const destPath = path.join(distDir, build.output);

    try {
      const result = await postcss(plugins).process(css, {
        from: srcPath,
        to: destPath,
      });

      fs.writeFileSync(destPath, result.css);
      console.log(`✓ ${build.output} (prefix: "${build.prefix || 'none'}")`);
    } catch (err) {
      console.error(`✗ ${build.output}:`, err.message);
      process.exit(1);
    }
  }

  console.log('\nBuild complete.');
}

runBuilds();
