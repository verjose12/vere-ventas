const DEFAULT_PHONE = "";

function decodeStateFromHash() {
  const hash = location.hash || "";
  const match = hash.match(/[#&?]s=([^&]+)/);

  if (!match) {
    return null;
  }

  let base64 = decodeURIComponent(match[1]);

  base64 = base64
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  while (base64.length % 4) {
    base64 += "=";
  }

  try {
    const json = atob(base64);
    const bytes = Uint8Array.from(json, char => char.charCodeAt(0));
    const decodedJson = new TextDecoder().decode(bytes);

    return JSON.parse(decodedJson);
  } catch (error) {
    console.error("Error decodificando estado:", error);
    return null;
  }
}

function formatPrice(value) {
  if (value == null || value === "") {
    return "";
  }

  const number = Number(value);

  try {
    return number.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2
    });
  } catch {
    return `MXN ${number.toFixed(2)}`;
  }
}

function showError(message) {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
      <div style="
        padding:12px;
        margin:12px;
        background:#222;
        border:1px solid #333;
        border-radius:8px;
      ">
        ${message}
      </div>
    `
  );
}

function renderGallery(state) {
  const titleElement = document.querySelector("#t");
  const descriptionElement = document.querySelector("#d");
  const pricesElement = document.querySelector("#prices");
  const galleryElement = document.querySelector("#g");
  const askButton = document.querySelector("#askBtn");
  const copyButton = document.querySelector("#copyBtn");

  titleElement.textContent = state.t || "Producto";
  descriptionElement.textContent = state.d || "";

  galleryElement.innerHTML = "";

  state.u.forEach((imageUrl, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const price =
      Array.isArray(state.pp) && state.pp[index]
        ? state.pp[index]
        : null;

    card.innerHTML = `
      <img
        class="img"
        src="${imageUrl}"
        alt="${state.t || "Producto"}"
      >

      ${
        price
          ? `<div class="pill">${formatPrice(price)}</div>`
          : ""
      }
    `;

    galleryElement.appendChild(card);
  });

  if (Array.isArray(state.pp)) {
    pricesElement.textContent = "El precio aparece en cada fotografía.";
  } else {
    pricesElement.textContent = "";
  }

  askButton.addEventListener("click", () => {
    const message = encodeURIComponent(
      `Hola, me interesa este producto: ${state.t || "Producto"}\n${location.href}`
    );

    const base = DEFAULT_PHONE
      ? `https://wa.me/${DEFAULT_PHONE}?text=`
      : "https://api.whatsapp.com/send?text=";

    window.open(base + message, "_blank");
  });

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      alert("Link copiado ✅");
    } catch {
      prompt("Copia este link:", location.href);
    }
  });
}

const state = decodeStateFromHash();

if (!state || !Array.isArray(state.u) || state.u.length === 0) {
  showError(
    "No se pudo cargar la galería. Revisa que el enlace esté completo."
  );
} else {
  renderGallery(state);
}