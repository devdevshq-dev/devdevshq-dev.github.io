import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../lib/scroll-motion.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2017 } });
const { startScrollMotion } = await import(`data:text/javascript;base64,${Buffer.from(outputText + "\n//# sourceURL=scroll-motion.ts\n").toString('base64')}`);

function environment(t, { reduced = false, supportsObserver = true } = {}) {
  class Element {
    style = new Map();
    classList = new Set();
    dataset = {};
    animations = [];
    constructor() {
      this.style.setProperty = this.style.set.bind(this.style);
      this.style.removeProperty = this.style.delete.bind(this.style);
      this.classList.remove = this.classList.delete.bind(this.classList);
      this.classList.toggle = (name, on) => on ? this.classList.add(name) : this.classList.delete(name);
    }
    closest() { return this.revealTarget ?? this; }
    animate() {
      const animation = { cancelled: false, cancel() { this.cancelled = true; } };
      this.animations.push(animation);
      return animation;
    }
  }
  const targets = [new Element(), new Element()];
  const image = new Element();
  let rect = { top: 100, bottom: 600, height: 500 };
  image.parentElement = { getBoundingClientRect: () => rect };
  const root = new Element(); root.scrollHeight = 5000;
  const preference = new EventTarget(); preference.matches = reduced;
  const document = new EventTarget();
  document.documentElement = root;
  document.activeElement = null;
  document.querySelectorAll = selector => selector === '[data-reveal]' ? targets : [image];
  const frames = new Map(); let nextFrame = 0;
  const window = new EventTarget();
  window.innerHeight = 1000; window.scrollY = 0;
  window.matchMedia = () => preference;
  window.requestAnimationFrame = callback => { frames.set(++nextFrame, callback); return nextFrame; };
  window.cancelAnimationFrame = id => frames.delete(id);
  const observers = [];
  class Observer {
    targets = new Set();
    disconnected = false;
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(element) { this.targets.add(element); }
    unobserve(element) { this.targets.delete(element); }
    disconnect() { this.targets.clear(); this.disconnected = true; }
    enter(element) { this.callback([{ target: element, isIntersecting: true }]); }
  }
  const globals = { window, document, Element, IntersectionObserver: supportsObserver ? Observer : undefined };
  const originals = Object.fromEntries(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  let cleanup;
  t.after(() => {
    cleanup?.();
    for (const key of Object.keys(globals)) {
      if (originals[key]) Object.defineProperty(globalThis, key, originals[key]);
      else delete globalThis[key];
    }
  });
  const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()); };
  const focus = target => { const event = new Event('focusin'); Object.defineProperty(event, 'target', {value: target}); document.dispatchEvent(event); };
  return { start: () => { cleanup = startScrollMotion(); return cleanup; }, targets, image, root, preference, window, observers, frames, flush, focus, setRect: value => { rect = value; } };
}

test('reveals run once, and keyboard focus immediately cancels or bypasses entrance animation', t => {
  const env = environment(t);
  env.start();
  const observer = env.observers[0];
  const [first, second] = env.targets;
  observer.enter(first);
  observer.enter(first);
  assert.equal(first.animations.length, 1);
  env.focus(first);
  assert(first.animations[0].cancelled);
  env.focus(second);
  observer.enter(second);
  assert.equal(second.animations.length, 0);
  assert(second.classList.has('is-revealed'));
});

test('scroll work is coalesced, drift stays bounded, and cleanup removes pending work', t => {
  const env = environment(t);
  const stop = env.start();
  env.flush();
  assert.equal(env.root.style.get('--scroll-progress'), '0');
  const before = env.image.style.get('--scroll-offset');
  env.window.scrollY = 2000;
  env.setRect({top: -200, bottom: 300, height: 500});
  for (let i = 0; i < 10; i++) env.window.dispatchEvent(new Event('scroll'));
  assert.equal(env.frames.size, 1);
  env.flush();
  assert.equal(env.root.style.get('--scroll-progress'), '0.5');
  assert.notEqual(env.image.style.get('--scroll-offset'), before);
  assert(Math.abs(parseFloat(env.image.style.get('--scroll-offset'))) <= 18);
  env.window.dispatchEvent(new Event('scroll'));
  stop();
  assert.equal(env.frames.size, 0);
  assert.equal(env.image.style.has('--scroll-offset'), false);
  assert.equal(env.root.classList.has('motion-enabled'), false);
  env.window.dispatchEvent(new Event('scroll'));
  assert.equal(env.frames.size, 0);
});

test('changing reduced-motion preference cancels movement and reveals all content', t => {
  const env = environment(t);
  env.start();
  env.flush();
  env.observers[0].enter(env.targets[0]);
  env.preference.matches = true;
  env.preference.dispatchEvent(new Event('change'));
  env.flush();
  assert(env.targets[0].animations[0].cancelled);
  assert(env.observers[0].disconnected);
  assert(env.targets.every(target => target.classList.has('is-revealed')));
  assert.equal(env.root.classList.has('motion-enabled'), false);
  assert.equal(env.image.style.has('--scroll-offset'), false);
});

test('reduced motion and missing observer support leave content readable without reveal animations', t => {
  const env = environment(t, {reduced: true, supportsObserver: false});
  env.start();
  env.flush();
  assert.equal(env.observers.length, 0);
  assert(env.targets.every(target => target.classList.has('is-revealed') && target.animations.length === 0));
  env.preference.matches = false;
  env.preference.dispatchEvent(new Event('change'));
  assert(env.targets.every(target => target.animations.length === 0));
});
