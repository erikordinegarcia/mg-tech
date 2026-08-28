// =====================================================
// SITE PÚBLICO — Renderiza os projetos cadastrados
// =====================================================
// Categoria e descrição agora são opcionais: se não
// forem preenchidas no painel, simplesmente não aparecem
// no card, sem deixar espaço vazio ou "undefined".
// =====================================================

async function carregarProjetosPublicos() {
  const grid = document.getElementById('projects-grid');

  if (!grid) return;

  grid.innerHTML = `<p class="pj-loading">Carregando projetos...</p>`;

  const { data: projetos, error } = await supabaseClient
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar projetos:', error);
    grid.innerHTML = `<p class="pj-loading">Não foi possível carregar os projetos no momento.</p>`;
    return;
  }

  if (!projetos || projetos.length === 0) {
    grid.innerHTML = `<p class="pj-loading">Nenhum projeto cadastrado ainda.</p>`;
    return;
  }

  grid.innerHTML = projetos.map(criarCardProjeto).join('');
}

function criarCardProjeto(projeto) {
  const titulo = escaparHTML(projeto.title);

  // Categoria: só mostra o <span> se houver valor
  const categoriaHtml = projeto.category ? `<span>${escaparHTML(projeto.category)}</span>` : '';

  // Descrição: só mostra o <p> se houver valor
  const descricaoHtml = projeto.description
    ? `<p class="pj-card-desc">${escaparHTML(projeto.description)}</p>`
    : '';

  return `
    <article class="pj-card" style="background-image: url('${projeto.image_url}')">
      <div class="pj-card-content">
        ${categoriaHtml}
        <h3>${titulo}</h3>
        ${descricaoHtml}
      </div>
    </article>
  `;
}

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', carregarProjetosPublicos);
