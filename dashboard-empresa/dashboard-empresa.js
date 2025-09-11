document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("toggleDark");
   
    // Verifica o modo salvo no localStorage
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      toggle.checked = true;
    }
  
    toggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    });
    
    let nome_fantasia = localStorage.getItem("nome_fantasia")

    const logo = document.getElementById("nome_empresa");

    logo.innerHTML="Bem vindo, "+nome_fantasia;

    function queryString(parameter) {  
              var loc = location.search.substring(1, location.search.length);   
              var param_value = false;   
              var params = loc.split("&");   
              for (i=0; i<params.length;i++) {   
                  param_name = params[i].substring(0,params[i].indexOf('='));   
                  if (param_name == parameter) {                                          
                      param_value = params[i].substring(params[i].indexOf('=')+1)   
                  }   
              }   
              if (param_value) {   
                  return param_value;   
              }   
              else {   
                  return undefined;   
              }   
        }

      let nome = localStorage.getItem("idEMP");
  });
  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("toggleDark");
  
    // Verifica o modo salvo no localStorage
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      toggle.checked = true;
    }
  
    toggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    });
  });
  // Variáveis globais
let currentSection = 'dashboard';
let isDarkMode = false;
let notifications = [
  {
    id: 1,
    icon: 'fas fa-user-plus',
    title: 'Novo funcionário cadastrado',
    message: 'Maria Silva foi adicionada ao departamento de TI',
    time: '2 min atrás',
    unread: true
  },
  {
    id: 2,
    icon: 'fas fa-graduation-cap',
    title: 'Treinamento concluído',
    message: '15 funcionários concluíram o curso de JavaScript',
    time: '1 hora atrás',
    unread: true
  },
  {
    id: 3,
    icon: 'fas fa-trophy',
    title: 'Meta atingida',
    message: 'Departamento de vendas atingiu 90% de conclusão',
    time: '3 horas atrás',
    unread: false
  }
];

// Dados simulados
const dashboardData = {
  stats: {
    employees: 248,
    trainings: 42,
    certificates: 1847,
    completionRate: 87
  },
  recentActivities: [
    {
      icon: 'fas fa-graduation-cap',
      title: 'Treinamento "JavaScript Avançado" foi concluído',
      description: '15 funcionários completaram o curso com sucesso',
      time: '2 horas atrás'
    },
    {
      icon: 'fas fa-user-plus',
      title: 'Novo funcionário adicionado',
      description: 'Maria Silva foi cadastrada no departamento de TI',
      time: '4 horas atrás'
    },
    {
      icon: 'fas fa-trophy',
      title: 'Meta de treinamento atingida',
      description: 'Departamento de Vendas alcançou 90% de conclusão',
      time: '1 dia atrás'
    }
  ]
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
  setupEventListeners();
  loadUserData();
  checkThemePreference();
});

// Inicializar dashboard
function initializeDashboard() {
  showSection('dashboard');
  updateNotificationCount();
  animateStats();
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
async function loadUserData() {
  const id_empresa = localStorage.getItem("id_empresa")
  try {
    const response = await fetch(`http://traineasy.selfip.com:3000/empresa_data?id=${id_empresa}`); // rota do backend

    const data = await response.json();

    const welcomeText = document.getElementById('boasVindas');
    const companyName = document.getElementById('nome_empresa');

    if (welcomeText) welcomeText.textContent = `Bem-vindo ${data.nome}`;
    if (companyName) companyName.textContent = data.nome;
  } catch (error) {
    console.error("Falha ao carregar dados:", error);
  }
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
  // Aqui você implementaria a lógica de busca real

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
  // Esconder todas as seções
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Mostrar seção selecionada
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    currentSection = sectionId;
  }
  
  // Fechar sidebar no mobile
  closeSidebar();
  
  // Scroll para o topo
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

// Animar estatísticas
async function animateStats() {
  const id_empresa = sessionStorage.getItem('id_empresa')
  const statElements = document.querySelectorAll('.stat-content h3');
  const response = await fetch(`http://traineasy.selfip.com:3000/fill_dashboard_empresa?id=${id_empresa}`); // rota do backend

  const data = await response.json();
  console.log(data);
  const stats = [data.funcionarios_ativos, data.treinamentos_ativos, data.certificados_emitidos, data.taxa_conclusao];
  
  statElements.forEach((element, index) => {
    const targetValue = stats[index];
    const isPercentage = index === 3; // Taxa de conclusão
    animateNumber(element, 0, targetValue, 2000, isPercentage);
  });
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

// Criar novo treinamento
function createNewTraining() {
  showLoadingOverlay();
  
  setTimeout(() => {
    hideLoadingOverlay();

    // Aqui você implementaria a navegação para a página de criação
  }, 1500);
}


// Logout
function logout() {
  showLoadingOverlay();
  
  setTimeout(() => {
    hideLoadingOverlay();
    
    // Aqui você implementaria o logout real
  }, 2000);
}

// Mostrar modal de upgrade
function showUpgradeModal() {
  showModal({
    title: 'Upgrade para Premium',
    content: `
      <div class="upgrade-modal">
        <div class="upgrade-icon">
          <i class="fas fa-crown" style="font-size: 3rem; color: #f59e0b;"></i>
        </div>
        <h3>Desbloqueie recursos premium</h3>
        <ul class="upgrade-features">
          <li><i class="fas fa-check"></i> Treinamentos ilimitados</li>
          <li><i class="fas fa-check"></i> Relatórios avançados</li>
          <li><i class="fas fa-check"></i> Suporte prioritário</li>
          <li><i class="fas fa-check"></i> Integrações personalizadas</li>
        </ul>
        <div class="upgrade-actions">
          <button class="btn-primary" onclick="upgradeAccount()">
            <i class="fas fa-crown"></i>
            Fazer Upgrade
          </button>
          <button class="btn-secondary" onclick="closeModal()">
            Talvez depois
          </button>
        </div>
      </div>
    `,
    showCloseButton: true
  });
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

// Fechar todos os dropdowns
function closeAllDropdowns(event) {
  const dropdowns = [
    'notificationsDropdown',
    'userMenuDropdown'
  ];
  
  dropdowns.forEach(dropdownId => {
    const dropdown = document.getElementById(dropdownId);
    const trigger = event.target.closest(`[onclick*="${dropdownId.replace('Dropdown', '')}"]`);
    
    if (dropdown && !trigger && !dropdown.contains(event.target)) {
      dropdown.classList.remove('show');
    }
  });
  
  // Fechar busca se clicar fora
  const searchContainer = document.getElementById('searchContainer');
  const searchTrigger = event.target.closest('[onclick*="toggleSearch"]');
  
  if (searchContainer && !searchTrigger && !searchContainer.contains(event.target)) {
    closeSearch();
  }
}

// Manipular atalhos do teclado
function handleKeyboardShortcuts(event) {
  // Ctrl/Cmd + K para busca
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    toggleSearch();
  }
  
  // Escape para fechar modais e dropdowns
  if (event.key === 'Escape') {
    closeAllDropdowns({ target: document.body });
    closeSearch();
    closeModal();
  }
  
  // Ctrl/Cmd + D para alternar tema
  if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
    event.preventDefault();
    toggleTheme();
  }
}

// Manipular redimensionamento da janela
function handleWindowResize() {
  // Fechar sidebar no mobile quando redimensionar
  if (window.innerWidth > 768) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('show');
    }
  }
}

// Função para mostrar modal
function showModal({ title, content, showCloseButton = false }) {
  // Remover modal existente
  const existingModal = document.querySelector('.modal-overlay');
  if (existingModal) {
    existingModal.remove();
  }
  
  const modalHTML = `
    <div class="modal-overlay show" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          ${showCloseButton ? '<button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>' : ''}
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  document.body.style.overflow = 'hidden';
}

// Função para fechar modal
function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = 'auto';
    }, 300);
  }
}

// Função para mostrar notificações
function showNotification(message, type = 'info', duration = 5000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  
  notification.innerHTML = `
    <i class="${icons[type]}"></i>
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Adicionar estilos inline para a notificação
  notification.style.cssText = `
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: white;
    border-radius: 0.75rem;
    padding: 1rem 1.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    border-left: 4px solid var(--primary-color);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 10001;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
    max-width: 400px;
    font-family: 'Inter', sans-serif;
  `;
  
  // Cores específicas por tipo
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#6366f1'
  };
  
  notification.style.borderLeftColor = colors[type];
  notification.querySelector('i').style.color = colors[type];
  
  // Estilizar o texto e botão
  const span = notification.querySelector('span');
  span.style.cssText = `
    flex: 1;
    color: #374151;
    font-weight: 500;
    font-size: 0.875rem;
  `;
  
  const button = notification.querySelector('button');
  button.style.cssText = `
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: all 0.2s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  }, 10);
  
  // Remover automaticamente
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, duration);
}

// Adicionar estilos CSS adicionais dinamicamente
const additionalCSS = `
<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal-overlay.show {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.9);
  transition: all 0.3s ease;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-overlay.show .modal-content {
  transform: scale(1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.125rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.modal-body {
  padding: 1.5rem;
}

.upgrade-modal {
  text-align: center;
}

.upgrade-icon {
  margin-bottom: 1.5rem;
}

.upgrade-modal h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 1.5rem;
}

.upgrade-features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
}

.upgrade-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: #374151;
}

.upgrade-features i {
  color: #10b981;
  font-size: 0.875rem;
}

.upgrade-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .notification {
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
  
  .upgrade-actions {
    flex-direction: column;
  }
  
  .upgrade-actions button {
    width: 100%;
  }
}

body.dark .modal-content {
  background: #1f2937;
  color: #f9fafb;
}

body.dark .modal-header {
  border-bottom-color: #374151;
}

body.dark .modal-title {
  color: #f9fafb;
}

body.dark .upgrade-modal h3 {
  color: #f9fafb;
}

body.dark .upgrade-features li {
  color: #e5e7eb;
}

body.dark .notification {
  background: #374151;
  color: #f9fafb;
}

body.dark .notification span {
  color: #f9fafb;
}
</style>
`;

// Injetar CSS adicional
document.head.insertAdjacentHTML('beforeend', additionalCSS);

// Inicializar notificações
setTimeout(() => {
  renderNotifications();
}, 100);


  