// Altere a porta conforme o endereço exibido pelo dotnet run.
const API_URL = "http://localhost:5000/api/Materiais";

let materiais = [];

const $ = (id) => document.getElementById(id);

function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

function mostrarMensagem(texto, tipo = "success") {
    $("mensagens").innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${escaparHtml(texto)}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        </div>`;
}

function tipoDo(material) {
    return material.tipoMaterial ||
        (material.autor !== undefined ? "Livro" : "Revista");
}

async function requisicao(url, opcoes = {}) {
    const configuracao = {
        ...opcoes,
        headers: { ...(opcoes.headers || {}) }
    };

    if (configuracao.body) {
        configuracao.headers["Content-Type"] = "application/json";
    }

    let resposta;

    try {
        resposta = await fetch(url, configuracao);
    } catch (erro) {
        throw new Error(
            "Não foi possível acessar a API. Confira se o back-end está em execução, " +
            "se a URL/porta está correta e se o certificado HTTPS local foi aceito."
        );
    }

    if (!resposta.ok) {
        const texto = await resposta.text();
        let mensagem = texto || `Erro HTTP ${resposta.status}`;

        try {
            const corpo = JSON.parse(texto);
            mensagem = corpo.title || corpo.message || corpo.detail || corpo.mensagem;

            if (!mensagem && corpo.errors) {
                mensagem = Object.values(corpo.errors).flat().join(" ");
            }

            if (!mensagem) mensagem = texto;
        } catch {
            // Mantém a resposta em texto quando não for JSON.
        }

        throw new Error(mensagem);
    }

    if (resposta.status === 204) {
        return null;
    }

    const texto = await resposta.text();

    return texto ? JSON.parse(texto) : null;
}

async function carregarMateriais() {
    $("tabelaMateriais").innerHTML =
        '<tr><td colspan="9" class="text-center text-secondary">Carregando...</td></tr>';

    try {
        materiais = await requisicao(API_URL) || [];

        atualizarDashboard();
        renderizarTabela();

    } catch (erro) {
        console.error("Erro ao carregar materiais:", erro);

        $("tabelaMateriais").innerHTML =
            '<tr><td colspan="9" class="text-center text-danger">Não foi possível carregar os materiais.</td></tr>';

        mostrarMensagem(erro.message, "danger");
    }
}

function atualizarDashboard() {
    const livros = materiais.filter(m => tipoDo(m) === "Livro");
    const revistas = materiais.filter(m => tipoDo(m) === "Revista");

    $("totalMateriais").textContent = materiais.length;
    $("totalLivros").textContent = livros.length;
    $("totalRevistas").textContent = revistas.length;
    $("totalEmprestimos").textContent = livros.length;
}

function renderizarTabela() {
    const termo = $("filtro").value.trim().toLocaleLowerCase("pt-BR");

    const filtrados = materiais.filter(m => {
        const texto = [
            m.id,
            m.titulo,
            m.anoPublicacao,
            m.autor,
            m.edicao,
            m.mesPublicacao,
            tipoDo(m)
        ].join(" ").toLocaleLowerCase("pt-BR");

        return texto.includes(termo);
    });

    if (!filtrados.length) {
        $("tabelaMateriais").innerHTML =
            '<tr><td colspan="9" class="text-center text-secondary">Nenhum material encontrado.</td></tr>';

        return;
    }

    $("tabelaMateriais").innerHTML = filtrados.map(m => {
        const tipo = tipoDo(m);
        const livro = tipo === "Livro";

        return `
            <tr>
                <td>${escaparHtml(m.id)}</td>
                <td>${escaparHtml(m.titulo)}</td>
                <td>${escaparHtml(m.anoPublicacao)}</td>

                <td>
                    <span class="badge ${livro ? "text-bg-success" : "text-bg-warning"}">
                        ${escaparHtml(tipo)}
                    </span>
                </td>

                <td>${livro ? escaparHtml(m.autor) : "—"}</td>
                <td>${livro ? escaparHtml(m.paginas) : "—"}</td>
                <td>${!livro ? escaparHtml(m.edicao) : "—"}</td>
                <td>${!livro ? escaparHtml(m.mesPublicacao) : "—"}</td>

                <td>
                    <div class="acoes">
                        <button class="btn btn-outline-primary btn-sm"
                                data-acao="consultar" data-id="${m.id}">
                            Consultar
                        </button>

                        <button class="btn btn-outline-secondary btn-sm"
                                data-acao="editar" data-id="${m.id}">
                            Editar
                        </button>

                        <button class="btn btn-outline-danger btn-sm"
                                data-acao="excluir" data-id="${m.id}">
                            Excluir
                        </button>

                        <button class="btn btn-outline-success btn-sm"
                                data-acao="emprestar" data-id="${m.id}">
                            Emprestar
                        </button>
                    </div>
                </td>
            </tr>`;
    }).join("");
}

function alternarCamposTipo() {
    const livro = $("tipoMaterial").value === "Livro";

    document.querySelectorAll(".campo-livro")
        .forEach(el => el.classList.toggle("d-none", !livro));

    document.querySelectorAll(".campo-revista")
        .forEach(el => el.classList.toggle("d-none", livro));

    $("autor").required = livro;
    $("paginas").required = livro;
    $("edicao").required = !livro;
    $("mesPublicacao").required = !livro;
}

function limparFormulario() {
    $("formMaterial").reset();

    $("materialId").value = "";
    $("tipoMaterial").disabled = false;

    $("tituloFormulario").textContent = "Cadastrar material";
    $("btnSalvar").textContent = "Cadastrar";

    alternarCamposTipo();
}

function montarPayload() {
    const tipo = $("tipoMaterial").value;

    const comum = {
        titulo: $("titulo").value.trim(),
        anoPublicacao: Number($("anoPublicacao").value)
    };

    if (tipo === "Livro") {
        return {
            ...comum,
            autor: $("autor").value.trim(),
            paginas: Number($("paginas").value)
        };
    }

    return {
        ...comum,
        edicao: Number($("edicao").value),
        mesPublicacao: Number($("mesPublicacao").value)
    };
}

async function salvarMaterial(evento) {
    evento.preventDefault();

    const id = $("materialId").value;
    const tipo = $("tipoMaterial").value.toLowerCase();

    const url = id
        ? `${API_URL}/${tipo}/${id}`
        : `${API_URL}/${tipo}`;

    const metodo = id ? "PUT" : "POST";

    try {
        await requisicao(url, {
            method: metodo,
            body: JSON.stringify(montarPayload())
        });

        mostrarMensagem(
            id ? "Material atualizado com sucesso!" :
                 "Material cadastrado com sucesso!"
        );

        limparFormulario();

        await carregarMateriais();

    } catch (erro) {
        mostrarMensagem(erro.message, "danger");
    }
}

async function editarMaterial(id) {
    try {
        const material = await requisicao(`${API_URL}/${id}`);

        const tipo = tipoDo(material);

        $("materialId").value = material.id;
        $("tipoMaterial").value = tipo;
        $("tipoMaterial").disabled = true;

        $("titulo").value = material.titulo || "";
        $("anoPublicacao").value = material.anoPublicacao ?? "";
        $("autor").value = material.autor || "";
        $("paginas").value = material.paginas ?? "";
        $("edicao").value = material.edicao ?? "";
        $("mesPublicacao").value = material.mesPublicacao ?? "";

        $("tituloFormulario").textContent = `Editar material #${id}`;
        $("btnSalvar").textContent = "Salvar alterações";

        alternarCamposTipo();

        $("secaoFormulario").scrollIntoView({
            behavior: "smooth"
        });

    } catch (erro) {
        mostrarMensagem(erro.message, "danger");
    }
}

async function excluirMaterial(id) {
    if (!confirm(`Tem certeza que deseja excluir o material ${id}?`)) {
        return;
    }

    try {
        await requisicao(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        mostrarMensagem("Material excluído com sucesso!");

        await carregarMateriais();

    } catch (erro) {
        mostrarMensagem(erro.message, "danger");
    }
}

async function consultarMaterial(id) {
    try {
        const [material, descricao] = await Promise.all([
            requisicao(`${API_URL}/${id}`),
            requisicao(`${API_URL}/${id}/descricao`)
        ]);

        const tipo = tipoDo(material);

        $("consultaId").value = id;

        $("resultadoConsulta").innerHTML = `
            <div class="alert alert-info">
                <strong>${escaparHtml(material.titulo)}</strong>
                — ${escaparHtml(tipo)}<br>

                Ano: ${escaparHtml(material.anoPublicacao)}<br>

                ${tipo === "Livro"
                    ? `Autor: ${escaparHtml(material.autor)}<br>
                       Páginas: ${escaparHtml(material.paginas)}`
                    : `Edição: ${escaparHtml(material.edicao)}<br>
                       Mês de publicação: ${escaparHtml(material.mesPublicacao)}`}

                <hr>

                ${escaparHtml(descricao.descricao)}<br>

                Prazo de empréstimo:
                ${escaparHtml(descricao.prazoEmprestimo)} dias
            </div>`;

    } catch (erro) {
        $("resultadoConsulta").innerHTML = "";
        mostrarMensagem(erro.message, "danger");
    }
}

async function emprestarMaterial(id) {
    try {
        const resultado = await requisicao(
            `${API_URL}/${id}/emprestar`,
            { method: "POST" }
        );

        mostrarMensagem(
            resultado?.mensagem || "Empréstimo realizado."
        );

    } catch (erro) {
        mostrarMensagem(erro.message, "danger");
    }
}

function configurarEventos() {
    $("formMaterial").addEventListener("submit", salvarMaterial);

    $("tipoMaterial").addEventListener("change", alternarCamposTipo);

    $("btnCancelarEdicao").addEventListener("click", limparFormulario);

    $("btnAtualizar").addEventListener("click", carregarMateriais);

    $("filtro").addEventListener("input", renderizarTabela);

    $("btnLimparFiltro").addEventListener("click", () => {
        $("filtro").value = "";
        renderizarTabela();
    });

    $("formConsulta").addEventListener("submit", evento => {
        evento.preventDefault();

        consultarMaterial(Number($("consultaId").value));
    });

    $("tabelaMateriais").addEventListener("click", evento => {
        const botao = evento.target.closest("button[data-acao]");

        if (!botao) return;

        const id = Number(botao.dataset.id);
        const acao = botao.dataset.acao;

        if (acao === "consultar") consultarMaterial(id);
        if (acao === "editar") editarMaterial(id);
        if (acao === "excluir") excluirMaterial(id);
        if (acao === "emprestar") emprestarMaterial(id);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    configurarEventos();
    alternarCamposTipo();
    carregarMateriais();
});