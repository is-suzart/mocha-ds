# macOS Quickstart

> **Recomendado:** Use o bootstrap automático:
> ```bash
> node scripts/bootstrap.mjs --fix
> ```
> Ele detecta e instala todas as dependências (Node, Rust, Qt6 via Homebrew, Xcode CLI Tools) em um só comando. Depois continue na seção **Setup** abaixo.

## Pré-requisitos

### Node.js 20+
```bash
# Via nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 20

# Ou via Homebrew
brew install node@20
```

### Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Qt6
```bash
brew install qt@6
# moc em /opt/homebrew/opt/qt@6/bin/moc (Apple Silicon)
# ou /usr/local/opt/qt@6/bin/moc (Intel)
```

Adicione ao PATH (opcional, o build.rs detecta automaticamente):
```bash
echo 'export PATH="/opt/homebrew/opt/qt@6/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## Setup

```bash
git clone https://github.com/is-suzart/mocha-framework.git
cd mocha-framework
npm install

# Se Qt6 não estiver no PATH, defina QT6_DIR:
export QT6_DIR=$(brew --prefix qt@6)

cd packages/native
npx napi build --platform --release
cd ../..
```

---

## Rodar

```bash
npx tsx examples/mocha-ds/index.ts
```

A janela QML abre com o playground MochaDS.

---

## Debug no VSCode / Antigravity IDE

1. Abra `examples/mocha-ds/index.ts`
2. Coloque breakpoint em um método (`increment`, `decrement`)
3. Pressione **F5**
4. Clique no botão no QML → debugger para na linha

---

## Troubleshooting

| Problema | Solução |
|---|---|
| `Qt6 not found` | `brew install qt@6 && export QT6_DIR=$(brew --prefix qt@6)` |
| `moc not found` | Verifique `$(brew --prefix qt@6)/bin/moc` existe |
| `framework QtCore not found` | O build.rs detecta frameworks automaticamente em `/opt/homebrew/opt/qt@6/lib/` |
| Janela QML não abre | macOS Sonoma+ precisa de permissão de acessibilidade. System Settings → Privacy → Accessibility |
| `MOCHA_DEVTOOLS=1` ativa debug server | `MOCHA_DEVTOOLS_PORT=0` usa porta aleatória |
| Apple Silicon (M1/M2/M3) | Funciona nativamente com `aarch64-apple-darwin` triple |
