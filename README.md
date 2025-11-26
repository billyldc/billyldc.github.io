# `test/` 目录使用说明

这个目录是一个**完全独立**的个人主页，不再依赖根目录的 Jekyll。你可以把整个 `test/` 文件夹单独拎出去部署，或者在本仓库里直接打开使用。

## 1. 怎么预览这个主页

- 本地直接双击：在文件管理器中打开 `test/index.html`，用浏览器打开即可（不依赖服务器）。
- 或者在仓库根目录开一个本地服务器：
  ```bash
  python -m http.server 8000
  ```
  然后浏览器访问 `http://localhost:8000/test/`。

## 2. 目录结构

- `index.html`：主页（About / Education / Research 等）。
- `publications.html`：论文列表页面。
- `styles.css`：两页公用的样式（配色、布局、响应式等）。
- `main.js`：
  - 根据 `<main data-md="...">` 加载 `content/` 里的 Markdown；
  - 支持简单 Markdown 解析（标题、列表、引用、粗体、斜体、链接等）；
  - 中英文切换逻辑（界面文案 + Markdown 内容）；
  - 根据链接文字自动给 ArXiv / 会议 / 期刊按钮上色。
- `content/home.md`：主页内容（中英文都在这个文件里）。
- `content/publications.md`：论文列表（中英文都在这个文件里）。
- `files/`：PDF 文件、讲义等。
- `images/profile.jpg`：头像。

## 3. 中英文内容怎么维护

`content/home.md` 和 `content/publications.md` 都采用**同一个文件里写中英文**的方式：

- 用注释分隔语言块：
  ```markdown
  <!--lang:zh-->
  # 中文内容……
  ...
  <!--lang:en-->
  # English content…
  ...
  ```
- JS 会根据当前语言只渲染对应语言块，公共部分（不在任何 `<!--lang:...-->` 里的行）会同时显示在两种语言下。
- 导航跳转依赖标题里的 `{#about}` 这些锚点，请保留中英文两侧相同的 id：
  ```markdown
  ## 教育经历 {#education}
  ## Education {#education}
  ```

> 建议：修改内容时，始终同时更新 `<!--lang:zh-->` 和 `<!--lang:en-->` 两块，避免中英文信息不一致。

## 4. 论文列表的维护方法

文件：`content/publications.md`

- 每条论文写成一个有序列表项，**所有条目前缀都写成 `1.`**，不要手动写 2、3、4：
  ```markdown
  1. **Paper Title**
     Authors: ...
     *Venue 2025*
     [arXiv](...) · [SODA25](./files/...)
  1. **Next Paper**
  1. **Another Paper**
  ```
  自定义解析器会把它们合并成一个 `<ol>`，浏览器自动显示为 1,2,3,...
  以后插入新论文，只需要插入一段新的 `1.` 段落即可，不用改已有数字。

- 颜色规则（在 `main.js` 的 `stylePublicationLinks()` 中定义）：
  - 链接文字 / URL 包含 `arxiv` → ArXiv 粉色按钮；
  - 链接文字包含 `soda`, `wine`, `ijtcs`, `stoc`, `focs`, `nips`, `neurips`, `icml`, `colt` → 会议蓝色按钮；
  - 链接文字包含 `tcs`, `iandc`, `information and computation`, `jcss`, `sicomp` → 期刊绿色按钮。

只要在 Markdown 里把链接文字写成 `SODA25` / `IJTCS24` / `TCS25` / `IandC25` / `arXiv` 等，颜色会自动匹配，无需手动加 class。

## 5. PDF 和头像的更新

- **新增或更新 PDF：**
  - 把文件放到 `test/files/` 目录；
  - 在 Markdown 用相对路径链接，例如：
    ```markdown
    [TCS25](./files/TCS25_On_the_Optimal_Mixing_Problem.pdf)
    ```
- **更新头像：**
  - 替换 `images/profile.jpg` 即可，保持文件名不变；
  - 如果改了文件名，需要同时修改 `index.html`、`publications.html` 中头像的 `<img src="...">`。

## 6. 新增页面（可选）

如果以后想在 `test/` 下面再加一个新页面，例如 `teaching`：

1. 复制 `publications.html` 为 `teaching.html`；
2. 把里面 `<main data-md="publications">` 改成 `<main data-md="teaching">`；
3. 在 `content/` 下新建 `teaching.md`，按 `home.md` 的格式写 `<!--lang:zh-->` 和 `<!--lang:en-->` 两块内容；
4. 在导航栏（`index.html` / `publications.html`）里加一个链接到 `./teaching.html`；
5. 如果需要多语言导航文字，在 `main.js` 的 `translations.zh` / `translations.en` 中增加对应的 `nav_xxx` 文案，并在 HTML 上加 `data-i18n-key="nav_xxx"`。

这样就可以继续扩展，而不破坏现在的结构。***
