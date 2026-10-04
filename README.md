# ImageBook · 沉浸式图片书

这是一个**纯静态、只读、沉浸式**图片书阅读器。核心使用原生 HTML5 + CSS3 + JavaScript + Canvas 2D + Web Audio API，不依赖 React、Vue、jQuery、Three.js 或任何 CDN。

## 1. 目录结构

```text
ImageBook/
├── index.html
├── manifest.webmanifest
├── README.md
├── css/
│   ├── main.css
│   ├── book.css
│   ├── ui.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── book.js
│   ├── page-manager.js
│   ├── image-manager.js
│   ├── audio-manager.js
│   ├── ui-manager.js
│   ├── fullscreen.js
│   └── config.js
├── images/
├── music/
│   └── background.mp3
├── assets/
│   └── icons/
├── data/
│   ├── book.json
│   └── images.json
└── tools/
    └── generate-manifest.js
```

## 2. 添加图片

把图片放入 `images/`，文件名必须只有数字：

```text
images/101.jpg
images/102.jpg
images/103.webp
images/104.png
```

支持 `.jpg .jpeg .png .webp .avif`。

非法文件名例如 `page1.jpg`、`abc.jpg`、`第一张.jpg` 会被 manifest 工具忽略并给出警告。

## 3. 生成图片清单

在项目根目录运行：

```bash
node tools/generate-manifest.js
```

脚本会扫描 `images/`，验证数字文件名，使用数字大小排序，并生成：

```text
data/images.json
```

删除或增加图片后重新运行一次即可。**页码永远来自文件名，不会因为删除中间文件而自动重编号。**

## 4. 本地测试

直接双击 `index.html` 时，某些浏览器会禁止 `fetch()` 读取本地 JSON。建议启动一个本地静态服务器：

```bash
python -m http.server 8080
```

然后访问 `http://localhost:8080/`。

也可以使用 VS Code Live Server、WebStorm 静态预览或其他任意静态服务器。

## 5. 静态部署

可以直接部署到：

- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel Static
- 普通 Nginx / Apache 静态目录

不要改成绝对路径。项目统一使用 `./images/...`、`./data/...`、`./music/...` 等相对路径，因此也兼容 `https://username.github.io/ImageBook/` 这样的子目录部署。

## 6. 更换背景音乐

网站只允许程序使用一个预先指定的音乐文件，访问者没有音乐上传、选择、替换功能。

管理员替换：

```text
music/background.mp3
```

如果文件名不同，请同步修改：

```text
js/config.js
```

中的：

```js
music: {
  src: './music/background.mp3'
}
```

请只使用你有权部署并在线播放的音乐。第三方平台的“免费试听”并不等于允许直接嵌入或再分发。

## 7. 修改网站标题和作品信息

编辑：

```text
data/book.json
```

例如：

```json
{
  "title": "我的私人画册",
  "author": "作者名称",
  "subtitle": "Immersive Image Book",
  "description": "作品简介"
}
```

## 8. 阅读器功能

- 双页实体书式 Canvas 翻页
- 页面卷曲、页面背面、阴影、书脊、页面厚度
- 鼠标拖动 / 点击翻页
- 手机触摸拖动 / 点击翻页
- `←` 上一页、`→` / `Space` 下一页
- `Home` 第一页、`End` 最后一页、`Esc` 退出全屏/弹窗
- 双击页面或手机快速双击进入大图查看
- 滚轮缩放、拖动查看、双击/按钮恢复
- 目录缩略图跳转
- 背景音乐播放 / 暂停 / 静音 / 音量
- 纸张音效独立控制
- 2.5 秒无操作自动隐藏 HUD
- 自动保存上次阅读页、音乐静音、音量和纸张音效状态
- 邻近页面缓存与预加载（当前页约 ±4）
- 缺失图片单页报错，不让整本画册崩溃

## 9. 只读与“防下载”边界

前端 UI 没有图片上传、替换、删除、添加、音乐选择和后台管理入口；同时禁用普通右键、图片拖拽、文本选择和长按保存相关默认行为。

但是图片既然需要发送给浏览器，就不能保证技术用户无法通过开发者工具、网络请求或缓存获取公开资源。因此本项目的目标是“**Viewer Only 的普通访问体验**”，不是 DRM 或绝对防盗。

## 10. 更新图片缓存

本项目默认不强制加入 Service Worker，以避免管理员替换图片后被旧缓存卡住。这样静态部署更新图片后更直接、也更容易排查。

## 11. 浏览器兼容目标

重点支持：

- Android Chrome / Edge / WebView
- iPhone / iPad Safari
- Chrome / Edge / Firefox 桌面版

竖屏不会阻止阅读，仅会显示“建议横屏”的引导层。浏览器支持时，点击“开始阅读”后会尝试锁定横屏；失败会自动降级，不影响页面运行。

## 12. 维护原则

以后新增图片时只操作：

```text
images/
```

再执行：

```bash
node tools/generate-manifest.js
```

不需要修改 `app.js`、`book.js` 或翻页代码。


## 自动识别新增图片

现在网站运行时会自动探测 `images/` 中后续的数字页码图片，不要求重新生成 `data/images.json`。

例如已有 `1.jpg`～`6.jpg` 后，直接加入：

- `7.jpg`
- `8.png`
- `9.webp`
- `10.jpeg`

刷新网站即可自动加入图片书。图片不需要转换格式。文件名必须是纯数字页码，且建议页码连续。支持 JPG、JPEG、PNG、WebP、AVIF、GIF、BMP。

如果图片数量很多，可在 `js/config.js` 的 `autoDiscovery.maxPage` 中提高最大探测页码。


## 图片加载策略（已优化）

- 网站启动时不再逐张下载全部图片。
- 当前双页只加载当前需要显示的图片。
- 翻页动画需要哪一页，就在那一刻加载哪一页。
- 自动发现新增数字页时使用 HTTP HEAD 检查文件是否存在，不下载图片正文。
- 目录缩略图采用 IntersectionObserver 懒加载，打开目录并滚动到哪里才加载哪里的缩略图。
- 图片格式无需转换，继续支持 jpg、jpeg、png、webp、avif、gif、bmp。

注意：如果你的静态服务器完全不支持 HEAD 请求，自动发现新增页面可能无法工作。此时运行 `tools/generate-manifest.js` 更新 `data/images.json` 即可；网页浏览本身仍然采用按页懒加载。
