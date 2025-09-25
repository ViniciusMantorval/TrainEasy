// Variáveis globais
let currentSection = 'funcionarios';
let isDarkMode = false;
let notifications = [
  {
    id: 1,
    icon: 'fas fa-user-plus',
    title: 'Novo funcionário adicionado',
    message: 'Maria Silva foi adicionada ao departamento',
    time: '2 min atrás',
    unread: true
  },
  {
    id: 2,
    icon: 'fas fa-graduation-cap',
    title: 'Treinamento concluído',
    message: 'João Santos completou o curso de JavaScript',
    time: '1 hora atrás',
    unread: true
  },
  {
    id: 3,
    icon: 'fas fa-users',
    title: 'Departamento atualizado',
    message: 'Novos funcionários foram adicionados ao TI',
    time: '3 horas atrás',
    unread: false
  }
];

// ==========================================
// FUNCIONALIDADES ORIGINAIS DO SERVIDOR
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
    // Inicializar funcionalidades modernas
    initializeModernFeatures();
    
    let id_departamento = localStorage.getItem("id_departamento");
    
    // Carregar informações do departamento
    await loadDepartmentInfo();
    
    // Carregar funcionários
    await loadEmployees();
});

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

// Ver todas as notificações
function viewAllNotifications() {
  
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

// Definir item ativo do menu
function setActiveMenuItem(element) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  element.classList.add('active');
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
      
      // Verificar se estamos na página de funcionários especificamente
      if (currentPage.includes('funcionarios_empresa') && href.includes('funcionarios_empresa')) {
        item.classList.add('active');
      }
      // Verificar outras páginas específicas
      else if (currentPage.includes('departamentos') && href.includes('departamentos') && !href.includes('funcionarios')) {
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

// Voltar para página anterior
function goBack() {
  window.history.back();
}

// Ir para dashboard
function goToDashboard() {
  window.location.href = '../dashboard-empresa/dashboard-empresa.html';
}

// Ir para departamentos
function goToDepartments() {
  window.location.href = '../departamentos/departamentos.html';
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// FUNCIONALIDADES ORIGINAIS DO SERVIDOR - ADICIONAR FUNCIONÁRIO
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

document.getElementById("adicionar_funcionario").addEventListener("click", function () {
  const linhaEdicao = document.getElementById("linha-edicao");
  linhaEdicao.style.display = "block";
  
  // Scroll suave para o formulário
  linhaEdicao.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Focar no primeiro campo
  setTimeout(() => {
    document.getElementById("funcionario_nome").focus();
  }, 300);
});

const form = document.getElementById('formCriar');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); 
  
  // Mostrar loading
  showLoadingOverlay();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  let url = "";
  let userData = {};
  let id_departamento = localStorage.getItem("id_departamento");

  userData = {
    id_departamento: id_departamento,
    email: data.email,
    senha: data.senha,
    nome: data.nome
  };
  url = 'https://traineasy.up.railway.app/funcionarios';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      showNotification('Funcionário adicionado com sucesso!', 'success');
      form.reset();
      document.getElementById("linha-edicao").style.display = "none";
      await loadEmployees(); // Recarregar lista
      updateStats(); // Atualizar estatísticas
    } else {
      throw new Error('Erro na resposta do servidor');
    }
  } catch (error) {
    showNotification('Erro ao adicionar funcionário', 'error');
    console.error(error);
  } finally {
    hideLoadingOverlay();
  }
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// FUNCIONALIDADES ORIGINAIS DO SERVIDOR - CARREGAR FUNCIONÁRIOS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function loadEmployees() {
  const lista = document.getElementById("funcionariosConteiner");
  const id = localStorage.getItem("id_departamento");
  const loadingState = document.getElementById("loadingState");
  const emptyState = document.getElementById("emptyState");
  
  // Mostrar loading
  loadingState.style.display = "block";
  emptyState.style.display = "none";
  lista.innerHTML = '';

  try {
    const response = await fetch('https://traineasy.up.railway.app/list_funcionarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });

    const texto = await response.json();
    loadingState.style.display = "none";

    if (texto.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    for (let x in texto) {
      const employeeCard = createEmployeeCard(texto[x]);
      lista.appendChild(employeeCard);
    }

    // Animar entrada dos cards
    animateEmployeeCards();
    
    // Atualizar estatísticas
    updateStats();

  } catch (error) {
    loadingState.style.display = "none";
    showNotification('Erro ao carregar funcionários', 'error');
    console.error(error);
  }
}

// Função para criar card de funcionário moderno
function createEmployeeCard(funcionario) {
  const card = document.createElement("div");
  card.className = 'employee-card';
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  
  // Gerar iniciais para o avatar
  const initials = funcionario.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  card.innerHTML = `
    <div class="employee-header">
      <div class="employee-avatar">${initials}</div>
      <div class="employee-info">
        <h4>${funcionario.nome}</h4>
        <p>${funcionario.email}</p>
      </div>
    </div>
    
    <div class="employee-status">
      <span class="status-badge active">Ativo</span>
      <small>ID: ${funcionario.id_Funcionario}</small>
    </div>
    
    <div class="employee-actions">
      <button class="btn-edit" onclick="editEmployee(${funcionario.id_Funcionario}, '${funcionario.nome}', '${funcionario.email}')">
        <i class="fas fa-edit"></i>
        Editar
      </button>
      <button class="btn-delete" onclick="deleteEmployee(${funcionario.id_Funcionario}, '${funcionario.nome}')">
        <i class="fas fa-trash"></i>
        Remover
      </button>
    </div>
  `;
  
  return card;
}

// Animar entrada dos cards
function animateEmployeeCards() {
  const cards = document.querySelectorAll('.employee-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.transition = 'all 0.5s ease-out';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Editar funcionário
function editEmployee(id, nome, email) {
  document.getElementById("edicao_nome").value = nome;
  document.getElementById("edicao_email").value = email;
  document.getElementById("edicao_funcionario").dataset.id = id;
  document.getElementById("edicao_funcionario").style.display = "block";
  
  // Scroll para o formulário
  document.getElementById("edicao_funcionario").scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center' 
  });
}

// Deletar funcionário
async function deleteEmployee(id, nome) {
  if (!confirm(`Tem certeza que deseja remover ${nome}?`)) {
    return;
  }
  
  showLoadingOverlay();
  
  try {
    const response = await fetch('https://traineasy.up.railway.app/deletar_funcionario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });
    
    if (response.ok) {
      showNotification('Funcionário removido com sucesso!', 'success');
      await loadEmployees();
      updateStats();
    } else {
      throw new Error('Erro na resposta do servidor');
    }
  } catch (error) {
    showNotification('Erro ao remover funcionário', 'error');
    console.error(error);
  } finally {
    hideLoadingOverlay();
  }
}

// Cancelar edição
function cancelarEdicao() {
  document.getElementById("linha-edicao").style.display = "none";
  document.getElementById("edicao_funcionario").style.display = "none";
}

// Salvar edição de funcionário
async function salvarEdicaoFuncionario(event) {
  event.preventDefault();
  showLoadingOverlay();

  const nome = document.getElementById("edicao_nome").value;
  const email = document.getElementById("edicao_email").value;
  const senha = document.getElementById("edicao_senha").value;
  const id = document.getElementById("edicao_funcionario").dataset.id;

  const userData = { id, nome, email };
  if (senha) userData.senha = senha;

  try {
    const response = await fetch('https://traineasy.up.railway.app/editar_funcionario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      showNotification('Funcionário editado com sucesso!', 'success');
      document.getElementById("edicao_funcionario").style.display = "none";
      await loadEmployees();
    } else {
      throw new Error('Erro na resposta do servidor');
    }
  } catch (error) {
    showNotification('Erro ao editar funcionário', 'error');
    console.error(error);
  } finally {
    hideLoadingOverlay();
  }
}

// Carregar informações do departamento
async function loadDepartmentInfo() {
  const id_departamento = localStorage.getItem("id_departamento");
  
  if (!id_departamento) {
    showNotification('Departamento não selecionado', 'warning');
    return;
  }

  try {
    const response = await fetch('https://traineasy.up.railway.app/get_departamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id_departamento })
    });

    const departamento = await response.json();
    
    if (departamento && departamento.nome) {
      document.getElementById('departmentName').innerHTML = `
        <i class="fas fa-users"></i>
        ${departamento.nome}
      `;
      document.getElementById('departmentDescription').textContent = 
        `Gerencie os funcionários do departamento ${departamento.nome}`;
    }
  } catch (error) {
    console.error('Erro ao carregar informações do departamento:', error);
  }
}

// Atualizar estatísticas
function updateStats() {
  const employeeCards = document.querySelectorAll('.employee-card');
  const totalEmployees = employeeCards.length;
  const activeEmployees = document.querySelectorAll('.status-badge.active').length;
  
  document.getElementById('totalEmployees').textContent = totalEmployees;
  document.getElementById('activeEmployees').textContent = activeEmployees;
  document.getElementById('completedTrainings').textContent = Math.floor(totalEmployees * 0.7);
}

// Filtrar funcionários
function filterEmployees() {
  const searchTerm = document.getElementById('searchEmployees').value.toLowerCase();
  const employeeCards = document.querySelectorAll('.employee-card');
  
  employeeCards.forEach(card => {
    const employeeName = card.querySelector('h4').textContent.toLowerCase();
    const employeeEmail = card.querySelector('p').textContent.toLowerCase();
    
    if (employeeName.includes(searchTerm) || employeeEmail.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Toggle filtro dropdown
function toggleFilterDropdown() {
  const filterOptions = document.getElementById('filterOptions');
  filterOptions.classList.toggle('show');
}

// Filtrar por status
function filterByStatus() {
  const checkboxes = document.querySelectorAll('#filterOptions input[type="checkbox"]');
  const selectedFilters = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  
  const employeeCards = document.querySelectorAll('.employee-card');
  
  employeeCards.forEach(card => {
    if (selectedFilters.includes('all') || selectedFilters.length === 0) {
      card.style.display = 'block';
    } else {
      const isActive = card.querySelector('.status-badge.active');
      
      if ((selectedFilters.includes('active') && isActive) ||
          (selectedFilters.includes('inactive') && !isActive)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

// Atualizar funcionários
function refreshEmployees() {
  showLoadingOverlay();
  setTimeout(() => {
    loadEmployees();
    hideLoadingOverlay();
  }, 1000);
}

// Toggle senha
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;
  const icon = button.querySelector('i');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

// Mostrar loading overlay
function showLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.add('show');
  }
}

// Esconder loading overlay
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


