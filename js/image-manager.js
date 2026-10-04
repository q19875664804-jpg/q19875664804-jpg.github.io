export class ImageManager {
  constructor({ prefetchSpreads = 0, onStateChange } = {}) {
    this.prefetchSpreads = Math.max(0, Number(prefetchSpreads) || 0);
    this.cache = new Map();
    this.onStateChange = onStateChange;
  }

  getCached(page) { return this.cache.get(Number(page))?.image ?? null; }

  load(item) {
    if (!item) return Promise.resolve(null);
    const page = Number(item.page);
    const existing = this.cache.get(page);
    if (existing?.status === 'loaded') return Promise.resolve(existing.image);
    if (existing?.promise) return existing.promise;

    const record = { status: 'loading', image: null, promise: null, lastUsed: performance.now() };
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.draggable = false;
    record.promise = new Promise((resolve) => {
      img.onload = async () => {
        try { await img.decode?.(); } catch (_) {}
        record.status = 'loaded';
        record.image = img;
        record.lastUsed = performance.now();
        record.promise = null;
        this.onStateChange?.(item, 'loaded');
        resolve(img);
      };
      img.onerror = () => {
        record.status = 'error';
        record.image = null;
        record.promise = null;
        this.onStateChange?.(item, 'error');
        resolve(null);
      };
      img.src = item.src;
    });
    this.cache.set(page, record);
    return record.promise;
  }

  async preload(items = []) {
    await Promise.allSettled(items.filter(Boolean).map(item => this.load(item)));
  }

  keepPages(pages = []) {
    const keep = new Set(pages.filter(Boolean).map(p => Number(p.page)));
    for (const [page, record] of this.cache.entries()) {
      if (!keep.has(page) && record.status !== 'loading') this.cache.delete(page);
    }
  }

  async prepareAround(pageManager) {
    const current = pageManager.currentLeftIndex;
    const spreadSize = 2;
    const start = Math.max(0, current - this.prefetchSpreads * spreadSize);
    const end = Math.min(pageManager.total - 1, current + spreadSize - 1 + this.prefetchSpreads * spreadSize);
    const items = pageManager.images.slice(start, end + 1);
    await this.preload(items);
    this.keepPages(items);
  }

  async getImage(item) {
    if (!item) return null;
    const img = this.getCached(item.page);
    if (img) {
      const record = this.cache.get(Number(item.page));
      if (record) record.lastUsed = performance.now();
      return img;
    }
    return this.load(item);
  }
}
