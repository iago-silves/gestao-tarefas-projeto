// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = email.value;
    const senha = senha.value;
    const res = await apiRequest("/usuario/login", "POST", { email, senha });
    if (res.includes("sucesso")) {
      localStorage.setItem("userEmail", email);
      window.location.href = "index.html";
    } else alert(res);
  });
}

// CADASTRO
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = nome.value;
    const email = email.value;
    const senha = senha.value;
    const res = await apiRequest("/usuario/cadastro", "POST", {
      nome,
      email,
      senha,
    });
    alert(res);
    if (res.includes("sucesso")) window.location.href = "login.html";
  });
}

// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn)
  logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "login.html";
  };

// NOME DO USUÁRIO
const userName = document.getElementById("userName");
if (userName) {
  const email = localStorage.getItem("userEmail");
  if (!email) window.location.href = "login.html";
  else userName.textContent = email;
}
