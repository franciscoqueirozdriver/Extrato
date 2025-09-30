import { Scenario } from "../core/types.js";

const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const fmtBRL = (v:number)=> {
  const negZero = (1/v === -Infinity);
  const sign = (v < 0 || negZero) ? '-' : '';
  const abs = Math.abs(v);
  return sign + abs.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
};
const caps = (s?:string)=> (s||'').toUpperCase().trim();
const trunc = (s:string,max=44)=> s.length>max ? s.slice(0,max).trim() : s;
const esc = (s:string)=> s.replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]!));

export function renderScenarioToHTML(s: Scenario): string {
  // saldo global
  let global = s.openingBalance ?? 0;

  const dayBlocks = s.days
    .slice()
    .sort((a,b)=> a.date.localeCompare(b.date))
    .map(day=>{
      const lines = day.entries.map(tx=>{
        global += tx.amount;
        const desc = (()=> {
          switch(tx.type){
            case 'PIX_ENVIADO_CP':   return `Pix enviado: "Cp :${tx.cpCode}-${caps(trunc(tx.counterparty||''))}"`;
            case 'PIX_RECEBIDO_CP':  return `Pix recebido: "Cp :${tx.cpCode}-${caps(trunc(tx.counterparty||''))}"`;
            case 'PIX_ENVIADO_NOCP': return `Pix enviado: "${tx.phonePrefix} ${tx.phone} ${caps(trunc(tx.counterparty||''))}"`;
            case 'PIX_RECEBIDO_NOCP':return `Pix recebido: "${tx.phonePrefix} ${tx.phone} ${caps(trunc(tx.counterparty||''))}"`;
            case 'PAGAMENTO':        return `Pagamento`;
            case 'PAGAMENTO_EFETUADO':return `Pagamento efetuado: "${tx.freeText||''}"`;
            case 'ROTATIVO':         return `Rotativo Digital: "${(tx.city||'').toUpperCase()}"`;
            case 'CASHBACK':         return `Cashback: "${tx.freeText||''}"`;
            case 'COMPRA_DEBITO': {
              const base = (tx.freeText||'').trim();
              const rotulo = base.toLowerCase().startsWith('no estabelecimento')
                ? base : (base ? `No estabelecimento ${base}` : 'No estabelecimento');
              return `Compra no debito: "${rotulo}"`;
            }
          }
        })();
        return `<div class="line"><div class="desc">${esc(desc)}</div><div class="vals"><span>${fmtBRL(tx.amount)}</span><span>${fmtBRL(global)}</span></div></div>`;
      }).join('');

      const d = new Date(day.date+'T12:00:00');
      const header = `${d.getUTCDate()} de ${meses[d.getUTCMonth()]} de ${d.getUTCFullYear()} Saldo do dia: ${fmtBRL(global)}`;

      return `<section class="day">${lines}<div class="header-dia">${esc(header)}</div></section>`;
    }).join('');

  const saldoHeader = s.saldo_total ? `
  <section class="head card">
    <div class="hline title">Saldo total</div>
    <div class="hline money">${Number(s.saldo_total.total).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
    <div class="hline muted">(bloqueado + disponível)</div>
    <hr/>
    <div class="hline title">Saldo disponível:</div>
    <div class="hline money">${Number(s.saldo_total.disponivel).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
    <hr/>
    <div class="hline title">Saldo bloqueado:</div>
    <div class="hline money">${Number(s.saldo_total.bloqueado).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
  </section>` : '';

  // Cabeçalho de identificação
  const H = s.header ?? {};
  const periodo = (H.periodoInicio && H.periodoFim)
    ? `${new Date(H.periodoInicio+'T00:00:00').toLocaleDateString('pt-BR')} a ${new Date(H.periodoFim+'T00:00:00').toLocaleDateString('pt-BR')}`
    : '';

  const headerBlock = `
  <section class="id card">
    <div class="id-col">
      <div class="lbl">Titular</div>
      <div class="val">${esc(H.titular ?? '')}</div>
    </div>
    <div class="id-col">
      <div class="lbl">Documento</div>
      <div class="val">${esc(H.documento ?? '')}</div>
    </div>
    <div class="id-col">
      <div class="lbl">Conta</div>
      <div class="val">${esc(H.conta ?? 'Banco Inter')}</div>
    </div>
    <div class="id-col">
      <div class="lbl">Período</div>
      <div class="val">${esc(periodo)}</div>
    </div>
  </section>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<title>Extrato – Banco Inter</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  @page { size: A4; margin: 16mm 12mm; }
  *{box-sizing:border-box}
  body{margin:0;font:12px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,Inter,Arial,sans-serif;color:#141414;background:#fff}
  .topbar{height:6px;background:#ff6e00;margin:0 0 8px 0;}
  .wrap{max-width:820px;margin:0 auto}
  header{display:flex;justify-content:space-between;align-items:center;padding:8px 0 12px;margin-bottom:4px}
  .brand{font-weight:700} .brand b{color:#ff6e00}
  .muted{color:#6a6a6a}
  .card{border:1px solid #ededed;border-radius:8px;padding:10px;margin:8px 0}
  .statement{padding-top:4px}
  .head .hline{padding:2px 0}
  .head .title{font-weight:600}
  .money{font-variant-numeric: tabular-nums}
  hr{border:0;border-top:1px solid #eaeaea;margin:6px 0}
  .id{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
  .id .lbl{font-size:11px;color:#6a6a6a}
  .id .val{font-size:13px}
  .day{margin:8px 0 14px}
  .line{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px dashed #e8e8e8;white-space:pre-wrap}
  .line:last-child{border-bottom:0}
  .desc{font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
  .vals{display:flex;gap:12px;min-width:200px;justify-content:flex-end;font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
  .header-dia{margin-top:6px;padding-top:6px;border-top:1px solid #e8e8e8;font-weight:600}
  .day + .day { page-break-inside: avoid; }
</style>
</head>
<body>
  <div class="topbar"></div>
  <div class="wrap">
    <header>
      <div class="brand">Extrato <b>Inter</b></div>
      <div class="muted">${new Date().toLocaleDateString('pt-BR')}</div>
    </header>
    ${headerBlock}
    ${saldoHeader}
    <main class="statement">
      ${dayBlocks}
    </main>
  </div>
</body>
</html>`;
}
