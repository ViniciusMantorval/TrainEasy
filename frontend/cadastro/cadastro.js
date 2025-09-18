document.addEventListener("DOMContentLoaded", () => {
  const tipoRadios = document.getElementsByName("tipo");
  const campoCNPJ = document.getElementById("campoCNPJ");
  const campoFuncionario = document.getElementById("campoFuncionario");
  const cepInput = document.getElementById("cep");
  const enderecoDiv = document.getElementById("endereco");

  // Envio de dados do formulário para o backend
  const form = document.getElementById('formCadastro');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();  // Evita o envio padrão do formulário

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    let url = "";
    let userData = {};

      // Dados de cadastro de empresa
      userData = {
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,
        email: data.email,
        senha: data.senha,
        cnpj: data.cnpj
      };
      url = 'https://traineasy.up.railway.app/empresas';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const resultado = await response.text();
      alert(resultado);
      form.reset();  // Limpa o formulário após o envio

        window.location.href = '../dashboard-empresa/dashboard-empresa.html'; 
    } catch (error) {
      alert('Erro ao enviar dados, reveja suas informações ou contate o suporte');
      console.error(error);
    }
  });
});


