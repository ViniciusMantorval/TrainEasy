
document.getElementById('form-recompensa').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id_empresa = sessionStorage.getItem("userId")
    const nome = document.getElementById('nome').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const preco_pontos = parseInt(document.getElementById('pontos').value.trim());
    const quantidade = parseInt(document.getElementById('quantidade').value.trim());
  
    const mensagem = document.getElementById('mensagem');
  
    if (!nome || !descricao || !preco_pontos || preco_pontos < 1) {
      mensagem.textContent = "Preencha todos os campos corretamente.";
      mensagem.style.color = "red";
      return;
    }
  
    try {
      const res = await fetch("http://localhost:3000/criar-recompensas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, descricao, preco_pontos,id_empresa, quantidade})
      });
  
      if (res.ok) {
        mensagem.textContent = "Recompensa cadastrada com sucesso!";
        mensagem.style.color = "green";
        document.getElementById('form-recompensa').reset();
        window.location.href = "../gerenciar-recompensas/gerenciar-recompensas.html";
      } else {
        const erro = await res.json();
        mensagem.textContent = erro?.error || "Erro ao cadastrar.";
        mensagem.style.color = "red";
      }
    } catch (err) {
      console.error("Erro ao enviar:", err);
      mensagem.textContent = "Erro de conexão.";
      mensagem.style.color = "red";
    }
  });
  