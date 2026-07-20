# Windows Quickstart

## Pré-requisitos

### 1. Node.js 20+
```powershell
# Baixe e instale: https://nodejs.org (LTS 20.x)
# Ou via winget:
winget install OpenJS.NodeJS.LTS
```

### 2. Rust
```powershell
# Baixe e instale: https://rustup.rs
# Ou via winget:
winget install Rustlang.Rustup
```

### 3. Qt6
```powershell
# Opção A: Chocolatey (recomendado)
choco install qt6 -y

# Opção B: instalador oficial
# Baixe de https://www.qt.io/download-open-source
# Escolha Qt 6.8.x → MSVC 2022 64-bit
```

Defina a variável de ambiente:
```powershell
# Via Chocolatey (instala em C:\Qt\6.8.0\msvc2022_64)
[Environment]::SetEnvironmentVariable("QT6_DIR", "C:\Qt\6.8.0\msvc2022_64", "User")

# Ou se instalou manualmente em outro path:
# [Environment]::SetEnvironmentVariable("QT6_DIR", "C:\Qt\6.7.0\msvc2022_64", "User")
```

### 4. Visual Studio Build Tools (MSVC)
```powershell
# Baixe: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
# Ou via winget:
winget install Microsoft.VisualStudio.2022.BuildTools --override "--add Microsoft.VisualStudio.Workload.VCTools"
```

> **IMPORTANTE:** Na instalação, marque o workload **"Desktop development with C++"** (C++ Build Tools + Windows SDK).

**Reinicie o terminal** após instalar o Build Tools.

---

## Setup

Abra um **novo PowerShell** (ou terminal do VSCode) e:

```powershell
git clone https://github.com/is-suzart/mocha-framework.git
cd mocha-framework
npm install

cd packages\native
npx napi build --platform --release
cd ..\..
```

---

## Rodar

```powershell
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
| `Qt6 not found` | Verifique `$env:QT6_DIR` aponta pra `C:\Qt\6.8.0\msvc2022_64`. Reinicie terminal após definir. |
| `moc.exe not found` | Instale `qt6-base-dev-tools` (Chocolatey) ou verifique `C:\Qt\6.8.0\msvc2022_64\bin\moc.exe` |
| `link: fatal error LNK1104: cannot open file 'Qt6Core.lib'` | QT6_DIR errado ou Qt instalado sem MSVC. Reinstale Qt com o compilador MSVC 2022 64-bit. |
| `'npx' is not recognized` | Node.js não está no PATH. Reinstale Node.js ou reinicie terminal. |
| `error MSB8036: The Windows SDK version X was not found` | Instale o Windows SDK pelo Visual Studio Installer → Modify → Individual Components |
| `MSVC Build Tools not found` | Instale Visual Studio 2022 Build Tools com workload "Desktop C++" |
| Janela QML não abre | Qt no Windows precisa do plugin `windows` (já incluído no Qt6 base). Verifique se o terminal tem GPU acceleration. |
| `MOCHA_DEVTOOLS=1` ativa debug server na porta definida, `MOCHA_DEVTOOLS_PORT=0` usa porta aleatória | |
