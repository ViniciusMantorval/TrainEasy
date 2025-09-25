document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {

      const response = await fetch('traineasy.up.railway.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const texto = await response.text();
      try {

        const json = JSON.parse(texto);
        console.log(json);
        
        id=json.id;
        user=json.usuario;
        
        if (json.tipo === 'funcionario') {
          sessionStorage.setItem("id_funcionario", json.id);
          sessionStorage.setItem("nome", json.nome);
          sessionStorage.setItem("tipo", json.tipo);
          window.location.href = '../dashboard-funcionario/dashboard-funcionario.html';
        } else if (json.tipo === 'empresa') {
          sessionStorage.setItem("id_empresa", id);
          sessionStorage.setItem("nome_fantasia", user);
          sessionStorage.setItem("tipo", json.tipo);
          window.location.href = '../dashboard-empresa/dashboard-empresa.html';
        }
      } catch (erroJson) {
        // Se não for JSON válido, mostra como erro
      }
  
    } catch (error) {
      alert('Erro ao fazer login, senha ou email invalidos');
      console.error(error);
    }
  });
//        localStorage.setItem("idEMP", "id");

