/** 全站导航 / 页脚注入 · Clay shell */
(function () {
  const page = document.body.dataset.page || "home";

  const links = [
    { id: "home", href: "index.html", label: "首页" },
    { id: "roster", href: "index.html#roster", label: "动作库" },
    { id: "game", href: "game.html", label: "街口连招" },
    { id: "preview", href: "preview.html?id=jack-attack", label: "逐帧预览" },
    {
      id: "packer",
      href: "https://spritepacker.app/tools/sprite-sheet-to-gif",
      label: "图集转 GIF",
      external: true,
      title: "打开 SpritePacker · Sprite Sheet → GIF",
    },
  ];

  function navHTML() {
    const items = links
      .map((l) => {
        let cls = "";
        if (page === "home" && l.id === "home") cls = "is-active";
        else if (page === "game" && l.id === "game") cls = "is-active";
        else if (page === "preview" && l.id === "preview") cls = "is-active";
        const ext = l.external
          ? ` target="_blank" rel="noopener noreferrer" class="nav-external${cls ? " " + cls : ""}"`
          : ` class="${cls}"`;
        const title = l.title ? ` title="${l.title}"` : "";
        return `<a href="${l.href}" data-nav="${l.id}"${ext}${title}>${l.label}${l.external ? '<span class="nav-ext" aria-hidden="true">↗</span>' : ""}</a>`;
      })
      .join("");

    return `
      <div class="site-nav__inner">
        <a class="site-nav__brand" href="index.html" aria-label="街口连招首页">
          <span class="site-nav__mark" aria-hidden="true"></span>
          <span class="site-nav__titles">
            <span class="site-nav__name">街口连招</span>
            <span class="site-nav__tag">Jack Street</span>
          </span>
        </a>
        <nav class="site-nav__links" aria-label="主导航">${items}</nav>
        <div class="site-nav__actions">
          <a class="btn btn-text nav-external" href="https://spritepacker.app/" target="_blank" rel="noopener noreferrer" title="SpritePacker">SpritePacker</a>
          <a class="btn btn-primary" href="game.html?id=jack-attack">开始游戏</a>
          <button type="button" class="site-nav__burger" aria-label="打开菜单" id="navBurger">
            <i></i><i></i><i></i>
          </button>
        </div>
      </div>
    `;
  }

  function footerHTML() {
    return `
      <div class="site-footer__inner">
        <div>
          <div class="site-footer__brand">街口连招</div>
          <div>像素动作库 × 一局连招预览 · 图集工具由 SpritePacker 提供</div>
        </div>
        <div class="site-footer__links">
          <a href="index.html">首页</a>
          <a href="index.html#roster">动作库</a>
          <a href="game.html">游戏</a>
          <a href="preview.html?id=jack-attack">预览</a>
          <a href="https://spritepacker.app/tools/sprite-sheet-to-gif" target="_blank" rel="noopener noreferrer">图集转 GIF ↗</a>
        </div>
      </div>
    `;
  }

  const navMount = document.getElementById("site-nav");
  const footerMount = document.getElementById("site-footer");
  if (navMount) {
    navMount.className = "site-nav";
    navMount.innerHTML = navHTML();
    const burger = document.getElementById("navBurger");
    burger?.addEventListener("click", () => {
      navMount.classList.toggle("is-open");
    });
  }
  if (footerMount) {
    footerMount.className = "site-footer";
    footerMount.innerHTML = footerHTML();
  }
})();
