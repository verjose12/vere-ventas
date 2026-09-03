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

const logoutBtn =
  menuQuery("#logoutBtn");


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

  
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("Error al cerrar sesión:", error);
      return;
    }

    // window.location.href = "./auth/login.html";
    window.location.replace("./auth/login.html");
  });
}

async function loadSideMenuBusinessName() {

  const businessNameEl =
    document.querySelector(
      "#sideMenuBusinessName"
    );

  if (!businessNameEl) return;


  const {
    data: { user },
    error: userError
  } =
    await supabaseClient.auth.getUser();


  if (userError || !user) {
    businessNameEl.textContent =
      "Mi negocio";

    return;
  }


  let displayName =
    "Mi negocio";


  const {
    data: profile,
    error: profileError
  } =
    await supabaseClient
      .from("profiles")
      .select(
        "name, business_name"
      )
      .eq("id", user.id)
      .maybeSingle();


  if (!profileError && profile) {

    displayName =
      profile.business_name ||
      profile.name ||
      "Mi negocio";
  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient.functions.invoke(
        "facebook-connection-info"
      );


    if (
      !error &&
      data?.connected &&
      data?.page?.name
    ) {

      displayName =
        data.page.name;
    }

  } catch (error) {

    console.warn(
      "No se pudo cargar la página de Facebook:",
      error
    );
  }


  businessNameEl.textContent =
    displayName;
}


loadSideMenuBusinessName();