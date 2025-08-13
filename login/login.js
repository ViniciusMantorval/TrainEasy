document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const texto = await response.text();
      try {
        const json = JSON.parse(texto);
        alert(json.mensagem);
  
        if (json.tipo === 'funcionario') {
          sessionStorage.setItem("userId",json.id)
          sessionStorage.setItem("userType",json.tipo)
          window.location.href = '../dashboard-funcionario/dashboard-funcionario.html';
        } else if (json.tipo === 'empresa') {
          sessionStorage.setItem("userId",json.id)
          sessionStorage.setItem("userType",json.tipo)
          window.location.href = '../dashboard-empresa/dashboard-empresa.html';
        }
      } catch (erroJson) {
        // Se não for JSON válido, mostra como erro
        alert(texto);
      }
  
    } catch (error) {
      alert('Erro ao fazer login');
      console.error(error);
    }
  });
