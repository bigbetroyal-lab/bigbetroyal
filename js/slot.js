import { gastarSaldo, addSaldo } from "./ui.js";

document.querySelectorAll(".spin-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const aposta = parseInt(btn.dataset.aposta);

        if (!gastarSaldo(aposta)) return;

        const ganhou = Math.random() < 0.4;
        const resultado = document.getElementById("slot-resultado");

        if (ganhou) {
            const premio = aposta * 2;
            addSaldo(premio);
            resultado.innerText = `🎉 Ganhou ${premio} coins!`;
        } else {
            resultado.innerText = "❌ Perdeu!";
        }
    });
});
