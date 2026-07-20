# Linux Quickstart

> **Recomendado:** Use o bootstrap automático:
> ```bash
> node scripts/bootstrap.mjs --fix
> ```
> Ele detecta sua distro (apt/dnf/pacman) e instala todas as dependências (Node, Rust, Qt6, libs de sistema) em um só comando. Depois continue na seção **Setup** abaixo.

## Pré-requisitos

### Node.js 20+
```bash
# Via nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 20

# Ou via gerenciador de pacotes
# Arch:      sudo pacman -S nodejs npm
# Ubuntu:    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs
# Fedora:    sudo dnf install nodejs npm
```

### Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Qt6

**Arch Linux:**
```bash
sudo pacman -S qt6-base qt6-tools
# moc em /usr/lib/qt6/moc
```

**Ubuntu / Debian:**
```bash
sudo apt update
sudo apt install -y qt6-base-dev qt6-base-dev-tools qt6-tools-dev qt6-tools-dev-tools
sudo apt install -y libgl1-mesa-dev libxkbcommon-dev  # dependências runtime
# moc em /usr/lib/qt6/libexec/moc (se qt6-base-dev-tools) ou /usr/lib/x86_64-linux-gnu/qt6/libexec/moc
```

**Fedora:**
```bash
sudo dnf install qt6-qtbase-devel qt6-qttools-devel
sudo dnf install mesa-libGL-devel libxkbcommon-devel
# moc em /usr/lib64/qt6/libexec/moc
```

---

## Setup

```bash
git clone https://github.com/is-suzart/mocha-framework.git
cd mocha-framework
npm install
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
| `pkg-config: Qt6Core not found` | Instale `qt6-base-dev` (Ubuntu) ou `qt6-base` (Arch) |
| `moc not found` | `sudo pacman -S qt6-base` (Arch) ou `sudo apt install qt6-base-dev-tools` (Ubuntu) |
| `fatal error: QGuiApplication` | Inclua `qt6-base-dev` completo, não só runtime |
| `libQt6Core.so.6: cannot open shared object` | Rode `sudo ldconfig` após instalar Qt6 |
| Janela QML não abre | Verifique `$DISPLAY` (X11) ou `$WAYLAND_DISPLAY` (Wayland) |
| `MOCHA_DEVTOOLS=1` ativa debug server na porta definida, `MOCHA_DEVTOOLS_PORT=0` usa porta aleatória | |
