// Variáveis globais
let currentTab = 'overview';
let currentCourseFilter = 'all';
let currentActivityFilter = 'all';
let tipo = sessionStorage.getItem('tipo')
let id
if (tipo === 'funcionario'){
    id = sessionStorage.getItem('id_funcionario')
}else if(tipo === 'empresa'){
    id = sessionStorage.getItem('id_empresa')
}

// Dados simulados
let userData = {
    nome: 'Nome',
    empresa: 'TechCorp Solutions',
    email: 'joao.silva@techcorp.com',
    // bio: 'Desenvolvedor apaixonado por tecnologia com foco em JavaScript e React. Sempre em busca de novos desafios e oportunidades de aprendizado.',
    // avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    // banner: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop'
};

let coursesData = [
    {
        id: 'js-fundamentals',
        title: 'JavaScript Fundamentals',
        description: 'Aprenda os conceitos básicos do JavaScript',
        // image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
        progress: 100,
        status: 'completed' // não esquecer de colocar o , depois que voltar e se voltar
        // duration: '12h',
        // rating: 4.8,
        // students: '2.5k',
        // certificate: true
    },
    {
        id: 'react-dev',
        title: 'React Development',
        description: 'Construa aplicações modernas com React',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
        progress: 70,
        status: 'in-progress',
        duration: '18h',
        rating: 4.9,
        students: '1.2k',
        certificate: false
    },
    {
        id: 'nodejs-express',
        title: 'Node.js & Express',
        description: 'Desenvolvimento backend com Node.js',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=200&fit=crop',
        progress: 0,
        status: 'pending',
        duration: '20h',
        rating: 4.7,
        students: '850',
        certificate: false
    },
    {
        id: 'html-css',
        title: 'HTML & CSS Mastery',
        description: 'Domine os fundamentos do desenvolvimento web',
        image: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=300&h=200&fit=crop',
        progress: 100,
        status: 'completed',
        duration: '15h',
        rating: 4.6,
        students: '3.1k',
        certificate: true
    }
];

const certificatesData = [
    {
        id: 'js-fundamentals',
        title: 'JavaScript Fundamentals',
        completedDate: '22/01/2025',
        grade: '95%'
    },
    {
        id: 'html-css',
        title: 'HTML & CSS Mastery',
        completedDate: '15/01/2025',
        grade: '92%'
    }
];

async function fetchUserData() {
    try {
        const res = await fetch(`http://traineasy.selfip.com:3000/fill_profile?id=${id}&tipo=${tipo}`);
                const data = await res.json();
                userData = { ...userData, ...data };
                console.log("Dados de usuário carregado:", userData);
    } catch (err) {
        console.error("Erro ao buscar usuário:", err);
    }
}

async function fetchCourseData() {
    try {
        const res = await fetch(`http://traineasy.selfip.com:3000/courses?id=${id}&tipo=${tipo}`);
                const data = await res.json();
                // O API não retorna 'bio', 'avatar' e 'banner', então vamos fundir os dados.
                if (Array.isArray(data)) {
                    // Mescla os dados da API com os dados simulados
                    // Usando concat para garantir que coursesData continua sendo um array
                    coursesData = data.map(apiCourse => {
                        const existingCourse = coursesData.find(c => c.id === apiCourse.id);
                        return existingCourse ? { ...existingCourse, ...apiCourse } : apiCourse;
                    });
                } else {
                    console.error("A API não retornou um array de cursos.");
                    // Pode adicionar um fallback ou notificação de erro para o usuário
                }
                
                console.log("Dados de cursos carregados:", coursesData);
    } catch (err) {
        console.error("Erro ao buscar usuário:", err);
    }
}



// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
    // AWAIT força a espera até que a busca pela API termine
    await fetchUserData();
    await fetchCourseData();
    // Depois que a busca terminar, chamamos as funções de inicialização
    // garantindo que os dados já estejam disponíveis
    loadUserData();
    initializeProfile();
    initializeEventListeners();
    initializeAnimations();
});
// Inicializar perfil
function initializeProfile() {
    // Configurar progresso circular
    updateCircularProgress();
    
    // Configurar abas
    switchTab('overview');
    
    // Carregar cursos
    renderCourses();
    
    // Carregar certificados
    renderCertificates();
}

// Inicializar event listeners
function initializeEventListeners() {
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('userDropdown');
        const toggle = document.querySelector('.dropdown-toggle');
        
        if (!toggle.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    // Fechar modal ao clicar no overlay
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-overlay')) {
            closeEditProfile();
        }
    });
    
    // Tecla ESC para fechar modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeEditProfile();
        }
    });
}

// Inicializar animações
function initializeAnimations() {
    // Animar barras de progresso
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-fill, .skill-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
    
    // Animar contadores
    animateCounters();
}

// Carregar dados do usuário
function loadUserData() {
    document.getElementById('profileName').textContent = userData.nome;
    document.getElementById('profileTitle').textContent = userData.funcao;
    document.getElementById('profileCompany').textContent = userData.empresa;
    document.getElementById('profileAvatar').src = userData.avatar;
    document.getElementById('navAvatar').src = userData.avatar;
}

// Atualizar progresso circular
function updateCircularProgress() {
    const circle = document.querySelector('.progress-ring-fill');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const percentage = 90; // 70% de progresso
    
    progress_text = document.getElementById("progress_text");
    progress_text.innerText = `${percentage}%`
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference - (percentage / 100) * circumference;
}

// Animar contadores
async function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    let targets = ['0', '0', '0', '0'];
    try {
        const res = await fetch(`http://traineasy.selfip.com:3000/courses_statistics?id=${id}&tipo=${tipo}`);
        const data = await res.json();
        console.log(data);
        if (data) {
            targets = [
                data.cursos_concluidos || '0', 
                '0', 
                data.certificados_obtidos || '0', 
                data.pontos || '0'
            ];
        }
    }catch(err){
        console.error("Erro ao buscar usuário:", err);
    }

    counters.forEach((counter, index) => {
        const target = parseInt(targets[index].toString().replace('.', ''), 10);
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = targets[index];
                clearInterval(timer);
            } else {
                if (targets[index].includes('.')) {
                    counter.textContent = Math.floor(current / 1000) + '.' + String(Math.floor(current % 1000)).padStart(3, '0');
                } else {
                    counter.textContent = Math.floor(current);
                }
            }
        }, 20);
    });
}

// Alternar dropdown do usuário
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Trocar de aba
function switchTab(tabName) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Adicionar classe active na aba selecionada
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    currentTab = tabName;
    
    // Executar ações específicas da aba
    if (tabName === 'courses') {
        renderCourses();
    } else if (tabName === 'certificates') {
        renderCertificates();
    }
}

// Filtrar cursos
function filterCourses(filter) {
    currentCourseFilter = filter;
    
    // Atualizar botões de filtro
    document.querySelectorAll('.courses-filter .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderCourses();
}

// Buscar cursos
function searchCourses(query) {
    const cards = document.querySelectorAll('.course-card');
    
    cards.forEach(card => {
        const title = card.querySelector('.course-title').textContent.toLowerCase();
        const description = card.querySelector('.course-description').textContent.toLowerCase();
        
        if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Renderizar cursos
function renderCourses() {
    const container = document.getElementById('coursesGrid');
    let filteredCourses = coursesData;
    
    if (currentCourseFilter !== 'all') {
        filteredCourses = coursesData.filter(course => course.status === currentCourseFilter);
    }
    
    container.innerHTML = filteredCourses.map(course => `
        <div class="course-card ${course.status}" data-status="${course.status}">
            <div class="course-image">
                <img src="${course.image}" alt="${course.titulo}">
                <div class="course-status">
                    <i class="fas fa-${getStatusIcon(course.status)}"></i>
                    ${getStatusText(course.status)}
                </div>
            </div>
            <div class="course-content">
                <h4 class="course-title">${course.titulo}</h4>
                <p class="course-description">${course.descricao}</p>
                <div class="course-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                    
                </div>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-star"></i> ${course.rating}</span>
                    <span><i class="fas fa-${course.certificate ? 'certificate' : 'users'}"></i> ${course.certificate ? 'Certificado' : course.students + ' alunos'}</span>
                </div>
            </div>
            <div class="course-actions">
                ${getCourseActionButton(course)}
            </div>
        </div>
    `).join('');
}

// Obter ícone do status
function getStatusIcon(status) {
    const icons = {
        'concluido': 'check-circle',
        'em_andamento': 'play-circle',
        'pendente': 'lock'
    };
    return icons[status] || 'circle';
}

// Obter texto do status
function getStatusText(status) {
    const texts = {
        'concluido': 'Concluído',
        'em_andamento': 'Em Progresso',
        'pendente': 'Bloqueado'
    };
    return texts[status] || 'Desconhecido';
}

// Obter botão de ação do curso
function getCourseActionButton(course) {
    if (course.status === 'concluido') {
        return `<button class="btn-primary" onclick="viewCertificate('${course.id}')">Ver Certificado</button>`;
    } else if (course.status === 'em_andamento') {
        return `<button class="btn-primary" onclick="continueCourse('${course.id}')">Continuar</button>`;
    } else {
        return `<button class="btn-secondary" disabled>Complete o curso anterior</button>`;// caso queira alterar o fato de botoes ficarem travados com o processo pendende altere essa linha
    }
}

// Renderizar certificados
function renderCertificates() {
    const container = document.querySelector('.certificates-grid');
    
    container.innerHTML = certificatesData.map(cert => `
        <div class="certificate-card">
            <div class="certificate-preview">
                <div class="certificate-content">
                    <div class="certificate-header">
                        <i class="fas fa-award"></i>
                        <h4>Certificado de Conclusão</h4>
                    </div>
                    <div class="certificate-body">
                        <h5>${cert.title}</h5>
                        <p>${userData.nome}</p>
                        <p>Concluído em ${cert.completedDate}</p>
                        <p>Nota: ${cert.grade}</p>
                    </div>
                </div>
            </div>
            <div class="certificate-actions">
                <button class="btn-primary" onclick="viewCertificate('${cert.id}')">
                    <i class="fas fa-eye"></i>
                    Visualizar
                </button>
                <button class="btn-secondary" onclick="downloadCertificate('${cert.id}')">
                    <i class="fas fa-download"></i>
                    Baixar
                </button>
                <button class="btn-secondary" onclick="shareCertificate('${cert.id}')">
                    <i class="fas fa-share"></i>
                    Compartilhar
                </button>
            </div>
        </div>
    `).join('');
}

// Filtrar atividades
function filterActivity(filter) {
    currentActivityFilter = filter;
    
    // Atualizar botões de filtro
    document.querySelectorAll('.activity-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Aqui você implementaria a lógica de filtro das atividades
    showNotification(`Filtro de atividades: ${filter}`, 'info');
}

// Editar perfil
function editProfile() {
    const modal = document.getElementById('editProfileModal');
    
    // Preencher formulário com dados atuais
    document.getElementById('editName').value = userData.nome;
    document.getElementById('editTitle').value = userData.funcao;
    document.getElementById('editCompany').value = userData.empresa;
    document.getElementById('editEmail').value = userData.email;
    document.getElementById('editBio').value = userData.bio;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de edição
function closeEditProfile() {
    const modal = document.getElementById('editProfileModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Salvar perfil
function saveProfile(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Atualizar dados do usuário
    userData.nome = formData.get('name');
    userData.funcao = formData.get('title');
    userData.empresa = formData.get('company');
    userData.email = formData.get('email');
    userData.bio = formData.get('bio');
    
    // Atualizar interface
    loadUserData();
    
    showNotification('Perfil atualizado com sucesso!', 'success');
    closeEditProfile();
}

// Compartilhar perfil
function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: `Perfil de ${userData.name}`,
            text: `Confira o perfil de ${userData.name} na TrainEasy`,
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que não suportam Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link do perfil copiado para a área de transferência!', 'success');
        });
    }
}

// Alterar avatar
function changeAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profileAvatar').src = e.target.result;
                document.getElementById('navAvatar').src = e.target.result;
                userData.avatar = e.target.result;
                showNotification('Avatar atualizado com sucesso!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Alterar banner
function changeBanner() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const banner = document.querySelector('.profile-banner');
                banner.style.backgroundImage = `url(${e.target.result})`;
                banner.style.backgroundSize = 'cover';
                banner.style.backgroundPosition = 'center';
                userData.banner = e.target.result;
                showNotification('Banner atualizado com sucesso!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Continuar curso
function continueCourse(courseId) {
    showNotification(`Redirecionando para o curso...`, 'info');
    window.location.href = `../treinamento/treinamento.html?id=${courseId}`;
    setTimeout(() => {
        showNotification(`Curso ${courseId} carregado!`, 'success');
    }, 1500);
}

// Ver certificado
function viewCertificate(courseId) {
    showNotification('Abrindo certificado...', 'info');
    // Aqui você implementaria a visualização do certificado
    setTimeout(() => {
        showModal({
            title: 'Certificado de Conclusão',
            content: `
                <div class="certificate-viewer">
                    <div class="certificate-full">
                        <div class="cert-header">
                            <i class="fas fa-award" style="font-size: 3rem; color: #f59e0b; margin-bottom: 1rem;"></i>
                            <h2>Certificado de Conclusão</h2>
                        </div>
                        <div class="cert-body">
                            <p>Certificamos que</p>
                            <h3 style="color: #6366f1; margin: 1rem 0;">${userData.name}</h3>
                            <p>concluiu com êxito o curso</p>
                            <h4 style="margin: 1rem 0;">${coursesData.find(c => c.id === courseId)?.title}</h4>
                            <p>com aproveitamento de <strong>95%</strong></p>
                            <p style="margin-top: 2rem;">São Paulo, 22 de Janeiro de 2025</p>
                        </div>
                    </div>
                    <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                        <button class="btn-primary" onclick="downloadCertificate('${courseId}')">
                            <i class="fas fa-download"></i> Baixar PDF
                        </button>
                        <button class="btn-secondary" onclick="shareCertificate('${courseId}')">
                            <i class="fas fa-share"></i> Compartilhar
                        </button>
                    </div>
                </div>
            `,
            showCloseButton: true
        });
    }, 1000);
}

// Baixar certificado
function downloadCertificate(courseId) {
    showNotification('Preparando download do certificado...', 'info');
    // Simular download
    setTimeout(() => {
        showNotification('Certificado baixado com sucesso!', 'success');
    }, 2000);
}

// Baixar todos os certificados
function downloadAllCertificates() {
    showNotification('Preparando download de todos os certificados...', 'info');
    // Simular download
    setTimeout(() => {
        showNotification('Todos os certificados foram baixados!', 'success');
    }, 3000);
}

// Compartilhar certificado
function shareCertificate(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (navigator.share) {
        navigator.share({
            title: `Certificado - ${course.title}`,
            text: `Acabei de concluir o curso ${course.title} na TrainEasy!`,
            url: window.location.href
        });
    } else {
        showNotification('Link do certificado copiado!', 'success');
    }
}

// Ver todas as conquistas
function viewAllAchievements() {
    showModal({
        title: 'Todas as Conquistas',
        content: `
            <div class="achievements-full">
                <div class="achievement-category">
                    <h4>Conquistas de Aprendizado</h4>
                    <div class="achievements-grid">
                        <div class="achievement-item">
                            <div class="achievement-icon gold">
                                <i class="fas fa-crown"></i>
                            </div>
                            <div class="achievement-info">
                                <h5>Mestre JavaScript</h5>
                                <p>Concluiu 5 cursos de JavaScript</p>
                                <span class="achievement-date">Hoje</span>
                            </div>
                        </div>
                        <div class="achievement-item">
                            <div class="achievement-icon silver">
                                <i class="fas fa-medal"></i>
                            </div>
                            <div class="achievement-info">
                                <h5>Estudante Dedicado</h5>
                                <p>7 dias consecutivos estudando</p>
                                <span class="achievement-date">Ontem</span>
                            </div>
                        </div>
                        <div class="achievement-item">
                            <div class="achievement-icon bronze">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="achievement-info">
                                <h5>Primeira Certificação</h5>
                                <p>Obteve seu primeiro certificado</p>
                                <span class="achievement-date">3 dias atrás</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="achievement-category">
                    <h4>Conquistas Sociais</h4>
                    <div class="achievements-grid">
                        <div class="achievement-item">
                            <div class="achievement-icon silver">
                                <i class="fas fa-comments"></i>
                            </div>
                            <div class="achievement-info">
                                <h5>Colaborador Ativo</h5>
                                <p>Participou de 10 discussões no fórum</p>
                                <span class="achievement-date">1 semana atrás</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        showCloseButton: true
    });
}

// Abrir configurações
function openSettings() {
    showModal({
        title: 'Configurações',
        content: `
            <div class="settings-content">
                <div class="settings-section">
                    <h4>Notificações</h4>
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" checked> Email sobre novos cursos
                        </label>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" checked> Lembretes de estudo
                        </label>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox"> Newsletter semanal
                        </label>
                    </div>
                </div>
                <div class="settings-section">
                    <h4>Privacidade</h4>
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" checked> Perfil público
                        </label>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox"> Mostrar progresso para outros usuários
                        </label>
                    </div>
                </div>
                <div class="settings-section">
                    <h4>Tema</h4>
                    <div class="setting-item">
                        <select class="setting-select">
                            <option value="light">Claro</option>
                            <option value="dark">Escuro</option>
                            <option value="auto">Automático</option>
                        </select>
                    </div>
                </div>
                <div style="margin-top: 2rem;">
                    <button class="btn-primary" onclick="saveSettings()">
                        <i class="fas fa-save"></i> Salvar Configurações
                    </button>
                </div>
            </div>
        `,
        showCloseButton: true
    });
}

// Salvar configurações
function saveSettings() {
    showNotification('Configurações salvas com sucesso!', 'success');
    closeModal();
}

// Logout
function logout() {
    showNotification('Fazendo logout...', 'info');
    setTimeout(() => {
        showNotification('Logout realizado com sucesso!', 'success');
        // Aqui você redirecionaria para a página de login
        window.location.href = `../login/login.html`;
    }, 1500);
}

// Função para mostrar modal
function showModal({ title, content, showCloseButton = false }) {
    // Remover modal existente
    const existingModal = document.querySelector('.modal-overlay:not(#editProfileModal)');
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
    
    const modal = document.querySelector('.modal-overlay:not(#editProfileModal)');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
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
        border-radius: 0.5rem;
        padding: 1rem 1.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border-left: 4px solid var(--primary-color);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10001;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 400px;
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
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Adicionar estilos CSS adicionais dinamicamente
const additionalCSS = `
<style>
.certificate-viewer {
    text-align: center;
}

.certificate-full {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    padding: 3rem 2rem;
    margin-bottom: 2rem;
}

.cert-header h2 {
    color: #374151;
    margin-bottom: 2rem;
}

.cert-body p {
    margin: 0.5rem 0;
    color: #6b7280;
}

.achievements-full {
    max-height: 70vh;
    overflow-y: auto;
}

.achievement-category {
    margin-bottom: 2rem;
}

.achievement-category h4 {
    color: #374151;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.achievements-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.settings-content {
    max-height: 70vh;
    overflow-y: auto;
}

.settings-section {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.settings-section:last-child {
    border-bottom: none;
}

.settings-section h4 {
    color: #374151;
    margin-bottom: 1rem;
}

.setting-item {
    margin-bottom: 1rem;
}

.setting-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: #374151;
}

.setting-select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background: white;
}

.notification {
    font-family: 'Inter', sans-serif;
}

.notification span {
    flex: 1;
    color: #374151;
    font-weight: 500;
}

.notification button {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.notification button:hover {
    background: #f3f4f6;
    color: #6b7280;
}

@media (max-width: 768px) {
    .notification {
        right: 1rem;
        left: 1rem;
        max-width: none;
    }
}
</style>
`;

// Injetar CSS adicional
document.head.insertAdjacentHTML('beforeend', additionalCSS);

