const $ = (selector) => document.querySelector(selector);

const openSideMenuBtn = $("#openSideMenuBtn");
const closeSideMenuBtn = $("#closeSideMenuBtn");
const sideMenu = $("#sideMenu");
const sideMenuOverlay = $("#sideMenuOverlay");

function openSideMenu() {
    sideMenu.classList.add("open");
    sideMenuOverlay.classList.add("show");
  
    sideMenu.setAttribute("aria-hidden", "false");
    openSideMenuBtn.setAttribute("aria-expanded", "true");
  
    document.body.style.overflow = "hidden";
  }
  
  function closeSideMenu() {
    sideMenu.classList.remove("open");
    sideMenuOverlay.classList.remove("show");
  
    sideMenu.setAttribute("aria-hidden", "true");
    openSideMenuBtn.setAttribute("aria-expanded", "false");
  
    document.body.style.overflow = "";
  }
  
  openSideMenuBtn.addEventListener("click", openSideMenu);
  
  closeSideMenuBtn.addEventListener("click", closeSideMenu);
  
  sideMenuOverlay.addEventListener("click", closeSideMenu);
  
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeSideMenu();
    }
  });