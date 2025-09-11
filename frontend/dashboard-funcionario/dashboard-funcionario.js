// Variáveis globais
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
  initializeDashboard();
  setupEventListeners();
  loadUserData();
  checkThemePreference();
  fillDashboarInfo();
  loadTrainings(); // Função original para carregar treinamentos
});

// Inicializar dashboard
function initializeDashboard() {
  updateNotificationCount();
  renderNotifications();
  restoreActiveMenuItem(); // Adicionar esta linha
}

// Restaurar item ativo do menu baseado na URL atual
function restoreActiveMenuItem() {
  const currentPage = window.location.pathname.toLowerCase();
  const navItems = document.querySelectorAll('.nav-item');
  
  // Primeiro, remover todas as classes active
  navItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Depois, ativar apenas o item correto baseado na URL
  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      const href = link.getAttribute('href').toLowerCase();
      
      // Verificar se é a página do dashboard
      if (currentPage.includes('dashboard-funcionario') && href.includes('dashboard-funcionario')) {
        item.classList.add('active');
      }
      // Verificar se é a página de treinamentos
      else if (currentPage.includes('treinamento') && href.includes('treinamento') && !href.includes('dashboard')) {
        item.classList.add('active');
      }
      // Verificar se é a página de certificados
      else if (currentPage.includes('certificados') && href.includes('certificados')) {
        item.classList.add('active');
      }
      // Verificar se é a página de mercado de pontos
      else if (currentPage.includes('mercado') && href.includes('mercado')) {
        item.classList.add('active');
      }
      // Verificar se é a página de progresso
      else if (currentPage.includes('progresso') && href.includes('progresso')) {
        item.classList.add('active');
      }
      // Verificar se é a página de configurações
      else if (currentPage.includes('configuracoes') && href.includes('configuracoes')) {
        item.classList.add('active');
      }
    }
  });
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

// ===== CÓDIGO ORIGINAL PARA CARREGAR TREINAMENTOS =====
async function loadTrainings() {
  const container = document.querySelector(".cursos-container");
  const userId = sessionStorage.getItem("id_funcionario");
  
  console.log(userId);
  
  if (!userId) {
    showNotification('ID do funcionário não encontrado', 'error');
    return;
  }
  
  try {
    showLoadingOverlay();
    
    const res = await fetch(`http://traineasy.selfip.com:3000/treinamentos?id_funcionario=${userId}`);
    const treinamentos = await res.json();
    
    console.log(treinamentos);
    
    // Limpar container
    container.innerHTML = '';
    
    if (treinamentos && treinamentos.length > 0) {
      treinamentos.forEach(treinamento => {
        const card = document.createElement("div");
        card.classList.add("curso-card");

        card.innerHTML = `
          <h4>${treinamento.titulo}</h4>
          <p class="curso-desc">${treinamento.descricao}</p>
          <p class="progresso">Progresso: 0%</p>
          <p class="data-inicio">Início: ${new Date(treinamento.data_inicio).toLocaleDateString('pt-BR')}</p>
          <button onclick="abrirTreinamento(${treinamento.id_treinamento})">Acessar</button>
        `;

        container.appendChild(card);
      });
      
    } else {
      container.innerHTML = `
        <div class="no-trainings">
          <i class="fas fa-graduation-cap" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
          <h3 style="color: var(--gray-600); margin-bottom: 0.5rem;">Nenhum treinamento disponível</h3>
          <p style="color: var(--gray-500);">Novos treinamentos aparecerão aqui quando forem atribuídos a você.</p>
        </div>
      `;
    }
    
  } catch (error) {
    console.error("Erro ao carregar treinamentos:", error);
    showNotification('Erro ao carregar treinamentos', 'error');
    
    container.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error-color); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--error-color); margin-bottom: 0.5rem;">Erro ao carregar treinamentos</h3>
        <p style="color: var(--gray-500);">Verifique sua conexão e tente novamente.</p>
        <button onclick="loadTrainings()" style="margin-top: 1rem;">Tentar novamente</button>
      </div>
    `;
  } finally {
    hideLoadingOverlay();
  }
}

async function fillDashboarInfo() {
  const userId = sessionStorage.getItem("id_funcionario");

  const res = await fetch(`http://traineasy.selfip.com:3000/fill_dashboard_funcionario?id=${userId}`);
  const response = await res.json();
  const totalTrainings = document.getElementById("totalTrainings");
  const totalCertificates = document.getElementById("totalCertificates");
  const totalPoints = document.getElementById("totalPoints");
  const completionRate = document.getElementById("completionRate");

  totalTrainings.innerText = response.treinamentos_concluidos
  totalCertificates.innerText = response.certificados_emitidos
  totalPoints.innerText = response.pontos_acumulados
  completionRate.innerText = `${response.taxa_conclusao_percentual}%`
}

function abrirTreinamento(id) {
  showNotification('Abrindo treinamento...', 'info');
  window.location.href = `../treinamento/treinamento.html?id=${id}`;
}

