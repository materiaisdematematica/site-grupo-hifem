/* =========================================================
   HIFEM — PROFESSORES
   Carrega orientandos a partir de db/professores.json
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const titulo = document.querySelector(".page-heading h1");
    const subtitulo = document.querySelector(".page-lead");
    const info = document.querySelector(".info");
    const lista = document.getElementById("lista-alunos");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    function mostrarErro(mensagem) {
        if (titulo) {
            titulo.textContent = "Professor não encontrado";
        }

        if (subtitulo) {
            subtitulo.textContent = mensagem;
        }

        if (info) {
            info.textContent = "Orientandos";
        }

        if (lista) {
            lista.innerHTML = `
                <li>
                    Não foi possível carregar a lista de orientandos.
                </li>
            `;
        }
    }

    function renderizarProfessor(professor) {
        if (titulo) {
            titulo.textContent = professor.name;
        }

        if (subtitulo) {
            subtitulo.textContent = `Lista de orientandos vinculados a ${professor.name}.`;
        }

        if (info) {
            info.textContent = "Orientandos";
        }

        if (!lista) {
            return;
        }

        if (!professor.alunos || professor.alunos.length === 0) {
            lista.innerHTML = `
                <li>
                    Nenhum orientando cadastrado no momento.
                </li>
            `;
            return;
        }

        lista.innerHTML = "";

        professor.alunos.forEach((aluno) => {
            const item = document.createElement("li");
            item.textContent = aluno;
            lista.appendChild(item);
        });
    }

    if (!id) {
        mostrarErro("Nenhum identificador de professor foi informado na URL.");
        return;
    }

    fetch("../db/professores.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Arquivo professores.json não encontrado.");
            }

            return response.json();
        })
        .then((professores) => {
            const professor = professores[id];

            if (!professor) {
                mostrarErro("O identificador informado não corresponde a nenhum professor cadastrado.");
                return;
            }

            renderizarProfessor(professor);
        })
        .catch(() => {
            mostrarErro("Verifique se o arquivo db/professores.json existe e se está com JSON válido.");
        });
});