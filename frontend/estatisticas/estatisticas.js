// Variáveis globais
let currentSection = 'estatisticas';
let isDarkMode = false;
let notifications = [
  {
    id: 1,
    icon: 'fas fa-chart-line',
    title: 'Relatório mensal disponível',
    message: 'O relatório de estatísticas de outubro está pronto',
    time: '2 min atrás',
    unread: true
  },
  {
    id: 2,
    icon: 'fas fa-users',
    title: 'Novo funcionário adicionado',
    message: 'João Silva foi adicionado ao departamento de TI',
    time: '1 hora atrás',
    unread: true
  },
  {
    id: 3,
    icon: 'fas fa-trophy',
    title: 'Meta de treinamentos atingida',
    message: 'Parabéns! Sua empresa atingiu 95% de conclusão',
    time: '3 horas atrás',
    unread: false
  }
];

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  initializeStatistics();
  setupEventListeners();
  loadUserData();
  checkThemePreference();
  loadStatistics(); // Função original para carregar estatísticas do servidor
});

// Inicializar página de estatísticas
function initializeStatistics() {
  showSection('estatisticas');
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
function loadUserData() {
  const welcomeText = document.getElementById('boasVindas');
  const companyName = document.getElementById('nome_empresa');
  
  // Carregar dados do localStorage se disponível
  const nomeFantasia = localStorage.getItem("nome_fantasia");
  
  if (welcomeText) welcomeText.textContent = 'Bem-vindo, Admin';
  if (companyName) companyName.textContent = nomeFantasia || 'TechCorp Solutions';
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

// Mostrar seção
function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    currentSection = sectionId;
  }
  
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Definir item ativo do menu
function setActiveMenuItem(element) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
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

// Fechar todos os dropdowns
function closeAllDropdowns(event) {
  const dropdowns = document.querySelectorAll('.notifications-dropdown, .user-menu-dropdown, .filter-options');
  
  dropdowns.forEach(dropdown => {
    if (!dropdown.contains(event.target) && !event.target.closest('.notification-btn, .user-menu-btn, .filter-btn')) {
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
  
  // Redimensionar gráfico se existir
  if (window.chartInstance) {
    window.chartInstance.resize();
  }
}

// ===== CÓDIGO ORIGINAL PARA CARREGAR ESTATÍSTICAS DO SERVIDOR =====
async function loadStatistics() {
  const idEmpresa = sessionStorage.getItem("id_empresa");
  console.log(idEmpresa, "front");
  
  if (!idEmpresa) {
    showNotification('ID da empresa não encontrado', 'error');
    return;
  }
  
  try {
    showLoadingOverlay();
    
    const res = await fetch(`http://traineasy.selfip.com:3000/api/estatisticas?id_empresa=${idEmpresa}`);
    
    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Atualizar cards de estatísticas
    updateStatCard('total-treinamentos', data.totalTreinamentos, 'Treinamentos');
    updateStatCard('media-conclusao', `${data.mediaConclusao}%`, 'Conclusão Média');
    updateStatCard('total-funcionarios', data.totalFuncionarios, 'Funcionários');
    updateStatCard('total-pontos', data.totalPontos, 'Pontos Distribuídos');
    
    // Atualizar tabela de treinamentos
    updateTrainingsTable(data.treinamentos);
    
    // Criar gráfico
    createChart(data.treinamentos);
    
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
    showNotification('Erro ao carregar estatísticas', 'error');
    showEmptyState();
  } finally {
    hideLoadingOverlay();
  }
}

// Atualizar card de estatística
function updateStatCard(cardId, value, label) {
  const card = document.getElementById(cardId);
  if (card) {
    const numberElement = card.querySelector('.stat-content h3');
    const labelElement = card.querySelector('.stat-content p');
    
    if (numberElement) {
      // Animar o número
      animateNumber(numberElement, 0, parseInt(value) || 0, 2000, value.toString().includes('%'));
    }
    if (labelElement) labelElement.textContent = label;
  }
}

// Animar número
function animateNumber(element, start, end, duration, isPercentage = false) {
  const startTime = performance.now();
  
  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const current = Math.floor(start + (end - start) * progress);
    
    if (isPercentage) {
      element.textContent = current + '%';
    } else if (end > 1000) {
      element.textContent = current.toLocaleString('pt-BR');
    } else {
      element.textContent = current;
    }
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }
  
  requestAnimationFrame(updateNumber);
}

// Atualizar tabela de treinamentos
function updateTrainingsTable(treinamentos) {
  const tabela = document.getElementById("tabela-treinamentos");
  
  if (!tabela) return;
  
  // Limpar tabela
  tabela.innerHTML = '';
  
  if (treinamentos && treinamentos.length > 0) {
    treinamentos.forEach(t => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.titulo}</td>
        <td>${t.participantes}</td>
        <td>${t.concluidos}</td>
        <td>${t.media_pontuacao}</td>
        <td>${t.conclusao}%</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="viewTrainingDetails('${t.id}')" title="Ver detalhes">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" onclick="editTraining('${t.id}')" title="Editar">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </td>
      `;
      tabela.appendChild(tr);
    });
    
    // Esconder estado vazio
    hideEmptyState();
  } else {
    showEmptyState();
  }
}

// Criar gráfico
function createChart(treinamentos) {
  const canvas = document.getElementById("graficoConclusao");
  
  if (!canvas || !treinamentos || treinamentos.length === 0) return;
  
  // Destruir gráfico existente se houver
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }
  
  window.chartInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels: treinamentos.map(t => t.titulo),
      datasets: [{
        label: "Conclusão (%)",
        data: treinamentos.map(t => t.conclusao),
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 0
          }
        }
      }
    }
  });
}

// Mostrar estado vazio
function showEmptyState() {
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  
  if (emptyState) emptyState.style.display = 'flex';
  if (loadingState) loadingState.style.display = 'none';
}

// Esconder estado vazio
function hideEmptyState() {
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  
  if (emptyState) emptyState.style.display = 'none';
  if (loadingState) loadingState.style.display = 'none';
}

// ===== FUNÇÕES ADICIONAIS PARA FUNCIONALIDADES DA PÁGINA =====

// Atualizar estatísticas
function refreshStats() {
  showNotification('Atualizando estatísticas...', 'info');
  loadStatistics();
}

// Atualizar período do gráfico
function updateChartPeriod() {
  const period = document.getElementById('chartPeriod').value;
  showNotification(`Atualizando gráfico para ${period} dias...`, 'info');
  
  // Recarregar estatísticas com novo período
  setTimeout(() => {
    loadStatistics();
  }, 1000);
}

// Filtrar treinamentos
function filterTrainings() {
  const searchTerm = document.getElementById('searchTrainings').value.toLowerCase();
  const rows = document.querySelectorAll('#tabela-treinamentos tr');
  
  rows.forEach(row => {
    const title = row.cells[0]?.textContent.toLowerCase() || '';
    if (title.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Alternar dropdown de filtros
function toggleFilterDropdown() {
  const filterOptions = document.getElementById('filterOptions');
  if (filterOptions) {
    filterOptions.classList.toggle('show');
  }
}



// Ordenar tabela
function sortTable(column) {
  showNotification(`Ordenando por ${column}...`, 'info');
}

// Ver detalhes do treinamento
function viewTrainingDetails(id) {
  showNotification(`Carregando detalhes do treinamento ${id}...`, 'info');
}

// Editar treinamento
function editTraining(id) {
  showNotification(`Editando treinamento ${id}...`, 'info');
}

