const menuQuery = (selector) =>
  document.querySelector(selector);

const openSideMenuBtn =
  menuQuery("#openSideMenuBtn");

const closeSideMenuBtn =
  menuQuery("#closeSideMenuBtn");

const sideMenu =
  menuQuery("#sideMenu");

const sideMenuOverlay =
  menuQuery("#sideMenuOverlay");

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