// ==========================================
// FUNCIONALIDADES ORIGINAIS DO SERVIDOR
// ==========================================

// Event listener para o botão de criar departamento (ORIGINAL)
document.getElementById("criar-treinamento").addEventListener("click", function () {
  const linhaEdicao = document.getElementById("linha-edicao");
  linhaEdicao.style.display = "block";
  
  // Scroll suave para o formulário
  linhaEdicao.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Foco no primeiro campo
  setTimeout(() => {
    document.getElementById("depart_nome").focus();
  }, 300);
});

// Carregamento de departamentos do servidor (ORIGINAL - MANTIDO)
document.addEventListener("DOMContentLoaded", async () => {
  showLoadingState();
  
  // Inicializar funcionalidades modernas
  initializeModernFeatures();
  
  const lista = document.getElementById("departamento_conteiner");
  const id_empresa = sessionStorage.getItem("id_empresa");
  console.log("ID da empresa:", id_empresa);
  
  lista.innerHTML = '';

  try {
    const response = await fetch('http://traineasy.selfip.com:3000/list_departamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_empresa })
    });

    const texto = await response.json();
    hideLoadingState();

    // Atualizar estatísticas
    updateStats(texto.length);

    for (let x in texto) {
      const node = document.createElement("div");
      node.className = 'department-card';
      node.setAttribute('data-department-id', texto[x].id);
      node.setAttribute('data-department-name', texto[x].nome.toLowerCase());

      // Criar estrutura do card
      const departmentInfo = document.createElement("div");
      departmentInfo.className = "department-info";

      const nome = document.createElement("h4");
      const descritivo = document.createElement("p");
      descritivo.className = "curso-desc";
      
      const departmentMeta = document.createElement("div");
      departmentMeta.className = "department-meta";
      
      const idInfo = document.createElement("span");
      idInfo.innerHTML = `<i class="fas fa-hashtag"></i> ID: ${texto[x].id}`;
      
      const empresaInfo = document.createElement("span");
      empresaInfo.innerHTML = `<i class="fas fa-building"></i> Empresa: ${texto[x].id_empresa}`;
      
      departmentMeta.appendChild(idInfo);
      departmentMeta.appendChild(empresaInfo);

      // Container de ações
      const departmentActions = document.createElement("div");
      departmentActions.className = "department-actions";

      const botaoEntrar = document.createElement("button");
      botaoEntrar.className = "btn-primary";
      botaoEntrar.innerHTML = '<i class="fas fa-arrow-right"></i> Acessar Departamento';
      botaoEntrar.onclick = () => {
        showLoadingOverlay();
        localStorage.setItem("id_departamento", texto[x].id);
        setTimeout(() => {
          window.location.href = "../funcionarios_empresa/funcionarios_empresa.html";
        }, 500);
      };

      const botaoEditar = document.createElement("button");
      botaoEditar.className = "btn-secondary";
      botaoEditar.innerHTML = '<i class="fas fa-edit"></i> Editar';
      
      // Dados
      nome.textContent = texto[x].nome;
      descritivo.textContent = String(texto[x].descritivo || 'Sem descrição disponível');

      // Event listener para edição (ORIGINAL - MANTIDO)
      botaoEditar.addEventListener("click", function () {
        // Preencher os campos do formulário
        document.getElementById("edicao_nome").value = texto[x].nome;
        document.getElementById("edicao_descritivo").value = texto[x].descritivo;

        // Armazena o ID do departamento na linha de edição
        document.getElementById("edicao_departamento").dataset.id = texto[x].id;

        // Posiciona o formulário abaixo da linha clicada
        const linhaEdicao = document.getElementById("edicao_departamento");
        node.parentNode.insertBefore(linhaEdicao, node.nextSibling);
        linhaEdicao.style.display = "block";
        
        // Scroll suave para o formulário
        linhaEdicao.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Foco no primeiro campo
        setTimeout(() => {
          document.getElementById("edicao_nome").focus();
        }, 300);
      });

      // Montar estrutura
      departmentInfo.appendChild(nome);
      departmentInfo.appendChild(descritivo);
      departmentInfo.appendChild(departmentMeta);
      
      departmentActions.appendChild(botaoEntrar);
      departmentActions.appendChild(botaoEditar);

      node.appendChild(departmentInfo);
      node.appendChild(departmentActions);
      
      lista.appendChild(node);
    }

    // Mostrar estado vazio se necessário
    if (texto.length === 0) {
      showEmptyState();
    } else {
      hideEmptyState();
    }

  } catch (error) {
    hideLoadingState();
    showNotification('Erro ao carregar departamentos', 'error');
    console.error('Erro:', error);
    showEmptyState();
  }
});

// Função para salvar edição (ORIGINAL - MANTIDA)
async function salvarEdicao(event) {
  event.preventDefault();
  showLoadingOverlay();

  const nome = document.getElementById("edicao_nome").value;
  const descritivo = document.getElementById("edicao_descritivo").value;
  const id = document.getElementById("edicao_departamento").dataset.id;

  const userData = { id, nome, descritivo };

  try {
    const response = await fetch('http://traineasy.selfip.com:3000/editarDepartamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const resultado = await response.text();
    hideLoadingOverlay();
    showNotification('Departamento editado com sucesso!', 'success');
    
    // Fechar formulário de edição
    document.getElementById("edicao_departamento").style.display = "none";
    
    // Recarregar página após um delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
    
  } catch (error) {
    hideLoadingOverlay();
    showNotification('Erro ao editar departamento', 'error');
    console.error('Erro:', error);
  }
}

// Função para cancelar edição (ORIGINAL - MANTIDA)
function cancelarEdicao() {
  document.getElementById("linha-edicao").style.display = "none";
  document.getElementById("edicao_departamento").style.display = "none";
}

// Formulário de criação (ORIGINAL - MANTIDO)
const form = document.getElementById('formCriar');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showLoadingOverlay();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const id_empresa = sessionStorage.getItem("id_empresa");

  const userData = {
    id_empresa: id_empresa,
    nome: data.nome,
    descritivo: data.descritivo
  };

  try {
    const response = await fetch('http://traineasy.selfip.com:3000/departamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      hideLoadingOverlay();
      showNotification('Departamento criado com sucesso!', 'success');
      
      // Limpar formulário
      form.reset();
      
      // Fechar formulário
      document.getElementById("linha-edicao").style.display = "none";
      
      // Recarregar página após um delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      throw new Error('Erro na resposta do servidor');
    }
    
  } catch (error) {
    hideLoadingOverlay();
    showNotification('Erro ao criar departamento', 'error');
    console.error('Erro:', error);
  }
});

// ==========================================
// FUNCIONALIDADES DO DASHBOARD STYLE
// ==========================================

// Variáveis globais
let isDarkMode = false;

// Sistema de notificações
let notifications = [
  {
    id: 1,
    title: 'Novo departamento criado',
    message: 'O departamento "Marketing" foi criado com sucesso',
    time: '2 min atrás',
    read: false,
    icon: 'fas fa-building'
  },
  {
    id: 2,
    title: 'Funcionário adicionado',
    message: 'João Silva foi adicionado ao departamento de TI',
    time: '1 hora atrás',
    read: true,
    icon: 'fas fa-users'
  }
];

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

// Atualizar contador de notificações
function updateNotificationCount() {
  const unreadCount = notifications.filter(n => !n.read).length;
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
    <div class="notification-item ${!notification.read ? 'unread' : ''}">
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

// Carregar informações da empresa
function loadCompanyInfo() {
  const companyNameElement = document.getElementById('company_name');
  const empresaNome = sessionStorage.getItem('nome_empresa') || localStorage.getItem('nome_fantasia') || 'TechCorp Solutions';
  
  if (companyNameElement) {
    companyNameElement.textContent = empresaNome;
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
}

// Restaurar item ativo do menu - CORRIGIDO
function restoreActiveMenuItem() {
  const currentPage = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');
  
  // Remover active de todos os itens primeiro
  navItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Ativar apenas o item correto baseado na URL atual
  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      const href = link.getAttribute('href');
      
      // Verificar se estamos na página de departamentos especificamente
      if (currentPage.includes('departamentos') && href.includes('departamentos') && !href.includes('funcionarios')) {
        item.classList.add('active');
      }
      // Verificar outras páginas específicas
      else if (currentPage.includes('funcionarios_empresa') && href.includes('funcionarios_empresa')) {
        item.classList.add('active');
      }
      else if (currentPage.includes('dashboard') && href.includes('dashboard')) {
        item.classList.add('active');
      }
      else if (currentPage.includes('criar-treinamento') && href.includes('criar-treinamento')) {
        item.classList.add('active');
      }
      else if (currentPage.includes('meus-treinamentos') && href.includes('meus-treinamentos')) {
        item.classList.add('active');
      }
      else if (currentPage.includes('ranking') && href.includes('ranking')) {
        item.classList.add('active');
      }
      else if (currentPage.includes('recompensas') && href.includes('recompensas')) {
        item.classList.add('active');
      }
      else if (currentPage.includes('estatisticas') && href.includes('estatisticas')) {
        item.classList.add('active');
      }
    }
  });
}

// Definir item ativo do menu
function setActiveMenuItem(element) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  element.classList.add('active');
}

// Toggle de notificações
function toggleNotifications() {
  const dropdown = document.getElementById('notificationsDropdown');
  if (!dropdown) return;
  
  dropdown.classList.toggle('show');
  
  // Fechar ao clicar fora
  if (dropdown.classList.contains('show')) {
    setTimeout(() => {
      document.addEventListener('click', closeNotificationsOnOutsideClick);
    }, 100);
  }
}

function closeNotificationsOnOutsideClick(event) {
  const dropdown = document.getElementById('notificationsDropdown');
  const notificationBtn = document.querySelector('.notification-btn');
  
  if (dropdown && !dropdown.contains(event.target) && !notificationBtn.contains(event.target)) {
    dropdown.classList.remove('show');
    document.removeEventListener('click', closeNotificationsOnOutsideClick);
  }
}

function markAllAsRead() {
  notifications.forEach(notif => notif.read = true);
  const unreadItems = document.querySelectorAll('.notification-item.unread');
  unreadItems.forEach(item => item.classList.remove('unread'));
  
  // Atualizar contador
  const notifCount = document.querySelector('.notif-count');
  if (notifCount) {
    notifCount.style.display = 'none';
  }
  
  showNotification('Todas as notificações foram marcadas como lidas', 'info');
}

function viewAllNotifications() {
  showLoadingOverlay();
  setTimeout(() => {
    window.location.href = '../notifications/notifications.html';
  }, 500);
}

// Toggle de busca
function toggleSearch() {
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');
  
  if (searchContainer) {
    searchContainer.classList.toggle('show');
    if (searchContainer.classList.contains('show')) {
      setTimeout(() => searchInput.focus(), 300);
    }
  }
}

function closeSearch() {
  const searchContainer = document.getElementById('searchContainer');
  if (searchContainer) {
    searchContainer.classList.remove('show');
  }
}

function handleSearch(event) {
  if (event.key === 'Enter') {
    const searchTerm = event.target.value;
    filterDepartments();
  }
}

// Menu do usuário
function toggleUserMenu() {
  const dropdown = document.getElementById('userMenuDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
    
    if (dropdown.classList.contains('show')) {
      setTimeout(() => {
        document.addEventListener('click', closeUserMenuOnOutsideClick);
      }, 100);
    }
  }
}

function closeUserMenuOnOutsideClick(event) {
  const dropdown = document.getElementById('userMenuDropdown');
  const userMenu = document.querySelector('.user-menu');
  
  if (dropdown && !userMenu.contains(event.target)) {
    dropdown.classList.remove('show');
    document.removeEventListener('click', closeUserMenuOnOutsideClick);
  }
}

function openSettings() {
  showLoadingOverlay();
  setTimeout(() => {
    window.location.href = '../settings/settings.html';
  }, 500);
}

function openHelp() {
  showLoadingOverlay();
  setTimeout(() => {
    window.location.href = '../help/help.html';
  }, 500);
}

function logout() {
  showConfirmModal(
    'Confirmar Logout',
    'Tem certeza que deseja sair da sua conta?',
    () => {
      showLoadingOverlay();
      // Limpar dados da sessão
      sessionStorage.clear();
      localStorage.removeItem('user_token');
      
      setTimeout(() => {
        window.location.href = '../login/login.html';
      }, 1000);
    }
  );
}

// Toggle de tema
function toggleTheme() {
  if (isDarkMode) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

// Sidebar mobile
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('show');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.remove('show');
}

// Busca de departamentos
function filterDepartments() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const departmentCards = document.querySelectorAll('.department-card');
  let visibleCount = 0;
  
  departmentCards.forEach(card => {
    const departmentName = card.getAttribute('data-department-name') || '';
    const departmentText = card.textContent.toLowerCase();
    
    if (departmentName.includes(searchTerm) || departmentText.includes(searchTerm)) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Mostrar/esconder estado vazio baseado na busca
  if (visibleCount === 0 && searchTerm !== '') {
    showEmptyState('Nenhum departamento encontrado para "' + searchTerm + '"');
  } else if (visibleCount > 0) {
    hideEmptyState();
  }
}

// Atualizar departamentos
function refreshDepartments() {
  showLoadingOverlay();
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Atualizar estatísticas
function updateStats(totalDepartments = 0) {
  document.getElementById('totalDepartments').textContent = totalDepartments;
  document.getElementById('totalEmployees').textContent = totalDepartments * 4; // Estimativa
}

// Estados da interface
function showLoadingState() {
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  
  if (loadingState) loadingState.style.display = 'block';
  if (emptyState) emptyState.style.display = 'none';
}

function hideLoadingState() {
  const loadingState = document.getElementById('loadingState');
  if (loadingState) loadingState.style.display = 'none';
}

function showEmptyState(customMessage = null) {
  const emptyState = document.getElementById('emptyState');
  if (emptyState) {
    if (customMessage) {
      const emptyStateP = emptyState.querySelector('p');
      if (emptyStateP) {
        emptyStateP.textContent = customMessage;
      }
    }
    emptyState.style.display = 'block';
  }
}

function hideEmptyState() {
  const emptyState = document.getElementById('emptyState');
  if (emptyState) emptyState.style.display = 'none';
}

function showLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.add('show');
  }
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

// Sistema de notificações toast
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification-toast ${type}`;
  
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  
  notification.innerHTML = `
    <div class="notification-content">
      <i class="${icons[type]}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Remover automaticamente após 5 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}

// Modal de confirmação
function showConfirmModal(title, message, onConfirm) {
  const modal = document.createElement('div');
  modal.className = 'confirm-modal';
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="this.closest('.confirm-modal').remove()">Cancelar</button>
          <button class="btn-primary" onclick="this.closest('.confirm-modal').remove(); (${onConfirm})()">Confirmar</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Fechar ao clicar no overlay
  modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      modal.remove();
    }
  });
}

