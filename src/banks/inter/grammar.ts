
// Regex para validar linhas geradas (usado nos testes)
export const GRAMMAR = {
  PIX_CP_ENVIADO: /^Pix enviado: "Cp :\d{1,12}-[A-Z0-9À-Ü\s\.\-&]+" -?R\$ [\d\.]+,\d{2} -?R\$ [\d\.]+,\d{2}$/,
  PIX_CP_RECEBIDO: /^Pix recebido: "Cp :\d{1,12}-[A-Z0-9À-Ü\s\.\-&]+" R\$ [\d\.]+,\d{2} -?R\$ [\d\.]+,\d{2}$/,
  PIX_NOCP_ENVIADO: /^Pix enviado: "\d{5} \d{7,12} [A-Z0-9À-Ü\s\.\-&]+" -?R\$ [\d\.]+,\d{2} -?R\$ [\d\.]+,\d{2}$/,
  PIX_NOCP_RECEBIDO:/^Pix recebido: "\d{5} \d{7,12} [A-Z0-9À-Ü\s\.\-&]+" R\$ [\d\.]+,\d{2} -?R\$ [\d\.]+,\d{2}$/,

  PAGAMENTO: /^Pagamento -?R\$ [\d\.]+,\d{2} -?R\$ [\d\.]+,\d{2}$/,
  PAGAMENTO_EFETUADO: /^Pagamento efetuado: ".+" -?R\$ [\d\.]+,\d{2} -?R\$ [\d\.]+,\d{2}$/,

  ROTATIVO: /^Rotativo Digital: "[A-Z]{2,3}" -?R\$ [\d\.]+,\d{2} -?R\$ [\d\.]+,\d{2}$/,
  CASHBACK: /^Cashback: ".+" R\$ [\d\.]+,\d{2} -?R\$ [\d\.]+,\d{2}$/,

  COMPRA_DEBITO: /^Compra no debito: ".+" -?R\$ [\d\.]+,\d{2} -?R\$ [\d\.]+,\d{2}$/,

  HEADER_DIA: /^\d{1,2} de [A-Za-zçãéó]+ de \d{4} Saldo do dia: -?R\$ [\d\.]+,\d{2}$/
};

