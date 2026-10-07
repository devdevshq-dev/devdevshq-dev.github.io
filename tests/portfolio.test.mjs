import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import worker from '../dist/server/index.js';

const content = JSON.parse(readFileSync(new URL('../content/portfolio.json', import.meta.url), 'utf8'));
const response = await worker.fetch(new Request('http://localhost/'), {}, { props: {}, waitUntil() {}, passThroughOnException() {} });
const html = await response.text();
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

test('the standard portfolio renders every supplied role, project, skill, and education record', () => {
  assert.equal(response.status, 200);
  assert(html.includes(escape(content.about)));
  for (const role of content.experience) {
    assert(html.includes(escape(role.company)));
    assert(html.includes(escape(role.role)));
    assert(html.includes(escape(role.date)));
    for (const bullet of role.bullets) assert(html.includes(escape(bullet)), bullet);
  }
  for (const project of content.projects) {
    assert(html.includes(escape(project.name)));
    for (const bullet of project.bullets) assert(html.includes(escape(bullet)));
  }
  for (const group of content.skills) for (const skill of group.items) assert(html.includes(escape(skill)));
  assert(html.includes(escape(content.education.institution)));
  assert(html.includes(escape(content.education.degree)));
  for (const award of content.awards) assert(html.includes(escape(award)));
  assert(html.includes('Kotak811'));
  for (const removed of ['Kotak Mahindra Bank', 'CURRENT ROLE', 'current-badge', 'BACKEND TOOLKIT', 'architecture-panel', 'optical-cables', 'cable-signal', 'Open to Opportunities', 'Netesh', 'netesh', 'Cognizant', 'FinSight Analyzer', 'hello@example.com']) assert(!html.includes(removed), removed);
});
test('all seven sections, community resources, and profile links are available directly', () => {
  for (const section of ['about', 'experience', 'projects', 'community', 'skills', 'education', 'contact']) assert(html.includes(`id="${section}"`));
  assert(html.replace(/<[^>]*>/g, '').includes('Giving back to the community'));
  for (const resource of ['https://100devtools.pages.dev/', 'https://shatranj.pages.dev/']) assert(html.includes(`href="${resource}"`));
  for (const profile of Object.values(content.socials)) assert(html.includes(`href="${profile}"`));
  assert(html.includes('Skip to content'));
  assert(html.includes('Turn ambient music on'));
  assert(!html.includes('[cite:'));
  assert(!html.includes('google.com/search'));
});
test('the background is decorative while the game and 3D renderer remain removed', () => {
  assert(/<canvas[^>]*class="network-background"[^>]*aria-hidden="true"/.test(html));
  assert(html.includes('Profile terminal'));
  assert(html.includes('Replay profile terminal'));
  const terminal = html.match(/<section class="profile-terminal"[\s\S]*?<\/section>/)?.[0];
  assert(terminal);
  for (const field of ['focus', 'stack', 'award']) assert(!terminal.includes(escape(`"${field}":`)));
  for (const removed of ['System Explorer', 'MISSION LOG', 'xp-badge', 'explorer-world', 'Restart adventure']) assert(!html.includes(removed), removed);
  const chunks = readdirSync(new URL('../dist/client/_next/static/chunks/', import.meta.url));
  assert(!chunks.some(name => /three\.|ExplorerWorld|RoomEnvironment/.test(name)));
});
test('all three editorial images are included in the production assets', () => {
  for (const name of ['server-infrastructure', 'developer-toolbox', 'online-chess']) {
    assert(html.includes(`src="/images/${name}.webp"`));
    const file = readFileSync(new URL(`../dist/client/images/${name}.webp`, import.meta.url));
    assert.equal(file.toString('ascii', 0, 4), 'RIFF');
    assert.equal(file.toString('ascii', 8, 12), 'WEBP');
    assert(file.length < 300_000, `${name} should remain optimized for the web`);
  }
});
