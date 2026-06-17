const quotes = [
  "Toda investigação começa quando uma pergunta resiste às respostas fáceis.",
  "Compreender o mundo exige enxergar as conexões invisíveis.",
  "Modelos são mapas: ajudam a pensar, mas não substituem o território.",
  "A história da matemática também é a história das formas de ensinar."
];

const quoteElement = document.querySelector(".quote p");

let currentQuote = 0;

setInterval(() => {
  currentQuote = (currentQuote + 1) % quotes.length;
  quoteElement.style.opacity = 0;

  setTimeout(() => {
    quoteElement.innerHTML = quotes[currentQuote].replaceAll(" ", " ");
    quoteElement.style.opacity = 1;
  }, 500);
}, 6000);