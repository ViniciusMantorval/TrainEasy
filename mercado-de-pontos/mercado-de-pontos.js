document.addEventListener("DOMContentLoaded", async () => {
    const userId = sessionStorage.getItem("userId");
    const idEmpresa = sessionStorage.getItem("empresaId"); // caso necessário
  
    if (!userId || !idEmpresa) {
      alert("Usuário ou empresa não identificados.");
      return;
    }
  
    const pontosElement = document.getElementById("pontos");
    const listaRecompensas = document.getElementById("lista-recompensas");
    let pontos = 0;
  
    try {
      // Buscar pontos do funcionário
      const resPontos = await fetch(`http://localhost:3000/pontos?id_funcionario=${userId}&id_empresa=${idEmpresa}`);
      const dados = await resPontos.json();
      pontos = dados.pontos || 0;
      pontosElement.innerText = `Você possui ${pontos} pontos disponíveis.`;
  
      // Buscar recompensas
      const resRecompensas = await fetch("http://localhost:3000/recompensas");
      const recompensas = await resRecompensas.json();
  
      recompensas.forEach(r => {
        const div = document.createElement("div");
        div.className = "recompensa";
  
        const title = document.createElement("h3");
        title.innerText = r.nome;
  
        const desc = document.createElement("p");
        desc.innerText = r.descricao;
  
        const preco = document.createElement("p");
        preco.innerText = `💰 Custa ${r.preco_pontos} pontos`;
  
        const botao = document.createElement("button");
        botao.innerText = "Resgatar";
        botao.disabled = r.preco_pontos > pontos;
  
        botao.addEventListener("click", async () => {
          const confirmado = confirm(`Deseja resgatar "${r.nome}" por ${r.preco_pontos} pontos?`);
          if (!confirmado) return;
  
          const res = await fetch("http://localhost:3000/resgatar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_funcionario: userId,
              id_recompensa: r.id_recompensa,
              id_empresa: idEmpresa
            })
          });
  
          if (res.ok) {
            alert("Recompensa resgatada com sucesso!");
            location.reload();
          } else {
            alert("Erro ao resgatar recompensa.");
          }
        });
  
        div.appendChild(title);
        div.appendChild(desc);
        div.appendChild(preco);
        div.appendChild(botao);
        listaRecompensas.appendChild(div);
      });
  
    } catch (err) {
      console.error("Erro ao carregar mercado:", err);
      pontosElement.innerText = "Erro ao carregar pontos.";
    }
  });
  