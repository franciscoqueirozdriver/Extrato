
import { Scenario, DayBlock } from './types.js';
import { formatDateHeader } from './format.js';
import { renderInterLine } from '../banks/inter/templates.js';

export function renderScenarioToText(s: Scenario): string {
  const lines: string[] = [];
  // Cabeçalho opcional (saldo total)
  if (s.saldo_total) {
    lines.push('Saldo total');
    lines.push(`R$ ${s.saldo_total.total.toFixed(2)}`.replace('.', ','));
    lines.push('(bloqueado + disponível)');
    lines.push('');
    lines.push('Saldo disponível:');
    lines.push(`R$ ${s.saldo_total.disponivel.toFixed(2)}`.replace('.', ','));
    lines.push('');
    lines.push('Saldo bloqueado:');
    lines.push(`R$ ${s.saldo_total.bloqueado.toFixed(2)}`.replace('.', ','));
    lines.push('');
  }

  const days: DayBlock[] = s.days;

  for (const day of days) {
    // render entradas
    for (const t of day.entries) {
      lines.push(renderInterLine(t));
    }
    // cabeçalho "Saldo do dia"
    const saldoDia = day.saldo_dia ?? (day.entries.at(-1)?.balanceAfter ?? 0);
    lines.push(formatDateHeader(day.date, saldoDia));
    lines.push(''); // linha em branco como separador
  }

  return lines.join('\n');
}

