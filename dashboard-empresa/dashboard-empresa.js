document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("toggleDark");
  
    // Verifica o modo salvo no localStorage
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      toggle.checked = true;
    }
  
    toggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    });
  });
  