export function info(...message): void {
  console.log("[INFO]", ...message);
}

export function error(...message): void {
  console.error("[ERROR]", ...message);
}
