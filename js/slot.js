import { auth } from "./firebase.js";
import { atualizarSaldo, adicionarAposta } from "./saldo.js";

const slotReels = document.querySelectorAll(".reel");
const slotResultado = document.getElementById("slot-resultado");
const spinButtons = document.querySelectorAll(".spin-btn");

const symbols = ["🍒","🍋","🍉","🍇","🍊"];

spinButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        const aposta = parseInt(btn.dataset.aposta);
        const user = auth.currentUser;
        if (!user) return alert("Você precisa estar logado para girar a slot!");

        // Verifica saldo
        const saldoText = document.getElementById("top-saldo").textContent;
        let saldo = parseInt(saldoText.replace(/\D/g,''));
        if (saldo < aposta) return alert("Saldo insuficiente!");

        saldo -= aposta;
        await atualizarSaldo(user.uid, saldo);

        // Gira reels
        const finalSymbols = [];
        slotReels.forEach((reel, i) => {
            let randomIndex = Math.floor(Math.random() * symbols.length);
            finalSymbols[i] = symbols[randomIndex];
            let count = 0;
            const interval = setInterval(() => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                count++;
                if(count > 10) {
                    clearInterval(interval);
                    reel.textContent = finalSymbols[i];
                }
            }, 50);
        });

        // Verifica resultado após animação
        setTimeout(async () => {
            let ganhou = finalSymbols.every(s => s === finalSymbols[0]);
            let premio = ganhou ? aposta*4 : 0; // Jackpot x4
            if(ganhou) saldo += premio;
            await atualizarSaldo(user.uid, saldo);

            slotResultado.textContent = ganhou 
                ? `🎉 Jackpot! Você ganhou ${premio} coins!`
                : `💔 Tente novamente!`;

            // Adiciona ao histórico
            await adicionarAposta(user.uid, aposta, ganhou ? "Ganhou Slot" : "Perdeu Slot");
        }, 600);
    });
});

