// =====================================================
// SITE PÚBLICO — Renderiza os projetos cadastrados
// =====================================================
// Este script busca os projetos no Supabase e monta os
// cards dentro de <div id="projects-grid"></div>
// Não precisa mexer nesse arquivo para adicionar projetos:
// isso é feito pelo painel /admin.
//
// As classes usadas aqui (pj-grid, pj-card, pj-card-content,
// pj-card-desc) têm um prefixo próprio de propósito, para
// nunca colidir com as classes .project / .project-content
// usadas na seção estática "Projetos" do index.html.
// =====================================================

async function carregarProjetosPublicos() {
  const grid = document.getElementById('projects-grid');

  if (!grid) return; // seção não existe nesta página

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
  const categoria = escaparHTML(projeto.category);
  const descricao = escaparHTML(projeto.description);

  return `
    <article class="pj-card" style="background-image: url('${projeto.image_url}')">
      <div class="pj-card-content">
        <span>${categoria}</span>
        <h3>${titulo}</h3>
        <p class="pj-card-desc">${descricao}</p>
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
