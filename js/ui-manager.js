import { CONFIG } from './config.js';

export class UIManager {
  constructor(app) {
    this.app = app;
    this.hud = document.getElementById('hud');
    this.hudTimer = null;
    this.directory = document.getElementById('directory-drawer');
    this.backdrop = document.getElementById('drawer-backdrop');
    this.musicPanel = document.getElementById('music-panel');
    this.infoModal = document.getElementById('info-modal');
    this.paperPanel = document.getElementById('audio-panel');
    this.viewerModal = document.getElementById('viewer-modal');
    this.viewerImage = document.getElementById('viewer-image');
    this.viewerViewport = document.getElementById('viewer-viewport');
    this.viewerScale = 1;
    this.viewerX = 0;
    this.viewerY = 0;
    this.viewerLastTap = 0;
    this.bind();
  }

  bind() {
    document.getElementById('prev-btn').addEventListener('click', () => this.app.flipPrev());
    document.getElementById('next-btn').addEventListener('click', () => this.app.flipNext());
    document.getElementById('directory-btn').addEventListener('click', () => this.toggleDirectory());
    document.getElementById('drawer-close').addEventListener('click', () => this.closeDirectory());
    this.backdrop.addEventListener('click', () => this.closeDirectory());
    document.getElementById('info-btn').addEventListener('click', () => this.openInfo());
    document.getElementById('info-close').addEventListener('click', () => this.closeInfo());
    document.getElementById('welcome-info').addEventListener('click', () => this.openInfo());
    document.getElementById('music-btn').addEventListener('click', () => this.toggleMusicPanel());
    document.getElementById('paper-btn').addEventListener('click', () => this.togglePaperPanel());
    document.getElementById('music-play').addEventListener('click', async () => {
      const playing = await this.app.audio.toggleMusic();
      document.getElementById('music-play').textContent = playing ? '暂停' : '播放';
      this.touch();
    });
    document.getElementById('music-mute').addEventListener('click', () => {
      const muted = this.app.audio.toggleMute();
      document.getElementById('music-mute').textContent = muted ? '取消静音' : '静音';
      this.touch();
    });
    document.getElementById('music-volume').addEventListener('input', e => { this.app.audio.setVolume(e.target.value); this.touch(); });
    document.getElementById('paper-volume').addEventListener('input', e => { this.app.audio.setPaperVolume(e.target.value); this.touch(); });
    document.getElementById('paper-toggle').addEventListener('click', () => {
      this.app.audio.setPaperEnabled(!this.app.audio.paperEnabled);
      this.syncAudioUI();
    });
    document.getElementById('fullscreen-btn').addEventListener('click', () => this.app.toggleFullscreen());
    document.getElementById('brand-button').addEventListener('click', () => this.openInfo());
    document.getElementById('viewer-close').addEventListener('click', () => this.closeViewer());
    document.getElementById('viewer-reset').addEventListener('click', () => this.resetViewer());
    document.getElementById('viewer-viewport').addEventListener('wheel', e => { e.preventDefault(); this.zoomViewer(e.deltaY < 0 ? 1.12 : 0.89); }, { passive: false });

    let drag = false, sx = 0, sy = 0;
    this.viewerViewport.addEventListener('pointerdown', e => { drag = true; sx = e.clientX; sy = e.clientY; this.viewerViewport.setPointerCapture(e.pointerId); });
    this.viewerViewport.addEventListener('pointermove', e => {
      if (!drag || this.viewerScale <= 1) return;
      this.viewerX += e.clientX - sx; this.viewerY += e.clientY - sy; sx = e.clientX; sy = e.clientY; this.updateViewerTransform();
    });
    this.viewerViewport.addEventListener('pointerup', () => { drag = false; });
    this.viewerViewport.addEventListener('pointercancel', () => { drag = false; });

    const start = (e) => { this.app.touchActivity(); this.touch(); };
    window.addEventListener('mousemove', start, { passive: true });
    window.addEventListener('pointerdown', start, { passive: true });
    window.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('keydown', () => this.touch(), { passive: true });
    this.syncAudioUI();
  }

  touch() {
    if (!CONFIG.ui.autoHideHUD) return;
    this.hud.classList.add('hud-visible');
    clearTimeout(this.hudTimer);
    this.hudTimer = setTimeout(() => this.hud.classList.remove('hud-visible'), CONFIG.ui.autoHideDelay);
  }

  setLoading(text) { document.getElementById('loading-text').textContent = text; }

  showWelcome({ resumePage = null } = {}) {
    const title = this.app.book?.title || CONFIG.site.title;
    const subtitle = this.app.book?.subtitle || CONFIG.site.subtitle;
    document.getElementById('welcome-title').textContent = title;
    document.getElementById('welcome-subtitle').textContent = subtitle;
    const meta = document.getElementById('welcome-meta');
    meta.textContent = `${this.app.pageManager.total} 页 · ${this.app.book?.author || '私人收藏'}`;
    const hint = document.getElementById('resume-hint');
    if (resumePage) { hint.hidden = false; hint.textContent = `上次阅读到第 ${resumePage} 页，点击“开始阅读”将从这里继续。`; }
    else hint.hidden = true;
    document.getElementById('welcome-screen').hidden = false;
  }

  hideLoading() { const el=document.getElementById('loading-screen'); el.classList.remove('visible'); setTimeout(()=>{el.hidden=true;},480); }
  hideWelcome() { document.getElementById('welcome-screen').hidden = true; }

  showError(message) { document.getElementById('error-text').textContent = message; document.getElementById('error-screen').hidden = false; document.getElementById('loading-screen').hidden = true; }

  updatePages({ left, right, total, progress }) {
    const counter = document.getElementById('page-counter');
    const label = right ? `第 ${left}–${right} 页 / ${total} 页` : `第 ${left} 页 / ${total} 页`;
    counter.textContent = label;
    document.getElementById('progress-fill').style.width = `${Math.min(100, progress * 100)}%`;
    document.getElementById('prev-btn').disabled = !this.app.pageManager.hasPrev();
    document.getElementById('next-btn').disabled = !this.app.pageManager.hasNext();
  }

  buildDirectory(images) {
    const grid = document.getElementById('thumbnail-grid');
    grid.innerHTML = '';
    for (const item of images) {
      const button = document.createElement('button');
      button.className = 'thumb-card';
      button.type = 'button';
      button.dataset.page = item.page;
      const img = document.createElement('img');
      img.alt = `第 ${item.page} 页`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      img.dataset.src = item.src;
      const label = document.createElement('span'); label.textContent = `${item.page}`;
      button.append(img, label);
      button.addEventListener('click', () => { this.app.jumpToPage(item.page); this.closeDirectory(); });
      grid.appendChild(button);
    }

    // 只有缩略图真正进入目录视口时才开始请求图片。
    const lazyLoad = img => {
      if (!img.dataset.src || img.src) return;
      img.src = img.dataset.src;
      delete img.dataset.src;
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          lazyLoad(entry.target);
          observer.unobserve(entry.target);
        }
      }, { root: document.getElementById('directory'), rootMargin: '300px' });
      grid.querySelectorAll('img').forEach(img => observer.observe(img));
    } else if (this.directory.classList.contains('open')) {
      grid.querySelectorAll('img').forEach(lazyLoad);
    }
  }

  toggleDirectory() { if (this.directory.classList.contains('open')) this.closeDirectory(); else this.openDirectory(); }
  openDirectory() {
    this.directory.classList.add('open');
    this.directory.setAttribute('aria-hidden', 'false');
    this.backdrop.hidden = false;
    requestAnimationFrame(() => {
      this.backdrop.classList.add('show');
      document.querySelectorAll('#thumbnail-grid img[data-src]').forEach(img => {
        const r = img.getBoundingClientRect();
        if (r.top < window.innerHeight + 300 && r.bottom > -300) {
          img.src = img.dataset.src;
          delete img.dataset.src;
        }
      });
    });
    this.touch();
  }
  closeDirectory() { this.directory.classList.remove('open'); this.directory.setAttribute('aria-hidden', 'true'); this.backdrop.classList.remove('show'); setTimeout(() => { this.backdrop.hidden = true; }, 220); }

  toggleMusicPanel() {
    const open = !this.musicPanel.hidden;
    this.musicPanel.hidden = open;
    this.paperPanel.hidden = true;
    this.touch();
  }

  togglePaperPanel() {
    const open = !this.paperPanel.hidden;
    this.paperPanel.hidden = open;
    this.musicPanel.hidden = true;
    this.touch();
  }

  syncAudioUI() {
    document.getElementById('music-volume').value = String(this.app.audio.volume);
    document.getElementById('paper-volume').value = String(this.app.audio.paperVolume);
    document.getElementById('music-mute').textContent = this.app.audio.muted ? '取消静音' : '静音';
    document.getElementById('paper-toggle').textContent = this.app.audio.paperEnabled ? '关闭' : '开启';
    document.getElementById('music-title').textContent = CONFIG.music.title;
  }

  openInfo() {
    const body = document.getElementById('info-body');
    const b = this.app.book || {};
    body.innerHTML = `<p>${escapeHTML(b.description || '一部视觉作品集。')}</p><dl><div><dt>作者</dt><dd>${escapeHTML(b.author || '未署名')}</dd></div><div><dt>页数</dt><dd>${this.app.pageManager.total}</dd></div><div><dt>模式</dt><dd>双页实体书</dd></div></dl>`;
    document.getElementById('info-title').textContent = b.title || CONFIG.site.title;
    this.infoModal.hidden = false;
  }

  closeInfo() { this.infoModal.hidden = true; }

  openViewer(item) {
    if (!item) return;
    this.viewerImage.src = item.src;
    this.viewerImage.alt = `第 ${item.page} 页`;
    document.getElementById('viewer-page').textContent = `第 ${item.page} 页`;
    this.viewerScale = 1; this.viewerX = 0; this.viewerY = 0; this.updateViewerTransform();
    this.viewerModal.hidden = false;
  }

  closeViewer() { this.viewerModal.hidden = true; }
  resetViewer() { this.viewerScale = 1; this.viewerX = 0; this.viewerY = 0; this.updateViewerTransform(); }
  zoomViewer(factor) { this.viewerScale = Math.min(4, Math.max(1, this.viewerScale * factor)); if (this.viewerScale === 1) { this.viewerX = 0; this.viewerY = 0; } this.updateViewerTransform(); }
  updateViewerTransform() { this.viewerImage.style.transform = `translate3d(${this.viewerX}px,${this.viewerY}px,0) scale(${this.viewerScale})`; }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
