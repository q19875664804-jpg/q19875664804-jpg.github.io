export async function enterFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
  } catch (_) {}
  try {
    await screen.orientation?.lock?.('landscape');
  } catch (_) {}
}

export async function exitFullscreen() {
  try { if (document.fullscreenElement) await document.exitFullscreen?.(); } catch (_) {}
}

export function isFullscreen() { return !!document.fullscreenElement; }
