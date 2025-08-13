document.addEventListener("DOMContentLoaded", async () => {
    const idEmpresa = sessionStorage.getItem("userId"); // ou pegar via URL
    console.log(idEmpresa,"front");
    
    const res = await fetch(`http://localhost:3000/api/estatisticas?id_empresa=${idEmpresa}`);
    const data = await res.json();
  
    document.getElementById("total-treinamentos").textContent = `Treinamentos: ${data.totalTreinamentos}`;
    document.getElementById("media-conclusao").textContent = `Conclusão média: ${data.mediaConclusao}%`;
    document.getElementById("total-funcionarios").textContent = `Funcionários: ${data.totalFuncionarios}`;
    document.getElementById("total-pontos").textContent = `Pontos: ${data.totalPontos}`;
  
    const tabela = document.getElementById("tabela-treinamentos");
    data.treinamentos.forEach(t => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.titulo}</td>
        <td>${t.participantes}</td>
        <td>${t.concluidos}</td>
        <td>${t.media_pontuacao}</td>
        <td>${t.conclusao}%</td>
      `;
      tabela.appendChild(tr);
    });
  
    new Chart(document.getElementById("graficoConclusao"), {
      type: "bar",
      data: {
        labels: data.treinamentos.map(t => t.titulo),
        datasets: [{
          label: "Conclusão (%)",
          data: data.treinamentos.map(t => t.conclusao),
          backgroundColor: "rgba(75, 192, 192, 0.6)"
        }]
      }
    });
  });  