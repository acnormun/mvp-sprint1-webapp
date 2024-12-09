const API_URL = "http://127.0.0.1:5000";

// Navegação
function navigate(page) {
    const content = document.getElementById("content");

    if (page === "home") {
        content.innerHTML = `
            <div class="text-center px-4">
                <h2>Bem-vindo ao Cadastro de Agrupamentos</h2>
                <p>Escolha uma opção no menu.</p>
            </div>`;
    } else if (page === "cadastro") {
        content.innerHTML = `
            <div class="card p-4 w-75 mx-auto" style="max-width: 600px;">
                <h2>Cadastro de Agrupamento</h2>
                <form id="cadastroForm">
                    <div class="mb-3">
                        <label for="id" class="form-label">ID</label>
                        <input type="number" class="form-control" id="id" required>
                    </div>
                    <div class="mb-3">
                        <label for="quantidade" class="form-label">Quantidade de Toras</label>
                        <input type="number" class="form-control" id="quantidade_de_toras" required>
                    </div>
                    <div class="mb-3">
                        <label for="peso" class="form-label">Peso (kg)</label>
                        <input type="number" class="form-control" id="peso" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Cadastrar</button>
                </form>
            </div>`;
        document.getElementById("cadastroForm").onsubmit = cadastrarAgrupamento;
    } else if (page === "listagem") {
        listarAgrupamentos();
    }
}

// Listar agrupamentos (GET)
async function listarAgrupamentos() {
    const content = document.getElementById("content");
    try {
        const response = await fetch(`${API_URL}/buscar_agrupamentos`);
        const agrupamentos = await response.json();

        if (agrupamentos.length === 0) {
            content.innerHTML = `<p class="text-center">Nenhum agrupamento cadastrado.</p>`;
        } else {
            content.innerHTML = `
            <div class="w-75 mx-auto">
                <h2 class="py-4">Listagem de Agrupamentos</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Quantidade de Toras</th>
                            <th>Peso (kg)</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${agrupamentos.map(item => `
                            <tr>
                                <td>${item.id}</td>
                                <td>${item.quantidade_de_toras}</td>
                                <td>${item.peso}</td>
                                <td>
                                    <button class="btn btn-danger btn-sm" onclick="deletarAgrupamento(${item.id})">Excluir</button>
                                    <button class="btn btn-warning btn-sm" onclick="abrirEdicao(${item.id})">Editar</button>
                                </td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
        }
    } catch (error) {
        content.innerHTML = `<p class="text-danger">Erro ao carregar agrupamentos.</p>`;
    }
}

// Cadastrar um agrupamento (POST)
async function cadastrarAgrupamento(event) {
    event.preventDefault();
    const id = document.getElementById("id").value;
    const quantidade_de_toras = document.getElementById("quantidade_de_toras").value;
    const peso = document.getElementById("peso").value;

    try {
        const response = await fetch(`${API_URL}/cadastrar_agrupamento`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, quantidade_de_toras, peso })
        });

        if (response.ok) {
            alert("Agrupamento cadastrado com sucesso!");
            navigate("listagem");
        } else {
            alert("Erro ao cadastrar agrupamento.");
        }
    } catch (error) {
        alert("Erro ao conectar-se à API.");
    }
}

// Deletar um agrupamento (DELETE)
async function deletarAgrupamento(id) {
    try {
        const response = await fetch(`${API_URL}/deletar_agrupamento/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Agrupamento excluído com sucesso!");
            navigate("listagem");
        } else {
            alert("Erro ao excluir agrupamento.");
        }
    } catch (error) {
        alert("Erro ao conectar-se à API.");
    }
}

// Abrir o modal de edição
async function abrirEdicao(id) {
    try {
        const response = await fetch(`${API_URL}/buscar_agrupamentos`);
        const agrupamentos = await response.json();
        const agrupamento = agrupamentos.find(item => item.id === id);

        if (agrupamento) {
            document.getElementById("editId").value = agrupamento.id;
            document.getElementById("editQuantidade").value = agrupamento.quantidade_de_toras;
            document.getElementById("editPeso").value = agrupamento.peso;

            // Exibe o modal
            new bootstrap.Modal(document.getElementById("editModal")).show();

            // Salvar alteração no formulário de edição
            document.getElementById("editForm").onsubmit = function(event) {
                event.preventDefault();
                editarAgrupamento(agrupamento.id);
            };
        }
    } catch (error) {
        alert("Erro ao abrir edição.");
    }
}

// Editar um agrupamento (PUT)
async function editarAgrupamento(id) {
    const quantidade = document.getElementById("editQuantidade").value;
    const peso = document.getElementById("editPeso").value;

    try {
        const response = await fetch(`${API_URL}/editar_agrupamento/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantidade_de_toras: quantidade, peso }),
        });

        if (response.ok) {
            alert("Agrupamento atualizado com sucesso!");
            navigate("listagem");
        } else {
            alert("Erro ao editar agrupamento.");
        }
    } catch (error) {
        alert("Erro ao conectar-se à API.");
    }
}

navigate('home');
