import base from './content.js';

const content = { ...base, ...(window.__TEST_OVERRIDES__ || {}) };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const html = (strings, ...vals) => strings.reduce((out, s, i) => out + s + (i < vals.length ? vals[i] : ''), '');
const list = (arr, fn) => arr.map(fn).join('');
const ext = 'rel="noopener" target="_blank"';
const rev = new Date().toISOString().slice(0, 10);

const hero = () => html`
<section id="hero" class="hero" aria-labelledby="name">
  <div class="hero-lead">
    <p class="dim">${esc(content.location)} · DRAWN BY SELF · CHECKED BY CI</p>
    <h1 id="name">${esc(content.name)}</h1>
    <p class="title">${esc(content.title)}</p>
    <p class="pitch">${esc(content.pitch)}</p>
    <ul class="callouts" aria-label="Proof">
      ${list(content.proof, p => html`<li><a href="${esc(p.href)}" ${ext}><strong>${esc(p.value)}</strong><span>${esc(p.label)}</span></a></li>`)}
    </ul>
  </div>
  <table class="title-block" aria-label="Title block">
    <tbody>
      <tr>
        <th scope="row">Name</th><td>${esc(content.name)}</td>
        <th scope="row">Rev</th><td class="mono">${rev}</td>
      </tr>
      <tr>
        <th scope="row">Title</th><td colspan="3">${esc(content.title)}</td>
      </tr>
      <tr>
        <th scope="row">Location</th><td>${esc(content.location)}</td>
        <th scope="row">Sheet</th><td class="mono">1 / 1</td>
      </tr>
      <tr>
        <th scope="row">Checked by</th>
        <td colspan="3"><div class="links">
          <a href="${esc(content.links.github)}" rel="me noopener" target="_blank">GitHub</a>
          <a href="${esc(content.links.linkedin)}" rel="me noopener" target="_blank">LinkedIn</a>
          <a href="mailto:${esc(content.email)}">Email</a>
          ${content.cv ? html`<a href="${esc(content.cv)}" download>Download CV</a>` : ''}
        </div></td>
      </tr>
      <tr class="action-row">
        <td colspan="4"><div class="actions">
          <a class="btn primary" href="mailto:${esc(content.email)}">Email Laise</a>
          <a class="btn" href="#projects">View projects</a>
        </div></td>
      </tr>
    </tbody>
  </table>
</section>`;

const about = () => html`
<section id="about" aria-labelledby="h-about">
  <h2 id="h-about"><span class="zone">A·2</span>General notes</h2>
  <div class="prose">${list(content.about, p => html`<p>${esc(p)}</p>`)}</div>
</section>`;

const skills = () => html`
<section id="skills" aria-labelledby="h-skills">
  <h2 id="h-skills"><span class="zone">B·2</span>Specifications</h2>
  <dl class="dims">
    ${list(content.skills, g => html`
    <div class="dim-row">
      <dt>${esc(g.group)}</dt>
      <dd><ul class="chips">${list(g.items, i => html`<li>${esc(i)}</li>`)}</ul></dd>
    </div>`)}
  </dl>
</section>`;

const experience = () => html`
<section id="experience" aria-labelledby="h-exp">
  <h2 id="h-exp"><span class="zone">C·3</span>Revision history</h2>
  <table class="rev">
    <thead><tr><th scope="col">Rev</th><th scope="col">Period</th><th scope="col">Description</th></tr></thead>
    <tbody>
      ${list(content.experience, (e, i, arr) => html`
      <tr>
        <td class="mono">${String.fromCharCode(65 + (arr.length - 1 - i))}</td>
        <td class="mono period">${esc(e.period)}</td>
        <td>
          <p class="rev-title"><strong>${esc(e.role)}</strong> · ${esc(e.company)}</p>
          <ul>${list(e.bullets, b => html`<li>${esc(b)}</li>`)}</ul>
        </td>
      </tr>`)}
    </tbody>
  </table>
</section>`;

const projects = () => html`
<section id="projects" aria-labelledby="h-projects">
  <h2 id="h-projects"><span class="zone">D·3</span>Detail views</h2>
  <div class="details">
    ${list(content.projects, (p, i) => html`
    <article class="detail" aria-labelledby="p-${i}">
      <header class="detail-head">
        <span class="bubble" aria-hidden="true">${String.fromCharCode(65 + i)}</span>
        <h3 id="p-${i}">${esc(p.name)}</h3>
        <span class="scale mono">${p.live ? 'LIVE' : 'SOURCE'}</span>
      </header>
      <p>${esc(p.description)}</p>
      <ul class="chips">${list(p.tags, t => html`<li>${esc(t)}</li>`)}</ul>
      <p class="detail-links">
        <a href="${esc(p.repo)}" ${ext}>Code</a>
        ${p.live ? html`<a href="${esc(p.live)}" ${ext}>Live site</a>` : ''}
      </p>
    </article>`)}
  </div>
</section>`;

const contact = () => html`
<section id="contact" aria-labelledby="h-contact">
  <h2 id="h-contact"><span class="zone">F·4</span>Issue for review</h2>
  <div class="contact-row">
    <p class="pitch">Open to QA engineering and test-automation roles, on-site in Barcelona or remote.</p>
    <p><a class="btn primary" href="mailto:${esc(content.email)}">${esc(content.email)}</a></p>
  </div>
</section>`;

document.getElementById('main').innerHTML = [hero(), about(), skills(), experience(), projects(), contact()].join('');
document.getElementById('year').textContent = new Date().getFullYear();
