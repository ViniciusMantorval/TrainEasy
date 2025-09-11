// Variáveis globais
let currentTraining = null;
let isDarkMode = false;
let notifications = [
  {
    id: 1,
    icon: 'fas fa-graduation-cap',
    title: 'Treinamento atualizado',
    message: 'O treinamento "JavaScript Avançado" foi modificado',
    time: '5 min atrás',
    unread: true
  },
  {
    id: 2,
    icon: 'fas fa-users',
    title: 'Novo funcionário',
    message: 'Maria Silva foi adicionada ao departamento',
    time: '1 hora atrás',
    unread: true
  },
  {
    id: 3,
    icon: 'fas fa-chart-line',
    title: 'Relatório disponível',
    message: 'Relatório mensal de progresso está pronto',
    time: '2 horas atrás',
    unread: false
  }
];

// ==========================================
// FUNCIONALIDADES ORIGINAIS DO SERVIDOR
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
    // Inicializar funcionalidades modernas
    initializeModernFeatures();
    
    // Carregar treinamento original
    await loadTraining();
});

// Função original para carregar treinamento
async function loadTraining() {
    const params = new URLSearchParams(window.location.search);
    const id_treinamento = params.get('id');
    
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const conteudoDiv = document.getElementById("conteudo");
    
    if (!id_treinamento) {
        showEmptyState('ID do treinamento não fornecido');
        return;
    }
    
    console.log('Carregando treinamento ID:', id_treinamento);
    
    try {
        showLoadingState();
        
        const res = await fetch(`http://traineasy.selfip.com:3000/list_edit_treinamento/${id_treinamento}`);
        const treinamentos = await res.json();
        
        hideLoadingState();
        
        if (treinamentos && treinamentos.length > 0) {
            currentTraining = treinamentos[0];
            renderizarEditor(treinamentos);
        } else {
            showEmptyState('Treinamento não encontrado');
        }
    } catch (error) {
        console.error("Erro ao carregar treinamento:", error);
        hideLoadingState();
        showEmptyState('Erro ao carregar treinamento');
        showNotification('Erro ao carregar treinamento', 'error');
    }
}

// Função original para renderizar editor (mantida e melhorada)
function renderizarEditor(treinamentos) {
    const conteudoDiv = document.getElementById("conteudo");
    const treinamento = treinamentos[0];
    const { resumo, quiz } = treinamento.conteudo_json;

    let html = `
        <div class="training-header">
            <h2><i class="fas fa-graduation-cap"></i> ${treinamento.titulo}</h2>
            <p><em>${treinamento.descricao}</em></p>
        </div>

        <div class="training-section">
            <h3><i class="fas fa-file-text"></i> Resumo</h3>
            <div class="introducao">
                <label><strong>Introdução:</strong></label>
                <textarea id="introducao-auto" rows="4" placeholder="Digite a introdução do treinamento...">${resumo.introdução}</textarea>
            </div> 
            
            <h3><i class="fas fa-list"></i> Tópicos principais:</h3>
            <div id="topicos-auto">`;

    resumo.tópicos_principais.forEach((t, i) => {
        html += `
            <div class="topico" data-index="${i}">
                <label><strong>Título do Tópico ${i + 1}:</strong></label>
                <input type="text" name="titulo_${i}" value="${t.titulo}" placeholder="Digite o título do tópico">
                <label><strong>Conteúdo:</strong></label>`;
        if (Array.isArray(t.conteudo)) {
            html += `<textarea rows="4" name="conteudo_${i}" placeholder="Digite o conteúdo do tópico...">${t.conteudo.join("\n")}</textarea>`;
        } else {
            html += `<textarea rows="4" name="conteudo_${i}" placeholder="Digite o conteúdo do tópico...">${t.conteudo}</textarea>`;
        }
        html += "</div>";
    });

    html += `</div>
        </div>
        
        <div class="training-section">
            <h3><i class="fas fa-question-circle"></i> Quiz</h3>
            <div id="quiz-auto">`;

    quiz.forEach((q, i) => {
        html += `
            <div class="pergunta" data-index="${i}">
                <label><strong>Pergunta ${i + 1}:</strong></label>
                <input type="text" name="pergunta_${i}" value="${q.pergunta}" placeholder="Digite a pergunta">
                <label><strong>Opções:</strong></label>
                <div class="opcoes-grid">`;
        for (const [letra, texto] of Object.entries(q.opcoes)) {
            html += `
                <div class="opcao-item">
                    <label>Opção ${letra}:</label>
                    <input type="text" name="opcao_${i}_${letra}" value="${texto}" placeholder="Digite a opção ${letra}">
                </div>`;
        }
        html += `</div>
                <div class="resposta-correta">
                    <label><strong>Resposta correta:</strong></label>
                    <select name="resposta_${i}">
                        <option value="A" ${q.resposta_correta === 'A' ? 'selected' : ''}>A</option>
                        <option value="B" ${q.resposta_correta === 'B' ? 'selected' : ''}>B</option>
                        <option value="C" ${q.resposta_correta === 'C' ? 'selected' : ''}>C</option>
                        <option value="D" ${q.resposta_correta === 'D' ? 'selected' : ''}>D</option>
                    </select>
                </div>
            </div>`;
    });

    html += `</div>
        </div>
        
        <div class="save-section">
            <button id="btnSalvarAuto" class="btn-primary">
                <i class="fas fa-save"></i>
                Salvar Treinamento
            </button>
        </div>`;
    
    conteudoDiv.innerHTML = html;

    // Adicionar listener para o botão de salvar
    document.getElementById('btnSalvarAuto').addEventListener('click', salvarTreinamentoGerado);
    
    // Animar entrada dos elementos
    animateFormElements();
}

// Função original para salvar treinamento (mantida e melhorada)
async function salvarTreinamentoGerado() {
    const params = new URLSearchParams(window.location.search);
    const id_treinamento = params.get('id');

    if (!id_treinamento) {
        showNotification('ID do treinamento não encontrado', 'error');
        return;
    }

    // Mostrar loading
    showLoadingOverlay();

    try {
        const titulo = document.querySelector('.training-header h2').textContent.replace('🎓 ', '').trim();
        const descricao = document.querySelector('.training-header p em').textContent;

        const introducao = document.getElementById('introducao-auto').value;

        const topicosPrincipais = [];
        document.querySelectorAll('#topicos-auto .topico').forEach((topicoDiv, i) => {
            const tituloTopico = topicoDiv.querySelector(`input[name="titulo_${i}"]`).value;
            const conteudoTopico = topicoDiv.querySelector(`textarea[name="conteudo_${i}"]`).value;
            topicosPrincipais.push({
                titulo: tituloTopico,
                conteudo: conteudoTopico.split('\n')
            });
        });

        const quiz = [];
        document.querySelectorAll('#quiz-auto .pergunta').forEach((perguntaDiv, i) => {
            const perguntaTexto = perguntaDiv.querySelector(`input[name="pergunta_${i}"]`).value;
            const opcoes = {};
            
            ['A', 'B', 'C', 'D'].forEach(letra => {
                const inputOpcao = perguntaDiv.querySelector(`input[name="opcao_${i}_${letra}"]`);
                if (inputOpcao) {
                    opcoes[letra] = inputOpcao.value;
                }
            });
            
            const respostaCorreta = perguntaDiv.querySelector(`select[name="resposta_${i}"]`).value;

            quiz.push({
                pergunta: perguntaTexto,
                opcoes: opcoes,
                resposta_correta: respostaCorreta
            });
        });

        const conteudo_json = {
            resumo: {
                introdução: introducao,
                tópicos_principais: topicosPrincipais
            },
            quiz: quiz
        };

        const res = await fetch(`http://traineasy.selfip.com:3000/update_treinamento/${id_treinamento}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: titulo,
                descricao: descricao,
                conteudo_json: conteudo_json
            })
        });

        const data = await res.json();

        hideLoadingOverlay();

        if (res.ok) {
            showSuccessModal(data.message || 'Treinamento salvo com sucesso!');
            showNotification('Treinamento salvo com sucesso!', 'success');
        } else {
            showErrorModal(`Erro ao salvar treinamento: ${data.error}`);
            showNotification('Erro ao salvar treinamento', 'error');
        }
    } catch (error) {
        console.error("Erro ao salvar treinamento:", error);
        hideLoadingOverlay();
        showErrorModal("Erro de conexão ao tentar salvar o treinamento.");
        showNotification('Erro de conexão', 'error');
    }
}

// ==========================================
// FUNCIONALIDADES MODERNAS ADICIONADAS
// ==========================================

// Inicializar funcionalidades modernas
function initializeModernFeatures() {
  setupEventListeners();
  loadUserData();
  checkThemePreference();
  updateNotificationCount();
  renderNotifications();
  restoreActiveMenuItem();
  loadCompanyInfo();
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
function loadUserData() {
  const welcomeText = document.getElementById('boasVindas');
  const companyName = document.getElementById('nome_empresa');
  
  if (welcomeText) welcomeText.textContent = 'Olá, Equipe RH!';
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

// Ativar modo escuro
function enableDarkMode() {
  document.body.classList.add('dark');
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.className = 'fas fa-sun';
  }
  isDarkMode = true;
  localStorage.setItem('theme', 'dark');
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
}

// Alternar tema
function toggleTheme() {
  if (isDarkMode) {
    disableDarkMode();
   
  } else {
    enableDarkMode();
    
  }
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
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  element.classList.add('active');
}

// Restaurar item ativo do menu
function restoreActiveMenuItem() {
  const currentPage = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      const href = link.getAttribute('href');
      if (currentPage.includes('editar-treinamentos') || href.includes('criar-treinamento')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    }
  });
}

// Carregar informações da empresa
function loadCompanyInfo() {
  const companyNameElement = document.getElementById('company_name');
  const empresaNome = sessionStorage.getItem('nome_empresa') || localStorage.getItem('nome_fantasia') || 'TechCorp Solutions';
  
  if (companyNameElement) {
    companyNameElement.textContent = empresaNome;
  }
}



// Logout
function logout() {
  showLoadingOverlay();
  
  setTimeout(() => {
    hideLoadingOverlay();
   
    // Limpar dados locais
    localStorage.clear();
    sessionStorage.clear();
  }, 2000);
}

// Voltar para página anterior
function goBack() {
  window.history.back();
}

// Visualizar treinamento
function previewTraining() {
  if (currentTraining) {
    showNotification('Abrindo visualização do treinamento...', 'info');
    // Implementar visualização
  } else {
    showNotification('Nenhum treinamento carregado', 'warning');
  }
}

// Fechar todos os dropdowns
function closeAllDropdowns(event) {
  const dropdowns = document.querySelectorAll('.notifications-dropdown, .user-menu-dropdown');
  
  dropdowns.forEach(dropdown => {
    if (!dropdown.contains(event.target) && !event.target.closest('.notification-btn, .user-menu-btn')) {
      dropdown.classList.remove('show');
    }
  });
}

// Manipular atalhos de teclado
function handleKeyboardShortcuts(event) {
  // Ctrl/Cmd + S para salvar
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault();
    const saveBtn = document.getElementById('btnSalvarAuto');
    if (saveBtn) {
      saveBtn.click();
    }
  }
  
  // Ctrl/Cmd + K para busca
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    toggleSearch();
  }
  
  // Escape para fechar dropdowns
  if (event.key === 'Escape') {
    document.querySelectorAll('.show').forEach(element => {
      element.classList.remove('show');
    });
  }
}

// Manipular redimensionamento da janela
function handleWindowResize() {
  // Fechar sidebar no mobile se a tela ficar maior
  if (window.innerWidth > 1024) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('show');
    }
  }
}

// Animar elementos do formulário
function animateFormElements() {
  const elements = document.querySelectorAll('.introducao, .topico, .pergunta');
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'all 0.3s ease-out';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Estados de loading e empty
function showLoadingState() {
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  const conteudo = document.getElementById('conteudo');
  
  if (loadingState) loadingState.style.display = 'flex';
  if (emptyState) emptyState.style.display = 'none';
  if (conteudo) conteudo.style.display = 'none';
}

function hideLoadingState() {
  const loadingState = document.getElementById('loadingState');
  const conteudo = document.getElementById('conteudo');
  
  if (loadingState) loadingState.style.display = 'none';
  if (conteudo) conteudo.style.display = 'block';
}

function showEmptyState(message) {
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  const conteudo = document.getElementById('conteudo');
  
  if (loadingState) loadingState.style.display = 'none';
  if (conteudo) conteudo.style.display = 'none';
  if (emptyState) {
    emptyState.style.display = 'flex';
    const messageElement = emptyState.querySelector('p');
    if (messageElement) messageElement.textContent = message;
  }
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

// Mostrar modal de sucesso
function showSuccessModal(message) {
  const modal = document.getElementById('successModal');
  if (modal) {
    const messageElement = modal.querySelector('.modal-body p');
    if (messageElement) messageElement.textContent = message;
    modal.classList.add('show');
  }
}

// Fechar modal de sucesso
function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// Mostrar modal de erro
function showErrorModal(message) {
  const modal = document.getElementById('errorModal');
  if (modal) {
    const messageElement = modal.querySelector('#errorMessage');
    if (messageElement) messageElement.textContent = message;
    modal.classList.add('show');
  }
}

// Fechar modal de erro
function closeErrorModal() {
  const modal = document.getElementById('errorModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// Mostrar notificação
function showNotification(message, type = 'info') {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="closeNotification(this)">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Adicionar estilos inline para a notificação
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-primary);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    min-width: 300px;
    max-width: 400px;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
  `;
  
  // Adicionar ao body
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover automaticamente após 5 segundos
  setTimeout(() => {
    closeNotification(notification.querySelector('.notification-close'));
  }, 5000);
}

// Obter ícone da notificação
function getNotificationIcon(type) {
  const icons = {
    info: 'info-circle',
    success: 'check-circle',
    warning: 'exclamation-triangle',
    error: 'times-circle'
  };
  return icons[type] || 'info-circle';
}

// Fechar notificação
function closeNotification(button) {
  const notification = button.closest('.notification');
  if (notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
}

