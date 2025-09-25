// Variáveis globais
let currentSection = 'ranking';
let isDarkMode = false;
let notifications = [
  {
    id: 1,
    icon: 'fas fa-trophy',
    title: 'Novo líder no ranking',
    message: 'João Silva assumiu a primeira posição no ranking',
    time: '2 min atrás',
    unread: true
  },
  {
    id: 2,
    icon: 'fas fa-users',
    title: 'Ranking atualizado',
    message: 'O ranking mensal foi atualizado com novos dados',
    time: '1 hora atrás',
    unread: true
  },
  {
    id: 3,
    icon: 'fas fa-medal',
    title: 'Meta de pontuação atingida',
    message: '5 funcionários atingiram a meta mensal',
    time: '3 horas atrás',
    unread: false
  }
];

// Configuração da API (mantendo a original)
const API_CONFIG = {
  baseURL: 'https://traineasy.up.railway.app',
  endpoints: {
    ranking: '/ranking'
  },
  timeout: 15000
};

// Utilitários (mantendo os originais)
const Utils = {
  formatNumber(num) {
    return new Intl.NumberFormat('pt-BR').format(num);
  },
  
  calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  },
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  initializeRanking();
  setupEventListeners();
  loadUserData();
  checkThemePreference();
  
  // Verificar se Chart.js está disponível
  if (typeof Chart === 'undefined') {
    console.error('Chart.js não foi carregado. Verifique se o script está incluído.');
    document.getElementById('errorState').style.display = 'flex';
    document.getElementById('loadingState').style.display = 'none';
    return;
  }

  // Configurar Chart.js globalmente
  Chart.defaults.font.family = 'Inter';
  Chart.defaults.color = '#64748b';

  // Inicializar aplicação de ranking
  window.rankingApp = new RankingApp();
});

// Inicializar página de ranking
function initializeRanking() {
  showSection('ranking');
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
  const dropdowns = document.querySelectorAll('.notifications-dropdown, .user-menu-dropdown');
  
  dropdowns.forEach(dropdown => {
    if (!dropdown.contains(event.target) && !event.target.closest('.notification-btn, .user-menu-btn')) {
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
  if (window.rankingApp && window.rankingApp.chartManager && window.rankingApp.chartManager.chart) {
    window.rankingApp.chartManager.chart.resize();
  }
}

// Função para atualizar ranking (compatibilidade)
function refreshRanking() {
  if (window.rankingApp) {
    window.rankingApp.refresh();
  }
}

// ===== CÓDIGO ORIGINAL PARA RANKING (ADAPTADO) =====

// Gerenciador de estado da aplicação
class AppState {
  constructor() {
    this.rankingData = [];
    this.isLoading = false;
    this.error = null;
    this.chart = null;
    this.currentPeriod = 'all';
  }

  setLoading(status) {
    this.isLoading = status;
    this.updateLoadingUI();
  }

  setRankingData(data) {
    this.rankingData = data;
    this.updateStatsUI();
  }

  setError(error) {
    this.error = error;
    this.updateErrorUI();
  }

  updateLoadingUI() {
    const loadingState = document.getElementById('loadingState');
    const chartSection = document.querySelector('.chart-section');
    const statsSection = document.querySelector('.stats-section');
    
    if (this.isLoading) {
      if (loadingState) loadingState.style.display = 'flex';
      if (chartSection) chartSection.style.display = 'none';
      if (statsSection) statsSection.style.display = 'none';
    } else {
      if (loadingState) loadingState.style.display = 'none';
      if (chartSection) chartSection.style.display = 'block';
      if (statsSection) statsSection.style.display = 'block';
    }
  }

  updateErrorUI() {
    const errorState = document.getElementById('errorState');
    const chartSection = document.querySelector('.chart-section');
    const statsSection = document.querySelector('.stats-section');
    
    if (this.error) {
      if (errorState) errorState.style.display = 'flex';
      if (chartSection) chartSection.style.display = 'none';
      if (statsSection) statsSection.style.display = 'none';
    } else {
      if (errorState) errorState.style.display = 'none';
    }
  }

  updateStatsUI() {
    if (this.rankingData.length === 0) return;

    const pontuacoes = this.rankingData.map(f => f.total_pontos);
    const totalFuncionarios = this.rankingData.length;
    const mediaPontos = Utils.calculateAverage(pontuacoes);
    const maiorPontuacao = Math.max(...pontuacoes);
    
    // Simular crescimento médio (em uma aplicação real, isso viria do backend)
    const crescimentoMedio = 15;

    const totalFuncionariosEl = document.getElementById('totalFuncionarios');
    const mediaPontosEl = document.getElementById('mediaPontos');
    const maiorPontuacaoEl = document.getElementById('maiorPontuacao');
    const crescimentoMedioEl = document.getElementById('crescimentoMedio');

    if (totalFuncionariosEl) {
      animateNumber(totalFuncionariosEl, 0, totalFuncionarios, 2000);
    }
    if (mediaPontosEl) {
      animateNumber(mediaPontosEl, 0, Math.round(mediaPontos), 2000);
    }
    if (maiorPontuacaoEl) {
      animateNumber(maiorPontuacaoEl, 0, maiorPontuacao, 2000);
    }
    if (crescimentoMedioEl) {
      crescimentoMedioEl.textContent = `+${crescimentoMedio}%`;
    }

    // Atualizar subtítulo do gráfico
    const chartSubtitle = document.getElementById('chart-subtitle');
    if (chartSubtitle) {
      chartSubtitle.textContent = `${totalFuncionarios} funcionários • Média: ${Utils.formatNumber(Math.round(mediaPontos))} pontos`;
    }
  }
}

// Animar número
function animateNumber(element, start, end, duration) {
  const startTime = performance.now();
  
  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const current = Math.floor(start + (end - start) * progress);
    
    if (end > 1000) {
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

// Gerenciador de API
class APIManager {
  constructor() {
    this.controller = null;
  }

  async makeRequest(endpoint, options = {}) {
    if (this.controller) {
      this.controller.abort();
    }

    this.controller = new AbortController();
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: this.controller.signal,
      timeout: API_CONFIG.timeout
    };

    const finalOptions = { ...defaultOptions, ...options };
    const url = `${API_CONFIG.baseURL}${endpoint}`;

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), finalOptions.timeout);
      });

      const fetchPromise = fetch(url, finalOptions);
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Requisição cancelada');
      }
      throw error;
    }
  }

  async getRanking(idEmpresa) {
    return this.makeRequest(`${API_CONFIG.endpoints.ranking}?id_empresa=${idEmpresa}`);
  }
}

// Gerenciador de gráficos
class ChartManager {
  constructor() {
    this.chart = null;
    const canvas = document.getElementById('graficoBarras');
    if (canvas) {
      this.ctx = canvas.getContext('2d');
    }
  }

  createChart(data) {
    if (!this.ctx) return;
    
    if (this.chart) {
      this.chart.destroy();
    }

    // Ordenar dados por pontuação (maior para menor)
    const sortedData = [...data].sort((a, b) => b.total_pontos - a.total_pontos);
    
    const labels = sortedData.map(f => f.nome);
    const pontuacoes = sortedData.map(f => f.total_pontos);

    // Gerar cores gradientes
    const colors = this.generateGradientColors(sortedData.length);

    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Pontuação',
          data: pontuacoes,
          backgroundColor: colors,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: '#6366f1',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function(context) {
                return `Pontuação: ${Utils.formatNumber(context.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
                family: 'Inter'
              },
              callback: function(value) {
                return Utils.formatNumber(value);
              }
            },
            title: {
              display: true,
              text: 'Pontuação',
              color: '#1e293b',
              font: {
                size: 14,
                family: 'Inter',
                weight: '600'
              }
            },
            grid: {
              color: '#f1f5f9',
              drawBorder: false
            }
          },
          x: {
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
                family: 'Inter'
              },
              maxRotation: 45,
              minRotation: 0
            },
            title: {
              display: true,
              text: 'Funcionários',
              color: '#1e293b',
              font: {
                size: 14,
                family: 'Inter',
                weight: '600'
              }
            },
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  generateGradientColors(count) {
    const startColor = [99, 102, 241]; // #6366f1
    const endColor = [118, 75, 162];   // #764ba2
    
    return Array.from({ length: count }, (_, i) => {
      const t = count === 1 ? 0 : i / (count - 1);
      const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * t);
      const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * t);
      const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * t);
      return `rgb(${r}, ${g}, ${b})`;
    });
  }

  updateChart(data) {
    this.createChart(data);
  }
}

// Classe principal da aplicação
class RankingApp {
  constructor() {
    this.state = new AppState();
    this.api = new APIManager();
    this.chartManager = new ChartManager();
    this.idEmpresa = sessionStorage.getItem("id_empresa");

    this.init();
  }

  async init() {
    if (!this.idEmpresa) {
      this.state.setError("ID da empresa não encontrado. Faça login novamente.");
      showNotification('ID da empresa não encontrado', 'error');
      return;
    }

    this.setupEventListeners();
    await this.loadRankingData();
  }

  setupEventListeners() {
    // Botão de atualizar
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadRankingData());
    }

    // Filtro de período
    const periodFilter = document.getElementById('periodFilter');
    if (periodFilter) {
      periodFilter.addEventListener('change', (e) => {
        this.state.currentPeriod = e.target.value;
        this.filterDataByPeriod();
      });
    }
  }

  async loadRankingData() {
    this.state.setLoading(true);
    this.state.setError(null);

    try {
      showLoadingOverlay();
      const rankingData = await this.api.getRanking(this.idEmpresa);
      
      if (!rankingData || rankingData.length === 0) {
        throw new Error("Nenhum funcionário encontrado no ranking.");
      }

      this.state.setRankingData(rankingData);
      this.chartManager.createChart(rankingData);
      
      showNotification('Ranking carregado com sucesso!', 'success');
      
    } catch (error) {
      console.error("Erro ao carregar ranking:", error);
      this.state.setError(error.message || "Erro ao carregar os dados do ranking.");
      showNotification('Erro ao carregar ranking', 'error');
    } finally {
      this.state.setLoading(false);
      hideLoadingOverlay();
    }
  }

  filterDataByPeriod() {
    // Em uma aplicação real, isso faria uma nova requisição para o backend
    // Por enquanto, apenas atualiza o gráfico com os dados existentes
    if (this.state.rankingData.length > 0) {
      this.chartManager.updateChart(this.state.rankingData);
      showNotification(`Filtro aplicado: ${this.state.currentPeriod}`, 'info');
    }
  }

  // Método público para recarregar dados (pode ser chamado externamente)
  refresh() {
    this.loadRankingData();
  }
}

// Exportar para debug (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.RankingApp = RankingApp;
  window.Utils = Utils;
}


