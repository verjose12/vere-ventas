const DEFAULT_PHONE = "526561137081";

const base = DEFAULT_PHONE
  ? `https://wa.me/${DEFAULT_PHONE}?text=`
  : "https://api.whatsapp.com/send?text=";

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
      maximumFractionDigits: 2,
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
let selectedImageIndex = 0;

function renderGallery(product) {
  const titleElement = document.querySelector("#t");
  const descriptionElement = document.querySelector("#d");
  const pricesElement = document.querySelector("#prices");
  const galleryElement = document.querySelector("#g");
  const askButton = document.querySelector("#askBtn");
  const copyButton = document.querySelector("#copyBtn");

  const imageLightbox =
  document.querySelector("#imageLightbox");

const imageLightboxPhoto =
  document.querySelector("#imageLightboxPhoto");

const imageLightboxPrice =
  document.querySelector("#imageLightboxPrice");

const closeImageLightboxBtn =
  document.querySelector("#closeImageLightbox");

  titleElement.textContent = product.title || "Producto";
  descriptionElement.textContent = product.description || "";

  galleryElement.innerHTML = "";

  const imageUrls = product.image_urls || [];
  const perPhotoPrices = product.per_photo_prices || [];

  const params = new URLSearchParams(window.location.search);
const photoFromUrl = Number(params.get("photo"));

if (
  Number.isInteger(photoFromUrl) &&
  photoFromUrl >= 1 &&
  photoFromUrl <= imageUrls.length
) {
  selectedImageIndex = photoFromUrl - 1;
} else {
  selectedImageIndex = 0;
}

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

      ${price ? `<div class="pill">${formatPrice(price)}</div>` : ""}
    `;

    galleryElement.appendChild(card);

    if (index === selectedImageIndex) {
      card.classList.add("selected");
    }

    card.addEventListener("click", () => {
      selectedImageIndex = index;

      galleryElement
        .querySelectorAll(".card")
        .forEach((c) => c.classList.remove("selected"));

      card.classList.add("selected");
              imageLightboxPhoto.src = imageUrl;
        imageLightboxPhoto.alt =
          product.title || "Producto";

        imageLightboxPrice.textContent =
          price ? formatPrice(price) : "Pregunta por precio";

        imageLightbox.classList.add("show");
        imageLightbox.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    });
  });

  function closeImageLightbox() {
    imageLightbox.classList.remove("show");
    imageLightbox.setAttribute("aria-hidden", "true");
  
    imageLightboxPhoto.src = "";
    imageLightboxPhoto.alt = "";
  
    document.body.style.overflow = "";
  }
  
  closeImageLightboxBtn.addEventListener(
    "click",
    closeImageLightbox
  );
  
  imageLightbox.addEventListener("click", (event) => {
    if (event.target === imageLightbox) {
      closeImageLightbox();
    }
  });
  
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeImageLightbox();
    }
  });

  if (product.per_photo) {
    pricesElement.textContent = "El precio aparece en cada fotografía.";
  } else {
    pricesElement.textContent = `Precio: ${formatPrice(product.price)}`;
  }

  askButton.addEventListener("click", () => {

    const selectedPhotoNumber = selectedImageIndex + 1;

    const selectedPhotoUrl = new URL(window.location.href);
    selectedPhotoUrl.searchParams.set("photo", selectedPhotoNumber);

    const message = encodeURIComponent(
      `Hola 👋

Me interesa este producto:

${product.title}

📸 Fotografía seleccionada:
${selectedPhotoUrl.toString()}`
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

async function renderGalleryNavigation(currentProductId) {
  const galleryNav = document.querySelector("#galleryNav");

  if (!galleryNav) {
    return;
  }

  const products = await getProducts();

  galleryNav.innerHTML = "";

  products.forEach((product) => {
    const link = document.createElement("a");

    link.href = `viewer.html?id=${product.id}`;
    link.textContent = product.title || "Producto";

    if (String(product.id) === String(currentProductId)) {
      link.classList.add("active");
    }

    galleryNav.appendChild(link);
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

  await renderGalleryNavigation(productId);
}

loadProduct();
