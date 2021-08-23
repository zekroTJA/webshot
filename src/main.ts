import { $log } from '@tsed/logger';
import puppeteer from 'puppeteer';
import { getArgs } from './args';
import path from 'path';
import fs from 'fs';

$log.name = 'webshot';

(async () => {
  $log.info('Parsing args ...');
  const args = getArgs();

  try {
    fs.statSync(args.output);
  } catch (e: any) {
    if (e.errno === -4058) {
      $log.info('Creating output directory ...');
      fs.mkdirSync(args.output, { recursive: true });
    } else {
      throw e;
    }
  }

  $log.info('Starting up browser ...');
  const browser = await puppeteer.launch();

  const jobs = args.page.map(async (url) => {
    $log.info(`[${url}] Setting up page ...`);
    const page = await browser.newPage();
    const [width, height] = args.resolution;
    await page.setViewport({
      width: Math.floor(width / args.scale),
      height: Math.floor(height / args.scale),
      deviceScaleFactor: args.scale,
    });
    $log.info(`[${url}] Browsing page ...`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    $log.info(`[${url}] Taking screenshots ...`);
    await page.screenshot({
      path: getScreenshotName(args.output, url),
      type: 'png',
      fullPage: args.full,
    });
  });

  await Promise.all(jobs);

  $log.info('Shutting down browser ...');
  await browser.close();
})();

function getScreenshotName(dir: string, url: string): string {
  const fname = new URL(url).host.replace(/\./g, '-') + '.png';
  return path.join(dir, fname);
}
