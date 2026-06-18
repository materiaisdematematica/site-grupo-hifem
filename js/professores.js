/* =========================================================
   HIFEM — PROFESSORES
   Carrega orientandos a partir de db/professores.json
   Usado apenas em professor.html
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const titulo = document.querySelector(".page-heading h1");
    const subtitulo = document.querySelector(".page-lead");
    const info = document.querySelector(".info");
    const lista = document.getElementById("lista-alunos");

    if (!lista) {
        return;
    }

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

        lista.innerHTML = `
            <li>
                Não foi possível carregar a lista de orientandos.
            </li>
        `;
    }

    function renderizarProfessor(professor) {
        const nome = professor.name || professor.nome || "Professor";

        if (titulo) {
            titulo.textContent = nome;
        }

        if (subtitulo) {
            subtitulo.textContent = `Lista de orientandos vinculados a ${nome}.`;
        }

        if (info) {
            info.textContent = "Orientandos";
        }

        const alunos = professor.alunos || professor.orientandos || [];

        if (!alunos.length) {
            lista.innerHTML = `
                <li>
                    Nenhum orientando cadastrado no momento.
                </li>
            `;
            return;
        }

        lista.innerHTML = "";

        alunos.forEach((aluno) => {
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