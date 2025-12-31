const buttons = document.querySelectorAll("aside button");
const telas = document.querySelectorAll(".tela");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.tela;
        telas.forEach(tela => {
            tela.style.display = tela.id === target ? "block" : "none";
        });
    });
});

