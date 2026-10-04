import { CONFIG, STORAGE_KEYS } from './config.js';
import { PageManager } from './page-manager.js';
import { ImageManager } from './image-manager.js';
import { AudioManager } from './audio-manager.js';
import { BookRenderer } from './book.js';
import { UIManager } from './ui-manager.js';
import { enterFullscreen, exitFullscreen, isFullscreen } from './fullscreen.js';

class ImageBookApp {
  constructor() {
    this.book = null;
    this.pageManager = new PageManager([]);
    this.imageManager = new ImageManager({ prefetchSpreads: CONFIG.book.prefetchSpreads, onStateChange: (item, state) => this.onImageState(item, state) });
    this.audio = new AudioManager();
    this.ui = new UIManager(this);
    this.bookRenderer = null;
  }

  async init() {
    try {
      this.ui.setLoading('正在读取作品资料');
      const [bookRes, imageRes] = await Promise.all([fetch(CONFIG.paths.book, { cache: 'no-store' }), fetch(CONFIG.paths.manifest, { cache: 'no-store' })]);
      if (!bookRes.ok || !imageRes.ok) throw new Error('图片目录配置不存在，请检查网站部署文件。');
      this.book = await bookRes.json();
      const manifest = await imageRes.json();
      let images = this.normalizeManifest(manifest);

      // 静态网站无法直接列出 images/ 目录，因此在已有 manifest 的基础上
      // 自动探测后续数字页。这样用户只需要把 7.jpg、8.png、9.webp……
      // 放进 images/，无需手动修改 images.json，也无需转换图片格式。
      if (CONFIG.autoDiscovery?.enabled) {
        images = await this.autoDiscoverImages(images);
      }

      if (!images.length) throw new Error('没有找到有效的数字命名图片，请检查 images/ 与 images.json。');
      this.pageManager.setImages(images);
      this.pageManager.jumpToPage(this.loadSavedPage() || CONFIG.book.startPage);
      this.updateTitle();
      this.ui.buildDirectory(this.pageManager.images);
      this.ui.setLoading('正在预加载第一页');
      await this.imageManager.prepareAround(this.pageManager);
      this.createRenderer();
      this.ui.hideLoading();
      const saved = this.loadSavedPage();
      this.ui.showWelcome({ resumePage: saved && saved !== CONFIG.book.startPage ? saved : null });
      this.syncPageUI();
      this.bindGlobalKeys();
      document.getElementById('retry-btn').addEventListener('click', () => location.reload());
    } catch (error) {
      console.error(error);
      this.ui.showError(error?.message || '请检查网站部署文件。');
    }
  }

  async autoDiscoverImages(existingImages) {
    const known = new Map(existingImages.map(item => [Number(item.page), item]));
    const cfg = CONFIG.autoDiscovery || {};
    const maxPage = Math.max(1, Number(cfg.maxPage) || 1000);
    const tolerance = Math.max(1, Number(cfg.missingTolerance) || 8);
    const extensions = Array.isArray(cfg.extensions) && cfg.extensions.length
      ? cfg.extensions
      : ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp'];

    let start = 1;
    if (cfg.startAfterManifest && existingImages.length) {
      start = Math.max(...existingImages.map(item => Number(item.page))) + 1;
    }

    let consecutiveMissing = 0;
    for (let page = start; page <= maxPage; page++) {
      let found = null;
      for (const ext of extensions) {
        const src = `./images/${page}.${ext}`;
        if (await this.imageExists(src)) {
          found = { page, src };
          break;
        }
      }

      if (found) {
        known.set(page, found);
        consecutiveMissing = 0;
      } else {
        consecutiveMissing++;
        if (consecutiveMissing >= tolerance) break;
      }
    }

    return [...known.values()].sort((a, b) => Number(a.page) - Number(b.page));
  }

  async imageExists(src) {
    // 只检查响应头，不下载图片正文。这样自动发现页码时不会把几十张图片全部下载到缓存。
    try {
      const response = await fetch(src, {
        method: 'HEAD',
        cache: 'no-store',
        credentials: 'same-origin'
      });
      return response.ok;
    } catch (_) {
      return false;
    }
  }

  normalizeManifest(manifest) {
    const list = Array.isArray(manifest) ? manifest : manifest.images;
    if (!Array.isArray(list)) return [];
    return list.map(item => {
      if (typeof item === 'string') {
        const m = item.match(/^([0-9]+)\.[^.]+$/); return m ? { page: Number(m[1]), src: `./images/${item}` } : null;
      }
      return { page: Number(item.page), src: item.src || `./images/${item.page}.jpg` };
    }).filter(item => item && Number.isFinite(item.page)).sort((a,b)=>a.page-b.page);
  }

  createRenderer() {
    this.bookRenderer = new BookRenderer({
      canvas: document.getElementById('book-canvas'), pageManager: this.pageManager, imageManager: this.imageManager, audio: this.audio,
      onPageChange: immediate => { if (immediate !== false) this.saveState(); this.syncPageUI(); },
      onActivity: () => this.touchActivity()
    });
    this.bookRenderer.onOpenViewer = item => this.ui.openViewer(item);
    window.addEventListener('resize', () => this.bookRenderer?.resize());
    window.addEventListener('orientationchange', () => setTimeout(() => this.bookRenderer?.resize(), 80));
  }

  bindGlobalKeys() {
    window.addEventListener('keydown', e => {
      if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); this.flipNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); this.flipPrev(); }
      else if (e.key === 'Home') { e.preventDefault(); this.jumpToPage(this.pageManager.images[0]?.page); }
      else if (e.key === 'End') { e.preventDefault(); this.jumpToPage(this.pageManager.images[this.pageManager.total-1]?.page); }
      else if (e.key === 'Escape') { this.ui.closeDirectory(); this.ui.closeInfo(); this.ui.closeViewer(); if (isFullscreen()) exitFullscreen(); }
    });
  }

  async startReading() {
    this.ui.hideWelcome();
    await this.audio.playMusic();
    await enterFullscreen();
    this.bookRenderer?.requestRender();
    this.touchActivity();
  }

  async toggleFullscreen() { if (isFullscreen()) await exitFullscreen(); else await enterFullscreen(); }

  flipNext() { this.bookRenderer?.flipNext(); this.touchActivity(); }
  flipPrev() { this.bookRenderer?.flipPrev(); this.touchActivity(); }

  async jumpToPage(page) {
    if (!this.pageManager.jumpToPage(page)) return;
    await this.imageManager.prepareAround(this.pageManager);
    this.bookRenderer.textureCache.clear();
    this.bookRenderer.requestRender();
    this.syncPageUI(); this.saveState(); this.touchActivity();
  }

  syncPageUI() {
    const { left, right } = this.pageManager.getCurrentPageNumbers();
    this.ui.updatePages({ left, right, total: this.pageManager.total, progress: this.pageManager.getProgress() });
    this.ui.syncAudioUI();
  }

  updateTitle() {
    const title = this.book?.title || CONFIG.site.title;
    document.title = title;
    document.getElementById('brand-title').textContent = title;
  }

  onImageState(item, state) {
    if (state === 'error') this.bookRenderer?.invalidateTexture(item.page);
  }

  saveState() {
    if (!CONFIG.ui.persistState) return;
    localStorage.setItem(STORAGE_KEYS.page, String(this.pageManager.currentPageNumber || CONFIG.book.startPage));
  }

  loadSavedPage() { const n = Number(localStorage.getItem(STORAGE_KEYS.page)); return Number.isFinite(n) && n > 0 ? n : null; }
  touchActivity() { this.ui.touch(); }
}

const app = new ImageBookApp();
window.imageBookApp = app;
document.addEventListener('contextmenu', e => { if (CONFIG.protection.disableContextMenu) e.preventDefault(); });
document.addEventListener('dragstart', e => { if (CONFIG.protection.disableImageDrag || e.target instanceof HTMLImageElement) e.preventDefault(); });
document.addEventListener('selectstart', e => { if (CONFIG.protection.disableTextSelection) e.preventDefault(); });

document.getElementById('start-reading').addEventListener('click', () => app.startReading());
document.getElementById('welcome-screen').addEventListener('keydown', e => { if (e.key === 'Enter') app.startReading(); });

document.addEventListener('DOMContentLoaded', () => app.init());
