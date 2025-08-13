document.addEventListener("DOMContentLoaded", () => {
  const tipoRadios = document.getElementsByName("tipo");
  const campoCNPJ = document.getElementById("campoCNPJ");
  const campoFuncionario = document.getElementById("campoFuncionario");
  const cepInput = document.getElementById("cep");
  const enderecoDiv = document.getElementById("endereco");

  // Alterna a visibilidade dos campos com base no tipo de usuário
  tipoRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.checked && radio.value === "empresa") {
        campoCNPJ.style.display = "block";
        campoFuncionario.style.display = "none";
      } else if (radio.checked && radio.value === "funcionario") {
        campoCNPJ.style.display = "none";
        campoFuncionario.style.display = "block";
      }
    });
  });

  // Validação do CEP
  if (cepInput) {
    cepInput.addEventListener("blur", () => {
      const cep = cepInput.value.replace(/\D/g, "");
      if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then(res => res.json())
          .then(data => {
            if (data.erro) {
              enderecoDiv.textContent = "CEP inválido.";
            } else {
              enderecoDiv.textContent = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
            }
          })
          .catch(() => {
            enderecoDiv.textContent = "Erro ao buscar CEP.";
          });
      } else {
        enderecoDiv.textContent = "";
      }
    });
  }

  // Envio de dados do formulário para o backend
  const form = document.getElementById('formCadastro');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();  // Evita o envio padrão do formulário

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    let url = "";
    let userData = {};

    if (data.tipo === "empresa") {
      // Dados de cadastro de empresa
      userData = {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cnpj: data.cnpj
      };
      url = 'http://localhost:3000/empresas';
    } else if (data.tipo === "funcionario") {
      // Dados de cadastro de funcionário
      userData = {
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        cep: data.cep,
        senha: data.senha
      };
      url = 'http://localhost:3000/funcionarios';
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const resultado = await response.text();


      try {
        const json = JSON.parse(resultado);
        alert(json.mensagem);
        console.log(json);
        
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
        // alert(texto);
      }

    } catch (error) {
      alert('Erro ao enviar dados');
      console.error(error);
    }
  });
});
