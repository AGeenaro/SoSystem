(function () {
  var host = window.location.hostname;
  var isLocal = host === "localhost" || host === "127.0.0.1" || host === "";
  window.PRODIFY_CONFIG = {
    apiUrl: isLocal ? "http://localhost:3000" : "https://sosystem-api.onrender.com",
    version: "2026.10.30"
  };
})();
