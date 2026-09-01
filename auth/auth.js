const registerForm = document.querySelector("#registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("#registerName").value.trim();
    const email = document.querySelector("#registerEmail").value.trim();
    const password = document.querySelector("#registerPassword").value;

    const status = document.querySelector("#registerStatus");

    status.textContent = "Creando cuenta...";

    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        console.error(error);
        status.textContent = error.message;
        return;
      }
      
      console.log("Usuario creado:", data);
      
     // const user = data.user;
      
      // if (user) {
      //   const { error: profileError } = await supabaseClient
      //     .from("profiles")
      //     .insert({
      //       id: user.id,
      //       name: name,
      //       plan: "free"
      //     });
      
      //   if (profileError) {
      //     console.error(
      //       "Error creando perfil:",
      //       profileError
      //     );
      
      //     status.textContent =
      //       "La cuenta se creó, pero hubo un problema creando el perfil.";
      
      //     return;
      //   }
      // }
      
      status.textContent = "Cuenta creada correctamente, confirma tu email.";

    });
}

const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document
      .querySelector("#loginEmail")
      .value
      .trim();

    const password =
      document.querySelector("#loginPassword").value;

    const status =
      document.querySelector("#loginStatus");

    status.textContent = "Iniciando sesión...";

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      console.error(error);
      status.textContent = error.message;
      return;
    }

    console.log("Sesión iniciada:", data);

    status.textContent =
      "Sesión iniciada correctamente.";
    
    const user = data.user;
    
    const profile = await getProfile(user.id);
    
    setTimeout(() => {
      if (profile) {
        window.location.href = "../index.html";
      } else {
        window.location.href = "../profiles-setup.html";
      }
    }, 800);
  });
}

async function checkSession() {
    const {
      data: { session }
    } = await supabaseClient.auth.getSession();
  
    console.log("Sesión actual:", session);
  }
  
  checkSession();