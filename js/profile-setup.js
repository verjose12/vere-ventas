const profileForm = document.querySelector("#profileForm");
const statusEl = document.querySelector("#profileStatus");

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusEl.textContent = "Guardando perfil...";

  const {
    data: { session },
    error: sessionError
  } = await supabaseClient.auth.getSession();

  if (sessionError || !session) {
    statusEl.textContent = "No hay una sesión activa.";
    return;
  }

  const user = session.user;

  const name = document.querySelector("#name").value.trim();
  const businessName = document.querySelector("#businessName").value.trim();
  const whatsappPhone = document.querySelector("#whatsappPhone").value.trim();

  const profile = {
    id: user.id,
    name: name,
    business_name: businessName,
    whatsapp_phone: whatsappPhone
  };

  const savedProfile = await createProfile(profile);

  if (!savedProfile) {
    statusEl.textContent = "No se pudo guardar el perfil.";
    return;
  }

  statusEl.textContent = "Perfil guardado correctamente.";

  window.location.href = "index.html";
});