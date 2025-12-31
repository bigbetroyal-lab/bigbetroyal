import { gastarSaldo, addSaldo, atualizarRanking, adicionarHistorico } from "./ui.js";

const symbols = ["🍒", "🍋", "🍉", "🍇", "🍊", "7️⃣", "💎"];
const reels = document.querySelectorAll("#slot-reels .reel");
const resultadoEl = document.getElementById("slot-resultado");

document.querySelectorAll(".spin-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
        const aposta = parseInt(btn.dataset.aposta);
        if (!gastarSaldo(aposta)) return;

        resultadoEl.innerText = "";

        // Animação dos reels
        const finalSymbols = [];
        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];
            let spins = 20 + i*5; // número de iterações
            for (let s = 0; s < spins; s++) {
                reel.innerText = symbols[Math.floor(Math.random() * symbols.length)];
                await new Promise(r => setTimeout(r, 50 + i*10)); // delay
            }
            // Símbolo final
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.innerText = symbol;
            finalSymbols.push(symbol);
        }

        // Resultado
        let ganhou = finalSymbols.every(s => s === finalSymbols[0]);
        if (ganhou) {
            const premio = aposta * 5; // 5x aposta para vitória
            addSaldo(premio);
            resultadoEl.innerText = `🎉 JACKPOT! Ganhou ${premio} coins!`;
            adicionarHistorico("Slot", aposta, `Ganhou ${premio}`);
        } else {
            resultadoEl.innerText = "❌ Perdeu!";
            adicionarHistorico("Slot", aposta, "Perdeu");
        }

        atualizarRanking();
    });
});


import { adicionarHistorico } from "./ui.js";

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
            adicionarHistorico("Slot", aposta, `Ganhou ${premio}`);
        } else {
            resultado.innerText = "❌ Perdeu!";
            adicionarHistorico("Slot", aposta, "Perdeu");
        }
    });
});

import { atualizarRanking } from "./ui.js";

// Depois de addSaldo ou gastarSaldo
atualizarRanking();
