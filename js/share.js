const DEFAULT_PHONE = "";

const __utf8 = new TextEncoder();

function toBase64UrlUtf8(str) {
  const bytes = __utf8.encode(str);
  let bin = "";

  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }

  return btoa(bin)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildShareUrlFromState(stateObj) {
  const json = JSON.stringify(stateObj);
  const base64Url = toBase64UrlUtf8(json);
  const base = new URL("viewer.html", location.href).toString();

  return `${base}#s=${encodeURIComponent(base64Url)}`;
}


function buildGalleryLink(item) {
  const url = new URL("viewer.html", location.href);

  url.searchParams.set("id", item.id);

  if (item.userId) {
    url.searchParams.set("user", item.userId);
  }

  url.searchParams.set("v", "2");

  return url.toString();
}



function buildMessage(item) {
  const galleryLink = buildGalleryLink(item);
  const lines = [];

  lines.push(`*${item.title}*`);

  if (item.desc) {
    lines.push(item.desc);
  }

  lines.push("");
  lines.push("👉 *Ver fotos del producto:*");
  lines.push(galleryLink);
  lines.push("");
  lines.push("_Consulta disponibilidad. Envío/entrega a convenir._");

  return lines.join("\n");
}

async function shareFacebook(product, button) {
  const confirmPublish = confirm(
    `¿Quieres publicar "${product.title}" en Facebook?`
  );

  if (!confirmPublish) {
    return;
  }

  const originalContent = button.innerHTML;

  button.disabled = true;
  button.innerHTML = `
    <span class="spinner-border spinner-border-sm"></span>
  `;

  const imageUrl = product.urls?.[0];

  if (!imageUrl) {
    alert("Este producto no tiene una imagen para publicar.");
    return;
  }

  const galleryLink = buildGalleryLink(product);

  const message = [
    `🛍️ ${product.title}`,
    "",
    `💰 ${formatPrice(product.price)}`,
    product.desc ? `✨ ${product.desc}` : "",
    "",
    "📸 Ver todas las fotografías:",
    galleryLink,
    "",
    "📩 Consulta disponibilidad."
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { data, error } = await supabaseClient.functions.invoke(
      "publish-facebook",
      {
        body: {
          imageUrl,
          message
        }
      }
    );

    if (error) {
      let errorDetails = null;
    
      try {
        errorDetails = await error.context.json();
      } catch {
        errorDetails = {
          message: error.message
        };
      }
    
      console.error(
        "Respuesta completa de la Edge Function:",
        errorDetails
      );
    
      throw new Error(
        errorDetails?.error?.error?.message ||
        errorDetails?.error?.message ||
        errorDetails?.error ||
        errorDetails?.message ||
        error.message
      );
    }

    if (!data?.ok) {
      throw new Error(
        data?.error?.error?.message ||
        data?.error ||
        "Meta no pudo crear la publicación."
      );
    }

    alert("✅ Producto publicado correctamente en Vjox-Ventas.");

  } catch (error) {
    console.error("Error publicando en Facebook:", error);

    alert(
      `❌ No se pudo publicar en Facebook.\n\n${error.message}`
    );
  } finally {
    button.disabled = false;
    button.innerHTML = originalContent;
  }
}

function shareWhatsApp(item) {
  const message = encodeURIComponent(buildMessage(item));

  const base = DEFAULT_PHONE
    ? `https://wa.me/${DEFAULT_PHONE}?text=`
    : "https://api.whatsapp.com/send?text=";

  window.open(base + message, "_blank");
}

async function copyMessage(item) {
  const message = buildMessage(item);

  try {
    await navigator.clipboard.writeText(message);
    alert("Mensaje copiado ✅ Pégalo en WhatsApp.");
  } catch {
    prompt("Copia el mensaje:", message);
  }
}