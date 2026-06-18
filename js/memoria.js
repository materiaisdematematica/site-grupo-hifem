/* =========================================================
   HIFEM — MEMÓRIA
   Galeria/carrossel de história e memória do grupo
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const galeria = document.querySelector("#memoria-galeria");

    if (!galeria) {
        return;
    }

    const track = galeria.querySelector(".memoria-track");
    const botaoAnterior = galeria.querySelector(".memoria-prev");
    const botaoProximo = galeria.querySelector(".memoria-next");
    const contador = galeria.querySelector(".memoria-counter");
    const pontos = galeria.querySelector(".memoria-dots");

    if (!track) {
        return;
    }

    let slides = [];
    let indiceAtual = 0;
    let intervalo = null;

    let inicioToque = 0;
    let fimToque = 0;

    const TEMPO_AUTOMATICO = 6500;

    const usuarioPrefereMenosMovimento =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /*
       Caminhos possíveis para o JSON.

       Em pages/sobre.html, o correto é:
       ../db/memoria.json

       Os outros caminhos são apenas tentativas de segurança.
    */
    const CAMINHOS_JSON = [
        "../db/memoria.json",
        "./db/memoria.json",
        "/db/memoria.json"
    ];


    /* =====================================================
       UTILITÁRIOS
       ===================================================== */

    function escaparHTML(texto) {
        return String(texto || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function gerarTituloPeloArquivo(caminho) {
        const nomeArquivo = String(caminho || "")
            .split("/")
            .pop()
            .replace(/\.[^/.]+$/, "")
            .replaceAll("_", " ")
            .replaceAll("-", " ");

        return nomeArquivo || "Registro de memória do HIFEM";
    }

    function mostrarErro(mensagem) {
        track.innerHTML = `
            <article class="memoria-empty">
                ${mensagem}
            </article>
        `;

        if (contador) {
            contador.textContent = "0 / 0";
        }

        if (pontos) {
            pontos.innerHTML = "";
        }
    }


    /* =====================================================
       CARREGAMENTO DO JSON
       ===================================================== */

    async function carregarMemorias() {
        let ultimoErro = null;

        for (const caminho of CAMINHOS_JSON) {
            try {
                const resposta = await fetch(caminho, {
                    cache: "no-store"
                });

                if (!resposta.ok) {
                    throw new Error(`Erro ${resposta.status} ao tentar carregar ${caminho}`);
                }

                const dados = await resposta.json();

                if (!Array.isArray(dados)) {
                    throw new Error("O arquivo memoria.json precisa conter uma lista JSON.");
                }

                console.info(`Galeria de memória carregada por: ${caminho}`);

                return dados;
            } catch (erro) {
                ultimoErro = erro;
                console.warn(`Falha ao carregar ${caminho}:`, erro);
            }
        }

        throw ultimoErro || new Error("Não foi possível carregar memoria.json.");
    }


    /* =====================================================
       CRIAÇÃO DOS SLIDES
       ===================================================== */

    function criarSlide(item, indice) {
        const imagem = item.imagem || "";
        const titulo = item.titulo || gerarTituloPeloArquivo(imagem);
        const legenda = item.legenda || "Registro de história e memória do HIFEM.";

        return `
            <article class="memoria-slide" aria-label="Imagem ${indice + 1}">
                <figure class="memoria-figure">
                    <img
                        src="${escaparHTML(imagem)}"
                        alt="${escaparHTML(titulo)}"
                        loading="${indice === 0 ? "eager" : "lazy"}"
                    />

                    <figcaption class="memoria-caption">
                        <strong>${escaparHTML(titulo)}</strong>
                        <span>${escaparHTML(legenda)}</span>
                    </figcaption>
                </figure>
            </article>
        `;
    }

    function criarPontos(total) {
        if (!pontos) {
            return;
        }

        pontos.innerHTML = "";

        for (let i = 0; i < total; i++) {
            const botao = document.createElement("button");

            botao.type = "button";
            botao.className = "memoria-dot";
            botao.setAttribute("aria-label", `Ir para imagem ${i + 1}`);

            botao.addEventListener("click", () => {
                irParaSlide(i);
                reiniciarAutomatico();
            });

            pontos.appendChild(botao);
        }
    }

    function renderizarGaleria(memoria) {
        if (!memoria.length) {
            mostrarErro("Nenhuma imagem de memória cadastrada no momento.");
            return;
        }

        track.innerHTML = memoria.map(criarSlide).join("");

        slides = Array.from(track.querySelectorAll(".memoria-slide"));

        criarPontos(slides.length);
        atualizarGaleria();
        iniciarAutomatico();
    }


    /* =====================================================
       NAVEGAÇÃO
       ===================================================== */

    function atualizarGaleria() {
        if (!slides.length) {
            return;
        }

        track.style.transform = `translateX(-${indiceAtual * 100}%)`;

        slides.forEach((slide, indice) => {
            slide.setAttribute("aria-hidden", indice === indiceAtual ? "false" : "true");
        });

        if (contador) {
            contador.textContent = `${indiceAtual + 1} / ${slides.length}`;
        }

        if (pontos) {
            const dots = pontos.querySelectorAll(".memoria-dot");

            dots.forEach((dot, indice) => {
                dot.classList.toggle("active", indice === indiceAtual);
                dot.setAttribute("aria-current", indice === indiceAtual ? "true" : "false");
            });
        }
    }

    function irParaSlide(indice) {
        if (!slides.length) {
            return;
        }

        if (indice < 0) {
            indiceAtual = slides.length - 1;
        } else if (indice >= slides.length) {
            indiceAtual = 0;
        } else {
            indiceAtual = indice;
        }

        atualizarGaleria();
    }

    function proximoSlide() {
        irParaSlide(indiceAtual + 1);
    }

    function slideAnterior() {
        irParaSlide(indiceAtual - 1);
    }


    /* =====================================================
       AUTOPLAY
       ===================================================== */

    function iniciarAutomatico() {
        if (usuarioPrefereMenosMovimento || slides.length <= 1) {
            return;
        }

        pararAutomatico();

        intervalo = window.setInterval(() => {
            proximoSlide();
        }, TEMPO_AUTOMATICO);
    }

    function pararAutomatico() {
        if (intervalo) {
            window.clearInterval(intervalo);
            intervalo = null;
        }
    }

    function reiniciarAutomatico() {
        pararAutomatico();
        iniciarAutomatico();
    }


    /* =====================================================
       EVENTOS DOS BOTÕES
       ===================================================== */

    if (botaoAnterior) {
        botaoAnterior.addEventListener("click", () => {
            slideAnterior();
            reiniciarAutomatico();
        });
    }

    if (botaoProximo) {
        botaoProximo.addEventListener("click", () => {
            proximoSlide();
            reiniciarAutomatico();
        });
    }


    /* =====================================================
       PAUSA AO INTERAGIR
       ===================================================== */

    galeria.addEventListener("mouseenter", pararAutomatico);
    galeria.addEventListener("mouseleave", iniciarAutomatico);
    galeria.addEventListener("focusin", pararAutomatico);
    galeria.addEventListener("focusout", iniciarAutomatico);


    /* =====================================================
       TECLADO
       ===================================================== */

    galeria.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            slideAnterior();
            reiniciarAutomatico();
        }

        if (event.key === "ArrowRight") {
            proximoSlide();
            reiniciarAutomatico();
        }
    });


    /* =====================================================
       ARRASTAR NO CELULAR
       ===================================================== */

    galeria.addEventListener("touchstart", (event) => {
        inicioToque = event.changedTouches[0].clientX;
    }, { passive: true });

    galeria.addEventListener("touchend", (event) => {
        fimToque = event.changedTouches[0].clientX;

        const diferenca = inicioToque - fimToque;

        if (Math.abs(diferenca) < 45) {
            return;
        }

        if (diferenca > 0) {
            proximoSlide();
        } else {
            slideAnterior();
        }

        reiniciarAutomatico();
    }, { passive: true });


    /* =====================================================
       PAUSA QUANDO A ABA NÃO ESTÁ VISÍVEL
       ===================================================== */

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            pararAutomatico();
        } else {
            iniciarAutomatico();
        }
    });


    /* =====================================================
       INICIALIZAÇÃO
       ===================================================== */

    carregarMemorias()
        .then(renderizarGaleria)
        .catch((erro) => {
            console.error("Erro ao carregar a galeria de memória:", erro);

            mostrarErro(`
                Não foi possível carregar a galeria de memória.
                Verifique se o arquivo <strong>db/memoria.json</strong> existe,
                se o site está sendo aberto pelo <strong>Live Server</strong>
                e se o JSON está válido.
            `);
        });
});