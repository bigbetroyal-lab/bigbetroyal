import { auth, db } from "./firebase.js";
import { getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { atualizarSaldo } from "./ui.js";

// --- Variáveis ---
let apostaSelecionada = null;
const numeros = [
  {num:0, cor:"verde"}, {num:32, cor:"vermelho"}, {num:15, cor:"preto"},
  {num:19, cor:"vermelho"}, {num:4, cor:"preto"}, {num:21, cor:"vermelho"},
  {num:2, cor:"preto"}, {num:25, cor:"vermelho"}, {num:17, cor:"preto"},
  {num:34, cor:"vermelho"}, {num:6, cor:"preto"}, {num:27, cor:"vermelho"},
  {num:13, cor:"preto"}, {num:36, cor:"vermelho"}, {num:11, cor:"preto"},
  {num:30, cor:"vermelho"}, {num:8, cor:"preto"}, {num:23, cor:"vermelho"},
  {num:10, cor:"preto"}, {num:5, cor:"vermelho"}, {num:24, cor:"preto"},
  {num:16, cor:"vermelho"}, {num:33, cor:"preto"}, {num:1, cor:"vermelho"},
  {num:20, cor:"preto"}, {num:14, cor:"vermelho"}, {num:31, cor:"preto"},
  {num:9, cor:"vermelho"}, {num:22, cor:"preto"}, {num:18, cor:"vermelho"},
  {num:29, cor:"preto"}, {num:7, cor:"vermelho"}, {num:28, cor:"preto"},
  {num:12, cor:"vermelho"}, {num:35, cor:"preto"}, {num:3, cor:"vermelho"},
  {num:26, cor:"preto"}
];

const total = numeros.length;
const canvas = document.getElementById("canvas-roleta");
const ctx = canvas.getContext("2d");
const raio = 150;
const roletaVisual = document.getElementById("roleta-visual");
const bola = document.getElementById("bola");

// --- Desenhar Roleta ---
function drawRoleta(){
  const angulo = (2*Math.PI)/total;
  for(let i=0;i<total;i++){
    ctx.beginPath();
    ctx.moveTo(raio,raio);
    ctx.arc(raio,raio,raio,i*angulo,(i+1)*angulo);
    ctx.fillStyle = numeros[i].cor;
    ctx.fill();
    ctx.stroke();
    // Número
    ctx.save();
    ctx.translate(raio,raio);
    ctx.rotate((i+0.5)*angulo);
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.font = "14px Arial";
    ctx.fillText(numeros[i].num, raio-10,5);
    ctx.restore();
  }
}

drawRoleta();

// --- Seleção da aposta ---
document.querySelectorAll(".aposta-btn, .numero-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    apostaSelecionada = btn.dataset.aposta;
    document.getElementById("roleta-resultado").textContent = `Aposta selecionada: ${apostaSelecionada}`;
  });
});

// --- Girar Roleta ---
document.getElementById("roleta-spin").addEventListener("click", async ()=>{
  const user = auth.currentUser;
  if(!user) return alert("Você precisa estar logado para apostar!");
  if(!apostaSelecionada) return alert("Selecione uma aposta!");

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  if(!docSnap.exists()) return alert("Documento do usuário não encontrado!");
  let saldo = docSnap.data().saldo;
  const valorAposta = 50; // Ajuste ou torne dinâmico

  if(saldo<valorAposta) return alert("Saldo insuficiente!");
  saldo -= valorAposta;
  atualizarSaldo(user.uid, saldo);

  // Girar roleta
  const totalGiros = 360*5 + Math.floor(Math.random()*360);
  roletaVisual.style.transition = "transform 5s cubic-bezier(0.33, 1, 0.68, 1)";
  roletaVisual.style.transform = `rotate(${totalGiros}deg)`;

  setTimeout(async ()=>{
    const anguloFinal = totalGiros%360;
    const indexResultado = Math.floor(total - (anguloFinal/360*total)) % total;
    const resultado = numeros[indexResultado];

    const ganhou = apostaSelecionada==resultado.num || apostaSelecionada==resultado.cor;
    if(ganhou) saldo += valorAposta*2;
    atualizarSaldo(user.uid, saldo);

    document.getElementById("roleta-resultado").textContent = `Resultado: ${resultado.num} (${resultado.cor}) - Você ${ganhou?"ganhou!":"perdeu!"}`;

    roletaVisual.style.transition="none";
    roletaVisual.style.transform="rotate(0deg)";
  },5000);
});
