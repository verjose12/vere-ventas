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

/* function buildGalleryLink(item) {
  const payload = {
    t: item.title,
    d: item.desc || "",
    p: "MXN",
    u: item.urls,
    pp: item.perPhoto ? item.perPhotoPrices : null
  };

  return buildShareUrlFromState(payload);
} */

function buildGalleryLink(item){
  return new URL(
      `viewer.html?id=${item.id}`,
      location.href
  ).toString();
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