/* =========================================================
   HIFEM — NAV JS
   Controle simples do menu mobile
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const navCheck = document.getElementById("nav-check");
    const navLinks = document.querySelectorAll(".navbar-btn-list a");
    const navButton = document.querySelector(".nav-checkbtn");

    if (!navCheck) {
        return;
    }

    function fecharMenu() {
        navCheck.checked = false;
    }

    function abrirOuFecharMenu() {
        navCheck.checked = !navCheck.checked;
    }

    /* Fecha o menu ao clicar em qualquer link */
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            fecharMenu();
        });
    });

    /* Permite abrir/fechar com Enter ou Espaço no botão */
    if (navButton) {
        navButton.setAttribute("tabindex", "0");
        navButton.setAttribute("role", "button");
        navButton.setAttribute("aria-controls", "nav-check");
        navButton.setAttribute("aria-expanded", "false");

        navButton.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                abrirOuFecharMenu();
            }
        });
    }

    /* Atualiza aria-expanded */
    navCheck.addEventListener("change", () => {
        if (navButton) {
            navButton.setAttribute(
                "aria-expanded",
                navCheck.checked ? "true" : "false"
            );
        }
    });

    /* Fecha com ESC */
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            fecharMenu();
        }
    });

    /* Fecha ao sair do mobile */
    window.addEventListener("resize", () => {
        if (window.innerWidth > 820) {
            fecharMenu();
        }
    });
});