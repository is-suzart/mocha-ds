export function getTargetPlatform(): string {
  return process.env.MOCHA_PLATFORM || "desktop";
}

export function setTargetPlatform(platform: string): void {
  process.env.MOCHA_PLATFORM = platform;
}

export function preprocessPlatform(qml: string, platform: string): string {
  const regex = /\/\/\s*@if\s+platform\s*===?\s*["'](\w+)["']\s*\n([\s\S]*?)(?:\/\/\s*@else\s*\n([\s\S]*?))?\/\/\s*@endif/g;

  return qml.replace(regex, (_match, plat: string, ifBlock: string, elseBlock?: string) => {
    if (plat === platform) return ifBlock;
    if (elseBlock !== undefined) return elseBlock;
    return "";
  });
}
