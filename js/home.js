/* =========================================================
   HIFEM — HOME JS
   Frases rotativas e slideshow da imagem inferior direita
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURAÇÃO GERAL
       ===================================================== */

    const prefereMenosMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       FRASES ROTATIVAS
       ===================================================== */

    const frasesHifem = [
        "Toda investigação começa quando uma pergunta resiste às respostas fáceis.",
        "A história da matemática também é a história das formas de ensinar.",
        "Compreender o mundo exige enxergar as conexões invisíveis.",
        "Modelos são mapas: ajudam a pensar, mas não substituem o território.",
        "Pesquisar é construir memória, linguagem e pensamento."
    ];

    const quoteElement = document.querySelector(".quote p");

    let fraseAtual = 0;
    let intervaloFrases = null;

    function trocarFrase() {
        if (!quoteElement || frasesHifem.length <= 1) {
            return;
        }

        fraseAtual = (fraseAtual + 1) % frasesHifem.length;

        quoteElement.style.opacity = "0";

        window.setTimeout(() => {
            quoteElement.textContent = frasesHifem[fraseAtual];
            quoteElement.style.opacity = "1";
        }, 500);
    }

    if (!prefereMenosMovimento && quoteElement) {
        intervaloFrases = window.setInterval(trocarFrase, 7000);
    }


    /* =====================================================
       SLIDESHOW — FIG02
       ===================================================== */

    const buildingLayer = document.querySelector(".layer-building");

    const imagensInferiores = [
        "fig02.1.png",
        "fig02.2.png",
        "fig02.3.png",
        "fig02.4.png",
        "fig02.5.png"
    ];

    let imagensDisponiveis = [];
    let imagemAtual = 0;
    let intervaloImagens = null;

    function caminhoImagem(nomeArquivo) {
        return `./assets/img/${nomeArquivo}`;
    }

    function verificarImagem(nomeArquivo) {
        return new Promise((resolve) => {
            const img = new Image();

            img.onload = () => resolve(nomeArquivo);
            img.onerror = () => resolve(null);

            img.src = caminhoImagem(nomeArquivo);
        });
    }

    async function carregarImagensDisponiveis() {
        const resultados = await Promise.all(
            imagensInferiores.map(verificarImagem)
        );

        imagensDisponiveis = resultados.filter(Boolean);

        return imagensDisponiveis;
    }

    function aplicarImagem(nomeArquivo) {
        if (!buildingLayer || !nomeArquivo) {
            return;
        }

        buildingLayer.style.backgroundImage =
            `url("${caminhoImagem(nomeArquivo)}")`;
    }

    function trocarImagemInferior() {
        if (!buildingLayer || imagensDisponiveis.length <= 1) {
            return;
        }

        imagemAtual = (imagemAtual + 1) % imagensDisponiveis.length;

        /*
           Importante:
           usamos opacity temporária apenas para a transição.
           Depois removemos a propriedade inline, para o CSS controlar
           a opacidade correta em desktop e mobile.
        */
        buildingLayer.style.opacity = "0";

        window.setTimeout(() => {
            aplicarImagem(imagensDisponiveis[imagemAtual]);

            buildingLayer.style.removeProperty("opacity");
        }, 900);
    }

    async function iniciarSlideshowInferior() {
        if (!buildingLayer) {
            return;
        }

        await carregarImagensDisponiveis();

        if (imagensDisponiveis.length === 0) {
            return;
        }

        aplicarImagem(imagensDisponiveis[0]);

        if (!prefereMenosMovimento && imagensDisponiveis.length > 1) {
            intervaloImagens = window.setInterval(trocarImagemInferior, 8500);
        }
    }

    iniciarSlideshowInferior();


    /* =====================================================
       PAUSA QUANDO A ABA NÃO ESTÁ VISÍVEL
       ===================================================== */

    document.addEventListener("visibilitychange", () => {
        const paginaVisivel = !document.hidden;

        if (!paginaVisivel) {
            if (intervaloFrases) {
                window.clearInterval(intervaloFrases);
                intervaloFrases = null;
            }

            if (intervaloImagens) {
                window.clearInterval(intervaloImagens);
                intervaloImagens = null;
            }

            return;
        }

        if (!prefereMenosMovimento && quoteElement && !intervaloFrases) {
            intervaloFrases = window.setInterval(trocarFrase, 7000);
        }

        if (
            !prefereMenosMovimento &&
            buildingLayer &&
            imagensDisponiveis.length > 1 &&
            !intervaloImagens
        ) {
            intervaloImagens = window.setInterval(trocarImagemInferior, 8500);
        }
    });

});