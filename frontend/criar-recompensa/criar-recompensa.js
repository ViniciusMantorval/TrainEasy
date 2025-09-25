// Configuração da API
const API_CONFIG = {
  baseURL: 'https://traineasy.up.railway.app/empresas',
  endpoints: {
    criarRecompensa: '/criar-recompensas'
  },
  timeout: 10000 // 10 segundos
};

// Utilitários
const Utils = {
  // Debounce para validação em tempo real
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
  },

  // Validação de campos
  validateField(field, value) {
    const validators = {
      nome: (val) => {
        if (!val || val.trim().length < 3) {
          return 'Nome deve ter pelo menos 3 caracteres';
        }
        if (val.length > 100) {
          return 'Nome deve ter no máximo 100 caracteres';
        }
        return null;
      },
      descricao: (val) => {
        if (!val || val.trim().length < 1) {
          return 'Descrição é obrigatória';
        }
        if (val.length > 500) {
          return 'Descrição deve ter no máximo 500 caracteres';
        }
        return null;
      },
      pontos: (val) => {
        const num = parseInt(val);
        if (!val || isNaN(num) || num < 1) {
          return 'Pontos deve ser um número maior que 0';
        }
        if (num > 10000) {
          return 'Pontos deve ser no máximo 10.000';
        }
        return null;
      },
      quantidade: (val) => {
        const num = parseInt(val);
        if (!val || isNaN(num) || num < 1) {
          return 'Quantidade deve ser um número maior que 0';
        }
        if (num > 1000) {
          return 'Quantidade deve ser no máximo 1.000';
        }
        return null;
      }
    };

    return validators[field] ? validators[field](value) : null;
  },

  // Formatação de números
  formatNumber(num) {
    return new Intl.NumberFormat('pt-BR').format(num);
  },

  // Sanitização de entrada
  sanitizeInput(input) {
    return input.trim().replace(/[<>]/g, '');
  }
};

// Gerenciador de estado da aplicação
class AppState {
  constructor() {
    this.isSubmitting = false;
    this.validationErrors = {};
    this.connectionStatus = 'unknown';
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  setSubmitting(status) {
    this.isSubmitting = status;
    this.updateUI();
  }

  setValidationError(field, error) {
    if (error) {
      this.validationErrors[field] = error;
    } else {
      delete this.validationErrors[field];
    }
    this.updateFieldError(field, error);
  }

  updateFieldError(field, error) {
    const fieldElement = document.getElementById(field);
    const formGroup = fieldElement?.closest('.form-group');
    
    if (!formGroup) return;

    // Remove erro anterior
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    // Adiciona novo erro se existir
    if (error) {
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = error;
      formGroup.appendChild(errorElement);
      formGroup.classList.add('has-error');
    } else {
      formGroup.classList.remove('has-error');
    }
  }

  updateUI() {
    const submitBtn = document.getElementById('submit-btn');
    const hasErrors = Object.keys(this.validationErrors).length > 0;
    
    if (submitBtn) {
      submitBtn.disabled = this.isSubmitting || hasErrors;
      
      if (this.isSubmitting) {
        submitBtn.classList.add('loading');
      } else {
        submitBtn.classList.remove('loading');
      }
    }
  }

  isFormValid() {
    return Object.keys(this.validationErrors).length === 0;
  }
}

// Gerenciador de conexão e API
class APIManager {
  constructor() {
    this.controller = null;
  }

  async makeRequest(endpoint, options = {}) {
    // Cancela requisição anterior se existir
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
      // Timeout personalizado
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

  async criarRecompensa(dados) {
    return this.makeRequest(API_CONFIG.endpoints.criarRecompensa, {
      method: 'POST',
      body: JSON.stringify(dados)
    });
  }

  // Teste de conectividade
  async testConnection() {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/health`, {
        method: 'HEAD',
        timeout: 5000
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Gerenciador de mensagens
class MessageManager {
  constructor() {
    this.messageElement = document.getElementById('mensagem');
  }

  show(message, type = 'info', duration = 5000) {
    if (!this.messageElement) return;

    this.messageElement.textContent = message;
    this.messageElement.className = `message ${type} show`;

    // Auto-hide após duração especificada
    if (duration > 0) {
      setTimeout(() => {
        this.hide();
      }, duration);
    }
  }

  hide() {
    if (this.messageElement) {
      this.messageElement.classList.remove('show');
    }
  }

  showSuccess(message, duration = 3000) {
    this.show(message, 'success', duration);
  }

  showError(message, duration = 5000) {
    this.show(message, 'error', duration);
  }
}

// Classe principal da aplicação
class RecompensaApp {
  constructor() {
    this.state = new AppState();
    this.api = new APIManager();
    this.messages = new MessageManager();
    this.form = null;
    this.fields = {};
    
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.setupValidation();
    this.checkConnection();
  }

  setupElements() {
    this.form = document.getElementById('form-recompensa');
    this.fields = {
      nome: document.getElementById('nome'),
      descricao: document.getElementById('descricao'),
      pontos: document.getElementById('pontos'),
      quantidade: document.getElementById('quantidade')
    };
  }

  setupEventListeners() {
    if (this.form) {
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    // Listeners para validação em tempo real
    Object.entries(this.fields).forEach(([fieldName, fieldElement]) => {
      if (fieldElement) {
        const debouncedValidate = Utils.debounce(() => {
          this.validateField(fieldName);
        }, 300);

        fieldElement.addEventListener('input', debouncedValidate);
        fieldElement.addEventListener('blur', () => this.validateField(fieldName));
      }
    });

    // Listener para tecla Enter nos campos numéricos
    ['pontos', 'quantidade'].forEach(fieldName => {
      const field = this.fields[fieldName];
      if (field) {
        field.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.form.requestSubmit();
          }
        });
      }
    });

    // Listener para conexão
    window.addEventListener('online', () => {
      this.messages.showSuccess('Conexão restaurada!', 2000);
      this.checkConnection();
    });

    window.addEventListener('offline', () => {
      this.messages.showError('Sem conexão com a internet', 0);
    });
  }

  setupValidation() {
    // Validação inicial dos campos
    Object.keys(this.fields).forEach(fieldName => {
      this.validateField(fieldName);
    });
  }

  validateField(fieldName) {
    const field = this.fields[fieldName];
    if (!field) return;

    const value = Utils.sanitizeInput(field.value);
    const error = Utils.validateField(fieldName, value);
    
    this.state.setValidationError(fieldName, error);
  }

  async checkConnection() {
    try {
      const isConnected = await this.api.testConnection();
      this.state.connectionStatus = isConnected ? 'connected' : 'disconnected';
      
      if (!isConnected) {
        this.messages.showError('Não foi possível conectar ao servidor', 0);
      }
    } catch (error) {
      this.state.connectionStatus = 'error';
      console.warn('Erro ao verificar conexão:', error);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (this.state.isSubmitting) return;

    // Validação final
    this.validateAllFields();
    
    if (!this.state.isFormValid()) {
      this.messages.showError('Por favor, corrija os erros no formulário');
      return;
    }

    this.state.setSubmitting(true);

    try {
      const formData = this.getFormData();
      await this.submitForm(formData);
    } catch (error) {
      this.handleSubmitError(error);
    } finally {
      this.state.setSubmitting(false);
    }
  }

  validateAllFields() {
    Object.keys(this.fields).forEach(fieldName => {
      this.validateField(fieldName);
    });
  }

  getFormData() {
    const idEmpresa = sessionStorage.getItem("id_empresa");
    
    if (!idEmpresa) {
      throw new Error('ID da empresa não encontrado. Faça login novamente.');
    }

    return {
      nome: Utils.sanitizeInput(this.fields.nome.value),
      descricao: Utils.sanitizeInput(this.fields.descricao.value),
      preco_pontos: parseInt(this.fields.pontos.value),
      quantidade: parseInt(this.fields.quantidade.value),
      id_empresa: idEmpresa
    };
  }

  async submitForm(formData) {
    try {
      await this.api.criarRecompensa(formData);
      
      this.messages.showSuccess('Recompensa cadastrada com sucesso!');
      this.resetForm();
      
      // Redirecionar após sucesso
      setTimeout(() => {
        this.redirectToManagement();
      }, 1500);
      
    } catch (error) {
      // Retry logic para falhas de rede
      if (this.state.retryCount < this.state.maxRetries && this.isNetworkError(error)) {
        this.state.retryCount++;
        this.messages.showError(`Tentativa ${this.state.retryCount}/${this.state.maxRetries}...`);
        
        await new Promise(resolve => setTimeout(resolve, 1000 * this.state.retryCount));
        return this.submitForm(formData);
      }
      
      throw error;
    }
  }

  isNetworkError(error) {
    return error.message.includes('Timeout') || 
           error.message.includes('Failed to fetch') ||
           error.message.includes('Network');
  }

  handleSubmitError(error) {
    console.error('Erro ao enviar formulário:', error);
    
    let errorMessage = 'Erro inesperado. Tente novamente.';
    
    if (error.message.includes('Timeout')) {
      errorMessage = 'Tempo limite excedido. Verifique sua conexão.';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Erro de conexão. Verifique sua internet.';
    } else if (error.message.includes('ID da empresa')) {
      errorMessage = error.message;
    } else if (error.message.length > 0 && error.message.length < 100) {
      errorMessage = error.message;
    }
    
    this.messages.showError(errorMessage);
    this.state.retryCount = 0; // Reset retry count
  }

  resetForm() {
    this.form.reset();
    
    // Limpar erros de validação
    Object.keys(this.fields).forEach(fieldName => {
      this.state.setValidationError(fieldName, null);
    });
    
    // Focar no primeiro campo
    if (this.fields.nome) {
      this.fields.nome.focus();
    }
  }

  redirectToManagement() {
    const managementUrl = "../gerenciar-recompensas/gerenciar-recompensas.html";
    
    // Verificar se a página existe antes de redirecionar
    if (window.location.pathname.includes('criar-recompensa')) {
      window.location.href = managementUrl;
    } else {
      // Fallback: tentar voltar para a página anterior
      window.history.back();
    }
  }
}

// Adicionar estilos CSS para erros de validação
const errorStyles = `
  .field-error {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .field-error::before {
    content: "⚠";
    font-size: 0.75rem;
  }
  
  .form-group.has-error .form-input,
  .form-group.has-error .form-textarea {
    border-color: var(--error-color);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
  
  .form-group.has-error .input-icon {
    color: var(--error-color);
  }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);

// Inicializar aplicação quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new RecompensaApp();
  });
} else {
  new RecompensaApp();
}

// // Exportar para debug (apenas em desenvolvimento)
// if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//   window.RecompensaApp = RecompensaApp;
//   window.Utils = Utils;
// }


