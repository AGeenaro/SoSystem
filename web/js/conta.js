(function () {
  var TOKEN_KEY = "prodfy_jwt";
  var apiUrl = window.PRODIFY_CONFIG.apiUrl.replace(/\/$/, "");
  document.getElementById("apiUrlLabel").textContent = "API: " + apiUrl;

  function token() { return localStorage.getItem(TOKEN_KEY); }

  function showMessage(text, isError) {
    var box = document.getElementById("message");
    box.style.display = "block";
    box.style.borderColor = isError ? "#F8D6D5" : "#CDEFDC";
    box.textContent = text;
  }

  async function api(path, options) {
    options = options || {};
    var headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
    if (token()) headers.Authorization = "Bearer " + token();
    var response = await fetch(apiUrl + path, {
      method: options.method || "GET",
      headers: headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    var text = await response.text();
    var payload = text ? JSON.parse(text) : null;
    if (!response.ok) {
      var message = payload && payload.error ? payload.error.message : "Falha na API.";
      var error = new Error(message);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  }

  function currentUserFromToken() {
    var raw = token();
    if (!raw) return null;
    try {
      var part = raw.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(decodeURIComponent(escape(atob(part))));
    } catch (e) {
      return null;
    }
  }

  async function refresh() {
    var guest = document.getElementById("guestPanel");
    var session = document.getElementById("sessionPanel");
    if (!token()) {
      guest.style.display = "flex";
      session.style.display = "none";
      return;
    }
    try {
      var me = await api("/api/auth/me");
      guest.style.display = "none";
      session.style.display = "block";
      document.getElementById("sessionName").textContent = me.data.name;
      document.getElementById("sessionMeta").textContent = me.data.email + " · " + me.data.role;
      document.getElementById("profileName").value = me.data.name;
      document.getElementById("profileEmail").value = me.data.email;
      var admin = document.getElementById("adminPanel");
      if (me.data.role === "administrador" || me.data.role === "administrador_suporte") {
        admin.style.display = "block";
        await loadUsers();
      } else {
        admin.style.display = "none";
      }
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      guest.style.display = "flex";
      session.style.display = "none";
      showMessage(error.message, true);
    }
  }

  async function loadUsers() {
    var result = await api("/api/users");
    var body = document.getElementById("usersBody");
    var mine = currentUserFromToken();
    body.innerHTML = result.data.map(function (user) {
      var disabled = mine && mine.sub === user.id ? "disabled" : "";
      return "<tr><td>" + escapeHtml(user.name) + "</td><td>" + escapeHtml(user.email) +
        "</td><td>" + escapeHtml(user.role) + "</td><td><button class=\"btn btn-danger btn-sm\" data-id=\"" +
        user.id + "\" " + disabled + ">Excluir</button></td></tr>";
    }).join("");
    Array.prototype.forEach.call(body.querySelectorAll("button[data-id]"), function (button) {
      button.addEventListener("click", async function () {
        if (!confirm("Excluir este usuário?")) return;
        try {
          await api("/api/users/" + button.getAttribute("data-id"), { method: "DELETE" });
          showMessage("Usuário excluído.", false);
          await loadUsers();
        } catch (error) {
          showMessage(error.message, true);
        }
      });
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char];
    });
  }

  document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    try {
      var result = await api("/api/auth/login", {
        method: "POST",
        body: {
          email: document.getElementById("loginEmail").value,
          password: document.getElementById("loginPassword").value
        }
      });
      localStorage.setItem(TOKEN_KEY, result.data.accessToken);
      showMessage("Login realizado.", false);
      await refresh();
    } catch (error) {
      showMessage(error.message, true);
    }
  });

  document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    try {
      var result = await api("/api/auth/register", {
        method: "POST",
        body: {
          name: document.getElementById("registerName").value,
          email: document.getElementById("registerEmail").value,
          password: document.getElementById("registerPassword").value
        }
      });
      localStorage.setItem(TOKEN_KEY, result.data.accessToken);
      showMessage("Conta criada. O primeiro usuário é administrador.", false);
      await refresh();
    } catch (error) {
      showMessage(error.message, true);
    }
  });

  document.getElementById("profileForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    var claims = currentUserFromToken();
    if (!claims) return;
    var body = {
      name: document.getElementById("profileName").value,
      email: document.getElementById("profileEmail").value
    };
    var password = document.getElementById("profilePassword").value;
    if (password) body.password = password;
    try {
      await api("/api/users/" + claims.sub, { method: "PUT", body: body });
      document.getElementById("profilePassword").value = "";
      showMessage("Perfil atualizado.", false);
      await refresh();
    } catch (error) {
      showMessage(error.message, true);
    }
  });

  document.getElementById("createUserForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    try {
      await api("/api/users", {
        method: "POST",
        body: {
          name: document.getElementById("newName").value,
          email: document.getElementById("newEmail").value,
          password: document.getElementById("newPassword").value,
          role: document.getElementById("newRole").value
        }
      });
      event.target.reset();
      showMessage("Usuário criado.", false);
      await loadUsers();
    } catch (error) {
      showMessage(error.message, true);
    }
  });

  document.getElementById("logoutButton").addEventListener("click", function () {
    localStorage.removeItem(TOKEN_KEY);
    showMessage("Sessão encerrada neste navegador.", false);
    refresh();
  });

  refresh();
})();
