// =====================================================
// AUTENTICAÇÃO DO PAINEL ADMIN
// =====================================================

const loginForm = document.getElementById("login-form");

// --- Página de LOGIN (admin/index.html) ---
if (loginForm) {
  // Se já estiver logado, pula direto pro dashboard
  supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session) {
      window.location.href = "dashboard.html";
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const btn = document.getElementById("login-btn");
    const errorMsg = document.getElementById("login-error");

    errorMsg.textContent = "";
    btn.disabled = true;
    btn.textContent = "Entrando...";

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      errorMsg.textContent = "E-mail ou senha inválidos.";
      btn.disabled = false;
      btn.textContent = "Entrar";
      return;
    }

    window.location.href = "dashboard.html";
  });
}

// --- Proteção do DASHBOARD (admin/dashboard.html) ---
// Chame esta função no início do admin.js do dashboard
async function exigirLogin() {
  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    window.location.href = "index.html";
    return null;
  }

  return data.session;
}

// --- LOGOUT ---
async function fazerLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}
