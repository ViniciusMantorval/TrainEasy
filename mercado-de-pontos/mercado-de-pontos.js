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
  initializePage();
  setupEventListeners();
  loadUserData();
  checkThemePreference();
  loadMarketData(); // Função específica do mercado de pontos
});

// Inicializar página
function initializePage() {
  updateNotificationCount();
  renderNotifications();
  restoreActiveMenuItem();
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
      else if (currentPage.includes('mercado-de-pontos') && href.includes('mercado-de-pontos')) {
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

// Ver todas as notificações
function viewAllNotifications() {
  showNotification('Redirecionando para todas as notificações...', 'info');
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

// Abrir ajuda
function openHelp() {
  showNotification('Abrindo central de ajuda...', 'info');
}

// Logout
function logout() {
  if (confirm('Tem certeza que deseja sair?')) {
    showNotification('Fazendo logout...', 'info');
    // Aqui você pode adicionar a lógica de logout
    setTimeout(() => {
      window.location.href = '../login/login.html';
    }, 1000);
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

// ===== CÓDIGO ESPECÍFICO DO MERCADO DE PONTOS =====

// Carregar dados do mercado de pontos
async function loadMarketData() {
  const userId = sessionStorage.getItem("id_funcionario");

  if (!userId) {
    showNotification('ID do funcionário não encontrado', 'error');
    return;
  }

  const pontosElement = document.getElementById("pontos");
  const listaRecompensas = document.getElementById("lista-recompensas");
  let pontos = 0;

  // Função para formatar números
  function formatNumber(num) {
    return new Intl.NumberFormat('pt-BR').format(num);
  }

  try {
    showLoadingOverlay();

    // Buscar pontos do funcionário
    const resPontos = await fetch(`http://traineasy.selfip.com:3000/pontos?id_funcionario=${userId}`);
    const dados = await resPontos.json();
    pontos = dados.pontos || 0;
    pontosElement.innerText = `Você possui ${formatNumber(pontos)} pontos disponíveis.`;

    // Buscar recompensas
    const resRecompensas = await fetch(`http://traineasy.selfip.com:3000/recompensas?id_funcionario=${userId}`);
    const recompensas = await resRecompensas.json();

    // Limpar container
    listaRecompensas.innerHTML = '';

    if (recompensas && recompensas.length > 0) {
      recompensas.forEach((r, index) => {
        const div = document.createElement("div");
        div.className = "reward-card";
        div.style.animationDelay = `${index * 0.1}s`;

        const title = document.createElement("h3");
        title.innerText = r.nome;

        const desc = document.createElement("p");
        desc.innerText = r.descricao;

        const preco = document.createElement("p");
        preco.className = "price";
        preco.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gem">
            <path d="M6 3h12l4 6-10 13L2 9l4-6Z"/>
            <path d="M12 22V9"/>
            <path d="M2 9l10 13 10-13"/>
            <path d="M4 6l8 4 8-4"/>
          </svg>
          Custa ${formatNumber(r.preco_pontos)} pontos
        `;

        const botao = document.createElement("button");
        botao.className = "redeem-btn";
        botao.innerHTML = `
          Resgatar
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right">
            <path d="M5 12h14"/>
            <path d="M12 5l7 7-7 7"/>
          </svg>
        `;
        botao.disabled = r.preco_pontos > pontos;

        botao.addEventListener("click", async () => {
          const confirmado = confirm(`Deseja resgatar "${r.nome}" por ${formatNumber(r.preco_pontos)} pontos?`);
          if (!confirmado) return;

          try {
            showLoadingOverlay();
            
            const res = await fetch("http://traineasy.selfip.com:3000/resgatar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id_funcionario: userId,
                id_recompensa: r.id_recompensa
              })
            });

            if (res.ok) {
              showNotification("Recompensa resgatada com sucesso!", 'success');
              setTimeout(() => {
                location.reload();
              }, 1500);
            } else {
              showNotification("Erro ao resgatar recompensa.", 'error');
            }
          } catch (error) {
            console.error("Erro ao resgatar:", error);
            showNotification("Erro ao resgatar recompensa.", 'error');
          } finally {
            hideLoadingOverlay();
          }
        });

        div.appendChild(title);
        div.appendChild(desc);
        div.appendChild(preco);
        div.appendChild(botao);
        listaRecompensas.appendChild(div);
      });
    } else {
      listaRecompensas.innerHTML = `
        <div class="no-rewards" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--gray-500);">
          <i class="fas fa-store" style="font-size: 3rem; margin-bottom: 1rem; color: var(--gray-400);"></i>
          <h3 style="color: var(--gray-600); margin-bottom: 0.5rem;">Nenhuma recompensa disponível</h3>
          <p>Novas recompensas aparecerão aqui em breve.</p>
        </div>
      `;
    }

  } catch (err) {
    console.error("Erro ao carregar mercado:", err);
    pontosElement.innerText = "Erro ao carregar pontos.";
    showNotification('Erro ao carregar dados do mercado', 'error');
    
    listaRecompensas.innerHTML = `
      <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error-color); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--error-color); margin-bottom: 0.5rem;">Erro ao carregar recompensas</h3>
        <p style="color: var(--gray-500); margin-bottom: 1rem;">Verifique sua conexão e tente novamente.</p>
        <button onclick="loadMarketData()" class="redeem-btn" style="margin-top: 1rem;">Tentar novamente</button>
      </div>
    `;
  } finally {
    hideLoadingOverlay();
  }
}

