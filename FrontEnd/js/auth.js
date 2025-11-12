const API_URL = "http://localhost:8081";

async function cadastrarUsuario() {
  const nome = cadastroNome.value;
  const email = cadastroEmail.value;
  const senha = cadastroSenha.value;

  const res = await fetch(`${API_URL}/usuario/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });

  const data = await res.text();
  mensagem.textContent = data.includes("sucesso")
    ? "Usuário cadastrado!"
    : "Erro ao cadastrar.";
}

async function login() {
  const email = loginEmail.value;
  const senha = loginSenha.value;

  const res = await fetch(`${API_URL}/usuario/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const data = await res.text();

  if (data.includes("sucesso")) {
    localStorage.setItem("usuarioEmail", email);
    window.location.href = "projetos.html";
  } else {
    mensagem.textContent = "Email ou senha inválidos!";
  }
}
