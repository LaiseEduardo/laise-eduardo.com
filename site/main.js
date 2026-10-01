import base from './content.js';

const content = { ...base, ...(window.__TEST_OVERRIDES__ || {}) };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const html = (strings, ...vals) => strings.reduce((out, s, i) => out + s + (i < vals.length ? vals[i] : ''), '');
const list = (arr, fn) => arr.map(fn).join('');

const hero = () => html`
<section id="hero" class="hero">
  <p class="eyebrow">${esc(content.location)}</p>
  <h1>${esc(content.name)}</h1>
  <p class="title">${esc(content.title)}</p>
  <p class="pitch">${esc(content.pitch)}</p>
  <div class="actions">
    <a class="btn primary" href="#projects">View projects</a>
    ${content.cv ? html`<a class="btn" href="${esc(content.cv)}" download>Download CV</a>` : ''}
  </div>
  <ul class="social">
    <li><a href="${esc(content.links.github)}" rel="me noopener" target="_blank">GitHub</a></li>
    <li><a href="${esc(content.links.linkedin)}" rel="me noopener" target="_blank">LinkedIn</a></li>
    <li><a href="mailto:${esc(content.email)}">Email</a></li>
  </ul>
</section>`;

const about = () => html`
<section id="about"><h2>About</h2>${list(content.about, p => html`<p>${esc(p)}</p>`)}</section>`;

const skills = () => html`
<section id="skills"><h2>Skills</h2>
  ${list(content.skills, g => html`<div class="skill-group"><h3>${esc(g.group)}</h3>
    <ul class="chips">${list(g.items, i => html`<li>${esc(i)}</li>`)}</ul></div>`)}
</section>`;

const experience = () => html`
<section id="experience"><h2>Experience</h2>
  <ol class="timeline">${list(content.experience, e => html`
    <li><h3>${esc(e.role)} <span class="muted">· ${esc(e.company)}</span></h3>
      <p class="period">${esc(e.period)}</p>
      <ul>${list(e.bullets, b => html`<li>${esc(b)}</li>`)}</ul></li>`)}
  </ol>
</section>`;

const projects = () => html`
<section id="projects"><h2>Projects</h2>
  <div class="cards">${list(content.projects, p => html`
    <article class="card">
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.description)}</p>
      <ul class="chips">${list(p.tags, t => html`<li>${esc(t)}</li>`)}</ul>
      <p class="card-links">
        <a href="${esc(p.repo)}" rel="noopener" target="_blank">Code</a>
        ${p.live ? html`<a href="${esc(p.live)}" rel="noopener" target="_blank">Live site</a>` : ''}
      </p>
    </article>`)}
  </div>
</section>`;

const contact = () => html`
<section id="contact"><h2>Contact</h2>
  <p>Open to QA engineering and test-automation roles, on-site in Barcelona or remote.</p>
  <p><a class="btn primary" href="mailto:${esc(content.email)}">${esc(content.email)}</a></p>
</section>`;

document.getElementById('main').innerHTML = [hero(), about(), skills(), experience(), projects(), contact()].join('');
document.getElementById('year').textContent = new Date().getFullYear();
