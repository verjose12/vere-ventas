
async function requireAuth() {
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) {
    window.location.replace("./auth/login.html");
    return null;
  }

  return user;
}

// Vuelve a validar cuando la página reaparece,
// por ejemplo al presionar "Atrás" en el navegador.
window.addEventListener("pageshow", async () => {
  await requireAuth();
});