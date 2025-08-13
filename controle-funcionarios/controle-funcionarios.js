  document.getElementById('add_funcionario').addEventListener('submit', async function(e) {
    e.preventDefault();

    const funcionario = document.getElementById('funcionario').value;
    const id_empresa = sessionStorage.getItem('userId')

    try {
      const response = await fetch('http://localhost:3000/adicionar-funcionario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ funcionario, id_empresa })
      });

      const resultado = await response.text();
      alert(resultado);

    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
      alert('Erro ao adicionar funcionário.');
    }
  });

