export function info(...message): void {
  process.stdout.write("[INFO] ");
  console.log(...message);
}

export function error(...message): void {
  console.error("[ERROR]", ...message);
}

export function warn(...message): void {
  console.error("[WARN]", ...message);
}
