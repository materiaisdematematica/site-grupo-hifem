/* =========================================================
   HIFEM — HOME JS
   Frases rotativas e slideshow da imagem inferior direita
   ========================================================= */


/* =========================
   FRASES ROTATIVAS
   ========================= */

const frasesHifem = [
    "Toda investigação começa quando uma pergunta resiste às respostas fáceis.",
    "A história da matemática também é a história das formas de ensinar.",
    "Compreender o mundo exige enxergar as conexões invisíveis.",
    "Modelos são mapas: ajudam a pensar, mas não substituem o território.",
    "Pesquisar é construir memória, linguagem e pensamento."
];

const quoteElement = document.querySelector(".quote p");

let fraseAtual = 0;

function trocarFrase() {
    if (!quoteElement) return;

    fraseAtual = (fraseAtual + 1) % frasesHifem.length;

    quoteElement.style.opacity = "0";

    setTimeout(() => {
        quoteElement.textContent = frasesHifem[fraseAtual];
        quoteElement.style.opacity = "1";
    }, 500);
}

setInterval(trocarFrase, 7000);


/* =========================
   SLIDESHOW — FIG02
   ========================= */

const buildingLayer = document.querySelector(".layer-building");

const imagensInferiores = [
    "fig02.1.png",
    "fig02.2.png",
    "fig02.3.png",
    "fig02.4.png",
    "fig02.5.png"
];

let imagemAtual = 0;

function trocarImagemInferior() {
    if (!buildingLayer) return;

    imagemAtual = (imagemAtual + 1) % imagensInferiores.length;

    buildingLayer.style.opacity = "0";

    setTimeout(() => {
        buildingLayer.style.backgroundImage =
            `url("./assets/img/${imagensInferiores[imagemAtual]}")`;

        buildingLayer.style.opacity = "0.58";
    }, 900);
}

setInterval(trocarImagemInferior, 8500);