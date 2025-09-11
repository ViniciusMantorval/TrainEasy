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
  carregarCertificados(); // Função específica para carregar certificados
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
      else if (currentPage.includes('meus-certificados') && href.includes('meus-certificados')) {
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

// ===== CÓDIGO ESPECÍFICO DOS CERTIFICADOS =====
async function carregarCertificados() {
  const userId = sessionStorage.getItem("id_funcionario");

  const res = await fetch(`http://traineasy.selfip.com:3000/certificados/${userId}`);
  const certificados = await res.json();

  const container = document.getElementById("lista-certificados");
  container.innerHTML = "";

  certificados.forEach(cert => {
    const card = document.createElement("div");
    card.classList.add("cert-card");

    // Criação dos elementos
    const titulo = document.createElement("h3");
    titulo.innerText = cert.nomeTreinamento;

    const imagem = document.createElement("img");
    imagem.src = `http://traineasy.selfip.com:3000${cert.imagem}`; // já contém /uploads/
    imagem.alt = "Certificado";
    imagem.style.maxWidth = "200px";
    imagem.style.display = "block";
    imagem.style.marginBottom = "10px";

    const btnVisualizar = document.createElement("button");
    btnVisualizar.innerText = "Visualizar";
    btnVisualizar.addEventListener("click", () => visualizarCertificado(`http://traineasy.selfip.com:3000${cert.imagem}`));

    const btnBaixar = document.createElement("button");
    btnBaixar.innerText = "Baixar";
    btnBaixar.addEventListener("click", () => baixarCertificado(`http://traineasy.selfip.com:3000${cert.imagem}`, cert.nomeTreinamento));

    // Adiciona elementos ao card
    card.appendChild(titulo);
    card.appendChild(imagem);
    card.appendChild(btnVisualizar);
    card.appendChild(btnBaixar);

    container.appendChild(card);
  });
}

function visualizarCertificado(src) {
  // Abre diretamente a imagem em uma nova aba
  window.open(src, "_blank");
}
function baixarCertificado(src, nome) {
  // src vem como "/uploads/arquivo.png"
  const filename = src.split("/").pop();
  window.location.href = `http://traineasy.selfip.com:3000/download/${filename}`;
}


// async function loadCertificates() {
//   const container = document.getElementById("lista-certificados");
  

//   if (!userId) {
//     showNotification('ID do funcionário não encontrado', 'error');
//     return;
//   }

//   try {
//     showLoadingOverlay();

//     const res = await fetch(`http://traineasy.selfip.com:3000/certificados?id_funcionario=${userId}`);
//     const certificados = await res.json();

//     container.innerHTML = ''; // Limpar container

//     if (certificados && certificados.length > 0) {
//       certificados.forEach((certificado, index) => {
//         const card = document.createElement("div");
//         card.classList.add("certificate-card");
//         card.style.animationDelay = `${index * 0.1}s`;

//         card.innerHTML = `
//           <h3>${certificado.nome_treinamento}</h3>
//           <p>Emitido em: ${new Date(certificado.data_emissao).toLocaleDateString('pt-BR')}</p>
//           <div class="certificate-actions">
//             <button class="view-btn" onclick="viewCertificate('${certificado.url_certificado}')">
//               <i class="fas fa-eye"></i> Visualizar
//             </button>
//             <button class="download-btn" onclick="downloadCertificate('${certificado.url_certificado}', '${certificado.nome_treinamento}.pdf')">
//               <i class="fas fa-download"></i> Baixar
//             </button>
//           </div>
//         `;
//         container.appendChild(card);
//       });
//     } else {
//       container.innerHTML = `
//         <div class="no-certificates" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--gray-500);">
//           <i class="fas fa-certificate" style="font-size: 3rem; margin-bottom: 1rem; color: var(--gray-400);"></i>
//           <h3 style="color: var(--gray-600); margin-bottom: 0.5rem;">Nenhum certificado disponível</h3>
//           <p>Seus certificados de conclusão aparecerão aqui.</p>
//         </div>
//       `;
//     }

//   } catch (error) {
//     console.error("Erro ao carregar certificados:", error);
//     showNotification('Erro ao carregar certificados', 'error');
//     container.innerHTML = `
//       <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
//         <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error-color); margin-bottom: 1rem;"></i>
//         <h3 style="color: var(--error-color); margin-bottom: 0.5rem;">Erro ao carregar certificados</h3>
//         <p style="color: var(--gray-500); margin-bottom: 1rem;">Verifique sua conexão e tente novamente.</p>
//         <button onclick="loadCertificates()" class="view-btn" style="margin-top: 1rem;">Tentar novamente</button>
//       </div>
//     `;
//   } finally {
//     hideLoadingOverlay();
//   }
// }

function viewCertificate(url) {
  window.open(url, '_blank');
}

async function downloadCertificate(url, filename) {
  try {
    showLoadingOverlay();
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    showNotification('Download iniciado!', 'success');
  } catch (error) {
    console.error('Erro ao baixar certificado:', error);
    showNotification('Erro ao baixar certificado', 'error');
  } finally {
    hideLoadingOverlay();
  }
}

