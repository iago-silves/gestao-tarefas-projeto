const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailValue = document.getElementById("email").value;
    const senhaValue = document.getElementById("senha").value;

    try {
      const res = await apiRequest("/usuario/login", "POST", {
        email: emailValue,
        senha: senhaValue,
      });

      if (typeof res === "string" && res.includes("sucesso")) {
        localStorage.setItem("userEmail", emailValue);
        alert("Login realizado com sucesso!");
        window.location.href = "index.html";
      } else {
        alert(res);
      }
    } catch (err) {
      alert("Erro ao fazer login: " + err);
    }
  });
}

const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeValue = document.getElementById("nome").value;
    const emailValue = document.getElementById("email").value;
    const senhaValue = document.getElementById("senha").value;

    try {
      const res = await apiRequest("/usuario/cadastro", "POST", {
        nome: nomeValue,
        email: emailValue,
        senha: senhaValue,
      });

      if (typeof res === "string" && res.includes("sucesso")) {
        alert("Usuário cadastrado com sucesso!");
        window.location.href = "login.html";
      } else {
        alert(res);
      }
    } catch (err) {
      alert("Erro ao cadastrar usuário: " + err);
    }
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
}

const userName = document.getElementById("userName");
if (userName) {
  const email = localStorage.getItem("userEmail");
  if (!email) {
    window.location.href = "login.html";
  } else {
    userName.textContent = email;
  }
}
