// Variáveis globais
let isDarkMode = false;
let notifications = [
  {
    id: 1,
    icon: 'fas fa-plus-circle',
    title: 'Nova recompensa criada',
    message: 'Recompensa "Vale Presente" foi criada com sucesso',
    time: '5 min atrás',
    unread: true
  },
  {
    id: 2,
    icon: 'fas fa-edit',
    title: 'Recompensa editada',
    message: 'Recompensa "Desconto em Produtos" foi atualizada',
    time: '1 hora atrás',
    unread: true
  },
  {
    id: 3,
    icon: 'fas fa-gift',
    title: 'Recompensa resgatada',
    message: 'João Silva resgatou a recompensa "Férias Extras"',
    time: '2 horas atrás',
    unread: false
  }
];

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
  setupEventListeners();
  loadUserData();
  checkThemePreference();
  carregarRecompensas(); // Função original para carregar recompensas
});

// Inicializar dashboard
function initializeDashboard() {
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

// ===== CÓDIGO ORIGINAL FUNCIONAL PARA GERENCIAR RECOMPENSAS =====
async function carregarRecompensas() {
  const lista = document.getElementById("lista-recompensas");
  const id_empresa = sessionStorage.getItem("id_empresa");

  if (!id_empresa) {
    showNotification('ID da empresa não encontrado', 'error');
    return;
  }

  try {
    showLoadingOverlay();
    lista.innerHTML = `
      <div class="loading-state">
        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
        <p style="color: var(--gray-600);">Carregando recompensas...</p>
      </div>
    `;

    const res = await fetch(`http://traineasy.selfip.com:3000/recompensas?id_empresa=${id_empresa}`);
    const recompensas = await res.json();

    lista.innerHTML = "";

    if (recompensas.length === 0) {
      lista.innerHTML = `
        <div class="no-trainings">
          <i class="fas fa-gift" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
          <h3 style="color: var(--gray-600); margin-bottom: 0.5rem;">Nenhuma recompensa cadastrada</h3>
          <p style="color: var(--gray-500);">Crie sua primeira recompensa para começar.</p>
        </div>
      `;
    } else {
      recompensas.forEach(r => {
        console.log(r);
        console.log(r.quantidade_disponivel);
        
        const div = document.createElement("div");   
        div.className = "recompensa";

        const nomeInput = criarInput("text", r.nome);
        const descInput = criarTextarea(r.descricao);
        const pontosInput = criarInput("number", r.preco_pontos);
        const qtdInput = criarInput("number", r.quantidade_disponivel);

        nomeInput.disabled = true;
        descInput.disabled = true;
        pontosInput.disabled = true;
        qtdInput.disabled = true;

        const btnEditar = criarBotao("✏️ Editar", "edit");
        const btnSalvar = criarBotao("💾 Salvar", "save");
        const btnCancelar = criarBotao("✖️ Cancelar", "cancel");
        const btnExcluir = criarBotao("🗑️ Excluir", "delete");

        btnSalvar.style.display = "none";
        btnCancelar.style.display = "none";

        btnEditar.onclick = () => {
          nomeInput.disabled = false;
          descInput.disabled = false;
          pontosInput.disabled = false;
          qtdInput.disabled = false;
          btnEditar.style.display = "none";
          btnSalvar.style.display = "inline-block";
          btnCancelar.style.display = "inline-block";
          showNotification('Modo de edição ativado', 'info');
        };

        btnCancelar.onclick = () => {
          nomeInput.value = r.nome;
          descInput.value = r.descricao;
          pontosInput.value = r.preco_pontos;
          qtdInput.value = r.quantidade_disponivel;
          
          nomeInput.disabled = true;
          descInput.disabled = true;
          pontosInput.disabled = true;
          qtdInput.disabled = true;
          btnEditar.style.display = "inline-block";
          btnSalvar.style.display = "none";
          btnCancelar.style.display = "none";
          showNotification('Edição cancelada', 'info');
        };

        btnSalvar.onclick = async () => {
          const atualizados = {
            nome: nomeInput.value.trim(),
            descricao: descInput.value.trim(),
            preco_pontos: parseInt(pontosInput.value.trim()),
            id_empresa: id_empresa,
            quantidade_disponivel: parseInt(qtdInput.value.trim())
          };

          if (!atualizados.nome || !atualizados.descricao || !atualizados.preco_pontos || !atualizados.quantidade_disponivel) {
            showNotification('Preencha todos os campos', 'error');
            return;
          }

          try {
            showLoadingOverlay();
            const res = await fetch(`http://traineasy.selfip.com:3000/recompensas/${r.id_recompensa}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(atualizados)
            });

            if (res.ok) {
              showNotification("Recompensa atualizada com sucesso!", 'success');
              carregarRecompensas();
            } else {
              showNotification("Erro ao atualizar recompensa.", 'error');
            }
          } catch (error) {
            console.error('Erro ao atualizar recompensa:', error);
            showNotification("Erro ao atualizar recompensa.", 'error');
          } finally {
            hideLoadingOverlay();
          }
        };

        btnExcluir.onclick = async () => {
          if (!confirm(`Tem certeza que deseja excluir "${r.nome}"? Esta ação não pode ser desfeita.`)) {
            return;
          }

          try {
            showLoadingOverlay();
            const res = await fetch(`http://traineasy.selfip.com:3000/recompensas/${r.id_recompensa}`, {
              method: "DELETE"
            });

            if (res.ok) {
              showNotification("Recompensa excluída com sucesso!", 'success');
              carregarRecompensas();
            } else {
              showNotification("Erro ao excluir recompensa.", 'error');
            }
          } catch (error) {
            console.error('Erro ao excluir recompensa:', error);
            showNotification("Erro ao excluir recompensa.", 'error');
          } finally {
            hideLoadingOverlay();
          }
        };

        div.appendChild(nomeInput);
        div.appendChild(descInput);
        div.appendChild(pontosInput);
        div.appendChild(qtdInput);

        const btnGroup = document.createElement("div");
        btnGroup.className = "buttons";
        btnGroup.appendChild(btnEditar);
        btnGroup.appendChild(btnSalvar);
        btnGroup.appendChild(btnCancelar);
        btnGroup.appendChild(btnExcluir);

        div.appendChild(btnGroup);
        lista.appendChild(div);
      });
    }

    // Botão Nova Recompensa
    const btnNovaRecompensa = document.createElement("button");
    btnNovaRecompensa.textContent = "➕ Nova Recompensa";
    btnNovaRecompensa.className = "nova-recompensa";
    btnNovaRecompensa.onclick = () => {
      showNotification('Redirecionando para criação de recompensa...', 'info');
      window.location.href = "../criar-recompensa/criar-recompensa.html";
    };
    lista.appendChild(btnNovaRecompensa);

    // Notificação removida conforme solicitado
  } catch (err) {
    console.error('Erro ao carregar recompensas:', err);
    showNotification('Erro ao carregar recompensas', 'error');
    lista.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error-color); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--error-color); margin-bottom: 0.5rem;">Erro ao carregar recompensas</h3>
        <p style="color: var(--gray-500);">Verifique sua conexão e tente novamente.</p>
        <button onclick="carregarRecompensas()" style="margin-top: 1rem;">Tentar novamente</button>
      </div>
    `;
  } finally {
    hideLoadingOverlay();
  }
}

function criarInput(type, value) {
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  return input;
}

function criarTextarea(value) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  return textarea;
}

function criarBotao(texto, classe) {
  const btn = document.createElement("button");
  btn.textContent = texto;
  btn.className = classe;
  return btn;
}

// Função para adicionar nova recompensa (compatibilidade com HTML)
function adicionarNovaRecompensa() {
  showNotification('Redirecionando para criação de recompensa...', 'info');
  window.location.href = "../criar-recompensa/criar-recompensa.html";
}

