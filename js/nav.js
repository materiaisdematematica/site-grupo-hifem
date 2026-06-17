/* =========================================================
   HIFEM — NAV
   Controle do menu responsivo
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("nav-check");
    const menu = document.querySelector(".navbar-btn-list");
    const menuButton = document.querySelector(".nav-checkbtn");
    const links = document.querySelectorAll(".navbar-btn-list a");

    if (!checkbox || !menu) {
        return;
    }

    const mobileQuery = window.matchMedia("(max-width: 920px)");

    function fecharMenu() {
        checkbox.checked = false;

        if (mobileQuery.matches) {
            menu.classList.add("inactive");
        }
    }

    function abrirMenu() {
        checkbox.checked = true;
        menu.classList.remove("inactive");
    }

    function atualizarEstadoInicial() {
        if (mobileQuery.matches) {
            if (checkbox.checked) {
                menu.classList.remove("inactive");
            } else {
                menu.classList.add("inactive");
            }
        } else {
            /*
               No desktop, o menu deve ficar sempre visível.
               Isso evita que a classe "inactive" esconda o menu
               quando a tela for aumentada.
            */
            menu.classList.remove("inactive");
            checkbox.checked = false;
        }
    }

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            abrirMenu();
        } else {
            fecharMenu();
        }
    });

    links.forEach((link) => {
        link.addEventListener("click", () => {
            fecharMenu();
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            fecharMenu();
        }
    });

    document.addEventListener("click", (event) => {
        const clicouNoMenu = menu.contains(event.target);
        const clicouNoBotao = menuButton && menuButton.contains(event.target);
        const clicouNoCheckbox = checkbox.contains(event.target);

        if (!clicouNoMenu && !clicouNoBotao && !clicouNoCheckbox) {
            fecharMenu();
        }
    });

    mobileQuery.addEventListener("change", atualizarEstadoInicial);

    atualizarEstadoInicial();
});