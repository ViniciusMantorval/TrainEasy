document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("lista-recompensas");
  const id_empresa = sessionStorage.getItem("userId")

  async function carregarRecompensas() {
    lista.innerHTML = "Carregando...";
    try {
      const res = await fetch(`http://localhost:3000/recompensas?id_empresa=${id_empresa}`);
      const recompensas = await res.json();

      lista.innerHTML = "";

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
        };

        btnSalvar.onclick = async () => {
          const atualizados = {
            nome: nomeInput.value.trim(),
            descricao: descInput.value.trim(),
            preco_pontos: parseInt(pontosInput.value.trim()),
            id_empresa: id_empresa,
            quantidade_disponivel: parseInt(qtdInput.value.trim())
          };

          const res = await fetch(`http://localhost:3000/recompensas/${r.id_recompensa}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(atualizados)
          });

          if (res.ok) {
            alert("Recompensa atualizada com sucesso!");
            carregarRecompensas();
          } else {
            alert("Erro ao atualizar recompensa.");
          }
        };

        btnExcluir.onclick = async () => {
          const confirmacao = confirm(`Deseja excluir "${r.nome}"?`);
          if (!confirmacao) return;

          const res = await fetch(`http://localhost:3000/recompensas/${r.id_recompensa}`, {
            method: "DELETE"
          });

          if (res.ok) {
            alert("Recompensa excluída.");
            carregarRecompensas();
          } else {
            alert("Erro ao excluir.");
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
      const btnNovaRecompensa = document.createElement("button");
    btnNovaRecompensa.textContent = "➕ Nova Recompensa";
    btnNovaRecompensa.className = "nova-recompensa";
    btnNovaRecompensa.onclick = () => {
        window.location.href = "../criar-recompensa/criar-recompensa.html";
    };
    lista.appendChild(btnNovaRecompensa);
    } catch (err) {
      lista.innerHTML = "Erro ao carregar recompensas.";
      console.error(err);
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

  carregarRecompensas();
});
