import { readFileSync } from 'node:fs';
import { exportText } from './exporters/text.js';
import YAML from 'yaml';
import { Scenario } from './core/types.js';

function arg(name: string, fallback: string): string {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

// Agora sempre recebemos string:
const scenarioPath = arg('scenario', 'scenarios/inter-demo.yml');
const outPath = arg('out', 'build/extrato.txt');

function bail(msg: string, code = 1): never {
  console.error(msg);
  process.exit(code);
}

try {
  const raw = readFileSync(scenarioPath, 'utf8');
  const scenario = YAML.parse(raw) as Scenario;

  if (scenario.bank !== 'INTER') {
    bail('Apenas bank: INTER é suportado nesta versão.');
  }

  exportText(scenario, outPath);
  console.log(`OK: gerado ${outPath}`);
} catch (err) {
  bail(`Falha ao processar cenário em "${scenarioPath}": ${(err as Error).message}`);
}
