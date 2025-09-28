
const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const meses = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

export function formatBRL(value: number): string {
  // manter padrão do Inter, incluindo -R$ 0,00 quando for -0.00
  const sign = Object.is(value, -0) || value === 0 ? (1 / value === -Infinity ? '-' : '') : (value < 0 ? '-' : '');
  const abs = Math.abs(value);
  return `${sign}${fmtBRL.format(abs)}`;
}

export function formatDateHeader(iso: string, saldoDia: number): string {
  const d = new Date(iso + 'T12:00:00'); // safe TZ
  const dia = d.getUTCDate();
  const mes = meses[d.getUTCMonth()];
  const ano = d.getUTCFullYear();
  return `${dia} de ${mes} de ${ano} Saldo do dia: ${formatBRL(saldoDia)}`;
}

export function upperName(s?: string): string | undefined {
  return s ? s.toUpperCase() : s;
}

export function truncateName(s: string, max = 44): string {
  if (s.length <= max) return s;
  return s.slice(0, max).trim();
}

