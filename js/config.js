export const CONFIG = {
  site: {
    title: '我的图片书',
    subtitle: 'Immersive Image Book'
  },
  paths: {
    manifest: './data/images.json',
    book: './data/book.json'
  },
  autoDiscovery: {
    enabled: true,
    startAfterManifest: true,
    maxPage: 1000,
    missingTolerance: 8,
    extensions: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp']
  },
  book: {
    mode: 'double-page',
    startPage: 1,
    enableFlipAnimation: true,
    prefetchSpreads: 0,
    maxDpr: 2,
    textureWidth: 900,
    textureHeight: 1260
  },
  music: {
    enabled: true,
    src: './music/background.mp3',
    title: 'Silent Gallery',
    volume: 0.35
  },
  paperSound: {
    enabled: true,
    volume: 0.60
  },
  ui: {
    autoHideHUD: true,
    autoHideDelay: 2500,
    enableFullscreen: true,
    enableDirectory: true,
    persistState: true
  },
  protection: {
    disableContextMenu: true,
    disableImageDrag: true,
    disableTextSelection: true
  }
};

export const STORAGE_KEYS = {
  page: 'imagebook.currentPage',
  musicMuted: 'imagebook.musicMuted',
  musicVolume: 'imagebook.musicVolume',
  paperEnabled: 'imagebook.paperEnabled',
  paperVolume: 'imagebook.paperVolume'
};
