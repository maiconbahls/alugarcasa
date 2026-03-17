function doPost(e) {
  // Acessa a planilha ativa
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    // Tenta ler os dados enviados como JSON
    const data = JSON.parse(e.postData.contents);
    
    // Captura a data exata do momento do cadastro
    const dataHoraAtual = new Date();
    const dataFormatada = Utilities.formatDate(dataHoraAtual, "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");

    // Prepara a linha a ser inserida (A ordem aqui será a ordem das colunas no Excel)
    // Se a sua planilha não tiver esse cabeçalho, basta colocar nessa ordem:
    const rowData = [
      dataFormatada,            // Coluna A: Data/Hora do Cadastro
      data.nome_completo,       // Coluna B: Nome
      data.cpf,                 // Coluna C: CPF
      data.rg,                  // Coluna D: RG
      data.data_nascimento,     // Coluna E: Data de Nascimento
      data.email,               // Coluna F: Email
      data.telefone,            // Coluna G: Telefone
      data.estado_civil,        // Coluna H: Estado Civil
      data.profissao,           // Coluna I: Profissão
      data.clt,                 // Coluna J: CLT?
      data.empresa,             // Coluna K: Empresa
      data.data_admissao,       // Coluna L: Admissão
      data.renda_bruta,         // Coluna M: Renda Bruta
      data.valor_aluguel        // Coluna N: Valor Aluguel
    ];

    // Adiciona a linha ao final da planilha
    sheet.appendRow(rowData);

    // Retorna uma resposta de Sucesso para o formulário
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Retorna erro, caso ocorra algo
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Pega todos os dados da planilha
  const dados = sheet.getDataRange().getValues();
  
  // Array que vamos enviar de volta pra tela de Admin
  const jsonArray = [];
  
  // Pula a primeira linha (cabeçalho)
  // Assumimos que a Linha 1 é Cabelhaço e os os dados começam na Linha 2
  for (let i = 1; i < dados.length; i++) {
    let linha = dados[i];
    
    // Converte os valores pra JSON, casando exatamente com as colunas que definimos no formatoPost
    jsonArray.push({
      data_cadastro: linha[0],
      nome_completo: linha[1],
      cpf: linha[2],
      rg: linha[3],
      data_nascimento: linha[4],
      email: linha[5],
      telefone: linha[6],
      estado_civil: linha[7],
      profissao: linha[8],
      clt: linha[9],
      empresa: linha[10],
      data_admissao: linha[11],
      renda_bruta: linha[12],
      valor_aluguel: linha[13]
    });
  }
  
  // Retorna o JSON com todos os candidatos
  return ContentService.createTextOutput(JSON.stringify(jsonArray))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}
