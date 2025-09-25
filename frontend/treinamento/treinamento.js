// Variáveis globais --- Arrumar linha 539
let isDarkMode = false;
let notifications = [
  {
    id: 1,
    icon: 'fas fa-graduation-cap',
    title: 'Novo treinamento disponível',
    message: 'JavaScript Avançado foi adicionado à sua lista',
    time: '1 hora atrás',
    unread: true
  },
  {
    id: 2,
    icon: 'fas fa-trophy',
    title: 'Parabéns!',
    message: 'Você completou 5 treinamentos este mês',
    time: '2 horas atrás',
    unread: true
  },
  {
    id: 3,
    icon: 'fas fa-star',
    title: 'Pontuação atualizada',
    message: 'Você ganhou 150 pontos no último quiz',
    time: '1 dia atrás',
    unread: false
  }
];

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  initializeTrainingPage();
  setupEventListeners();
  loadUserData();
  checkThemePreference();
  loadTrainingData(); // Função original do treinamento
});

// Inicializar página de treinamento
function initializeTrainingPage() {
  updateNotificationCount();
  renderNotifications();
}

// Configurar event listeners
function setupEventListeners() {
  // Fechar dropdowns ao clicar fora
  document.addEventListener('click', function(event) {
    closeAllDropdowns(event);
  });
  
  // Teclas de atalho
  document.addEventListener('keydown', function(event) {
    handleKeyboardShortcuts(event);
  });
  
  // Redimensionamento da janela
  window.addEventListener('resize', function() {
    handleWindowResize();
  });
}

// Carregar dados do usuário
function loadUserData() {//Atualizar para fetch
  const welcomeText = document.getElementById('boasVindas');
  const companyName = document.getElementById('nome_empresa');
  
  if (welcomeText) welcomeText.textContent = 'Bem-vindo, Funcionário';
  if (companyName) companyName.textContent = 'TechCorp Solutions';
}

// Verificar preferência de tema
function checkThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    enableDarkMode();
  }
}

// Alternar tema
function toggleTheme() {
  if (isDarkMode) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

// Ativar modo escuro
function enableDarkMode() {
  document.body.classList.add('dark');
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.className = 'fas fa-sun';
  }
  isDarkMode = true;
  localStorage.setItem('theme', 'dark');
  showNotification('Modo escuro ativado', 'info');
}

// Desativar modo escuro
function disableDarkMode() {
  document.body.classList.remove('dark');
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.className = 'fas fa-moon';
  }
  isDarkMode = false;
  localStorage.setItem('theme', 'light');
  showNotification('Modo claro ativado', 'info');
}

// Alternar notificações
function toggleNotifications() {
  const dropdown = document.getElementById('notificationsDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// Marcar todas as notificações como lidas
function markAllAsRead() {
  notifications.forEach(notification => {
    notification.unread = false;
  });
  updateNotificationCount();
  renderNotifications();
  showNotification('Todas as notificações foram marcadas como lidas', 'success');
}

// Atualizar contador de notificações
function updateNotificationCount() {
  const unreadCount = notifications.filter(n => n.unread).length;
  const countElement = document.querySelector('.notif-count');
  
  if (countElement) {
    if (unreadCount > 0) {
      countElement.textContent = unreadCount;
      countElement.style.display = 'block';
    } else {
      countElement.style.display = 'none';
    }
  }
}

// Renderizar notificações
function renderNotifications() {
  const notificationsList = document.querySelector('.notifications-list');
  if (!notificationsList) return;
  
  notificationsList.innerHTML = notifications.map(notification => `
    <div class="notification-item ${notification.unread ? 'unread' : ''}">
      <div class="notification-icon">
        <i class="${notification.icon}"></i>
      </div>
      <div class="notification-content">
        <h4>${notification.title}</h4>
        <p>${notification.message}</p>
        <span class="notification-time">${notification.time}</span>
      </div>
    </div>
  `).join('');
}

// Ver todas as notificações
function viewAllNotifications() {
  showNotification('Redirecionando para página de notificações...', 'info');
}

// Alternar busca
function toggleSearch() {
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');
  
  if (searchContainer) {
    searchContainer.classList.toggle('show');
    if (searchContainer.classList.contains('show')) {
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 300);
    }
  }
}

// Fechar busca
function closeSearch() {
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');
  
  if (searchContainer) {
    searchContainer.classList.remove('show');
    if (searchInput) searchInput.value = '';
  }
}

// Manipular busca
function handleSearch(event) {
  const query = event.target.value.toLowerCase();
  
  if (event.key === 'Enter' && query.trim()) {
    performSearch(query);
  }
}

// Executar busca
function performSearch(query) {
  showNotification(`Buscando por: "${query}"`, 'info');
  // Simular resultados de busca
  setTimeout(() => {
    showNotification(`Encontrados resultados para "${query}"`, 'success');
  }, 1000);
}

// Alternar menu do usuário
function toggleUserMenu() {
  const dropdown = document.getElementById('userMenuDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// Alternar sidebar (mobile)
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('show');
  }
}

// Fechar sidebar
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.remove('show');
  }
}

// Definir item ativo do menu
function setActiveMenuItem(element) {
  // Remover classe active de todos os itens
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Adicionar classe active ao item clicado
  element.classList.add('active');
}

// Abrir perfil
function openProfile() {
  showNotification('Abrindo perfil do usuário...', 'info');
}

// Abrir configurações
function openSettings() {
  showNotification('Abrindo configurações...', 'info');
}

// Abrir ajuda
function openHelp() {
  showNotification('Abrindo central de ajuda...', 'info');
}

// Logout
function logout() {
  showLoadingOverlay();
  
  setTimeout(() => {
    hideLoadingOverlay();
    showNotification('Logout realizado com sucesso!', 'success');
  }, 2000);
}

// Mostrar overlay de carregamento
function showLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.add('show');
  }
}

// Esconder overlay de carregamento
function hideLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

// Mostrar notificação
function showNotification(message, type = 'info') {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification-toast ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Adicionar estilos
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-primary);
    color: var(--gray-900);
    padding: 1rem 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--gray-200);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Fechar todos os dropdowns
function closeAllDropdowns(event) {
  const dropdowns = document.querySelectorAll('.notifications-dropdown, .user-menu-dropdown, .search-container');
  
  dropdowns.forEach(dropdown => {
    if (!dropdown.contains(event.target) && !event.target.closest('.notification-btn, .user-menu-btn, .search-btn')) {
      dropdown.classList.remove('show');
    }
  });
}

// Manipular atalhos de teclado
function handleKeyboardShortcuts(event) {
  // Ctrl/Cmd + K para busca
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    toggleSearch();
  }
  
  // Escape para fechar dropdowns
  if (event.key === 'Escape') {
    closeAllDropdowns({ target: document.body });
    closeSearch();
  }
}

// Manipular redimensionamento da janela
function handleWindowResize() {
  // Fechar sidebar no desktop
  if (window.innerWidth > 1024) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('show');
    }
  }
}

// ===== CÓDIGO ORIGINAL DO TREINAMENTO =====
// Função para carregar dados do treinamento (mantida do código original)
async function loadTrainingData() {
  const params = new URLSearchParams(window.location.search);
  const id_treinamento = params.get('id');
  const id_funcionario = sessionStorage.getItem("id_funcionario");
  
  console.log(id_treinamento, id_funcionario);
  
  try {
    const response = await fetch('https://traineasy.up.railway.app/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_treinamento, id_funcionario })
    });
  
    const data = await response.json(); 
  
    if (data.exists == false) {
      // Faça o fetch para criar um novo status aqui
      await fetch('https://traineasy.up.railway.app/criar_progresso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_treinamento, id_funcionario })
      });
    }
  
  } catch (error) {
    showNotification('Erro ao verificar ou criar status', 'error');
    console.error(error);
  }
  
  try {
    const res = await fetch(`https://traineasy.up.railway.app/treinamento/${id_treinamento}`);
    const treinamento = await res.json();

    console.log(treinamento);

    if (treinamento) {
      // Exibir título e descrição
      document.querySelector("#titulo").textContent = treinamento.titulo;
      document.querySelector("#descricao").textContent = treinamento.descricao;

      // Exibir resumo
      if (treinamento.conteudo_json && treinamento.conteudo_json.resumo && treinamento.conteudo_json.resumo.introdução) {
        document.querySelector("#resumo").textContent = treinamento.conteudo_json.resumo.introdução;
      }
      
      if (treinamento.video_url) {
        const videoPlayer = document.querySelector("#video");
        const link = `..${treinamento.video_url}`;
        videoPlayer.src = link;  
        console.log(link);
        console.log(treinamento.video_url);
        videoPlayer.load();
      }
      
      // Exibir tópicos
      const containerTópicos = document.querySelector("#topicos");
      if (treinamento.conteudo_json && treinamento.conteudo_json.resumo && treinamento.conteudo_json.resumo.tópicos_principais) {
        const tópicos = treinamento.conteudo_json.resumo.tópicos_principais;

        if (Array.isArray(tópicos) && tópicos.length > 0) {
          tópicos.forEach(topico => {
            const topicoElement = document.createElement("li");
            topicoElement.classList.add("topico");
            if (Array.isArray(topico.conteudo) && topico.conteudo.length > 0) {
              topicoElement.innerHTML = `<strong>${topico.titulo}</strong>: ${topico.conteudo.join(' ')}`;
            } else {
              topicoElement.innerHTML = `<strong>${topico.titulo}</strong>: Não há conteúdo disponível.`;
            }
            containerTópicos.appendChild(topicoElement);
          });
        } else {
          containerTópicos.innerHTML = "<li>Não há tópicos disponíveis para este treinamento.</li>";
        }
      }

      // Exibir quiz
      const containerQuiz = document.querySelector("#quiz");

      if (treinamento.conteudo_json && treinamento.conteudo_json.quiz) {
        const quiz = treinamento.conteudo_json.quiz;
      
        if (Array.isArray(quiz) && quiz.length > 0) {
          quiz.forEach(questao => {
            const questaoElement = document.createElement("div");
            questaoElement.classList.add("quiz-questao");
      
            const perguntaElement = document.createElement("h4");
            perguntaElement.textContent = questao.pergunta;
            questaoElement.appendChild(perguntaElement);

            const quizOptionsDiv = document.createElement("div");
            quizOptionsDiv.classList.add("quiz-options");
      
            for (let [key, resposta] of Object.entries(questao.opcoes)) {
              const respostaElement = document.createElement("label");
              const input = document.createElement("input");
              input.type = "radio";
              input.name = `questao-${questao.pergunta}`;
              input.value = key;
              respostaElement.appendChild(input);
              
              const customRadio = document.createElement("span");
              customRadio.classList.add("radio-custom");
              respostaElement.appendChild(customRadio);

              respostaElement.appendChild(document.createTextNode(resposta));
              quizOptionsDiv.appendChild(respostaElement);
            }
            questaoElement.appendChild(quizOptionsDiv);
            containerQuiz.appendChild(questaoElement);
          });
      
          // Criar o botão e resultado dinamicamente
          const botaoEnviar = document.createElement("button");
          botaoEnviar.id = "enviar-quiz";
          botaoEnviar.textContent = "Enviar Respostas";
          containerQuiz.appendChild(botaoEnviar);
      
          const resultadoTexto = document.createElement("p");
          resultadoTexto.id = "resultado-quiz";
          containerQuiz.appendChild(resultadoTexto);
      
          // Adicionar o event listener

      // Preencher dados do certificado
      const nomeFuncionario = document.getElementById("nome");
      const nomeCurso = document.getElementById("curso");
      const dataCertificado = document.getElementById("data");
      const pontuacaoCertificado = document.getElementById("pontuacao");

      if (nomeFuncionario) {
        // Supondo que o nome do funcionário venha de algum lugar, talvez sessionStorage ou um endpoint de usuário
        // Por enquanto, usaremos um valor fixo ou um placeholder
        nomeFuncionario.textContent = "Funcionário Teste"; // Substitua por dados reais do funcionário
      }

      if (nomeCurso) {
        nomeCurso.textContent = treinamento.titulo; // Usa o título do treinamento como nome do curso
      }

      if (dataCertificado) {
        // Formatar a data atual ou usar a data de conclusão do treinamento se disponível
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexed
        const ano = hoje.getFullYear();
        dataCertificado.textContent = `${dia}/${mes}/${ano}`;
      }

      if (pontuacaoCertificado) {
        // Supondo que a pontuação venha de algum lugar, talvez do status do treinamento
        pontuacaoCertificado.textContent = "100"; // Substitua por dados reais da pontuação
      }
          botaoEnviar.addEventListener("click", async() => {
            let pontuacao = 0;
      
            quiz.forEach((questao) => {
              const opcoes = document.getElementsByName(`questao-${questao.pergunta}`);
              let respostaSelecionada = null;
      
              opcoes.forEach((opcao) => {
                if (opcao.checked) {
                  respostaSelecionada = opcao.value;
                }
              });
      
              if (respostaSelecionada === questao.resposta_correta) {
                pontuacao++;
              }
            });
      
            resultadoTexto.textContent = `Você acertou ${pontuacao} de ${quiz.length} questões.`;
            
            // Enviar pontuação para o servidor
            await fetch('https://traineasy.up.railway.app/pagamento', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id_funcionario: Number(id_funcionario),
                nova_pontuacao: pontuacao/quiz.length
              })
            });
            
            // Mostrar certificado
            const certificadoContainer = document.getElementById("certificado-container");
            const certificado = document.getElementById("certificado");

            const nome = document.getElementById("nome");
            const curso = document.getElementById("curso");
            const data = document.getElementById("data");
            const pontuacao_percent = document.getElementById("pontuacao");

            // Carregar dados do usuário (substituir por dados reais do banco)
            nome.innerText = sessionStorage.getItem("nome_funcionario") || "Funcionário";
            curso.innerText = treinamento.titulo;
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            const dataFormatada = `${dia}/${mes}/${ano}`;
            data.innerText = dataFormatada;
            pontuacao_percent.innerText = Math.round((pontuacao/quiz.length)*100);

            // Atualizar elementos de data no footer
            const dataDia = document.querySelector('.data-dia');
            const dataMes = document.querySelector('.data-mes');
            const dataAno = document.querySelector('.data-ano');

            if (dataDia) dataDia.innerText = dia;
            if (dataMes) {
              const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
              dataMes.innerText = meses[dataAtual.getMonth()];
            }
            if (dataAno) dataAno.innerText = ano;

            // Mostrar o certificado
            certificadoContainer.style.display = 'block';
            certificadoContainer.scrollIntoView({ behavior: 'smooth' });

            // Gerar e salvar certificado
            html2canvas(certificado).then(async (canvas) => {
              const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

              const formData = new FormData();
              formData.append("nova_pontuacao", (pontuacao/quiz.length) * 500);
              formData.append("id_funcionario", id_funcionario);
              formData.append("id_treinamento", id_treinamento);
              formData.append("certificado", blob, "certificado.png");

              
              await fetch('https://traineasy.up.railway.app/finalizar_progresso', {
                method: 'PATCH',
                body:formData
              });
            });
            
            showNotification(`Quiz concluído! Pontuação: ${pontuacao}/${quiz.length}`, 'success');
          });
          
        } else {
          containerQuiz.innerHTML = "<p>Não há perguntas de quiz disponíveis para este treinamento.</p>";
        }
      }
    }
  } catch (error) {
    console.error("Erro ao carregar treinamento:", error);
    showNotification('Erro ao carregar dados do treinamento', 'error');
  }
}


