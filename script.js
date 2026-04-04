document.addEventListener("DOMContentLoaded", () => {
  const storageInfo = document.getElementById("storageInfo");
  const commentsList = document.getElementById("commentsList");
  const themeToggle = document.getElementById("themeToggle");
  const feedbackModal = document.getElementById("feedbackModal");
  const closeModal = document.getElementById("closeModal");

  const VARIANT_NUMBER = 16;
  const DAY_START = 7;
  const NIGHT_START = 21;

  function saveBrowserInfoToLocalStorage() {
    const browserInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      currentURL: window.location.href,
      appName: navigator.appName,
      appVersion: navigator.appVersion,
      vendor: navigator.vendor,
      time: new Date().toString()
    };

    localStorage.setItem("browserInfo", JSON.stringify(browserInfo));
  }

  function renderLocalStorageInfo() {
    const browserInfo = JSON.parse(localStorage.getItem("browserInfo"));

    if (!browserInfo || !storageInfo) return;

    storageInfo.innerHTML = `
      <h3>Browser & OS info from localStorage</h3>
      <ul>
        ${Object.entries(browserInfo)
          .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
          .join("")}
      </ul>
    `;
  }

  async function loadComments() {
    if (!commentsList) return;

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${VARIANT_NUMBER}/comments`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const comments = await response.json();

      commentsList.innerHTML = comments
        .map(
          (comment) => `
            <div class="comment-card">
              <h4>${comment.name}</h4>
              <p><strong>Email:</strong> ${comment.email}</p>
              <p>${comment.body}</p>
            </div>
          `
        )
        .join("");
    } catch (error) {
      commentsList.innerHTML = `<p>Unable to load comments.</p>`;
      console.error(error);
    }
  }

  function applyTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }

  function setThemeByTime() {
    const hour = new Date().getHours();
    const autoTheme =
      hour >= DAY_START && hour < NIGHT_START ? "light-theme" : "dark-theme";

    const savedTheme = localStorage.getItem("theme");
    applyTheme(savedTheme || autoTheme);
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains("dark-theme");
    applyTheme(isDark ? "light-theme" : "dark-theme");
  }

  function showModal() {
    if (feedbackModal) {
      feedbackModal.classList.remove("hidden");
    }
  }

  function hideModal() {
    if (feedbackModal) {
      feedbackModal.classList.add("hidden");
    }
  }

  saveBrowserInfoToLocalStorage();
  renderLocalStorageInfo();
  loadComments();
  setThemeByTime();

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  if (closeModal) {
    closeModal.addEventListener("click", hideModal);
  }

  if (feedbackModal) {
    feedbackModal.addEventListener("click", (event) => {
      if (event.target === feedbackModal) {
        hideModal();
      }
    });
  }

  setTimeout(showModal, 60000);
});