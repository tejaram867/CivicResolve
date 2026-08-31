/* ============================================================
   CivicResolve — Shared frontend logic (vanilla JS)
   Demo data only. Premium Lucide icons. Smooth motion.
   ============================================================ */

/* ---------- Lucide helper ---------- */
function refreshIcons(root = document) {
  if (window.lucide) window.lucide.createIcons({ root, attrs: { "stroke-width": 2 } });
}

/* ---------- Demo data ---------- */
const ISSUES = [
  { id: "CR1024", title: "Dangerous Pothole Near School", category: "Road & Infrastructure", categoryKey: "road", location: "Tirupati Main Road", severity: "High", severityKey: "high", status: "In Progress", statusKey: "progress", reports: 42, progress: 60, authority: "Municipal Road Department", date: "Aug 28, 2026", icon: "construction" },
  { id: "CR1019", title: "Garbage Overflow at Market", category: "Garbage & Waste", categoryKey: "garbage", location: "Gandhi Bazaar", severity: "Medium", severityKey: "medium", status: "Reported", statusKey: "reported", reports: 18, progress: 10, authority: "Sanitation Department", date: "Aug 26, 2026", icon: "trash-2" },
  { id: "CR1011", title: "Drainage Blockage on 2nd Cross", category: "Drainage", categoryKey: "drainage", location: "2nd Cross Street", severity: "High", severityKey: "high", status: "In Progress", statusKey: "progress", reports: 27, progress: 45, authority: "Storm Water Dept", date: "Aug 22, 2026", icon: "waves" },
  { id: "CR1005", title: "Water Leakage from Main Pipe", category: "Water Supply", categoryKey: "water", location: "Lake View Colony", severity: "Critical", severityKey: "critical", status: "Critical", statusKey: "critical", reports: 53, progress: 25, authority: "Water Board Authority", date: "Aug 20, 2026", icon: "droplets" },
  { id: "CR0998", title: "Broken Streetlight on Park Avenue", category: "Street Lighting", categoryKey: "lighting", location: "Park Avenue", severity: "Low", severityKey: "low", status: "Resolved", statusKey: "resolved", reports: 9, progress: 100, authority: "Electricity Dept", date: "Aug 15, 2026", icon: "lightbulb" },
  { id: "CR0990", title: "Damaged Footpath Near Bus Stop", category: "Public Facilities", categoryKey: "facilities", location: "Central Bus Terminal", severity: "Medium", severityKey: "medium", status: "Verified", statusKey: "verified", reports: 21, progress: 80, authority: "Municipal Facilities", date: "Aug 12, 2026", icon: "footprints" },
  { id: "CR0982", title: "Open Drain Cover Missing", category: "Drainage", categoryKey: "drainage", location: "Indira Nagar 4th Block", severity: "Critical", severityKey: "critical", status: "In Progress", statusKey: "progress", reports: 38, progress: 35, authority: "Storm Water Dept", date: "Aug 09, 2026", icon: "circle-alert" },
  { id: "CR0975", title: "Road Crack Across Highway", category: "Road & Infrastructure", categoryKey: "road", location: "NH-69 Junction", severity: "High", severityKey: "high", status: "Resolved", statusKey: "resolved", reports: 64, progress: 100, authority: "Highways Authority", date: "Aug 04, 2026", icon: "road" },
];

const MY_REPORTS = [
  { issue: "Pothole", category: "Road", statusKey: "resolved", points: "+70" },
  { issue: "Garbage Dump", category: "Waste", statusKey: "progress", points: "+20" },
  { issue: "Drain Blockage", category: "Drainage", statusKey: "verified", points: "+20" },
  { issue: "Streetlight Out", category: "Lighting", statusKey: "reported", points: "+5" },
];

const REWARDS = [
  { pts: "+40", label: "Resolution confirmed", icon: "wrench" },
  { pts: "+20", label: "Issue verified", icon: "badge-check" },
  { pts: "+15", label: "Community verification", icon: "users" },
  { pts: "+5", label: "Valid report", icon: "file-check" },
];

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function statusBadge(key) {
  const map = {
    resolved: { cls: "badge--resolved", text: "Resolved", icon: "check-circle-2" },
    progress: { cls: "badge--progress", text: "In Progress", icon: "loader" },
    critical: { cls: "badge--critical", text: "Critical", icon: "alert-octagon" },
    reported: { cls: "badge--reported", text: "Reported", icon: "flag" },
    verified: { cls: "badge--verified", text: "Verified", icon: "badge-check" },
  };
  const s = map[key] || map.reported;
  return `<span class="badge ${s.cls}"><span class="dot"></span>${s.text}</span>`;
}

function sevBadge(key) {
  const map = {
    low: { cls: "sev--low", text: "Low" },
    medium: { cls: "sev--medium", text: "Medium" },
    high: { cls: "sev--high", text: "High" },
    critical: { cls: "sev--critical", text: "Critical" },
  };
  const s = map[key] || map.low;
  return `<span class="sev ${s.cls}"><i data-lucide="triangle-alert"></i>${s.text} Severity</span>`;
}

/* ---------- Toast ---------- */
function ensureToastWrap() {
  let wrap = $(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  return wrap;
}
function toast(message, type = "info", ms = 3400) {
  const wrap = ensureToastWrap();
  const icons = { success: "circle-check-big", error: "circle-xmark", info: "circle-info" };
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.innerHTML = `<i data-lucide="${icons[type] || icons.info}"></i><span>${message}</span>`;
  wrap.appendChild(el);
  refreshIcons(el);
  requestAnimationFrame(() => el.classList.add("is-show"));
  setTimeout(() => {
    el.classList.remove("is-show");
    setTimeout(() => el.remove(), 380);
  }, ms);
}
window.toast = toast;

/* ---------- Navbar scroll + mobile ---------- */
function initNav() {
  const nav = $(".nav");
  const toggle = $(".nav__toggle");
  const drawer = $(".nav-drawer");

  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && drawer) {
    toggle.addEventListener("click", () => {
      const open = drawer.classList.toggle("is-open");
      toggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
      refreshIcons(toggle);
    });
    $$(".nav-drawer a, .nav-drawer .btn").forEach((a) =>
      a.addEventListener("click", () => {
        drawer.classList.remove("is-open");
        toggle.innerHTML = '<i data-lucide="menu"></i>';
        refreshIcons(toggle);
      })
    );
  }
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const els = $$(".reveal");
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Animated counters ---------- */
function animateCounter(el, target, suffix = "") {
  const dur = 1500;
  const start = performance.now();
  const isPercent = suffix.includes("%");
  const final = isPercent ? parseFloat(target) : parseInt(target, 10);
  function frame(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(eased * final);
    el.innerHTML = isPercent ? `${val}${suffix}` : `${val.toLocaleString()}${suffix}`;
    if (p < 1) requestAnimationFrame(frame);
    else el.innerHTML = isPercent ? `${final}${suffix}` : `${final.toLocaleString()}${suffix}`;
  }
  requestAnimationFrame(frame);
}
function initCounters() {
  const counters = $$("[data-count]");
  if (!counters.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCounter(e.target, e.target.dataset.count, e.target.dataset.suffix || "");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => io.observe(c));
}

/* ---------- Issue cards ---------- */
function issueCardHTML(issue) {
  const barCls = issue.statusKey === "resolved" ? "progress__bar--green" : issue.statusKey === "critical" ? "progress__bar--orange" : "";
  return `
    <article class="card issue-card reveal" data-issue-id="${issue.id}">
      <div class="issue-card__top">
        <span class="issue-card__id">Issue #${issue.id}</span>
        ${statusBadge(issue.statusKey)}
      </div>
      <div class="issue-card__loc"><i data-lucide="map-pin"></i>${issue.location}</div>
      <h3><i data-lucide="${issue.icon}"></i>${issue.title}</h3>
      <div class="issue-card__meta">
        <span>${sevBadge(issue.severityKey)}</span>
        <span><b>${issue.reports}</b> reports</span>
      </div>
      <div>
        <div class="progress__label"><span>Progress</span><span>${issue.progress}%</span></div>
        <div class="progress"><div class="progress__bar ${barCls}" data-width="${issue.progress}"></div></div>
      </div>
      <div><button class="btn btn--ghost btn--sm btn--block js-view-issue" data-id="${issue.id}">View Details <i data-lucide="arrow-right"></i></button></div>
    </article>`;
}

/* ---------- Issue modal ---------- */
function openIssueModal(id) {
  const issue = ISSUES.find((i) => i.id === id);
  if (!issue) return;
  const stages = [
    { label: "Report Submitted", state: "done" },
    { label: "Issue Verified", state: issue.progress >= 30 ? "done" : "todo" },
    { label: "Authority Assigned", state: issue.progress >= 40 ? "done" : "todo" },
    { label: "Repair In Progress", state: issue.statusKey === "resolved" ? "done" : "current" },
    { label: "Community Verification", state: issue.statusKey === "resolved" ? "done" : issue.statusKey === "verified" ? "current" : "todo" },
    { label: "Resolved", state: issue.statusKey === "resolved" ? "done" : "todo" },
  ];
  const tl = stages
    .map((s) => {
      const icon = s.state === "done" ? "check" : s.state === "current" ? "circle" : "circle";
      return `<div class="timeline__step is-${s.state}">
        <div class="timeline__dot"><i data-lucide="${icon}"></i></div>
        <div class="timeline__body"><h4>${s.label}</h4></div>
      </div>`;
    })
    .join("");

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Issue details">
      <div class="modal__header">
        <div>
          <span class="issue-card__id">Issue #${issue.id}</span>
          <h3 style="margin-top:6px">${issue.title}</h3>
        </div>
        <button class="modal__close js-modal-close" aria-label="Close"><i data-lucide="x"></i></button>
      </div>
      <div class="modal__body">
        <div class="issue-card__meta" style="margin-bottom:14px;gap:10px">
          ${statusBadge(issue.statusKey)}
          ${sevBadge(issue.severityKey)}
        </div>
        <div class="result-row"><span class="result-row__label">Reported</span><span class="result-row__val">${issue.date}</span></div>
        <div class="result-row"><span class="result-row__label">Location</span><span class="result-row__val">${issue.location}</span></div>
        <div class="result-row"><span class="result-row__label">Reports</span><span class="result-row__val">${issue.reports} citizens</span></div>
        <div class="result-row"><span class="result-row__label">Authority</span><span class="result-row__val">${issue.authority}</span></div>
        <h4 style="margin:24px 0 16px">Resolution Timeline</h4>
        <div class="timeline">${tl}</div>
        <h4 style="margin:24px 0 16px">Evidence</h4>
        <div class="evidence">
          <div class="evidence__box"><i data-lucide="image"></i><span>Before (reported)</span></div>
          <div class="evidence__box ${issue.statusKey === "resolved" ? "is-after" : ""}"><i data-lucide="${issue.statusKey === "resolved" ? "circle-check-big" : "hourglass"}"></i><span>${issue.statusKey === "resolved" ? "After (resolved)" : "After (pending)"}</span></div>
        </div>
        <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn--primary btn--sm js-verify"><i data-lucide="badge-check"></i>Mark as Verified</button>
          <button class="btn btn--ghost btn--sm js-modal-close">Close</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  refreshIcons(overlay);
  requestAnimationFrame(() => overlay.classList.add("is-open"));
  const close = () => {
    overlay.classList.remove("is-open");
    setTimeout(() => overlay.remove(), 420);
  };
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  $$(".js-modal-close", overlay).forEach((b) => b.addEventListener("click", close));
  const verifyBtn = $(".js-verify", overlay);
  if (verifyBtn) verifyBtn.addEventListener("click", () => { toast("Thank you for verifying this issue!", "success"); close(); });
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
  });
}

/* ---------- Issues page ---------- */
function initIssuesPage() {
  const grid = $("#issues-grid");
  if (!grid) return;
  const search = $("#f-search");
  const fCat = $("#f-category");
  const fStatus = $("#f-status");
  const fSev = $("#f-severity");
  const empty = $("#issues-empty");

  function render(list) {
    grid.innerHTML = list.map(issueCardHTML).join("");
    if (!list.length) empty.style.display = "block";
    else empty.style.display = "none";
    $$(".js-view-issue", grid).forEach((b) =>
      b.addEventListener("click", () => openIssueModal(b.dataset.id))
    );
    refreshIcons(grid);
    initReveal();
    requestAnimationFrame(() => {
      $$(".progress__bar", grid).forEach((bar) => {
        const w = bar.dataset.width;
        if (w) bar.style.width = w + "%";
      });
    });
  }

  function apply() {
    const q = (search.value || "").toLowerCase();
    const cat = fCat.value;
    const status = fStatus.value;
    const sev = fSev.value;
    const filtered = ISSUES.filter((i) => {
      const okQ = !q || i.title.toLowerCase().includes(q) || i.location.toLowerCase().includes(q) || i.id.toLowerCase().includes(q);
      const okCat = !cat || i.categoryKey === cat;
      const okStatus = !status || i.statusKey === status;
      const okSev = !sev || i.severityKey === sev;
      return okQ && okCat && okStatus && okSev;
    });
    render(filtered);
  }

  [search, fCat, fStatus, fSev].forEach((el) => el && el.addEventListener("input", apply));
  render(ISSUES);
}

/* ---------- Report page ---------- */
function initReportPage() {
  const form = $("#report-form");
  if (!form) return;
  const dropzone = $("#dropzone");
  const fileInput = $("#file-input");
  const preview = $("#drop-preview");
  const locBtn = $("#use-location");
  const locField = $("#location");
  const sevPills = $$(".sev-pill");
  let selectedSev = "medium";
  let files = [];

  sevPills.forEach((pill) =>
    pill.addEventListener("click", () => {
      sevPills.forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
      selectedSev = pill.dataset.sev;
    })
  );

  function renderPreview() {
    preview.innerHTML = files
      .map((f, i) => `<div class="dropzone__thumb"><img src="${f.url}" alt="preview" /><button type="button" class="rm" data-i="${i}" aria-label="Remove"><i data-lucide="x"></i></button></div>`)
      .join("");
    refreshIcons(preview);
    $$(".rm", preview).forEach((b) =>
      b.addEventListener("click", () => {
        files = files.filter((_, idx) => idx !== parseInt(b.dataset.i, 10));
        renderPreview();
      })
    );
  }

  function handleFiles(list) {
    [...list].slice(0, 4).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      files.push({ name: file.name, url: URL.createObjectURL(file) });
    });
    if (files.length > 4) files = files.slice(0, 4);
    renderPreview();
  }

  dropzone.addEventListener("click", (e) => { if (!e.target.closest(".rm")) fileInput.click(); });
  fileInput.addEventListener("change", () => handleFiles(fileInput.files));
  ["dragenter", "dragover"].forEach((ev) =>
    dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.add("is-drag"); })
  );
  ["dragleave", "drop"].forEach((ev) =>
    dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.remove("is-drag"); })
  );
  dropzone.addEventListener("drop", (e) => handleFiles(e.dataTransfer.files));

  locBtn.addEventListener("click", () => {
    locBtn.innerHTML = '<i data-lucide="loader-circle"></i> Locating...';
    refreshIcons(locBtn);
    setTimeout(() => {
      locField.value = "Tirupati Main Road (auto-detected)";
      locBtn.innerHTML = '<i data-lucide="locate-fixed"></i> Use My Location';
      refreshIcons(locBtn);
      toast("Location detected from your device.", "success");
    }, 1100);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = $("#title").value.trim();
    const category = $("#category").value;
    const desc = $("#description").value.trim();
    if (!title) { toast("Please enter an issue title.", "error"); return; }
    if (!category) { toast("Please select a category.", "error"); return; }
    if (!desc) { toast("Please describe the issue.", "error"); return; }

    const resultZone = $("#result-zone");
    resultZone.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <div class="loading__text">Analyzing your report...</div>
        <div class="loading__sub">AI is classifying the issue and finding the right authority.</div>
      </div>`;
    resultZone.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      const aiMap = {
        road: { issue: "Pothole", cat: "Road Infrastructure", auth: "Municipal Road Department" },
        garbage: { issue: "Garbage Accumulation", cat: "Waste Management", auth: "Sanitation Department" },
        drainage: { issue: "Drainage Blockage", cat: "Drainage", auth: "Storm Water Dept" },
        water: { issue: "Water Leakage", cat: "Water Supply", auth: "Water Board Authority" },
        lighting: { issue: "Streetlight Failure", cat: "Street Lighting", auth: "Electricity Dept" },
        facilities: { issue: "Public Facility Damage", cat: "Public Facilities", auth: "Municipal Facilities" },
        other: { issue: "Public Infrastructure Issue", cat: "General Civic", auth: "Municipal Corporation" },
      };
      const dup = Math.max(5, Math.min(45, Math.round((desc.length % 7) * 6 + 5)));
      const a = aiMap[category] || aiMap.other;
      resultZone.innerHTML = `
        <div class="result-card">
          <h3><i data-lucide="cpu"></i>AI Analysis</h3>
          <p class="muted" style="margin-bottom:12px;font-size:0.9rem">Automated classification result (demo)</p>
          <div class="result-row"><span class="result-row__label">Detected Issue</span><span class="result-row__val">${a.issue}</span></div>
          <div class="result-row"><span class="result-row__label">Category</span><span class="result-row__val">${a.cat}</span></div>
          <div class="result-row"><span class="result-row__label">Severity</span><span class="result-row__val" style="text-transform:capitalize">${selectedSev}</span></div>
          <div class="result-row"><span class="result-row__label">Possible Authority</span><span class="result-row__val">${a.auth}</span></div>
          <div class="result-row"><span class="result-row__label">Duplicate Probability</span><span class="result-row__val">${dup}%</span></div>
        </div>
        <div class="result-card" style="margin-top:18px">
          <h3><i data-lucide="route"></i>Recommended Action</h3>
          <p style="margin-bottom:16px">Issue ready for department routing.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <a class="btn btn--primary" href="issues.html"><i data-lucide="eye"></i>View Issue</a>
            <button class="btn btn--ghost" id="report-another"><i data-lucide="plus"></i>Report Another</button>
          </div>
        </div>`;
      refreshIcons(resultZone);
      const another = $("#report-another");
      if (another) another.addEventListener("click", () => {
        form.reset();
        resultZone.innerHTML = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      toast("Report analyzed and submitted successfully!", "success");
    }, 2200);
  });
}

/* ---------- Dashboard ---------- */
function initDashboard() {
  const dash = $("#dash-root");
  if (!dash) return;

  const myReportsTbody = $("#my-reports-body");
  if (myReportsTbody) {
    myReportsTbody.innerHTML = MY_REPORTS.map(
      (r) => `<tr>
        <td data-label="Issue">${r.issue}</td>
        <td data-label="Category">${r.category}</td>
        <td data-label="Status">${statusBadge(r.statusKey)}</td>
        <td data-label="Points"><strong style="color:var(--teal-deep)">${r.points}</strong></td>
      </tr>`
    ).join("");
    refreshIcons(myReportsTbody);
  }

  const rewardList = $("#reward-list");
  if (rewardList) {
    rewardList.innerHTML = REWARDS.map(
      (r) => `<div class="reward-chip"><span style="display:flex;align-items:center"><i data-lucide="${r.icon}"></i>${r.label}</span><span class="reward-chip__pts">${r.pts}</span></div>`
    ).join("");
    refreshIcons(rewardList);
  }

  const circ = $("#circ-bar");
  const circNum = $("#circ-num");
  if (circ && circNum) {
    const pct = 75;
    const r = 70;
    const C = 2 * Math.PI * r;
    circ.setAttribute("stroke-dasharray", C);
    setTimeout(() => circ.setAttribute("stroke-dashoffset", C * (1 - pct / 100)), 300);
    let n = 0;
    const t = setInterval(() => { n += 3; if (n >= pct) { n = pct; clearInterval(t); } circNum.textContent = n + "%"; }, 35);
  }

  const bars = $$(".bar-row__fill");
  bars.forEach((b) => {
    const target = b.dataset.val;
    setTimeout(() => (b.style.width = target + "%"), 300);
  });

  const scoreBar = $("#score-bar");
  if (scoreBar) setTimeout(() => (scoreBar.style.width = "87%"), 400);
}

/* ---------- Landing preview ---------- */
function initLandingPreview() {
  const grid = $("#preview-grid");
  if (!grid) return;
  grid.innerHTML = ISSUES.slice(0, 4).map(issueCardHTML).join("");
  $$(".js-view-issue", grid).forEach((b) =>
    b.addEventListener("click", () => openIssueModal(b.dataset.id))
  );
  refreshIcons(grid);
  initReveal();
  requestAnimationFrame(() => {
    $$(".progress__bar", grid).forEach((bar) => {
      const w = bar.dataset.width;
      if (w) bar.style.width = w + "%";
    });
  });
}

/* ---------- Smooth scroll ---------- */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length <= 1) return;
      const t = $(id);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/* ---------- Active nav link ---------- */
function initActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  $$(".nav__links a, .nav-drawer a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href && (href === path || (path === "index.html" && href === "index.html"))) {
      a.classList.add("is-active");
    }
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  refreshIcons();
  initNav();
  initActiveNav();
  initSmoothScroll();
  initReveal();
  initCounters();
  initLandingPreview();
  initIssuesPage();
  initReportPage();
  initDashboard();
});
