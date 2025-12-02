const contentTarget = document.getElementById("markdown-root");
const yearTarget = document.getElementById("year");
const langToggle = document.getElementById("lang-toggle");

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const DEFAULT_LANG =
  localStorage.getItem("site.lang") ||
  (navigator.language && navigator.language.startsWith("zh") ? "zh" : "en");

let currentLang = DEFAULT_LANG === "en" ? "en" : "zh";

const translations = {
  zh: {
    name: "李东晨",
    title: "李东晨 · 个人主页",
    tagline: "博士生 · 在线算法 · 优化",
    nav_about: "关于我",
    nav_education: "教育经历",
    nav_research: "研究方向",
    nav_publications: "论文",
    nav_automation: "自动化",
    nav_experience: "研究经历",
    nav_awards: "荣誉",
    status_open: "正在寻找合作与交流机会",
    footer_note: "Inspired by Schema.org 结构化数据理念"
  },
  en: {
    name: "Dongchen Li",
    title: "Dongchen Li · Personal Site",
    tagline: "Ph.D. Student · Online Algorithms · Optimization",
    nav_about: "About",
    nav_education: "Education",
    nav_research: "Research",
    nav_publications: "Publications",
    nav_automation: "Automation",
    nav_experience: "Research Experience",
    nav_awards: "Awards",
    status_open: "Open to collaboration and discussion",
    footer_note: "Inspired by the idea of Schema.org structured data"
  }
};

function applyTranslations() {
  const dict = translations[currentLang];
  document.documentElement.setAttribute("data-lang", currentLang);

  document.querySelectorAll("[data-i18n-key]").forEach((el) => {
    const key = el.getAttribute("data-i18n-key");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  if (langToggle) {
    langToggle.textContent =
      currentLang === "zh" ? "English (英文)" : "中文 (Chinese)";
  }
}

function extractLang(text, lang) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  let current = null;
  const result = [];

  for (const raw of lines) {
    const m = raw.match(/^<!--\s*lang:(\w+)\s*-->/i);
    if (m) {
      current = m[1].toLowerCase();
      continue;
    }
    if (current === null || current === lang) {
      // treat comments as empty
      if (!/^<!--.*-->$/.test(raw.trim())) {
        result.push(raw);
      }
    }
  }

  return result.join("\n");
}

function inlineFormat(text) {
  // links [text](url)
  let result = text.replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // bold **text**
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italics *text*
  result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  // inline code `code`
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");
  return result;
}

function renderMarkdown(text) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");

  let html = "";
  let inParagraph = false;
  let paragraphBuffer = [];

  let inList = false;
  let listType = null; // "ul" | "ol"
  let currentListItem = null;
  let currentListItemClass = "";

  let inBlockquote = false;
  let blockquoteBuffer = [];

  function flushParagraph() {
    if (inParagraph && paragraphBuffer.length) {
      html += `<p>${paragraphBuffer.join(" ")}</p>`;
      paragraphBuffer = [];
      inParagraph = false;
    }
  }

  function flushListItem() {
    if (currentListItem !== null) {
      html += `<li${currentListItemClass}>${currentListItem}</li>`;
      currentListItem = null;
      currentListItemClass = "";
    }
  }

  function closeList() {
    if (inList) {
      flushListItem();
      html += listType === "ol" ? "</ol>" : "</ul>";
      inList = false;
      listType = null;
    }
  }

  function flushBlockquote() {
    if (inBlockquote && blockquoteBuffer.length) {
      html += `<blockquote>${blockquoteBuffer.join("<br>")}</blockquote>`;
      blockquoteBuffer = [];
      inBlockquote = false;
    }
  }

  for (const raw of lines) {
    const line = raw.replace(/\s+$/g, "");
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushBlockquote();
      continue;
    }

    // raw HTML block (e.g., <img ...>)
    if (/^<[a-zA-Z!/]/.test(trimmed)) {
      flushParagraph();
      flushBlockquote();
      closeList();
      html += line;
      continue;
    }

    // heading
    let match = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (match) {
      flushParagraph();
      flushBlockquote();
      closeList();

      let level = match[1].length;
      let textContent = match[2];
      let idAttr = "";

      const idMatch = textContent.match(/\s*\{#([a-zA-Z0-9_\-]+)\}\s*$/);
      if (idMatch) {
        textContent = textContent.slice(0, idMatch.index).trim();
        idAttr = ` id="${idMatch[1]}"`;
      }

      html += `<h${level}${idAttr}>${inlineFormat(textContent)}</h${level}>`;
      continue;
    }

    // horizontal rule
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
      flushParagraph();
      flushBlockquote();
      closeList();
      html += "<hr />";
      continue;
    }

    // blockquote
    match = trimmed.match(/^>\s?(.*)$/);
    if (match) {
      flushParagraph();
      closeList();
      inBlockquote = true;
      blockquoteBuffer.push(inlineFormat(match[1]));
      continue;
    }

    const indentMatch = raw.match(/^[\t ]*/);
    const indent = indentMatch ? indentMatch[0].length : 0;

    // list item (unordered)
    match = trimmed.match(/^[-*+]\s+(.+)$/);
    if (match) {
      flushParagraph();
      flushBlockquote();

      if (!inList || listType !== "ul") {
        closeList();
        inList = true;
        listType = "ul";
        html += "<ul>";
      }

      flushListItem();
      currentListItemClass = indent >= 2 ? ' class="list-subitem"' : "";
      currentListItem = inlineFormat(match[1]);
      continue;
    }

    // list item (ordered)
    match = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (match) {
      flushParagraph();
      flushBlockquote();

      const index = parseInt(match[1], 10) || 1;

      if (!inList || listType !== "ol") {
        closeList();
        inList = true;
        listType = "ol";
        html += index === 1 ? "<ol>" : `<ol start="${index}">`;
      }

      flushListItem();
      currentListItemClass = indent >= 2 ? ' class="list-subitem"' : "";
      currentListItem = inlineFormat(match[2]);
      continue;
    }

    // list item continuation (indented line under a list)
    if (inList && /^ {2,}\S/.test(line)) {
      const cont = line.trim();
      currentListItem =
        (currentListItem || "") + "<br>" + inlineFormat(cont);
      continue;
    }

    // normal paragraph text
    flushBlockquote();
    closeList();
    inParagraph = true;
    paragraphBuffer.push(inlineFormat(trimmed));
  }

  flushParagraph();
  flushBlockquote();
  closeList();

  return html;
}

function getMarkdownPath() {
  const container = document.querySelector("[data-md]");
  const name = container ? container.getAttribute("data-md") : "home";
  return `./content/${name}.md`;
}

async function loadMarkdown() {
  if (!contentTarget) return;

  const path = getMarkdownPath();

  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error("无法找到 Markdown 文件");
    }
    const raw = await response.text();
    const filtered = extractLang(raw, currentLang);
    contentTarget.innerHTML = renderMarkdown(filtered);
    stylePublicationLinks();
  } catch (error) {
    contentTarget.innerHTML = `<p style="color:#f87171;">${error.message}</p>`;
  }
}

applyTranslations();
loadMarkdown();

if (langToggle) {
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    localStorage.setItem("site.lang", currentLang);
    applyTranslations();
    loadMarkdown();
  });
}

function stylePublicationLinks() {
  if (!contentTarget) return;
  const links = contentTarget.querySelectorAll("a");

  links.forEach((a) => {
    const text = (a.textContent || "").trim();
    const href = (a.getAttribute("href") || "").toLowerCase();

    if (/arxiv/.test(text.toLowerCase()) || /arxiv\.org/.test(href)) {
      a.classList.add("pub-link", "pub-link--arxiv");
      return;
    }

    if (/soda|wine|ijtcs|stoc|focs|nips|neurips|icml|colt/.test(text.toLowerCase())) {
      a.classList.add("pub-link", "pub-link--conf");
      return;
    }

    if (/tcs|iandc|information and computation|jcss|sicomp/.test(text.toLowerCase())) {
      a.classList.add("pub-link", "pub-link--journal");
      return;
    }
  });
}
