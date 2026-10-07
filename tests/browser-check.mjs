import { chromium, expect } from '@playwright/test';
import { existsSync, readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import worker from '../dist/server/index.js';

// Route browser requests through the built Worker in memory: no preview server or external network required.
const assets=path.resolve('dist/client');
const types={'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.json':'application/json','.woff2':'font/woff2'};
const report=path.resolve('outputs');mkdirSync(report,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.PORTFOLIO_BROWSER||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
let failures=0;
try {
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  const serve = async route=>{
    const request=route.request();const url=new URL(request.url());
    const file=path.resolve(assets,`.${decodeURIComponent(url.pathname)}`);
    if(file.startsWith(`${assets}${path.sep}`)&&existsSync(file)) {
      await route.fulfill({status:200,contentType:types[path.extname(file)]||'application/octet-stream',body:readFileSync(file)});return;
    }
    const response=await worker.fetch(new Request(request.url(),{method:request.method(),headers:request.headers(),body:['GET','HEAD'].includes(request.method())?undefined:request.postDataBuffer()}),{}, {props:{},waitUntil(){},passThroughOnException(){}});
    await route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())});
  };
  await context.route('https://portfolio.test/**', serve);
  const page=await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('https://portfolio.test/');
  await expect(page.getByRole('heading', {name:'Devesh Kumar Sharma', exact:true})).toBeVisible();
  await expect(page.locator('canvas.network-background')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('body')).not.toContainText('Open to Opportunities');
  await page.getByRole('button', {name:'Replay profile terminal'}).click();
  await expect(page.locator('.terminal-output')).toContainText('Kotak811', {timeout:10000});
  await expect(page.locator('#experience')).not.toContainText('CURRENT ROLE');
  await expect(page.locator('main')).not.toContainText('BACKEND TOOLKIT');
  await expect(page.locator('.recognition-card')).toContainText('On the Spot Solver Award');
  await expect(page.locator('#experience')).toContainText('Kotak811');
  await expect(page.locator('html')).toHaveClass(/motion-enabled/);
  await page.locator('.infrastructure-visual').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.infrastructure-image').evaluate(image => image.style.getPropertyValue('--scroll-offset'))).not.toBe('');
  const imageOffset = await page.locator('.infrastructure-image').evaluate(image => image.style.getPropertyValue('--scroll-offset'));
  await page.evaluate(() => window.scrollBy({top:120, behavior:'instant'}));
  await expect.poll(() => page.locator('.infrastructure-image').evaluate(image => image.style.getPropertyValue('--scroll-offset'))).not.toBe(imageOffset);
  await page.getByRole('navigation', {name:'Main navigation'}).getByRole('link', {name:'Projects', exact:true}).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('#projects')).toContainText('TweetMe');
  await expect(page.locator('#projects')).toContainText('College Space');
  await expect(page.locator('#experience')).toContainText('Amazon');
  await expect(page.locator('#education')).toContainText('9.19/10.0');
  await expect(page.locator('#community a[href="https://100devtools.pages.dev/"]')).toHaveAttribute('target', '_blank');
  await expect(page.locator('#community a[href="https://shatranj.pages.dev/"]')).toHaveAttribute('target', '_blank');
  await page.locator('#community').scrollIntoViewIfNeeded();
  for (const image of await page.locator('main img').all()) {
    await expect(image).toHaveJSProperty('complete', true);
    expect(await image.evaluate(element => element.naturalWidth)).toBeGreaterThan(0);
  }
  await page.getByRole('button', {name:'Turn ambient music on'}).click();
  await expect(page.getByRole('button', {name:'Turn ambient music off'})).toBeVisible();
  await page.getByRole('slider', {name:'Music volume'}).fill('30');
  await page.getByRole('button', {name:'Turn ambient music off'}).click();
  await page.screenshot({path:path.join(report,'portfolio-desktop.png'), fullPage:true});
  for (const width of [390, 320]) {
    await page.setViewportSize({width, height:844});
    await page.getByRole('button', {name:'Open navigation'}).click();
    await expect(page.getByRole('navigation', {name:'Main navigation'})).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('navigation', {name:'Main navigation'})).not.toBeVisible();
    await expect(page.getByRole('button', {name:'Open navigation'})).toBeFocused();
    await page.getByRole('button', {name:'Open navigation'}).click();
    await page.getByRole('navigation', {name:'Main navigation'}).getByRole('link', {name:'Contact', exact:true}).click();
    await expect(page).toHaveURL(/#contact$/);
    if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)) throw new Error(`${width}px horizontal overflow`);
  }
  await page.screenshot({path:path.join(report,'portfolio-mobile.png'), fullPage:true});
  await page.emulateMedia({reducedMotion:'reduce'});
  const behavior = await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior);
  if(behavior !== 'auto') throw new Error('Reduced-motion scroll preference not respected');
  await expect(page.locator('html')).not.toHaveClass(/motion-enabled/);
  expect(await page.locator('.infrastructure-image').evaluate(image => getComputedStyle(image).translate)).toBe('none');
  await expect(page.locator('.terminal-output')).toContainText('Kotak811');
  expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
  const noScript = await browser.newContext({javaScriptEnabled:false});
  await noScript.route('https://portfolio.test/**', serve);
  const fallback = await noScript.newPage();
  await fallback.goto('https://portfolio.test/');
  await expect(fallback.locator('#experience')).toContainText('Kotak811');
  await expect(fallback.locator('.recognition-card')).toBeVisible();
  await noScript.close();
  if(errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
  console.log('Browser checks passed: direct portfolio sections, navigation, music, volume, mobile menu, responsive layout, and reduced motion.');
  await context.close();
} catch(error) {failures++;console.error(error);}
finally {await browser.close();}
if(failures) process.exitCode=1;
