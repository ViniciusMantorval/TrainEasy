const userId = sessionStorage.getItem("userId");
const userType = sessionStorage.getItem("userType");

document.addEventListener('DOMContentLoaded', () => {
    const toggleDark = document.getElementById('toggleDark');
    toggleDark.addEventListener('change', () => {
      document.body.classList.toggle('dark');
    });
  });
 
  document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".cursos-container");
  
    try {
      const res = await fetch(`http://localhost:3000/treinamentos?id_funcionario=${userId}`);
      const treinamentos = await res.json();
  
      treinamentos.forEach(treinamento => {
        const card = document.createElement("div");
        card.classList.add("curso-card");
        card.style.backgroundColor = "#5bc0de"; // ou aleatório se quiser
  
        card.innerHTML = `
          <h4>${treinamento.titulo}</h4>
          <p class="curso-desc">${treinamento.descricao}</p>
          <p class="progresso">Progresso: 0%</p>
          <p class="data-inicio">Início: ${new Date(treinamento.data_inicio).toLocaleDateString('pt-BR')}</p>
          <button onclick="abrirTreinamento(${treinamento.id_treinamento})">Acessar</button>
        `;
  
        container.appendChild(card);
      });
    } catch (error) {
      console.error("Erro ao carregar treinamentos:", error);
    }
  });
  
  function abrirTreinamento(id) {
    window.location.href = `../treinamento/treinamento.html?id=${id}`;
  }
  