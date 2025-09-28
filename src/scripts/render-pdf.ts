import { readFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import YAML from 'yaml';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { Scenario } from '../core/types.js';
import { renderScenarioToHTML } from '../templates/inter-html.js';

function arg(name: string, fallback: string): string {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

function bail(msg: string, code = 1): never {
  console.error(msg);
  process.exit(code);
}

function loadScenario(path: string): Scenario {
  const raw = readFileSync(path, 'utf8');
  return YAML.parse(raw) as Scenario;
}

async function launchBrowser() {
  const executablePath = await chromium.executablePath();
  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: executablePath || undefined,
    headless: chromium.headless,
  });
}

async function main() {
  const scenarioPath = arg('scenario', 'scenarios/inter-demo.yml');
  const outPath = arg('out', 'public/extrato.pdf');

  const scenario = loadScenario(scenarioPath);
  if (scenario.bank !== 'INTER') {
    bail('Apenas bank: INTER é suportado nesta versão.');
  }

  const html = renderScenarioToHTML(scenario);

  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('screen');

  mkdirSync(dirname(outPath), { recursive: true });
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '16mm', right: '12mm', bottom: '16mm', left: '12mm' },
  });

  await browser.close();
  console.log(`OK: gerado ${outPath}`);
}

main().catch((err) => {
  bail(`Falha ao gerar PDF: ${(err as Error).message}`);
});
