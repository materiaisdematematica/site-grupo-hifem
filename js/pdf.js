/* =========================================================
   HIFEM — PDF JS
   Abre PDFs dentro da própria página usando modal + iframe
   ========================================================= */

const pdfModal = document.querySelector("#pdfModal");
const pdfViewer = document.querySelector("#pdfViewer");
const pdfTitle = document.querySelector("#pdfTitle");
const closePdfButton = document.querySelector(".pdf-close");
const openPdfButtons = document.querySelectorAll(".js-open-pdf");

function openPdf(pdfPath, title) {
    if (!pdfModal || !pdfViewer) return;

    pdfViewer.src = pdfPath;

    if (pdfTitle) {
        pdfTitle.textContent = title || "Visualizador de PDF";
    }

    pdfModal.classList.add("active");
    pdfModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function closePdf() {
    if (!pdfModal || !pdfViewer) return;

    pdfModal.classList.remove("active");
    pdfModal.setAttribute("aria-hidden", "true");

    /*
      Limpa o PDF ao fechar.
      Isso evita que o navegador continue carregando o arquivo em segundo plano.
    */
    pdfViewer.src = "";

    document.body.style.overflow = "";
}

/* Botões que abrem PDF */
openPdfButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const pdfPath = button.dataset.pdf;
        const title = button.dataset.title;

        if (!pdfPath) {
            console.warn("Nenhum PDF foi definido no atributo data-pdf.");
            return;
        }

        openPdf(pdfPath, title);
    });
});

/* Botão fechar */
if (closePdfButton) {
    closePdfButton.addEventListener("click", closePdf);
}

/* Clicar fora da caixa fecha o modal */
if (pdfModal) {
    pdfModal.addEventListener("click", (event) => {
        if (event.target === pdfModal) {
            closePdf();
        }
    });
}

/* Tecla ESC fecha o modal */
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && pdfModal?.classList.contains("active")) {
        closePdf();
    }
});