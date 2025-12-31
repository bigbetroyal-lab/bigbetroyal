let saldo = 1000;

document.getElementById("apostar").addEventListener("click", () => {
    if(saldo < 100){
        alert("Saldo insuficiente!");
        return;
    }
    saldo -= 100;
    let resultado = Math.random() < 0.5 ? "Ganhou 200 coins!" : "Perdeu!";
    if(resultado.includes("Ganhou")) saldo += 200;
    document.getElementById("saldo").innerText = "Saldo: " + saldo + " coins";
    document.getElementById("resultado").innerText = resultado;
});
