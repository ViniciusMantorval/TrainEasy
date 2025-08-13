// Alternância de 
// tema claro/escuro
let video_url = null;

const toggleDark = document.getElementById('toggleDark');
toggleDark.addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

// Ocultar formulário manual (form-treinamento)
document.getElementById('form-treinamento').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById("form-treinamento").style.display = "none";
});


// Envio do vídeo
document.getElementById('formVideo').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  // Exibe status de carregamento
  document.getElementById("conteudo").innerText = "⏳ Processando vídeo...";
  let dadosTreinamento = null;

  try {
    const response = await fetch('http://localhost:3000/upload-video', {
      method: 'POST',
      body: formData
    });

    const resultado = await response.json();

    if (!resultado || !resultado.treinamento) {
      conteudo.innerHTML = "<p>Erro ao gerar conteúdo.</p>";
      return;
    }
    video_url = resultado.video_url
    dadosTreinamento = resultado.treinamento;
    renderizarEditor(dadosTreinamento);

    

    

  } catch (err) {
    alert('Erro ao enviar o vídeo');
    console.error(err);
    document.getElementById("conteudo").innerText = '';
  }
});

function renderizarEditor({ resumo, quiz }) {
      let html = `
        <h2>Resumo</h2>
        <div class = "introducao">
        <label><strong>Introdução:</strong></label><br>
        <textarea id="introducao" rows="3" cols="80">${resumo.introdução}</textarea><br><br>
        </div> 
        <h3>Tópicos principais:</h3>
        <div id="topicos">`;
  
      resumo.tópicos_principais.forEach((t, i) => {
        html += `
          <div class="topico">
            <label><strong>Título do Tópico ${i + 1}:</strong></label><br>
            <input type="text" name="titulo_${i}" value="${t.titulo}" size="80"><br>
            <label>Conteúdo:</label><br>`;
  
        if (Array.isArray(t.conteudo)) {
          html += `<textarea rows="3" cols="80" name="conteudo_${i}">${t.conteudo.join("\n")}</textarea>`;
        } else {
          html += `<textarea rows="3" cols="80" name="conteudo_${i}">${t.conteudo}</textarea>`;
        }
  
        html += "<br><br></div>";
      });
  
      html += `</div><h2>Quiz</h2><div id="quiz">`;
  
      quiz.forEach((q, i) => {
        html += `
          <div class="pergunta">
            <label><strong>Pergunta ${i + 1}:</strong></label><br>
            <input type="text" name="pergunta_${i}" value="${q.pergunta}" size="80"><br>
            <label>Opções:</label><br>`;
  
        for (const [letra, texto] of Object.entries(q.opcoes)) {
          html += `<input type="text" name="opcao_${i}_${letra}" value="${texto}" size="60"> (${letra})<br>`;
        }
  
        html += `<label>Resposta correta:</label>
                 <input type="text" name="resposta_${i}" value="${q.resposta_correta}" size="5"><br><br>
                 </div>`;
      });
  
      html += `</div><button onclick="salvarNoBanco()">Salvar no banco de dados</button>`;
      conteudo.innerHTML = html;
    }
    function salvarNoBanco() {
      const titulo = document.getElementById("nome").value;
      const descricao = document.getElementById("descricao").value;

      const data_inicio = document.getElementById("data_inicio").value;
      const data_encerramento = document.getElementById("data_encerramento").value;
      console.log(data_inicio ,data_encerramento )

      const introducao = document.getElementById("introducao").value;
  
      const topicosElements = document.querySelectorAll(".topico");
      const topicos = Array.from(topicosElements).map((el, i) => ({
        titulo: el.querySelector(`input[name="titulo_${i}"]`).value,
        conteudo: el.querySelector(`textarea[name="conteudo_${i}"]`).value.split("\n").map(l => l.trim()).filter(l => l)
      }));
  
      const perguntasElements = document.querySelectorAll(".pergunta");
      const quiz = Array.from(perguntasElements).map((el, i) => {
        const pergunta = el.querySelector(`input[name="pergunta_${i}"]`).value;
        const resposta_correta = el.querySelector(`input[name="resposta_${i}"]`).value;
        const opcoes = {};
        ["A", "B", "C", "D"].forEach(letra => {
          const input = el.querySelector(`input[name="opcao_${i}_${letra}"]`);
          if (input) opcoes[letra] = input.value;
        });
        return { pergunta, opcoes, resposta_correta };
      });
  
      const conteudo_json = {
        resumo: {
          introdução: introducao,
          tópicos_principais: topicos
        },
        quiz: quiz
      };

      const id_empresa = sessionStorage.getItem("userId");

      const data = {
        id_empresa,
        titulo,
        descricao,
        video_url,
        conteudo_json,
        data_inicio,
        data_encerramento
      };

      fetch("http://localhost:3000/salvar-treinamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(result => {
          alert("Treinamento salvo com sucesso!");
        })
        .catch(err => {
          alert("Erro ao salvar no banco.");
          console.error(err);
        });
    }