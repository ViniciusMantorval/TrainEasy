const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); 
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const axios = require('axios');
const vosk = require('vosk');
const path = require('path');

require('dotenv').config({ path: 'OPENROUTER_API_KEY.env' }); // Caminho para o arquivo .env
const API_KEY = process.env.OPENROUTER_API_KEY;

const app = express();
const port = 3000;

const cors = require('cors');

app.use(cors());
app.use(express.json());

// Conexão com o banco
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',               // seu usuário do MySQL
  password: '',               
  database: 'traineasy'
});
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao banco de dados traineasy');
});

// Configurando onde salvar o vídeo
const storage = multer.diskStorage({
  destination: 'uploads/', // cria essa pasta se ainda não existir
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // nome único
  }
});
const upload = multer({ storage });

// Rota GET - lista todos os funcionários
app.get('/funcionarios', (req, res) => {
  db.query('SELECT * FROM funcionarios', (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});



// Rota POST - adiciona um novo funcionário
app.post('/funcionarios', (req, res) => {
  const { nome, email, cpf, cep, senha } = req.body;
  console.log('Dados recebidos:', { nome, email, cpf, cep, senha });

  if (!nome || !email || !cpf || !cep || !senha) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  bcrypt.hash(senha, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao criptografar a senha:', err);
      return res.status(500).send('Erro ao processar a senha.');
    }

    const sql = 'INSERT INTO funcionarios (nome, email, cpf, cep, senha) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, email, cpf, cep, hashedPassword], (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar funcionário:', err);
        return res.status(500).json({ erro: err });
      }

      // Buscar o funcionário recém-cadastrado
      const sql2 = 'SELECT * FROM funcionarios WHERE email = ?';
      db.query(sql2, [email], (err, results) => {
        if (err) {
          console.error('Erro ao buscar funcionário:', err);
          return res.status(500).send('Erro no servidor.');
        }

        if (results.length === 0) {
          return res.status(401).send('Usuário não encontrado.');
        }

        const funcionario = results[0];
        return res.json({
          mensagem: `Bem-vindo, ${funcionario.nome}!`,
          tipo: 'funcionario',
          id: funcionario.id_funcionario
        });
      });
    });
  });
});




app.post('/empresas', (req, res) => {
  const { nome, email, senha, cnpj } = req.body;
  console.log('Dados recebidos:', { nome, email, senha, cnpj });

  if (!nome || !email || !senha || !cnpj) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  bcrypt.hash(senha, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao criptografar a senha:', err);
      return res.status(500).send('Erro ao processar a senha.');
    }

    const sql = 'INSERT INTO empresas (nome, email, senha, cnpj) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome, email, hashedPassword, cnpj], (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar empresa:', err);
        return res.status(500).json({ erro: err });
      }

      const sqlEmpresa = 'SELECT * FROM empresas WHERE email = ?';
      db.query(sqlEmpresa, [email], (err, results) => {
        if (err) {
          console.error('Erro ao buscar empresa:', err);
          return res.status(500).send('Erro no servidor.');
        }

        if (results.length === 0) {
          return res.status(401).send('Usuário não encontrado.');
        }

        const empresa = results[0];
        return res.json({
          mensagem: `Bem-vindo, ${empresa.nome}!`,
          tipo: 'empresa',
          id: empresa.id_empresa
        });
      });
    });
  });
});




// Rota POST - Verifica funcionário no banco de dados e da acesso
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send('Email e senha são obrigatórios.');
  }

  // Primeiro tenta nos funcionários
  const sqlFuncionario = 'SELECT * FROM funcionarios WHERE email = ?';
  db.query(sqlFuncionario, [email], (err, results) => {
    if (err) {
      console.error('Erro ao buscar funcionário:', err);
      return res.status(500).send('Erro no servidor.');
    }

    if (results.length > 0) {
      const usuario = results[0];
      return bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
        if (err) return res.status(500).send('Erro ao comparar senhas.');
        if (!isMatch) return res.status(401).send('Senha incorreta.');
        return res.json({ mensagem: `Bem-vindo, ${usuario.nome}!`, tipo: 'funcionario', id:usuario.id_funcionario });
      });
    }

    // Se não achou funcionário, tenta nas empresas
    const sqlEmpresa = 'SELECT * FROM empresas WHERE email = ?';
    db.query(sqlEmpresa, [email], (err, results) => {
      if (err) {
        console.error('Erro ao buscar empresa:', err);
        return res.status(500).send('Erro no servidor.');
      }

      if (results.length === 0) {
        return res.status(401).send('Usuário não encontrado.');
      }

      const empresa = results[0];
      bcrypt.compare(senha, empresa.senha, (err, isMatch) => {
        if (err) return res.status(500).send('Erro ao comparar senhas.');
        if (!isMatch) return res.status(401).send('Senha incorreta.');
        return res.json({ mensagem: `Bem-vindo, ${empresa.nome}!`, tipo: 'empresa',id:empresa.id_empresa });
      });
    });
  });
});

function limparTranscricao(texto) {
  return texto
    .replace(/[^a-zA-ZÀ-ú0-9.,?!\s]/g, '') // Remove símbolos ruins
    .replace(/\s+/g, ' ')                  // Espaços duplicados
    .replace(/\b\w\b/g, '')                // Palavras de 1 letra
    .trim();
}


app.post('/upload-video', upload.single('video'), async (req, res) => {
  const videoPath = req.file.path;
  const audioPath = videoPath.replace(path.extname(videoPath), '.wav');

  try {
    // 1. Converter vídeo para áudio WAV ideal para Vosk
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .audioCodec('pcm_s16le') 
        .audioChannels(1)        
        .audioFrequency(16000)   
        .format('wav')
        .save(audioPath)
        .on('end', resolve)
        .on('error', reject);
    });

    // 2. Transcrição com Vosk
    if (!fs.existsSync('./model')) {
      return res.status(500).send('Modelo Vosk não encontrado. Coloque em ./model');
    }

    vosk.setLogLevel(0);
    const model = new vosk.Model('./model');
    const wfReader = fs.createReadStream(audioPath, { highWaterMark: 4096 });
    const rec = new vosk.Recognizer({ model, sampleRate: 16000 });

    let transcription = '';

    for await (const data of wfReader) {
      const ok = rec.acceptWaveform(data);
      if (ok) transcription += rec.result().text + ' ';
    }
    transcription += rec.finalResult().text;
    rec.free();
    model.free();

    transcription = limparTranscricao(transcription);
    
    if (!transcription.trim()) {
      return res.status(500).send('Não foi possível transcrever o vídeo.');
    }
    // console.log(transcription)
    console.log("Enviando transcrição com sucesso...");
    // Conexão ccom o DeepSeek Via Openrouter
    const transcriptionSafe = JSON.stringify(transcription);
    console.log("Chamada ao DeepSeek...");
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          {
            role: "user",
            content: `A partir do texto do vídeo abaixo, gere um treinamento com **formato JSON exatamente igual ao exemplo fornecido**.

Formato esperado:
\`\`\`json
{
  "resumo": {
    "introdução": "Texto introdutório explicando o conteúdo geral do vídeo.",
    "tópicos_principais": [
      {
        "titulo": "Título do tópico 1",
        "conteudo": "Descrição clara e didática do conteúdo do tópico 1"
      },
      {
        "titulo": "Título do tópico 2",
        "conteudo": [
          "item 1",
          "item 2"
        ]
      }
    ]
  },
  "quiz": [
    {
      "pergunta": "Enunciado da pergunta objetiva",
      "opcoes": {
        "A": "Opção A",
        "B": "Opção B",
        "C": "Opção C",
        "D": "Opção D"
      },
      "resposta_correta": "Letra correta (ex: 'A')"
    }
  ]
}
\`\`\`

**Regras**:
- Crie **um resumo claro e didático**, com uma introdução e ao menos 4 tópicos principais bem organizados.
- No campo \`conteudo\`, use string ou array de strings conforme fizer sentido.
- Gere **exatamente 20 perguntas objetivas**, com 4 opções (A-D) e 1 correta.
- Não inclua explicações adicionais nem comentários fora do JSON.
- O output deve ser **apenas o JSON final**, começando com \`{\` e terminando com \`}\`.

Texto do vídeo:
"${transcriptionSafe}"
    `
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000' // opcional
        },
        timeout: 300000
      }
    );


    let conteudoGeradoString = ''; // Declare a variável aqui, fora do bloco if/else
    let treinamentoObjeto; // Declare também a variável para o objeto parseado

    if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message && response.data.choices[0].message.content) {
        conteudoGeradoString = String(response.data.choices[0].message.content).trim();
        console.log("Conteúdo bruto da IA:", conteudoGeradoString); // Para depuração
    } else {
        console.warn('Resposta inesperada da OpenRouter:', response.data);
        return res.status(500).json({ sucesso: false, mensagem: 'Formato de resposta inesperado da IA.' });
    }

    try {
      const conteudoLimpo = conteudoGeradoString
        .replace(/^```json\s*/, '')
        .replace(/```$/, '');
      
      treinamentoObjeto = JSON.parse(conteudoLimpo);
    } catch (parseError) {
        console.error('Erro ao fazer parse do JSON da IA:', parseError);
        // Retorne um erro específico se o JSON for inválido
        return res.status(500).json({ sucesso: false, mensagem: 'Erro ao interpretar resposta JSON da IA. O formato pode estar incorreto.' });
    }
console.log("Enviando resposta com sucesso...");
    // 4. Enviar resposta final
    const pastaDestino = path.join(__dirname, 'videos', 'armazenados');
if (!fs.existsSync(pastaDestino)) {
  fs.mkdirSync(pastaDestino, { recursive: true });
}

const nomeArquivo = path.basename(videoPath);
const novoCaminhoVideo = path.join(pastaDestino, nomeArquivo);

// Mover o vídeo do path temporário para o destino final
fs.renameSync(videoPath, novoCaminhoVideo);

// Gerar o caminho a ser salvo (relativo para uso no frontend ou banco)
const video_url = `/videos/armazenados/${nomeArquivo}`;

    res.json({
      sucesso: true,
      transcricao: transcription,
      treinamento: treinamentoObjeto,
      video_url:video_url
    });
    console.log("Resposta recebida!");
    // Limpar arquivos temporários

    fs.unlinkSync(audioPath);

  } catch (error) {
    console.error('Erro no processamento:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao processar o vídeo.',
      detalhe: error.message || error.toString()
    });
  }
});

app.post("/salvar-treinamento", async (req, res) => {
  const { id_empresa, titulo, descricao, video_url, conteudo_json, data_inicio, data_encerramento } = req.body;
  console.log('Dados Recebidos: ',{ id_empresa, titulo, descricao, video_url, conteudo_json, data_inicio, data_encerramento })
    // await db.query(
    //   `INSERT INTO treinamentos (id_empresa, titulo, descricao, video_url, conteudo_json, data_inicio,data_encerramento )
    //    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    //   [id_empresa, titulo, descricao, video_url, JSON.stringify(conteudo_json),data_inicio,data_encerramento]
    // );

    const sql = `INSERT INTO treinamentos (id_empresa, titulo, descricao, video_url, conteudo_json,data_inicio, data_encerramento) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [id_empresa, titulo, descricao, video_url, JSON.stringify(conteudo_json),data_inicio,data_encerramento], (err, result) => {
      if (err) {return res.status(500).json({ erro: err });
    }else{
      res.send('Funcionário cadastrado com sucesso!');
        }
    });
});



app.get("/treinamentos", async (req, res) => {
  const idFuncionario = req.query.id_funcionario;
  try {
    const sql =`SELECT t.*
FROM treinamentos t
JOIN empresas e ON e.id_empresa = t.id_empresa
JOIN empresas_funcionarios ef ON ef.id_empresa = e.id_empresa
WHERE ef.id_funcionario = ?;`;

    db.query(sql,[idFuncionario], (err, results) => {
      if (err) {
        console.error("Erro ao buscar treinamentos:", err);
        return res.status(500).json({ error: "Erro ao buscar treinamentos" });
      }

      console.log("Treinamentos encontrados:", results);
      res.json(results); // Envia os dados para o frontend
    });

  } catch (error) {
    console.error("Erro inesperado:", error);
    res.status(500).json({ error: "Erro inesperado no servidor" });
  }
});



app.get('/treinamento/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM treinamentos WHERE id_treinamento = ?';
  const [rows] = await db.promise().query(query, [id]);

  if (rows.length > 0) {
    const treinamento = rows[0];
    console.log(treinamento);
    
    res.json(treinamento);
    // const conteudoJson = JSON(treinamento.conteudo_json); // Assumindo que `conteudo_json` está armazenado como string no banco
    // res.json({
    //   titulo: treinamento.titulo,
    //   descricao: treinamento.descricao,
    //   resumo: conteudoJson.resumo,
    //   quiz: conteudoJson.quiz,
    //   topicos: conteudoJson.tópicos_principais,
    // });
  } else {
    res.status(404).send('Treinamento não encontrado');
  }
});


app.post('/adicionar-funcionario', async (req, res) => {
  const { funcionario, id_empresa } = req.body;

  if (!funcionario || !id_empresa) {
    return res.status(400).send('Dados incompletos.');
  }

  // Busca o funcionário por email ou nome
  const sqlFuncionario = 'SELECT * FROM funcionarios WHERE email = ? OR nome = ?';
  db.query(sqlFuncionario, [funcionario, funcionario], (err, results) => {
    if (err) {
      console.error('Erro ao buscar funcionário:', err);
      return res.status(500).send('Erro ao buscar funcionário.');
    }

    if (results.length === 0) {
      return res.status(404).send('Funcionário não encontrado.');
    }

    const usuario = results[0];

    // Agora insere o vínculo na tabela empresas_funcionarios
    const sqlInsercao = 'INSERT INTO empresas_funcionarios (id_empresa, id_funcionario) VALUES (?, ?)';
    db.query(sqlInsercao, [id_empresa, usuario.id_funcionario], (err, insertResult) => {
      if (err) {
        console.error('Erro ao inserir vínculo:', err);
        return res.status(500).send('Erro ao vincular funcionário.');
      }

      res.status(200).send('Funcionário vinculado com sucesso.');
    });
  });
});

app.patch('/pagamento', (req, res) => {
  const { id_funcionario, id_empresa, nova_pontuacao } = req.body;

  const sql = `
    UPDATE empresas_funcionarios
SET  pontos_carteira = pontos_carteira +?*?, total_pontos = total_pontos+?*?
WHERE id_funcionario = ? and id_empresa = ?;
  `;

  db.query(sql, [nova_pontuacao,500,nova_pontuacao,500, id_funcionario, id_empresa], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar pontuação' });
    console.log("Pontuação atualizada com sucesso")
    res.json({ message: 'Pontuação atualizada com sucesso' });
  });
});




app.post('/status', (req, res) => {
  const {id_treinamento , id_funcionario} = req.body;

  const sql = `
    SELECT * FROM progresso_funcionario
    WHERE id_treinamento = ? and id_funcionario=?
  `;

  db.query(sql, [id_treinamento,id_funcionario], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao verificar status' });
    console.log("Verificando status do treinamento")
    if (result.length > 0) {
      console.log(result)
      res.json({ exists:true });
    }else{
      res.json({ exists:false });
    }
  });
});

app.post('/criar_progresso', (req, res) => {
  const {id_treinamento , id_funcionario} = req.body;
  console.log(id_treinamento,id_funcionario,"Criar Processo");
  
  const sql = `
    INSERT INTO progresso_funcionario(id_treinamento,id_funcionario,status)
    VALUES (?, ?,'em_andamento')
  `;

  db.query(sql, [id_treinamento,id_funcionario], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao tentar criar processo' });
    console.log("Processo Criado")
    res.json({ mensagem:"progresso criado"});
  });
});


app.patch('/finalizar_progresso', (req, res) => {
  const {nova_pontuacao,id_treinamento , id_funcionario} = req.body;
  console.log(nova_pontuacao, id_treinamento,id_funcionario,"finalizar processo");
  const sql = `
    UPDATE progresso_funcionario
    SET status='concluido', pontuacao_final=?
    WHERE id_treinamento=? and id_funcionario=?
  `;

  db.query(sql, [nova_pontuacao,id_treinamento,id_funcionario], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao tentar finalizar processo' });
    console.log("Processo finalizado")
    res.json({ mensagem:"progresso finalizado"});
  });
});

app.get("/api/estatisticas", async (req, res) => {
  const idEmpresa = req.query.id_empresa;
  console.log(idEmpresa);
  
  if (!idEmpresa) {
    return res.status(400).json({ erro: "id_empresa é obrigatório" });
  }

  try {
    // Treinamentos da empresa
    const [treinamentos] = await db.promise().query(
      "SELECT * FROM treinamentos WHERE id_empresa = ?",
      [idEmpresa]
    );

    // Total de funcionários da empresa com progresso em treinamentos
    const [funcionarios] = await db.promise().query(
      `SELECT COUNT(DISTINCT pf.id_funcionario) AS total
       FROM progresso_funcionario pf
       INNER JOIN treinamentos t ON t.id_treinamento = pf.id_treinamento
       WHERE t.id_empresa = ?`,
      [idEmpresa]
    );

    const totalFuncionarios = funcionarios[0].total;
    let totalPontos = 0;
    let totalConclusaoPercentual = 0;
    const treinamentosResumo = [];

    for (const t of treinamentos) {
      const [progresso] = await db.promise().query(
        "SELECT status, pontuacao_final FROM progresso_funcionario WHERE id_treinamento = ?",
        [t.id_treinamento]
      );

      const participantes = progresso.length;
      const concluidos = progresso.filter(p => p.status === 'concluido').length;
      const totalPontuacao = progresso.reduce((acc, p) => acc + (p.pontuacao_final || 0), 0);
      const mediaPontuacao = participantes > 0 ? Math.round(totalPontuacao / participantes) : 0;
      const percentualConclusao = participantes > 0 ? Math.round((concluidos / participantes) * 100) : 0;

      totalPontos += totalPontuacao;
      totalConclusaoPercentual += percentualConclusao;

      treinamentosResumo.push({
        titulo: t.titulo,
        participantes,
        concluidos,
        media_pontuacao: mediaPontuacao,
        conclusao: percentualConclusao
      });
    }

    const mediaConclusao = treinamentos.length > 0 ? Math.round(totalConclusaoPercentual / treinamentos.length) : 0;

    res.json({
      totalFuncionarios,
      totalTreinamentos: treinamentos.length,
      totalPontos,
      mediaConclusao,
      treinamentos: treinamentosResumo
    });

  } catch (err) {
    console.error("Erro:", err);
    res.status(500).send("Erro ao gerar estatísticas");
  }
});


// Rota para retornar o ranking dos funcionários da empresa
app.get("/ranking", async (req, res) => {
  const id_empresa = req.query.id_empresa;
  if (!id_empresa) return res.status(400).json({ error: "id_empresa é obrigatório" });

  const query = `
    SELECT f.nome, ef.total_pontos
    FROM empresas_funcionarios ef
    JOIN funcionarios f ON f.id_funcionario = ef.id_funcionario
    WHERE ef.id_empresa = ?
    ORDER BY ef.total_pontos DESC
    LIMIT 5
  `;

  try {
    const [rows] =  await db.execute(query, [id_empresa]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar ranking" });
  }
});




// Rotas para mercado de pontos - funcionario
// Buscar pontos do funcionário
app.get("/pontos", async (req, res) => {
  const { id_funcionario, id_empresa } = req.query;
  const [rows] = await db.execute(
    "SELECT pontos_carteira as pontos FROM empresas_funcionarios WHERE id_funcionario = ? AND id_empresa = ?",
    [id_funcionario, id_empresa]
  );
  res.json(rows[0] || { pontos: 0 });
});



// Resgatar recompensa
app.post("/resgatar", async (req, res) => {
  const { id_funcionario, id_recompensa, id_empresa } = req.body;

  // Pegar preço da recompensa
  const [[recompensa]] = await db.execute("SELECT preco_pontos FROM recompensas WHERE id_recompensa = ?", [id_recompensa]);

  // Pegar pontos do funcionário
  const [[func]] = await db.execute(
    "SELECT pontos_carteira FROM empresas_funcionarios WHERE id_funcionario = ? AND id_empresa = ?",
    [id_funcionario, id_empresa]
  );

  if (!recompensa || !func || func.pontos_carteira < recompensa.preco_pontos) {
    return res.status(400).json({ error: "Pontos insuficientes ou dados inválidos." });
  }

  // Deduzir pontos
  await db.execute(
    "UPDATE empresas_funcionarios SET pontos_carteira = pontos_carteira - ? WHERE id_funcionario = ? AND id_empresa = ?",
    [recompensa.preco_pontos, id_funcionario, id_empresa]
  );

  // Registrar resgate
  await db.execute(
    "INSERT INTO recompensas_resgatadas (id_funcionario, id_recompensa) VALUES (?, ?)",
    [id_funcionario, id_recompensa]
  );

  res.sendStatus(200);
});

app.post("/criar-recompensas", async (req, res) => {
  const { nome, descricao, preco_pontos,id_empresa, quantidade} = req.body;
  console.log(nome, descricao, preco_pontos,id_empresa, quantidade);
  
  if (!nome || !descricao || !preco_pontos || preco_pontos < 1) {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  try {
    await db.execute(
      "INSERT INTO recompensas (nome, descricao, preco_pontos,id_empresa, quantidade_disponivel) VALUES (?, ?, ?,?,?)",
      [nome, descricao, preco_pontos,id_empresa, quantidade]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error("Erro ao inserir recompensa:", err);
    res.status(500).json({ error: "Erro interno." });
  }
});
app.get("/recompensas", async (req, res) => {
  const id_empresa = req.query.id_empresa;
  console.log("id_empresa recebido:", id_empresa);  
  try {
    const [recompensas] = await db.promise().execute("SELECT * FROM recompensas WHERE id_empresa = ?", [id_empresa]);
    res.status(200).json(recompensas);
  } catch (error) {
    console.error("Erro ao buscar recompensas:", error);
    res.status(500).json({ error: "Erro ao buscar recompensas." });
  }
});

app.put("/recompensas/:id", async (req, res) => {
  const { nome, descricao, preco_pontos,id_empresa, quantidade_disponivel } = req.body;
  const id = req.params.id;

  if (!id || !nome || !descricao || !preco_pontos || !id_empresa || !quantidade_disponivel) {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  try {
    await db.execute(
      "UPDATE recompensas SET nome = ?, descricao = ?, preco_pontos = ?, quantidade_disponivel=? WHERE id_recompensa = ?",
      [nome, descricao, preco_pontos, quantidade_disponivel, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao atualizar recompensa:", err);
    res.status(500).json({ error: "Erro ao atualizar." });
  }
});

// Deletar recompensa (DELETE)
app.delete("/recompensas/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.execute("DELETE FROM recompensas WHERE id_recompensa = ?", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao deletar recompensa:", err);
    res.status(500).json({ error: "Erro ao deletar." });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});