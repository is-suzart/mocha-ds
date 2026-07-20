# Windows Quickstart

> **Recomendado:** Use o bootstrap automático:
> ```powershell
> node scripts/bootstrap.mjs --fix
> ```
> Ele detecta e instala todas as dependências (Node, Rust, Qt6, MSVC Build Tools) e configura o ambiente em um só comando. Depois continue na seção **Setup** abaixo.

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
A melhor forma de instalar o Qt6 no Windows sem precisar criar uma conta da Qt Company ou compilar do código-fonte é utilizando a ferramenta **aqtinstall** (via Python/pip). Ela baixa os binários pré-compilados oficiais do Qt diretamente dos mirrors em poucos segundos.

#### Opção A: aqtinstall (Recomendado)
```powershell
# 1. Instale o aqtinstall usando o pip (Python deve estar instalado)
pip install aqtinstall

# 2. Instale o Qt 6.8.2 completo (inclui base, QML/declarative, QuickControls2, e ferramentas como moc e qmake)
# Recomendamos instalar no diretório C:\Qt para manter a convenção
aqt install-qt --outputdir C:\Qt windows desktop 6.8.2 win64_msvc2022_64
```

Defina a variável de ambiente (reinicie o terminal após definir):
```powershell
[Environment]::SetEnvironmentVariable("QT6_DIR", "C:\Qt\6.8.2\msvc2022_64", "User")
```

#### Opção B: Chocolatey
```powershell
# Instala o Qt6 via Chocolatey (pode conter versão mais antiga)
choco install qt6 -y
```

Defina a variável de ambiente (ajuste a versão instalada pelo Chocolatey):
```powershell
[Environment]::SetEnvironmentVariable("QT6_DIR", "C:\Qt\6.8.0\msvc2022_64", "User")
```

#### Opção C: Instalador Oficial (Exige login/cadastro)
1. Baixe o instalador online em: https://www.qt.io/download-qt-installer-oss
2. Realize o login ou crie uma conta na Qt Company.
3. Selecione **Qt 6.8.x** → **MSVC 2022 64-bit**.
4. Defina a variável de ambiente:
```powershell
[Environment]::SetEnvironmentVariable("QT6_DIR", "C:\Qt\6.8.2\msvc2022_64", "User")
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
| `Qt6 not found` | Verifique se `$env:QT6_DIR` aponta para o diretório correto (ex: `C:\Qt\6.8.2\msvc2022_64`). Reinicie o terminal após definir. |
| `moc.exe not found` | Se instalou via aqtinstall, certifique-se de que o arquivo existe em `C:\Qt\6.8.2\msvc2022_64\bin\moc.exe`. Se usou Chocolatey, instale `qt6-base-dev-tools`. |
| `link: fatal error LNK1104: cannot open file 'Qt6Core.lib'` | QT6_DIR errado ou Qt instalado sem MSVC. Certifique-se de que a versão instalada usa o compilador MSVC 2022 64-bit (`win64_msvc2022_64`). |
| `'npx' is not recognized` | Node.js não está no PATH. Reinstale Node.js ou reinicie o terminal. |
| `error MSB8036: The Windows SDK version X was not found` | Instale o Windows SDK pelo Visual Studio Installer → Modify → Individual Components |
| `MSVC Build Tools not found` | Instale Visual Studio 2022 Build Tools com o workload "Desktop development with C++" |
| Janela QML não abre | Qt no Windows precisa do plugin `windows` (já incluído no Qt6 base). Verifique se o terminal tem GPU acceleration. |
| `MOCHA_DEVTOOLS=1` ativa debug server na porta definida, `MOCHA_DEVTOOLS_PORT=0` usa porta aleatória | |
