import { Logger } from "@mocha/shared";
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

const logger = new Logger("package:appimage");

export interface AppImageMeta {
  name: string;
  version: string;
  target: string;
  icon?: string;
  appMeta: {
    description?: string;
    color?: string;
    platforms?: {
      linux?: { categories?: string[]; terminal?: boolean };
    };
  };
}

const LINUXDEPLOY_URL = "https://github.com/linuxdeploy/linuxdeploy/releases/download/continuous/linuxdeploy-x86_64.AppImage";
const LINUXDEPLOY_QT_URL = "https://github.com/linuxdeploy/linuxdeploy-plugin-qt/releases/download/continuous/linuxdeploy-plugin-qt-x86_64.AppImage";

function findTool(name: string): string | null {
  try {
    return execSync(`which "${name}"`, { encoding: "utf-8" }).trim();
  } catch {
    try {
      // also try local .AppImage in cwd or /tmp
      const candidates = [
        `./${name}-x86_64.AppImage`,
        `/tmp/${name}-x86_64.AppImage`,
      ];
      for (const c of candidates) {
        if (fs.existsSync(c)) return c;
      }
    } catch {}
  }
  return null;
}

function findOrDownloadLinuxDeploy(): string {
  const existing = findTool("linuxdeploy");
  if (existing && !existing.endsWith(".AppImage")) {
    const appImagePath = path.join("/", "tmp", "linuxdeploy-x86_64.AppImage");
    if (fs.existsSync(appImagePath)) {
      logger.info(`[appimage] Using AppImage linuxdeploy at ${appImagePath}`);
      return appImagePath;
    }
    logger.info(`[appimage] Downloading linuxdeploy AppImage...`);
    try {
      if (execSync("which curl 2>/dev/null || true", { encoding: "utf-8" }).trim()) {
        execSync(`curl -sLo "${appImagePath}" "${LINUXDEPLOY_URL}"`, { stdio: "inherit" });
      } else {
        execSync(`wget -qO "${appImagePath}" "${LINUXDEPLOY_URL}"`, { stdio: "inherit" });
      }
      execSync(`chmod +x "${appImagePath}"`);
      logger.info(`[appimage] Downloaded linuxdeploy AppImage to ${appImagePath}`);
      return appImagePath;
    } catch (err: any) {
      logger.warn(`[appimage] Failed to download linuxdeploy AppImage: ${err?.message || err}`);
      return existing;
    }
  }
  return existing || "";
}

function findOrDownloadQtPlugin(): string | null {
  // prefer system-installed native plugin
  try {
    const systemPlugin = execSync("which linuxdeploy-plugin-qt", { encoding: "utf-8" }).trim();
    if (systemPlugin && !systemPlugin.endsWith(".AppImage")) {
      logger.info(`[appimage] Found linuxdeploy-plugin-qt at ${systemPlugin}`);
      return systemPlugin;
    }
  } catch {}

  // download + extract the AppImage version (linuxdeploy requires native plugin, not AppImage)
  const appImagePath = path.join("/", "tmp", "linuxdeploy-plugin-qt-x86_64.AppImage");
  const extractDir = path.join("/", "tmp", "linuxdeploy-plugin-qt-extracted");
  const pluginBin = path.join(extractDir, "usr", "bin", "linuxdeploy-plugin-qt");

  if (fs.existsSync(pluginBin)) {
    logger.info(`[appimage] Using extracted linuxdeploy-plugin-qt at ${pluginBin}`);
    return pluginBin;
  }

  if (!fs.existsSync(appImagePath)) {
    logger.info(`[appimage] Downloading linuxdeploy-plugin-qt...`);
    try {
      if (execSync("which curl 2>/dev/null || true", { encoding: "utf-8" }).trim()) {
        execSync(`curl -sLo "${appImagePath}" "${LINUXDEPLOY_QT_URL}"`, { stdio: "inherit" });
      } else {
        execSync(`wget -qO "${appImagePath}" "${LINUXDEPLOY_QT_URL}"`, { stdio: "inherit" });
      }
      execSync(`chmod +x "${appImagePath}"`);
    } catch (err: any) {
      logger.warn(`[appimage] Failed to download linuxdeploy-plugin-qt: ${err?.message || err}`);
      return null;
    }
  }

  logger.info(`[appimage] Extracting linuxdeploy-plugin-qt...`);
  try {
    const squashRoot = path.join("/", "tmp", "squashfs-root");
    fs.rmSync(extractDir, { recursive: true, force: true });
    fs.rmSync(squashRoot, { recursive: true, force: true });
    execSync(`"${appImagePath}" --appimage-extract`, { cwd: "/tmp", stdio: "inherit" });
    if (fs.existsSync(squashRoot)) {
      fs.renameSync(squashRoot, extractDir);
    }
    if (fs.existsSync(pluginBin)) {
      logger.info(`[appimage] Extracted linuxdeploy-plugin-qt to ${pluginBin}`);
      return pluginBin;
    }
  } catch (err: any) {
    logger.warn(`[appimage] Failed to extract linuxdeploy-plugin-qt: ${err?.message || err}`);
  }

  return null;
}

export function packageAppImage(distDir: string, meta: AppImageMeta): void {
  const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const pkgName = sanitize(meta.name);

  logger.info(`[appimage] Packaging ${pkgName} ${meta.version}`);

  const appDir = fs.existsSync(distDir) ? distDir : path.resolve(process.cwd(), distDir);
  if (!fs.existsSync(appDir)) {
    logger.error(`[appimage] Build output not found: ${appDir}`);
    return;
  }

  const appImageDir = path.resolve(distDir, "..", "AppDir");
  fs.rmSync(appImageDir, { recursive: true, force: true });
  const usrBin = path.join(appImageDir, "usr", "bin");
  const usrLib = path.join(appImageDir, "usr", "lib", pkgName);
  fs.mkdirSync(usrBin, { recursive: true });
  fs.mkdirSync(usrLib, { recursive: true });

  for (const entry of fs.readdirSync(appDir)) {
    const src = path.join(appDir, entry);
    const dest = path.join(usrLib, entry);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  }

  // node_modules for @mocha/native resolution
  const nativePkgDir = findNativePackageDir();
  if (nativePkgDir) {
    const nodeModulesNative = path.join(usrLib, "node_modules", "@mocha", "native");
    fs.mkdirSync(nodeModulesNative, { recursive: true });
    const nativeLibFiles = ["package.json", "index.js", "native.d.ts", "index.d.ts"];
    for (const f of nativeLibFiles) {
      const src = path.join(nativePkgDir, f);
      if (fs.existsSync(src)) fs.copyFileSync(src, path.join(nodeModulesNative, f));
    }
    for (const f of fs.readdirSync(nativePkgDir)) {
      if (f.startsWith("mocha-native") && f.endsWith(".node")) {
        fs.copyFileSync(path.join(nativePkgDir, f), path.join(nodeModulesNative, f));
      }
    }
    logger.info(`[appimage] Native module: ${nodeModulesNative}`);
  }

  // bundle MochaDS QML module (design system)
  const uiDir = findMochaDsDir();
  if (uiDir) {
    const destMochaDs = path.join(appImageDir, "usr", "qml", "MochaDS");
    copyDir(uiDir, destMochaDs);
    logger.info(`[appimage] MochaDS QML: ${uiDir} -> ${destMochaDs}`);
  }

  const appRun = [
    "#!/usr/bin/env sh",
    'APPDIR="$(dirname "$(readlink -f "$0")")"',
    `export NODE_PATH="${"\${APPDIR}"}/usr/lib/${pkgName}"`,
    'export PATH="${APPDIR}/usr/bin:${PATH}"',
    'export LD_LIBRARY_PATH="${APPDIR}/usr/lib:${LD_LIBRARY_PATH}"',
    'export QML2_IMPORT_PATH="${APPDIR}/usr/qml"',
    'export QT_PLUGIN_PATH="${APPDIR}/usr/plugins"',
    'export QT_QUICK_BACKEND=software',
    'export QT_QPA_PLATFORM=xcb',
    'export MOCHA_FALLBACK_MOCK=error',
    `exec node "${"\${APPDIR}"}/usr/lib/${pkgName}/app.js" "$@"`,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(appImageDir, "AppRun"), appRun, { mode: 0o755 });

  const linuxPlatform = meta.appMeta?.platforms?.linux;
  const categories = linuxPlatform?.categories?.length
    ? linuxPlatform.categories.join(";") + ";"
    : "Development;";
  const terminal = linuxPlatform?.terminal ?? false;

  const desktop = [
    "[Desktop Entry]",
    `Name=${pkgName}`,
    `Exec=AppRun`,
    "Type=Application",
    `Icon=${pkgName}`,
    `Categories=${categories}`,
    `Terminal=${terminal}`,
    meta.appMeta?.description ? `Comment=${meta.appMeta.description}` : "",
    "",
  ].filter(Boolean).join("\n");
  fs.writeFileSync(path.join(appImageDir, `${pkgName}.desktop`), desktop);

  // icon
  if (meta.icon && fs.existsSync(meta.icon)) {
    const ext = path.extname(meta.icon);
    const destIcon = path.join(appImageDir, `${pkgName}${ext}`);
    fs.copyFileSync(meta.icon, destIcon);
    logger.info(`[appimage] Icon: ${destIcon}`);
  }

  // bundle portable Node.js binary (built on CentOS 7 for maximum glibc compatibility)
  try {
    const nodeVersion = process.version;
    const tarballName = `node-${nodeVersion}-linux-x64.tar.xz`;
    const downloadUrl = `https://nodejs.org/dist/${nodeVersion}/${tarballName}`;
    const tarballPath = path.join("/", "tmp", tarballName);
    const extractDir = path.join("/", "tmp", "mocha-node-extract");
    const extractedNode = path.join(extractDir, `node-${nodeVersion}-linux-x64`, "bin", "node");

    fs.rmSync(extractDir, { recursive: true, force: true });

    logger.info(`[appimage] Downloading Node.js ${nodeVersion} from nodejs.org...`);

    if (execSync("which curl 2>/dev/null || true", { encoding: "utf-8" }).trim()) {
      execSync(`curl -sLo "${tarballPath}" "${downloadUrl}"`, { stdio: "inherit" });
    } else {
      execSync(`wget -qO "${tarballPath}" "${downloadUrl}"`, { stdio: "inherit" });
    }

    fs.mkdirSync(extractDir, { recursive: true });
    execSync(`tar -xJf "${tarballPath}" -C "${extractDir}" "node-${nodeVersion}-linux-x64/bin/node"`, { stdio: "inherit" });

    if (!fs.existsSync(extractedNode)) {
      throw new Error("Extracted node binary missing");
    }

    fs.copyFileSync(extractedNode, path.join(appImageDir, "usr", "bin", "node"));
    fs.chmodSync(path.join(appImageDir, "usr", "bin", "node"), 0o755);
    logger.info(`[appimage] Bundled Node.js ${nodeVersion} (portable)`);

    // cleanup
    fs.rmSync(tarballPath, { force: true });
    fs.rmSync(extractDir, { recursive: true, force: true });
  } catch (err: any) {
    logger.warn(`[appimage] Failed to download Node.js: ${err?.message || err}`);
    // fallback: try to bundle the build machine's system node
    try {
      const nodeBin = execSync("which node", { encoding: "utf-8" }).trim();
      if (nodeBin && fs.existsSync(nodeBin)) {
        fs.copyFileSync(nodeBin, path.join(appImageDir, "usr", "bin", "node"));
        fs.chmodSync(path.join(appImageDir, "usr", "bin", "node"), 0o755);
        logger.info(`[appimage] Bundled system Node.js: ${nodeBin}`);
      }
    } catch {
      logger.warn("[appimage] Node.js not found — AppImage will need system Node.js");
    }
  }

  // bundle system C++ runtime libs for compatibility (linuxdeploy blacklists these)
  deploySystemLibs(appImageDir);

  const outFile = path.resolve(distDir, "..", `${pkgName}-${meta.version}-x86_64.AppImage`);

  const ldCmd = findOrDownloadLinuxDeploy();
  if (!ldCmd) {
    logger.info(`[appimage] linuxdeploy not found. Install it:`);
    logger.info(`[appimage]   wget -O /tmp/linuxdeploy.AppImage ${LINUXDEPLOY_URL}`);
    logger.info(`[appimage]   chmod +x /tmp/linuxdeploy.AppImage`);
    logger.info(`[appimage]   /tmp/linuxdeploy.AppImage --appdir "${appImageDir}" --output appimage`);
    return;
  }

  // deploy essential Qt runtime: platform plugins + qt.conf
  deployQtPlugins(appImageDir);

  // deploy essential QML modules (Qt plugin can't scan .js bundles for imports)
  deployQmlModules(appImageDir);

  // Phase 1: deploy dependencies + set initial rpath (no AppImage output yet)
  try {
    execSync(`${ldCmd} --appdir "${appImageDir}"`, {
      stdio: "inherit",
      env: { ...process.env, NO_STRIP: "1" },
    });
    logger.info("[appimage] Dependencies deployed by linuxdeploy");
  } catch (err: any) {
    logger.warn(`[appimage] linuxdeploy dep deployment failed: ${err?.message || err}`);
  }

  // Phase 2: fix RUNPATH on .node files (linuxdeploy sets $ORIGIN but Qt libs are in ../../..)
  patchNativeRunpaths(appImageDir);

  // Phase 3: create the AppImage
  try {
    execSync(`${ldCmd} --appdir "${appImageDir}" --output appimage`, {
      stdio: "inherit",
      env: { ...process.env, NO_STRIP: "1", OUTPUT: outFile },
    });
    logger.info(`[appimage] Package created: ${outFile}`);
    return;
  } catch (err: any) {
    logger.warn(`[appimage] linuxdeploy failed: ${err?.message || err}`);
  }

  logger.info(`[appimage] AppDir prepared at ${appImageDir}`);
  logger.info(`[appimage] Run manually:`);
  logger.info(`[appimage]   ${ldCmd} --appdir "${appImageDir}" --output appimage`);
}

function findNativePackageDir(): string | null {
  const candidates = [
    path.resolve(process.cwd(), "node_modules", "@mocha", "native"),
    path.resolve(process.cwd(), "..", "packages", "native"),
    path.resolve(process.cwd(), "packages", "native"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isSymbolicLink()) {
      const linkTarget = fs.readlinkSync(srcPath);
      const resolvedTarget = path.resolve(src, linkTarget);
      if (fs.existsSync(resolvedTarget) && fs.statSync(resolvedTarget).isDirectory()) {
        copyDir(resolvedTarget, destPath);
      } else if (fs.existsSync(resolvedTarget)) {
        fs.copyFileSync(resolvedTarget, destPath);
      }
    } else if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function deployQtPlugins(appImageDir: string): void {
  const usrDir = path.join(appImageDir, "usr");

  // qt.conf — tells Qt where to find plugins and QML modules
  const qtConf = [
    "# generated by mocha kit",
    "[Paths]",
    "Prefix = ../",
    "Plugins = plugins",
    "Imports = qml",
    "Qml2Imports = qml",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(usrDir, "bin", "qt.conf"), qtConf);
  logger.info("[appimage] Created qt.conf");

  // deploy platform plugin (libqxcb.so) for X11
  let qtPluginDir: string;
  try {
    qtPluginDir = execSync("qmake6 -query QT_INSTALL_PLUGINS", { encoding: "utf-8" }).trim();
  } catch {
    logger.warn("[appimage] Cannot find Qt plugins — qmake6 not available");
    return;
  }

  const platformSrc = path.join(qtPluginDir, "platforms", "libqxcb.so");
  if (!fs.existsSync(platformSrc)) {
    logger.warn(`[appimage] Platform plugin not found: ${platformSrc}`);
    return;
  }

  const platformDest = path.join(usrDir, "plugins", "platforms");
  fs.mkdirSync(platformDest, { recursive: true });
  fs.copyFileSync(platformSrc, path.join(platformDest, "libqxcb.so"));
  logger.info("[appimage] Deployed platform plugin: libqxcb.so");
}

function deployQmlModules(appImageDir: string): void {
  let qmlSrcDir: string;
  try {
    qmlSrcDir = execSync("qmake6 -query QT_INSTALL_QML", { encoding: "utf-8" }).trim();
  } catch {
    logger.warn("[appimage] Cannot find QML modules — qmake6 not available");
    return;
  }
  if (!fs.existsSync(qmlSrcDir)) {
    logger.warn(`[appimage] QML modules directory not found: ${qmlSrcDir}`);
    return;
  }

  const destQml = path.join(appImageDir, "usr", "qml");
  fs.mkdirSync(destQml, { recursive: true });

  for (const mod of QML_MODULES) {
    const src = path.join(qmlSrcDir, mod);
    if (fs.existsSync(src)) {
      copyDir(src, path.join(destQml, mod));
    } else {
      logger.warn(`[appimage] QML module not found at system path: ${mod}`);
    }
  }
  logger.info(`[appimage] Deployed ${QML_MODULES.length} QML modules`);
}

// standard Qt6 QML modules required by Mocha apps
const QML_MODULES = [
  "QtQuick",
  "QtQml",
  "Qt",
];

function findMochaDsDir(): string | null {
  const marker = path.join("MochaDS", "qmldir");
  const candidates = [
    path.resolve(process.cwd(), "ui"),
    path.resolve(process.cwd(), "..", "ui"),
    path.resolve(process.cwd(), "..", "design-system", "ui"),
  ];
  for (const c of candidates) {
    const markerPath = path.join(c, marker);
    try {
      const realPath = fs.realpathSync(markerPath);
      const mochaDsDir = path.dirname(realPath);
      if (fs.existsSync(path.join(mochaDsDir, "qmldir"))) {
        return mochaDsDir;
      }
    } catch {}
  }
  return null;
}

function findPatchelf(): string | null {
  try {
    return execSync("which patchelf", { encoding: "utf-8" }).trim();
  } catch {}
  const local = "/tmp/usr/bin/patchelf";
  if (fs.existsSync(local)) return local;
  return null;
}

function patchNativeRunpaths(appImageDir: string): void {
  const patchelf = findPatchelf();
  if (!patchelf) {
    logger.warn("[appimage] patchelf not found — cannot fix .node RUNPATH");
    return;
  }

  const libDir = path.join(appImageDir, "usr", "lib");
  const globPattern = path.join(appImageDir, "usr", "lib", "**", "*.node");
  
  let found = false;
  for (const nodeFile of walkDir(appImageDir, ".node")) {
    const nodeDir = path.dirname(nodeFile);
    const relPath = path.relative(nodeDir, libDir);
    const newRpath = `$ORIGIN/${relPath}`;
    try {
      execSync(`"${patchelf}" --set-rpath '${newRpath}' "${nodeFile}"`, { stdio: "pipe" });
      found = true;
    } catch (err: any) {
      logger.warn(`[appimage] patchelf failed on ${path.basename(nodeFile)}: ${err?.message || err}`);
    }
  }
  if (found) logger.info("[appimage] Fixed RUNPATH on native .node files");
}

const SYSTEM_LIBS = [
  "libstdc++.so.6",
  "libgcc_s.so.1",
];

function deploySystemLibs(appImageDir: string): void {
  const libDir = path.join(appImageDir, "usr", "lib");

  for (const libName of SYSTEM_LIBS) {
    try {
      const result = execSync(`ldconfig -p | grep "${libName}" | head -1`, { encoding: "utf-8" }).trim();
      const match = result.match(/=>\s+(\/\S+)/);
      if (!match) continue;
      const src = match[1];
      if (fs.existsSync(src)) {
        const dest = path.join(libDir, libName);
        fs.copyFileSync(src, dest);
        fs.chmodSync(dest, 0o755);
      }
    } catch {}
  }
}

function walkDir(dir: string, ext: string): string[] {
  const results: string[] = [];
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop()!;
    let entries: fs.Dirent[];
    try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch { continue; }
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.name.endsWith(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}
