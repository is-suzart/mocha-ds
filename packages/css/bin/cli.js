#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const atImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const prefixer = require('../scripts/postcss-prefixer');

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help')) {
  console.log(`
  Usage: npx @mocha-ds/css compile [options]

  Options:
    --prefix=<string>   Custom class prefix (e.g. acme → .acme-btn)
                        Omit or leave empty for no prefix (.btn)
    --output=<path>     Output file path (default: dist/custom.css)

  Examples:
    npx @mocha-ds/css compile --prefix=acme --output=src/styles/ds.css
    npx @mocha-ds/css compile --prefix= --output=dist/clean.css
  `);
  process.exit(0);
}

const command = args[0];

if (command !== 'compile') {
  console.error(`Unknown command: "${command}". Use "compile".`);
  process.exit(1);
}

const prefixArg = args.find(a => a.startsWith('--prefix='))?.split('=').slice(1).join('=') ?? '';
const outputArg = args.find(a => a.startsWith('--output='))?.split('=').slice(1).join('=') ?? 'dist/custom.css';

const srcPath = path.resolve(__dirname, '../src/index.css');
const destPath = path.resolve(process.cwd(), outputArg);

if (!fs.existsSync(srcPath)) {
  console.error('Source CSS not found. Is @mocha-ds/css installed?');
  process.exit(1);
}

const css = fs.readFileSync(srcPath, 'utf8');

postcss([
  atImport(),
  prefixer({ prefix: prefixArg }),
  autoprefixer(),
])
  .process(css, { from: srcPath, to: destPath })
  .then((result) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, result.css);
    const label = prefixArg ? `.${prefixArg}-` : '(nenhum)';
    console.log(`CSS compilado com sucesso! Prefixo: "${label}" → ${path.relative(process.cwd(), destPath)}`);
  })
  .catch((err) => {
    console.error('Erro na compilação:', err.message);
    process.exit(1);
  });
