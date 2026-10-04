import { CONFIG } from './config.js';

export class BookRenderer {
  constructor({ canvas, pageManager, imageManager, audio, onPageChange, onActivity }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.pageManager = pageManager;
    this.imageManager = imageManager;
    this.audio = audio;
    this.onPageChange = onPageChange;
    this.onActivity = onActivity;
    this.bookW = 0; this.bookH = 0; this.pageW = 0; this.dpr = 1;
    this.isDragging = false; this.flipDirection = 0; this.progress = 0;
    this.dragStartX = 0; this.gestureStartX = 0; this.lastX = 0; this.gestureMoved = false;
    this.isAnimating = false;
    this.textureCache = new Map();
    this.lastTap = 0;
    this.resize();
    this.bindEvents();
    this.requestRender();
  }

  resize() {
    const stage = document.getElementById('stage');
    const maxW = stage.clientWidth * 0.94;
    const maxH = stage.clientHeight * 0.88;
    const aspect = 1.44;
    let w = maxW, h = w / aspect;
    if (h > maxH) { h = maxH; w = h * aspect; }
    this.bookW = Math.max(260, Math.floor(w));
    this.bookH = Math.max(180, Math.floor(h));
    this.pageW = Math.floor(this.bookW / 2);
    this.dpr = Math.min(window.devicePixelRatio || 1, CONFIG.book.maxDpr);
    this.canvas.width = Math.floor(this.bookW * this.dpr);
    this.canvas.height = Math.floor(this.bookH * this.dpr);
    this.canvas.style.width = `${this.bookW}px`;
    this.canvas.style.height = `${this.bookH}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.requestRender();
  }

  requestRender() { if (!this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; this.render(); }); }

  bindEvents() {
    const cvs = this.canvas;
    const down = (x, y) => {
      this.onActivity?.();
      if (this.isAnimating) return;
      const rect = cvs.getBoundingClientRect(); const px = x - rect.left;
      this.dragStartX = this.lastX = px;
      this.gestureStartX = px;
      this.gestureMoved = false;
      this.isDragging = true;
      this.flipDirection = px >= this.pageW ? 1 : -1;
      if (this.flipDirection === 1 && !this.pageManager.hasNext()) { this.isDragging = false; return; }
      if (this.flipDirection === -1 && !this.pageManager.hasPrev()) { this.isDragging = false; return; }
      this.progress = 0.001;
      this.audio.playRustle(0.4);
      this.requestRender();
    };
    const move = (x) => {
      if (!this.isDragging) return;
      const rect = cvs.getBoundingClientRect(); const px = x - rect.left;
      this.lastX = px;
      if (Math.abs(px - this.gestureStartX) > 8) this.gestureMoved = true;
      const p = this.flipDirection === 1 ? (this.bookW - px) / this.pageW : px / this.pageW;
      this.progress = Math.max(0.001, Math.min(0.999, p));
      if (Math.abs(px - this.dragStartX) > 14) this.audio.playRustle(Math.min(1, Math.abs(px - this.dragStartX) / 70));
      this.dragStartX = px;
      this.requestRender();
    };
    const up = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (!this.gestureMoved) { this.animateTo(1, () => this.commitFlip()); return; }
      if (this.progress > 0.38) this.animateTo(1, () => this.commitFlip());
      else this.animateTo(0, () => { this.flipDirection = 0; this.progress = 0; this.requestRender(); });
    };

    cvs.addEventListener('pointerdown', e => { cvs.setPointerCapture?.(e.pointerId); down(e.clientX, e.clientY); });
    cvs.addEventListener('pointermove', e => move(e.clientX));
    cvs.addEventListener('pointerup', up);
    cvs.addEventListener('pointercancel', up);
    cvs.addEventListener('dblclick', e => {
      const rect = cvs.getBoundingClientRect(); const x = e.clientX - rect.left;
      this.openViewerAt(x);
    });
    cvs.addEventListener('touchend', e => {
      const now = performance.now();
      if (now - this.lastTap < 280 && !this.isDragging) {
        const t = e.changedTouches[0]; if (t) { const rect = cvs.getBoundingClientRect(); this.openViewerAt(t.clientX - rect.left); }
      }
      this.lastTap = now;
    }, { passive: true });
  }

  openViewerAt(x) {
    const item = x < this.pageW ? this.pageManager.currentLeft : this.pageManager.currentRight;
    if (item) this.onOpenViewer?.(item);
  }

  animateTo(target, onComplete) {
    this.isAnimating = true;
    const start = this.progress, startAt = performance.now(), duration = 300;
    const step = now => {
      const t = Math.min(1, (now - startAt) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      this.progress = start + (target - start) * ease;
      this.render();
      if (t < 1) requestAnimationFrame(step);
      else { this.progress = target; this.isAnimating = false; onComplete?.(); }
    };
    requestAnimationFrame(step);
  }

  flipNext() {
    if (this.isAnimating || !this.pageManager.hasNext()) return;
    this.flipDirection = 1; this.progress = 0.01; this.audio.playRustle(0.5);
    this.animateTo(1, () => this.commitFlip());
  }

  flipPrev() {
    if (this.isAnimating || !this.pageManager.hasPrev()) return;
    this.flipDirection = -1; this.progress = 0.01; this.audio.playRustle(0.5);
    this.animateTo(1, () => this.commitFlip());
  }

  commitFlip() {
    const changed = this.flipDirection === 1 ? this.pageManager.next() : this.pageManager.prev();
    this.flipDirection = 0; this.progress = 0; this.audio.playLand();
    if (changed) { this.onPageChange?.(); this.imageManager.prepareAround(this.pageManager); }
    this.requestRender();
  }

  async getPageTexture(item) {
    if (!item) return this.makeBlankTexture();
    const page = Number(item.page);
    if (this.textureCache.has(page)) return this.textureCache.get(page);
    const texture = document.createElement('canvas');
    texture.width = CONFIG.book.textureWidth; texture.height = CONFIG.book.textureHeight;
    this.drawPageBase(texture.getContext('2d'), item);
    this.textureCache.set(page, texture);
    const img = await this.imageManager.getImage(item);
    if (img) this.drawImageIntoTexture(texture.getContext('2d'), img);
    else this.drawErrorIntoTexture(texture.getContext('2d'), item);
    return texture;
  }

  invalidateTexture(page) { this.textureCache.delete(Number(page)); }

  drawPageBase(ctx, item) {
    const W = CONFIG.book.textureWidth, H = CONFIG.book.textureHeight;
    ctx.fillStyle = '#f8f3e8'; ctx.fillRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, W, H); grad.addColorStop(0, 'rgba(255,255,255,.42)'); grad.addColorStop(1, 'rgba(205,191,169,.12)'); ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle = 'rgba(146,119,86,.38)'; ctx.lineWidth = 2; ctx.strokeRect(36,36,W-72,H-72);
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1; ctx.strokeRect(44,44,W-88,H-88);
    ctx.fillStyle = '#d2c4b0'; ctx.font = '500 15px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(`${item.page}`, W/2, H-42);
  }

  drawImageIntoTexture(ctx, img) {
    const W = CONFIG.book.textureWidth, H = CONFIG.book.textureHeight;
    const marginX = 64, y = 78, targetW = W - marginX*2, targetH = H - 250;
    ctx.save(); ctx.shadowColor = 'rgba(37,27,18,.28)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 7; ctx.fillStyle = '#fff'; ctx.fillRect(marginX,y,targetW,targetH); ctx.restore();
    const ratio = img.naturalWidth / img.naturalHeight; const targetRatio = targetW / targetH;
    let sw, sh, sx, sy;
    if (ratio > targetRatio) { sh = img.naturalHeight; sw = sh*targetRatio; sx = (img.naturalWidth-sw)/2; sy=0; }
    else { sw = img.naturalWidth; sh = sw/targetRatio; sx=0; sy=(img.naturalHeight-sh)/2; }
    ctx.save(); ctx.beginPath(); ctx.rect(marginX+8,y+8,targetW-16,targetH-16); ctx.clip(); ctx.drawImage(img,sx,sy,sw,sh,marginX+8,y+8,targetW-16,targetH-16); ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.20)'; ctx.fillRect(marginX+8,y+8,targetW-16,40);
  }

  drawErrorIntoTexture(ctx, item) {
    const W = CONFIG.book.textureWidth, H = CONFIG.book.textureHeight;
    ctx.textAlign='center'; ctx.fillStyle='#6d6257'; ctx.font='600 28px system-ui,sans-serif'; ctx.fillText(`第 ${item.page} 页`,W/2,H/2-18); ctx.font='16px system-ui,sans-serif'; ctx.fillStyle='#9b8f82'; ctx.fillText('图片加载失败',W/2,H/2+20);
  }

  makeBlankTexture() {
    const c = document.createElement('canvas'); c.width = CONFIG.book.textureWidth; c.height = CONFIG.book.textureHeight; const ctx=c.getContext('2d'); ctx.fillStyle='#efe9dc'; ctx.fillRect(0,0,c.width,c.height); return c;
  }

  async render() {
    const ctx = this.ctx, W = this.pageW, H = this.bookH;
    ctx.clearRect(0,0,this.bookW,this.bookH);
    const left = await this.getPageTexture(this.pageManager.currentLeft);
    const right = await this.getPageTexture(this.pageManager.currentRight);
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,W,H); ctx.clip(); ctx.drawImage(left,0,0,left.width,left.height,0,0,W,H); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(W,0,W,H); ctx.clip();
    if (this.flipDirection===1 && this.progress>0.001) {
      const turningBack = await this.getPageTexture(this.pageManager.images[this.pageManager.currentLeftIndex+3]);
      ctx.drawImage(turningBack,0,0,right.width,right.height,W,0,W,H);
    } else {
      ctx.drawImage(right,0,0,right.width,right.height,W,0,W,H);
    }
    ctx.restore();
    if (this.progress>0.001) {
      const front = this.flipDirection===1 ? right : left;
      const backItem = this.flipDirection===1
        ? this.pageManager.images[this.pageManager.currentLeftIndex+2]
        : this.pageManager.images[Math.max(0,this.pageManager.currentLeftIndex-1)];
      const back = await this.getPageTexture(backItem);
      this.renderCurl(front, back, this.flipDirection);
    }
    this.onPageChange?.(false);
  }

  renderCurl(front, back, dir) {
    const ctx=this.ctx,W=this.pageW,H=this.bookH,p=this.progress,N=72; const R=Math.max(16,W*0.16*Math.sin(Math.PI*p)+12); const curlPos=1-p;
    const shadowX=dir===1?W+curlPos*W:curlPos*W; const grad=ctx.createRadialGradient(shadowX,H/2,R*.2,shadowX,H/2,R*2.5); grad.addColorStop(0,'rgba(0,0,0,.42)');grad.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,this.bookW,H);
    for(let i=0;i<N;i++){
      const u0=i/N,u1=(i+1)/N;const a=this.evalCylinder(u0,curlPos,R,W,dir),b=this.evalCylinder(u1,curlPos,R,W,dir); const sw=Math.abs(b.x-a.x); if(sw<0.01)continue;
      ctx.save();ctx.beginPath();ctx.rect(Math.min(a.x,b.x),0,sw+.6,H);ctx.clip();const tx=u0*front.width,tw=(u1-u0)*front.width;
      if(a.isBack){ctx.translate(a.x,0);ctx.scale(-1,1);ctx.drawImage(back,(1-u1)*back.width,0,tw,back.height,0,0,sw+.6,H);ctx.fillStyle=`rgba(0,0,0,${.10+a.shadow*.24})`;ctx.fillRect(0,0,sw+.6,H);}
      else{ctx.drawImage(front,tx,0,tw,front.height,a.x,0,sw+.6,H);if(a.highlight>0){ctx.fillStyle=`rgba(255,255,255,${a.highlight*.28})`;ctx.fillRect(a.x,0,sw+.6,H);}if(a.shadow>0){ctx.fillStyle=`rgba(0,0,0,${a.shadow*.32})`;ctx.fillRect(a.x,0,sw+.6,H);}}
      ctx.restore();
    }
  }

  evalCylinder(u,curlPos,R,W,dir){const spineX=W,d=dir===1?(u-curlPos):((1-u)-curlPos);let finalX=0,isBack=false,shadow=0,highlight=0;if(d<=0){finalX=dir===1?spineX+u*W:u*W;shadow=Math.max(0,1-Math.abs(d)*5)*.18;}else{const arc=d*W,circ=Math.PI*R;if(arc<circ){const t=arc/R,s=Math.sin(t),c=Math.cos(t);finalX=dir===1?spineX+curlPos*W+R*s:spineX-curlPos*W-R*s;highlight=s*.6;shadow=(1-s)*.2;if(t>Math.PI/2)isBack=true;}else{const over=arc-circ;finalX=dir===1?spineX+curlPos*W-over:spineX-curlPos*W+over;isBack=true;shadow=.15;}}return{x:finalX,isBack,shadow,highlight};}
}
