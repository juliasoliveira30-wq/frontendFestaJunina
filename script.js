const API = 'https://aula-7-backend-vercel-24lr.vercel.app/eventos';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('eventos');
  if (!container) {
    console.error('❌ Erro: <div id="eventos"> não encontrado no HTML');
    return;
  }
  
  container.innerHTML = '<p style="text-align:center; grid-column:1/-1; padding:20px;">Carregando eventos... 🔥</p>';

  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`Falha no servidor: ${res.status}`);
    
    const eventos = await res.json();
    container.innerHTML = '';

    if (!Array.isArray(eventos) || eventos.length === 0) {
      container.innerHTML = '<p style="text-align:center; grid-column:1/-1; padding:20px;">Nenhum evento cadastrado no Arraiá ainda! 🔥</p>';
      return;
    }

    eventos.forEach((evento, index) => {
      const img = evento.imagem || 'https://blog.pingouin.com.br/wp-content/uploads/2023/05/sao-joao-batista.jpg';
      container.innerHTML += `
        <div class="card">
          <img src="${img}" alt="${evento.titulo || 'Evento'}">
          <div class="card-content">
            <h3>${evento.titulo || 'Sem título'}</h3>
            <p>${evento.descricao || 'Sem descrição.'}</p>
            <strong>📅 ${evento.horario || 'A definir'}</strong>
            <button class="btn-vou-ir" onclick="adicionarInteresse(${index})">
              ❤️ <span class="contador-${index}">0</span>
            </button>
          </div>
        </div>
      `;
    });
    carregarInteresses(eventos);
  } catch (erro) {
    console.error('❌ Erro ao carregar:', erro);
    container.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:#b22222; padding:20px;">Erro: ${erro.message}</p>`;
  }

  // Ativa animações de scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.card, .comida-card, .ingresso-card, .galeria-grid img').forEach(el => observer.observe(el));
});

/* INTERESSES (LocalStorage) */
function carregarInteresses(eventos) {
  eventos.forEach((_, i) => {
    const cont = localStorage.getItem(`evento-${i}`) || 0;
    const el = document.querySelector(`.contador-${i}`);
    if (el) el.textContent = cont;
  });
}

function adicionarInteresse(index) {
  let c = parseInt(localStorage.getItem(`evento-${index}`) || 0);
  localStorage.setItem(`evento-${index}`, ++c);
  const el = document.querySelector(`.contador-${index}`);
  if (el) el.textContent = c;
}

/* NAVEGAÇÃO */
function scrollProgramacao() { document.getElementById('programacao')?.scrollIntoView({behavior:'smooth'}); }
function scrollInicio() { window.scrollTo({top:0,behavior:'smooth'}); }
function scrollComidas() { document.getElementById('comidas')?.scrollIntoView({behavior:'smooth'}); }
function scrollIngressos() { document.getElementById('ingressos')?.scrollIntoView({behavior:'smooth'}); }
function scrollGaleria() { document.getElementById('galeria')?.scrollIntoView({behavior:'smooth'}); }
function toggleMenu() { document.getElementById('navMenu')?.classList.toggle('ativo'); }

/* MODAIS */
function abrirLogin() { document.getElementById('loginModal')?.classList.add('ativo'); }
function fecharLogin() { document.getElementById('loginModal')?.classList.remove('ativo'); }
function abrirCheckout() { document.getElementById('checkoutModal')?.classList.add('ativo'); }
function fecharCheckout() { document.getElementById('checkoutModal')?.classList.remove('ativo'); }
function abrirGaleria(src) {
  document.getElementById('galeraModal').style.display = "flex";
  document.getElementById('imagemExpandida').src = src;
}
function fecharGaleria() { document.getElementById('galeraModal').style.display = "none"; }

/* CARRINHO SIMPLES */
let carrinho = { inteira: 0, meia: 0 };
function mudarQuantidade(tipo, delta) {
  carrinho[tipo] = Math.max(0, carrinho[tipo] + delta);
  document.getElementById(`qtd-${tipo}`).value = carrinho[tipo];
  atualizarCarrinho();
}
function atualizarCarrinho() {
  const total = carrinho.inteira + carrinho.meia;
  const valor = carrinho.inteira * 50 + carrinho.meia * 25;
  document.getElementById('total-qtde').textContent = total;
  document.getElementById('total-valor').textContent = valor.toFixed(2).replace('.', ',');
  document.getElementById('checkout-total').textContent = valor.toFixed(2).replace('.', ',');
}
