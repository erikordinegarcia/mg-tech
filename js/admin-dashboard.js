// =====================================================
// PAINEL ADMIN — CRUD de Projetos
// =====================================================

const form = document.getElementById("project-form");
const listEl = document.getElementById("projects-list");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const formError = document.getElementById("form-error");
const imageHint = document.getElementById("image-hint");

let editandoId = null; // null = criando novo | uuid = editando existente
let imagemAtualUrl = null; // usada quando edita sem trocar a imagem

// ---------------------------------------------------
// INICIALIZAÇÃO
// ---------------------------------------------------
(async function iniciar() {
  const sessao = await exigirLogin();
  if (!sessao) return; // exigirLogin já redireciona se não houver sessão

  document.getElementById("logout-btn").addEventListener("click", fazerLogout);

  carregarListaProjetos();
})();

// ---------------------------------------------------
// LISTAR PROJETOS
// ---------------------------------------------------
async function carregarListaProjetos() {
  listEl.innerHTML = `<p class="loading-text">Carregando...</p>`;

  const { data: projetos, error } = await supabaseClient
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    listEl.innerHTML = `<p class="loading-text">Erro ao carregar projetos.</p>`;
    console.error(error);
    return;
  }

  if (!projetos || projetos.length === 0) {
    listEl.innerHTML = `<p class="loading-text">Nenhum projeto cadastrado ainda.</p>`;
    return;
  }

  listEl.innerHTML = projetos.map((p) => criarItemLista(p)).join("");

  // Liga os botões de editar/excluir de cada item
  projetos.forEach((p) => {
    document
      .getElementById(`edit-${p.id}`)
      .addEventListener("click", () => preencherFormParaEdicao(p));

    document
      .getElementById(`delete-${p.id}`)
      .addEventListener("click", () => excluirProjeto(p));
  });
}

function criarItemLista(p) {
  return `
    <div class="admin-project-item">
      <img src="${p.image_url}" alt="${escaparHTMLAdmin(p.title)}" class="admin-project-thumb" />

      <div class="admin-project-info">
        <strong>${escaparHTMLAdmin(p.title)}</strong>
        <span class="admin-project-category">${escaparHTMLAdmin(p.category)}</span>
        <p>${escaparHTMLAdmin(p.description)}</p>
      </div>

      <div class="admin-project-actions">
        <button id="edit-${p.id}" class="btn-secondary btn-small">Editar</button>
        <button id="delete-${p.id}" class="btn-danger btn-small">Excluir</button>
      </div>
    </div>
  `;
}

function escaparHTMLAdmin(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

// ---------------------------------------------------
// PREENCHER FORM PARA EDIÇÃO
// ---------------------------------------------------
function preencherFormParaEdicao(projeto) {
  editandoId = projeto.id;
  imagemAtualUrl = projeto.image_url;

  document.getElementById("title").value = projeto.title;
  document.getElementById("category").value = projeto.category;
  document.getElementById("description").value = projeto.description;
  document.getElementById("image").value = "";

  imageHint.textContent = "Deixe em branco para manter a imagem atual.";
  formTitle.textContent = "Editar projeto";
  submitBtn.textContent = "Salvar alterações";
  cancelEditBtn.style.display = "inline-flex";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

cancelEditBtn.addEventListener("click", resetarFormulario);

function resetarFormulario() {
  editandoId = null;
  imagemAtualUrl = null;

  form.reset();
  formTitle.textContent = "Novo projeto";
  submitBtn.textContent = "Adicionar projeto";
  cancelEditBtn.style.display = "none";
  imageHint.textContent = "Envie uma imagem (JPG ou PNG).";
  formError.textContent = "";
}

// ---------------------------------------------------
// SALVAR (CRIAR OU ATUALIZAR)
// ---------------------------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  formError.textContent = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Salvando...";

  try {
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value.trim();
    const description = document.getElementById("description").value.trim();
    const arquivoImagem = document.getElementById("image").files[0];

    if (!arquivoImagem && !editandoId) {
      throw new Error("Selecione uma imagem para o projeto.");
    }

    let image_url = imagemAtualUrl;

    if (arquivoImagem) {
      image_url = await enviarImagem(arquivoImagem);
    }

    if (editandoId) {
      // ATUALIZAR
      const { error } = await supabaseClient
        .from("projects")
        .update({ title, category, description, image_url })
        .eq("id", editandoId);

      if (error) throw error;
    } else {
      // CRIAR
      const { error } = await supabaseClient
        .from("projects")
        .insert([{ title, category, description, image_url }]);

      if (error) throw error;
    }

    resetarFormulario();
    carregarListaProjetos();
  } catch (err) {
    console.error(err);
    formError.textContent = err.message || "Erro ao salvar o projeto.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = editandoId ? "Salvar alterações" : "Adicionar projeto";
  }
});

// ---------------------------------------------------
// UPLOAD DE IMAGEM PARA O STORAGE
// ---------------------------------------------------
async function enviarImagem(arquivo) {
  const extensao = arquivo.name.split(".").pop();
  const nomeArquivo = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extensao}`;

  const { error } = await supabaseClient.storage
    .from("project-images")
    .upload(nomeArquivo, arquivo);

  if (error) throw error;

  const { data } = supabaseClient.storage
    .from("project-images")
    .getPublicUrl(nomeArquivo);

  return data.publicUrl;
}

// ---------------------------------------------------
// EXCLUIR PROJETO
// ---------------------------------------------------
async function excluirProjeto(projeto) {
  const confirmar = confirm(`Excluir o projeto "${projeto.title}"? Essa ação não pode ser desfeita.`);
  if (!confirmar) return;

  const { error } = await supabaseClient.from("projects").delete().eq("id", projeto.id);

  if (error) {
    alert("Erro ao excluir o projeto.");
    console.error(error);
    return;
  }

  carregarListaProjetos();
}
