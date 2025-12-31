import { auth } from "./firebase.js";
import { atualizarSaldo, adicionarAposta } from "./saldo.js";

const crashStartBtn = document.getElementById("crash-start");
const crashCashoutBtn = document.getElementById("crash-cashout");
const crashMultiplicadorEl = document.getElementById("crash-multiplicador");
const crashResultadoEl = document.getElementById("crash-resultado");
const crashApostaInput = document.getElementById("crash-aposta");

let multiplicador = 1;
let interval;
let crashed = false;
let userSaldo = 0;
let aposta = 0;

crashStartBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if(!user) return alert("Você precisa estar logado para jogar!");

    aposta = parseInt(crashApostaInput.value);
    userSaldo = parseInt(document.getElementById("top-saldo").textContent.replace(/\D/g,''));

    if(userSaldo < aposta) return alert("Saldo insuficiente!");

    userSaldo -= aposta;
    await atualizarSaldo(user.uid, userSaldo);

    multiplicador = 1;
    crashed = false;
    crashCashoutBtn.disabled = false;
    crashResultadoEl.textContent = "";

    // Definir quando o crash acontece
    const crashPoint = (Math.random() * 9 + 2).toFixed(2); // entre 2x e 11x

    interval = setInterval(() => {
        multiplicador += 0.01;
        multiplicador = Math.round(multiplicador*100)/100;
        crashMultiplicadorEl.textContent = `Multiplicador: ${multiplicador}x`;

        if(multiplicador >= crashPoint) {
            clearInterval(interval);
            crashed = true;
            crashCashoutBtn.disabled = true;
            crashResultadoEl.textContent = `💥 Crash! Você perdeu ${aposta} coins.`;
            adicionarAposta(user.uid, aposta, "Perdeu Crash");
        }
    }, 50);
});

crashCashoutBtn.addEventListener("click", async () => {
    if(crashed) return;
    clearInterval(interval);
    const user = auth.currentUser;
    const premio = Math.round(aposta * multiplicador);
    userSaldo += premio;
    await atualizarSaldo(user.uid, userSaldo);
    crashResultadoEl.textContent = `🎉 Você sacou a ${multiplicador}x e ganhou ${premio} coins!`;
    crashCashoutBtn.disabled = true;
    await adicionarAposta(user.uid, aposta, `Ganhou Crash x${multiplicador.toFixed(2)}`);
});

