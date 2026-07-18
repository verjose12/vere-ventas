const DEFAULT_PHONE = "";

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
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

function renderGallery(product) {
  const titleElement = document.querySelector("#t");
  const descriptionElement = document.querySelector("#d");
  const pricesElement = document.querySelector("#prices");
  const galleryElement = document.querySelector("#g");
  const askButton = document.querySelector("#askBtn");
  const copyButton = document.querySelector("#copyBtn");

  titleElement.textContent = product.title || "Producto";
  descriptionElement.textContent = product.description || "";

  galleryElement.innerHTML = "";

  const imageUrls = product.image_urls || [];
  const perPhotoPrices = product.per_photo_prices || [];

  imageUrls.forEach((imageUrl, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const price =
      product.per_photo && perPhotoPrices[index]
        ? perPhotoPrices[index]
        : product.price;

    card.innerHTML = `
      <img
        class="img"
        src="${imageUrl}"
        alt="${product.title || "Producto"}"
      >

      ${
        price
          ? `<div class="pill">${formatPrice(price)}</div>`
          : ""
      }
    `;

    galleryElement.appendChild(card);
  });

  if (product.per_photo) {
    pricesElement.textContent =
      "El precio aparece en cada fotografía.";
  } else {
    pricesElement.textContent =
      `Precio: ${formatPrice(product.price)}`;
  }

  askButton.addEventListener("click", () => {
    const message = encodeURIComponent(
      `Hola, me interesa este producto: ${
        product.title || "Producto"
      }\n${window.location.href}`
    );

    const base = DEFAULT_PHONE
      ? `https://wa.me/${DEFAULT_PHONE}?text=`
      : "https://api.whatsapp.com/send?text=";

    window.open(base + message, "_blank");
  });

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado ✅");
    } catch {
      prompt("Copia este link:", window.location.href);
    }
  });
}

async function loadProduct() {
  const productId = getProductIdFromUrl();

  if (!productId) {
    showError("No se encontró el ID del producto en el enlace.");
    return;
  }

  const product = await getProductById(productId);

  if (!product) {
    showError("No se pudo cargar el producto.");
    return;
  }

  const imageUrls = product.image_urls || [];

  if (imageUrls.length === 0) {
    showError("Este producto no tiene imágenes.");
    return;
  }

  renderGallery(product);
}

loadProduct();