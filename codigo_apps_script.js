function doPost(e) {
  // Acessa a planilha ativa
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    // Tenta ler os dados enviados como JSON
    const data = JSON.parse(e.postData.contents);
    
    // Captura a data exata do momento do cadastro
    const dataHoraAtual = new Date();
    const dataFormatada = Utilities.formatDate(dataHoraAtual, "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");

    // Se a planilha estiver vazia (apenas uma linha ou nenhuma), adiciona o cabeçalho
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Data/Hora Cadastro", "Nome Completo", "CPF", "RG", "Nascimento", 
        "E-mail", "WhatsApp", "Estado Civil", "Profissão", "CLT?", 
        "Empresa", "Admissão", "Renda Bruta (R$)", "Aluguel Pretendido (R$)"
      ];
      sheet.appendRow(headers);
      // Opcional: coloca negrito no cabeçalho
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
    }

    // Prepara a linha a ser inserida (A ordem aqui será a ordem das colunas no Excel)
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
  
  // Pula a primeira linha (cabeçalho) e converte tudo pra String para evitar erros de data/número no JSON
  for (let i = 1; i < dados.length; i++) {
    let linha = dados[i];
    
    jsonArray.push({
      data_cadastro: String(linha[0]),
      nome_completo: String(linha[1]),
      cpf: String(linha[2]),
      rg: String(linha[3]),
      data_nascimento: String(linha[4]),
      email: String(linha[5]),
      telefone: String(linha[6]),
      estado_civil: String(linha[7]),
      profissao: String(linha[8]),
      clt: String(linha[9]),
      empresa: String(linha[10]),
      data_admissao: String(linha[11]),
      renda_bruta: String(linha[12]),
      valor_aluguel: String(linha[13])
    });
  }
  
  // Retorna o JSON com todos os candidatos
  return ContentService.createTextOutput(JSON.stringify(jsonArray))
    .setMimeType(ContentService.MimeType.JSON);
}
