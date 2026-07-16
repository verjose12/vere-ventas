
const CLOUD_NAME = "dvxorpdrd";
const UPLOAD_PRESET = "Ventas";
const CLOUDINARY_FOLDER = "verox-ventas";

async function uploadImageToCloudinary(file) {
  const form = new FormData();

  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", CLOUDINARY_FOLDER);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: form
    }
  );

  if (!response.ok) {
    throw new Error("Fallo al subir imagen a Cloudinary");
  }

  const data = await response.json();

  return optimizeCloudinaryUrl(data.secure_url);
}

function optimizeCloudinaryUrl(url) {
  return url.replace(
    "/upload/",
    "/upload/f_auto,q_auto:eco,w_1200/"
  );
}
