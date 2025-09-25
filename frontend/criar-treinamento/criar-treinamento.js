document.addEventListener("DOMContentLoaded", () => {
  
    // Variável global para guardar a URL do vídeo (usada no modo automático)
    let video_url = null;
    let id_empresa = sessionStorage.getItem("id_empresa") || 1;
  
    // --- ELEMENTOS DO DOM ---
    // Agrupando todas as variáveis de elementos do DOM aqui para garantir que todas sejam carregadas
    const modoCriacaoSelect = document.getElementById('modo-criacao');
    const formManual = document.getElementById('form-manual');
    if (formManual) {
        console.log("Elemento 'form-manual' encontrado com sucesso.");
    } else {
        console.log("ERRO: Elemento 'form-manual' não encontrado no DOM.");
    }
    const formVideo = document.getElementById('formVideo');
    const conteudoDiv = document.getElementById('conteudo');
  
    // Botões do formulário manual
    const btnAdicionarTopico = document.getElementById('btnAdicionarTopico');
    const btnAdicionarPergunta = document.getElementById('btnAdicionarPergunta');
    const btnSalvarManual = document.getElementById('btnSalvarManual');
    
    // Contêineres para os itens dinâmicos - atualizados para nova estrutura
    const topicosContainer = document.getElementById('topicos-container');
    const quizContainer = document.getElementById('quiz-container');
    
    // Contadores para garantir IDs únicos
    let topicoCounter = 0;
    let perguntaCounter = 0;
    
    // --- FUNCIONALIDADES DO DASHBOARD ---
    
    // Toggle de notificações
    window.toggleNotifications = function() {
      const dropdown = document.getElementById('notificationsDropdown');
      dropdown.classList.toggle('show');
    };
  
    // Marcar todas as notificações como lidas
    window.markAllAsRead = function() {
      const unreadItems = document.querySelectorAll('.notification-item.unread');
      unreadItems.forEach(item => {
        item.classList.remove('unread');
      });
      
      // Atualizar contador
      const notifCount = document.querySelector('.notif-count');
      notifCount.textContent = '0';
      notifCount.style.display = 'none';
    };
  
    // Ver todas as notificações
    window.viewAllNotifications = function() {
      // Implementar navegação para página de notificações
      console.log('Navegando para todas as notificações...');
    };
  
    // Toggle de busca
    window.toggleSearch = function() {
      const searchContainer = document.getElementById('searchContainer');
      const searchInput = document.getElementById('searchInput');
      searchContainer.classList.toggle('show');
      if (searchContainer.classList.contains('show')) {
        searchInput.focus();
      }
    };
  
    // Fechar busca
    window.closeSearch = function() {
      const searchContainer = document.getElementById('searchContainer');
      const searchInput = document.getElementById('searchInput');
      searchContainer.classList.remove('show');
      searchInput.value = '';
    };
  
    // Busca
    window.handleSearch = function(event) {
      if (event.key === 'Enter') {
        const query = event.target.value;
        console.log('Buscando por:', query);
        // Implementar lógica de busca
      }
    };
  
    // Toggle de tema
    window.toggleTheme = function() {
      document.body.classList.toggle('dark');
      const themeIcon = document.getElementById('themeIcon');
      
      if (document.body.classList.contains('dark')) {
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
      } else {
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
      }
    };
  
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      document.getElementById('themeIcon').className = 'fas fa-sun';
    }
  
    // Toggle do menu do usuário
    window.toggleUserMenu = function() {
      const dropdown = document.getElementById('userMenuDropdown');
      dropdown.classList.toggle('show');
    };
  
    // Configurações
    window.openSettings = function() {
      console.log('Abrindo configurações...');
    };
  
    // Ajuda
    window.openHelp = function() {
      console.log('Abrindo ajuda...');
    };
  
    // Logout
    window.logout = function() {
      if (confirm('Tem certeza que deseja sair?')) {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = '../login/login.html';
      }
    };
  
    // Toggle da sidebar (mobile)
    window.toggleSidebar = function() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('show');
    };
  
    // Fechar sidebar
    window.closeSidebar = function() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.remove('show');
    };
  
    // Definir item ativo do menu
    window.setActiveMenuItem = function(element) {
      // Remove active de todos os itens
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Adiciona active ao item clicado
      element.classList.add('active');
    };
  
    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', (e) => {
      // Fechar notificações
      const notificationsDropdown = document.getElementById('notificationsDropdown');
      const notificationBtn = document.querySelector('.notification-btn');
      if (!notificationBtn.contains(e.target) && !notificationsDropdown.contains(e.target)) {
        notificationsDropdown.classList.remove('show');
      }
  
      // Fechar menu do usuário
      const userMenuDropdown = document.getElementById('userMenuDropdown');
      const userMenuBtn = document.querySelector('.user-menu-btn');
      if (!userMenuBtn.contains(e.target) && !userMenuDropdown.contains(e.target)) {
        userMenuDropdown.classList.remove('show');
      }
  
      // Fechar busca
      const searchContainer = document.getElementById('searchContainer');
      const searchBtn = document.querySelector('.search-btn');
      if (!searchBtn.contains(e.target) && !searchContainer.contains(e.target)) {
        searchContainer.classList.remove('show');
      }
    });
  
    // --- LÓGICA PRINCIPAL DO TREINAMENTO ---
  
    // Alternância entre modo Manual e Automático
    modoCriacaoSelect.addEventListener('change', (e) => {
        if (e.target.value === 'manual') {
            formManual.style.display = 'block';
            formVideo.style.display = 'none';
            conteudoDiv.innerHTML = ''; // Limpa o resultado do modo automático, se houver
        } else {
            formManual.style.display = 'none';
            formVideo.style.display = 'block';
        }
    });
  
    // Lógica do Modo Automático
    formVideo.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
  
        // Mostrar loading
        showLoading();
        conteudoDiv.innerText = "⏳ Processando vídeo...";
        let dadosTreinamento = null;
  
        try {
            const response = await fetch('https://traineasy.up.railway.app/upload-video', {
                method: 'POST',
                body: formData
            });
  
            const resultado = await response.json();
  
            if (!resultado || !resultado.treinamento) {
                conteudoDiv.innerHTML = "<p>Erro ao gerar conteúdo.</p>";
                return;
            }
            video_url = resultado.video_url;
            dadosTreinamento = resultado.treinamento;
            renderizarEditor(dadosTreinamento);
  
        } catch (err) {
            alert('Erro ao enviar o vídeo');
            console.error(err);
            conteudoDiv.innerText = '';
        } finally {
            hideLoading();
        }
    });
  
    // Carregar departamentos
    async function carregarDepartamentos(id_empresa) {
      try {
        const response = await fetch('https://traineasy.up.railway.app/list_departamento', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_empresa })
        });
  
        const departamentos = await response.json();
        console.log(departamentos);
        const select = document.getElementById('departamento');
        select.innerHTML = '<option value="">Selecione um departamento</option>';
  
        departamentos.forEach(dep => {
          const option = document.createElement('option');
          option.value = dep.id;
          option.textContent = dep.nome;
          select.appendChild(option);
        });
      } catch (error) {
        console.error('Erro ao carregar departamentos:', error);
      }
    }
    
    carregarDepartamentos(id_empresa);
  
    // Adicionar um novo campo de Tópico
    btnAdicionarTopico.addEventListener('click', () => {
        topicoCounter++;
        const novoTopicoDiv = document.createElement('div');
        novoTopicoDiv.className = 'topico topico-manual';
        novoTopicoDiv.id = `topico-${topicoCounter}`;
        novoTopicoDiv.innerHTML = `
            <div class="form-group">
                <label for="titulo-topico-${topicoCounter}">
                    <i class="fas fa-heading"></i>
                    Título do Tópico ${topicoCounter}
                </label>
                <input type="text" id="titulo-topico-${topicoCounter}" class="form-input titulo-topico" placeholder="Digite o título do tópico" required />
            </div>
            <div class="form-group">
                <label for="conteudo-topico-${topicoCounter}">
                    <i class="fas fa-align-left"></i>
                    Conteúdo do Tópico
                </label>
                <textarea id="conteudo-topico-${topicoCounter}" class="form-textarea conteudo-topico" placeholder="Descreva o conteúdo do tópico..." required></textarea>
            </div>
            <button type="button" class="btn-remover" data-target="topico-${topicoCounter}">
                <i class="fas fa-trash"></i>
                Remover Tópico
            </button>
        `;
        topicosContainer.appendChild(novoTopicoDiv);
    });
  
    // Adicionar um novo campo de Pergunta
    btnAdicionarPergunta.addEventListener('click', () => {
        perguntaCounter++;
        const novaPerguntaDiv = document.createElement('div');
        novaPerguntaDiv.className = 'pergunta pergunta-manual';
        novaPerguntaDiv.id = `pergunta-${perguntaCounter}`;
        novaPerguntaDiv.innerHTML = `
            <div class="form-group">
                <label for="enunciado-pergunta-${perguntaCounter}">
                    <i class="fas fa-question"></i>
                    Pergunta ${perguntaCounter}
                </label>
                <input type="text" id="enunciado-pergunta-${perguntaCounter}" class="form-input enunciado-pergunta" placeholder="Digite o enunciado da pergunta" required />
            </div>
            <div class="form-group">
                <label>
                    <i class="fas fa-list"></i>
                    Opções de Resposta
                </label>
                <div class="opcoes-container">
                    <input type="text" class="form-input opcao-pergunta" placeholder="Opção A" required />
                    <input type="text" class="form-input opcao-pergunta" placeholder="Opção B" required />
                    <input type="text" class="form-input opcao-pergunta" placeholder="Opção C" required />
                    <input type="text" class="form-input opcao-pergunta" placeholder="Opção D" required />
                </div>
            </div>
            <div class="form-group">
                <label for="resposta-correta-${perguntaCounter}">
                    <i class="fas fa-check-circle"></i>
                    Resposta Correta
                </label>
                <select id="resposta-correta-${perguntaCounter}" class="form-select resposta-correta">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>
            </div>
            <button type="button" class="btn-remover" data-target="pergunta-${perguntaCounter}">
                <i class="fas fa-trash"></i>
                Remover Pergunta
            </button>
        `;
        quizContainer.appendChild(novaPerguntaDiv);
    });
    
    // Delegação de evento para os botões "Remover"
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remover') || e.target.closest('.btn-remover')) {
            const button = e.target.classList.contains('btn-remover') ? e.target : e.target.closest('.btn-remover');
            const targetId = button.dataset.target;
            const elementToRemove = document.getElementById(targetId);
            if (elementToRemove) {
                elementToRemove.remove();
            }
        }
    });
  
    // Salvar os dados do formulário manual
    btnSalvarManual.addEventListener('click', async () => {
        // Mostrar loading
        showLoading();
  
        try {
            // Coletar dados básicos do treinamento
            const titulo = document.getElementById("nome").value;
            const descricao = document.getElementById("descricao").value;
            const data_inicio = document.getElementById("data_inicio").value;
            const data_encerramento = document.getElementById("data_encerramento").value;
            const introducao = document.getElementById("introducao").value;
            const id_departamento = document.getElementById("departamento").value;
            const id_empresa = sessionStorage.getItem("id_empresa") || 1;
  
            if (!titulo || !descricao || !data_inicio || !data_encerramento || !introducao) {
                alert("Por favor, preencha todos os campos principais (Nome, Descrição, Datas e Introdução).");
                return;
            }
  
            // Coletar tópicos
            const topicos = [];
            document.querySelectorAll('.topico-manual').forEach(div => {
                const tituloTopico = div.querySelector('.titulo-topico').value;
                const conteudoTopico = div.querySelector('.conteudo-topico').value;
                if (tituloTopico && conteudoTopico) {
                    topicos.push({
                        titulo: tituloTopico,
                        conteudo: conteudoTopico
                    });
                }
            });
  
            // Coletar perguntas do quiz
            const quiz = [];
            document.querySelectorAll('.pergunta-manual').forEach(div => {
                const enunciado = div.querySelector('.enunciado-pergunta').value;
                const opcoesInputs = div.querySelectorAll('.opcao-pergunta');
                const respostaCorreta = div.querySelector('.resposta-correta').value;
  
                if (enunciado && opcoesInputs.length === 4) {
                    quiz.push({
                        pergunta: enunciado,
                        opcoes: {
                            "A": opcoesInputs[0].value,
                            "B": opcoesInputs[1].value,
                            "C": opcoesInputs[2].value,
                            "D": opcoesInputs[3].value
                        },
                        resposta_correta: respostaCorreta
                    });
                }
            });
  
            // Montar o objeto JSON final
            const conteudo_json = {
                resumo: {
                    introdução: introducao,
                    tópicos_principais: topicos
                },
                quiz: quiz
            };
            
            const data = {
                id_empresa,
                titulo,
                descricao,
                video_url: null,
                conteudo_json,
                data_inicio,
                data_encerramento,
                id_departamento
            };
  
            // Enviar para o backend
            const res = await fetch("https://traineasy.up.railway.app/salvar-treinamento", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
  
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Erro do servidor: ${res.status} - ${errorText}`);
            }
  
            const result = await res.json();
            
            if (result.sucesso) {
                alert(result.mensagem);
                formManual.reset();
                // Limpar containers
                topicosContainer.innerHTML = '';
                quizContainer.innerHTML = '';
                // Reiniciar contadores
                topicoCounter = 0;
                perguntaCounter = 0;
            } else {
                alert("Erro ao salvar o treinamento: " + result.mensagem);
            }
        } catch (err) {
            alert("Erro ao salvar o treinamento. Tente novamente mais tarde");
            console.error(err);
        } finally {
            hideLoading();
        }
    });
  
    // Função para renderizar o editor do modo automático
    function renderizarEditor({ resumo, quiz }) {
        let html = `
            <div class="form-card">
                <div class="form-card-header">
                    <h3><i class="fas fa-edit"></i> Editar Conteúdo Gerado</h3>
                </div>
                <div class="form-card-content">
                    <div class="form-group">
                        <label for="introducao-auto">
                            <i class="fas fa-play-circle"></i>
                            Introdução:
                        </label>
                        <textarea id="introducao-auto" class="form-textarea" rows="3">${resumo.introdução}</textarea>
                    </div>
                    
                    <h4><i class="fas fa-list"></i> Tópicos principais:</h4>
                    <div id="topicos-auto">`;
  
        resumo.tópicos_principais.forEach((t, i) => {
            html += `
                <div class="topico">
                    <div class="form-group">
                        <label for="titulo_${i}">
                            <i class="fas fa-heading"></i>
                            Título do Tópico ${i + 1}:
                        </label>
                        <input type="text" id="titulo_${i}" name="titulo_${i}" class="form-input" value="${t.titulo}">
                    </div>
                    <div class="form-group">
                        <label for="conteudo_${i}">
                            <i class="fas fa-align-left"></i>
                            Conteúdo:
                        </label>`;
            if (Array.isArray(t.conteudo)) {
                html += `<textarea id="conteudo_${i}" name="conteudo_${i}" class="form-textarea" rows="3">${t.conteudo.join("\n")}</text.area>`;
            } else {
                html += `<textarea id="conteudo_${i}" name="conteudo_${i}" class="form-textarea" ro.ws="3">${t.conteudo}</textarea>`;
            }
            html += "</div></div>";
        });
  
        html += `</div>
                    
                    <h4><i class="fas fa-question-circle"></i> Quiz</h4>
                    <div id="quiz-auto">`;
  
        quiz.forEach((q, i) => {
            html += `
                <div class="pergunta">
                    <div class="form-group">
                        <label for="pergunta_${i}">
                            <i class="fas fa-question"></i>
                            Pergunta ${i + 1}:
                        </label>
                        <input type="text" id="pergunta_${i}" name="pergunta_${i}" class="form-input" value="${q.pergunta}">
                    </div>
                    <div class="form-group">
                        <label>
                            <i class="fas fa-list"></i>
                            Opções:
                        </label>`;
            for (const [letra, texto] of Object.entries(q.opcoes)) {
                html += `<input type="text" name="opcao_${i}_${letra}" class="form-input" value="${texto}" placeholder="Opção ${letra}">`;
            }
            html += `</div>
                        <div class="form-group">
                            <label for="resposta_${i}">
                                <i class="fas fa-check-circle"></i>
                                Resposta correta:
                            </label>
                            <input type="text" id="resposta_${i}" name="resposta_${i}" class="form-input" value="${q.resposta_correta}" style="width: 100px;">
                        </div>
                    </div>`;
        });
  
        html += `</div>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" id="btnSalvarAuto" class="btn-primary">
                    <i class="fas fa-save"></i>
                    Salvar Treinamento Gerado
                </button>
            </div>`;
        
        conteudoDiv.innerHTML = html;
        
        // Adicionar listener para o novo botão de salvar
        document.getElementById('btnSalvarAuto').addEventListener('click', salvarTreinamentoGerado);
    }
    
    // Função para salvar os dados do editor automático
    function salvarTreinamentoGerado() {
        showLoading();
  
        try {
            const titulo = document.getElementById("nome").value;
            const descricao = document.getElementById("descricao").value;
            const data_inicio = document.getElementById("data_inicio").value;
            const data_encerramento = document.getElementById("data_encerramento").value;
  
            if (!titulo || !descricao || !data_inicio || !data_encerramento) {
                alert("Preencha os campos Nome, Descrição e Datas antes de salvar o treinamento gerado.");
                return;
            }
            
            const introducao = document.getElementById("introducao-auto").value;
  
            const topicosElements = document.querySelectorAll("#topicos-auto .topico");
            const topicos = Array.from(topicosElements).map((el, i) => ({
                titulo: el.querySelector(`input[name="titulo_${i}"]`).value,
                conteudo: el.querySelector(`textarea[name="conteudo_${i}"]`).value
            }));
  
            const perguntasElements = document.querySelectorAll("#quiz-auto .pergunta");
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
  
            const data = {
                id_empresa,
                titulo,
                descricao,
                video_url,
                conteudo_json,
                data_inicio,
                data_encerramento
            };
  
            fetch("https://traineasy.up.railway.app/salvar-treinamento", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(result => {
                alert("Treinamento salvo com sucesso!");
                conteudoDiv.innerHTML = '';
            })
            .catch(err => {
                alert("Erro ao salvar no banco.");
                console.error(err);
            })
            .finally(() => {
                hideLoading();
            });
        } catch (err) {
            alert("Erro ao processar dados.");
            console.error(err);
            hideLoading();
        }
    }
  
    // Funções de loading
    function showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.add('show');
    }
  
    function hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.remove('show');
    }
  });
  

  

