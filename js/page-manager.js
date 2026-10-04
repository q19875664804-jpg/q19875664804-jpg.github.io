export class PageManager {
  constructor(images = []) {
    this.setImages(images);
  }

  setImages(images) {
    this.images = Array.isArray(images) ? [...images].sort((a, b) => Number(a.page) - Number(b.page)) : [];
    this.indexByPage = new Map(this.images.map((item, index) => [Number(item.page), index]));
    this.spreadIndex = 0;
  }

  get total() { return this.images.length; }
  get currentLeftIndex() { return this.spreadIndex; }
  get currentRightIndex() { return this.spreadIndex + 1; }
  get currentLeft() { return this.images[this.currentLeftIndex] ?? null; }
  get currentRight() { return this.images[this.currentRightIndex] ?? null; }
  get currentPageNumber() { return this.currentLeft?.page ?? this.currentRight?.page ?? 0; }

  hasNext() { return this.spreadIndex + 2 < this.total; }
  hasPrev() { return this.spreadIndex > 0; }

  next() {
    if (!this.hasNext()) return false;
    this.spreadIndex += 2;
    return true;
  }

  prev() {
    if (!this.hasPrev()) return false;
    this.spreadIndex = Math.max(0, this.spreadIndex - 2);
    return true;
  }

  jumpToPage(pageNumber) {
    const page = Number(pageNumber);
    if (!Number.isFinite(page) || !this.indexByPage.has(page)) return false;
    const index = this.indexByPage.get(page);
    this.spreadIndex = Math.floor(index / 2) * 2;
    return true;
  }

  jumpToPageIndex(index) {
    const safe = Math.max(0, Math.min(this.total - 1, Number(index) || 0));
    this.spreadIndex = Math.floor(safe / 2) * 2;
  }

  getCurrentPageNumbers() {
    const left = this.currentLeft?.page ?? null;
    const right = this.currentRight?.page ?? null;
    return { left, right };
  }

  getProgress() {
    if (!this.total) return 0;
    return Math.min(1, (this.spreadIndex + 2) / this.total);
  }
}
