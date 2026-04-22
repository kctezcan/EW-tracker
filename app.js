const data = window.EISBACH_DATA;

if (!data) {
  const app = document.querySelector("#app");
  app.innerHTML = "<p>Could not load Eisbach tracker data.</p>";
} else {
  const app = document.querySelector("#app");
  const categories = ["all", ...new Set(data.feed.map((item) => item.category))];
  const visuals = Array.isArray(data.visuals) ? data.visuals : [];
  const heroVisual = visuals[0] ?? null;
  const accentVisuals = visuals.slice(1, 3);
  let activeFilter = "all";

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
  });

  const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
  });

  function formatDate(dateString) {
    return dateFormatter.format(new Date(`${dateString}T12:00:00`));
  }

  function formatDateTime(dateString) {
    return dateTimeFormatter.format(new Date(dateString));
  }

  function toneClass(tone) {
    if (tone === "positive") return "pill-positive";
    if (tone === "warning") return "pill-warning";
    return "pill-neutral";
  }

  function confidenceClass(level) {
    if (level === "high") return "pill-positive";
    if (level === "medium") return "pill-warning";
    return "pill-neutral";
  }

  function categoryLabel(category) {
    const item = data.feed.find((entry) => entry.category === category);
    return item ? item.categoryLabel : category;
  }

  function renderFacts() {
    return data.facts
      .map(
        (fact) => `
          <article class="fact-card">
            <strong>${fact.label}</strong>
            <p class="fact-value">${fact.value}</p>
            <p>${fact.detail}</p>
          </article>
        `
      )
      .join("");
  }

  function renderWatchlist() {
    return data.watchlist
      .map(
        (item) => `
          <article class="watch-card">
            <strong>${item.title}</strong>
            <p>${item.detail}</p>
          </article>
        `
      )
      .join("");
  }

  function renderCoverage() {
    return `
      <article class="coverage-card">
        <ul>
          ${data.coverage.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </article>
    `;
  }

  function renderSources() {
    return data.sources
      .map(
        (source) => `
          <article class="source-card">
            <strong>${source.label}</strong>
            <p>${source.note}</p>
            <div class="source-meta">
              <span class="pill pill-neutral"><strong>${source.type}</strong></span>
              <span class="pill ${confidenceClass(source.confidence)}"><strong>${source.confidence} confidence</strong></span>
              <a class="pill pill-neutral" href="${source.url}" target="_blank" rel="noreferrer">Open source</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderPhotoStack() {
    return accentVisuals
      .map(
        (item, index) => `
          <figure class="photo-tile photo-tile-${index + 1}">
            <div class="photo-tile-media">
              <img
                src="${item.imageUrl}"
                alt="${item.alt}"
                loading="lazy"
                decoding="async"
                referrerpolicy="no-referrer"
              />
            </div>
          </figure>
        `
      )
      .join("");
  }

  function renderPhotoCredits() {
    if (!visuals.length) {
      return "";
    }

    const credits = visuals
      .map(
        (item) => `
          <a href="${item.creditUrl}" target="_blank" rel="noreferrer">${item.creditName}</a>
          <a href="${item.licenseUrl}" target="_blank" rel="noreferrer">${item.licenseLabel}</a>
        `
      )
      .join(" · ");

    return `<p class="photo-credits">Photos: ${credits}</p>`;
  }

  function renderFeedItems() {
    const filtered =
      activeFilter === "all"
        ? data.feed
        : data.feed.filter((item) => item.category === activeFilter);

    if (!filtered.length) {
      return `
        <div class="empty-state">
          No feed items match this filter yet.
        </div>
      `;
    }

    return filtered
      .map(
        (item) => `
          <article class="feed-item">
            <div class="feed-date">
              <time datetime="${item.date}">${formatDate(item.date)}</time>
              <span class="feed-tag">${item.categoryLabel}</span>
            </div>
            <div>
              <h3>${item.title}</h3>
              <p>${item.summary}</p>
              <div class="feed-meta">
                <span class="pill ${toneClass(item.statusImpact)}"><strong>${item.impact}</strong></span>
                <span class="pill pill-neutral"><strong>${item.sourceLabel}</strong></span>
                <span class="pill ${confidenceClass(item.confidence)}"><strong>${item.confidence} confidence</strong></span>
                <a class="pill pill-neutral" href="${item.url}" target="_blank" rel="noreferrer">Source</a>
              </div>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderFilters() {
    return categories
      .map(
        (category) => `
          <button
            class="filter-button ${category === activeFilter ? "is-active" : ""}"
            type="button"
            data-filter="${category}"
          >
            ${category === "all" ? "All signals" : categoryLabel(category)}
          </button>
        `
      )
      .join("");
  }

  function render() {
    const heroStyle = heroVisual
      ? `style="--hero-image: url('${heroVisual.imageUrl}')"`
      : "";

    app.innerHTML = `
      <section class="hero section">
        <article class="hero-card card ${heroVisual ? "hero-card-image" : ""}" ${heroStyle}>
          <span class="eyebrow">Morning status page</span>
          <h1>${data.meta.title}</h1>
          <p class="hero-lead">${data.meta.summary}</p>
          <div class="hero-meta">
            <span class="pill ${toneClass(data.meta.statusTone)}"><strong>${data.meta.statusLabel}</strong></span>
            <span class="pill pill-neutral"><strong>As of ${formatDateTime(data.meta.asOf)}</strong></span>
            <span class="pill ${confidenceClass(data.meta.summaryConfidence)}"><strong>${data.meta.summaryConfidence} confidence summary</strong></span>
          </div>
        </article>
        <aside class="stats-card card">
          <h2>Project pulse</h2>
          <div class="stats-stack">
            <article class="stat-block">
              <span class="stat-label">Headline</span>
              <p class="stat-value">${data.meta.headline}</p>
            </article>
            <article class="stat-block">
              <span class="stat-label">Most likely next step</span>
              <p class="stat-value">${data.meta.outlook}</p>
            </article>
            <article class="stat-block">
              <span class="stat-label">Watch next</span>
              <p class="stat-copy">${data.meta.nextWatch}</p>
            </article>
          </div>
          ${accentVisuals.length ? `<div class="photo-stack">${renderPhotoStack()}</div>` : ""}
        </aside>
      </section>

      <section class="grid-two section">
        <article class="panel card">
          <h2 class="section-title">Where Things Stand</h2>
          <div class="facts-grid section">
            ${renderFacts()}
          </div>
        </article>

        <article class="panel card">
          <h2 class="section-title">What To Watch</h2>
          <div class="watch-grid section">
            ${renderWatchlist()}
          </div>
        </article>
      </section>

      <section class="grid-two section">
        <article class="panel card">
          <h2 class="section-title">Coverage Model</h2>
          <div class="section">
            ${renderCoverage()}
          </div>
        </article>

        <article class="panel card">
          <h2 class="section-title">Update Notes</h2>
          <div class="watch-grid section">
            <article class="watch-card">
              <strong>What this page does well</strong>
              <p>It tracks official policy, technical experiments, political promises, and public reporting in one place.</p>
            </article>
            <article class="watch-card">
              <strong>Important limitation</strong>
              <p>Most Instagram and TikTok pages are not openly scrapeable. The tracker uses public, indexed, and article-cited social signals rather than private or login-walled content.</p>
            </article>
          </div>
        </article>
      </section>

      <section class="section">
        <article class="feed-panel card">
          <div class="feed-topbar">
            <div>
              <h2 class="section-title">Live Feed</h2>
              <p class="feed-copy">Latest credible updates first, across official notices, news reports, community signals, engineering notes, and public social references.</p>
            </div>
          </div>
          <div class="feed-filters">
            ${renderFilters()}
          </div>
          <div id="feed-list" class="feed-list">
            ${renderFeedItems()}
          </div>
        </article>
      </section>

      <section class="section">
        <article class="panel card">
          <h2 class="section-title">Source Ledger</h2>
          <div class="source-list section">
            ${renderSources()}
          </div>
          <p class="footer-note">
            This site is generated from a structured data file so a daily automation can refresh the status without hand-editing the page.
          </p>
          ${renderPhotoCredits()}
        </article>
      </section>
    `;

    app.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        render();
      });
    });
  }

  render();
}
