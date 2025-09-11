document.getElementById('filtros').addEventListener('submit', async (e) => {
e.preventDefault();
  

  const formFiltros = new FormData(e.target);
  const data = Object.fromEntries(formFiltros.entries());


  try {

    const response = await fetch('http://traineasy.selfip.com:3000/list_empresas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    
    const texto = await response.json();

    const lista = document.getElementById("lista");
    const pesquisa = document.getElementById("nome");
    lista.innerHTML = '';
    pesquisa.value = '';

  for (let x in texto) {
    const node = document.createElement("tr");

    const id_empresa = document.createElement("td");
    const razao_social = document.createElement("td");
    const nome_fantasia = document.createElement("td");
    const email = document.createElement("td");
    const cnpj = document.createElement("td");
    const status = document.createElement("td");

    const botaoContainer = document.createElement("td");
    const botao = document.createElement("button");
    botao.textContent = "editar";
    botao.className = "editar";

    // Dados
    id_empresa.textContent = texto[x].id_empresa;
    razao_social.textContent = texto[x].razao_social;
    nome_fantasia.textContent = texto[x].nome_fantasia;
    email.textContent = texto[x].email;
    cnpj.textContent = texto[x].cnpj;
    status.textContent = texto[x].status;

    // Evento de edição
     botao.addEventListener("click", function () {
        // Preencher os campos do formulário
        document.getElementById("edit_razao_social").value = texto[x].razao_social;
        document.getElementById("edit_nome_fantasia").value = texto[x].nome_fantasia;
        document.getElementById("edit_email").value = texto[x].email;
        document.getElementById("edit_cnpj").value = texto[x].cnpj;
        document.getElementById("edit_status").value = texto[x].status;

        // Armazena o ID da empresa na linha de edição
        document.getElementById("linha-edicao").dataset.id = texto[x].id_empresa;

        // Posiciona o formulário abaixo da linha clicada
        const linhaEdicao = document.getElementById("linha-edicao");
        node.parentNode.insertBefore(linhaEdicao, node.nextSibling);
        linhaEdicao.style.display = "table-row";
      });

      botaoContainer.appendChild(botao);

      node.appendChild(id_empresa);
      node.appendChild(razao_social);
      node.appendChild(nome_fantasia);
      node.appendChild(email);
      node.appendChild(cnpj);
      node.appendChild(status);
      node.appendChild(botaoContainer);

      lista.appendChild(node);
    }

    if (texto.length === 0) {
      alert("Nenhuma empresa encontrada");
    }

  } catch (error) {
    alert('Erro ao buscar empresas');
    console.error(error);
  }
});



async function salvarEdicao(event) {
  event.preventDefault();

  const razao = document.getElementById("edit_razao_social").value;
  const nome = document.getElementById("edit_nome_fantasia").value;
  const email = document.getElementById("edit_email").value;
  const cnpj = document.getElementById("edit_cnpj").value;
  const status = document.getElementById("edit_status").value;

  // Pega o id da empresa a partir da linha de edição
  const id = document.getElementById("linha-edicao").dataset.id;

  const userData = {
    id, // agora o ID vai junto
    razao_social: razao,
    nome_fantasia: nome,
    email: email,
    cnpj: cnpj,
    status: status
  };

  try {
    const response = await fetch('http://traineasy.selfip.com:3000/editarEmpresa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const resultado = await response.text();
    alert(resultado);
    window.location.reload(); // Atualiza a página para refletir a edição
  } catch (error) {
    alert('Erro ao enviar dados');
    console.error(error);
  }

  document.getElementById("linha-edicao").style.display = "none";
}

function cancelarEdicao() {
  document.getElementById("linha-edicao").style.display = "none";
}