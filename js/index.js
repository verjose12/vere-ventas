const state ={
  files: [],
  items: []
};

const $ = s => document.querySelector(s);

const fileInput = $("#fileInput");
const titleInput = $("#titleInput");
const priceInput = $("#priceInput");
const descInput = $("#descInput");
const uploadBtn = $("#uploadBtn");
const clearBtn = $("#clearBtn");
const preview = $("#preview");
const list = $("#list");
const statusEl = $("#status");
const perPhotoChk = $("#perPhotoChk");
const stockInput = $("#stockInput");
const categoryInput = $("#categoryInput");

function formatPrice(n){
  if(n==null || n==="") return "";
  const v = Number(n);
  try { return v.toLocaleString("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:2}); }
  catch { return `MXN ${v.toFixed(2)}`; }
}

function rebuildPreview(){
  preview.innerHTML = "";
  for (let i=0;i<state.files.length;i++){
    const f = state.files[i];
    const url = URL.createObjectURL(f);
    const el = document.createElement("div");
    el.className = "thumb";
    el.innerHTML = `
      <img src="${url}" alt="">
      <div class="priceTag">Previsualización</div>
      ${perPhotoChk.checked ? `
        <div style="position:absolute;top:8px;left:8px;right:8px;background:rgba(0,0,0,.55);padding:6px;border-radius:8px">
          <input data-idx="${i}" class="pp" type="number" inputmode="decimal" min="0" step="0.01" placeholder="Precio para esta foto" style="width:100%;border:1px solid #444;background:#111;color:#fff;padding:6px;border-radius:6px;font-size:12px">
        </div>` : ``}
    `;
    preview.appendChild(el);
  }
}

fileInput.addEventListener("change", (e)=>{
  const picked = Array.from(e.target.files || []);
  if(picked.length === 0) return;
  state.files = mergeFiles( // <-usamos el helper para acumular
    state.files,
    picked
  );    
  fileInput.value = ""; // <-permite volver a elegir los mismos archivos
  rebuildPreview();
});


// si cambias el checkbox, vuelve a dibujar inputs por foto
perPhotoChk.addEventListener("change", rebuildPreview);

// Lee precios por foto antes de subir
function getPerPhotoPrices(){
  const map = {};
  document.querySelectorAll("input.pp").forEach(inp=>{
    map[Number(inp.dataset.idx)] = inp.value.trim();
  });
  return map;
}

clearBtn.addEventListener("click", ()=>{
  state.files = [];
  fileInput.value = "";
  preview.innerHTML = "";
  titleInput.value = "";
  priceInput.value = "";
  descInput.value = "";
  stockInput.value = "";
  categoryInput.value = "";
  setStatus("");
});

uploadBtn.addEventListener("click", async ()=>{
  const title = titleInput.value.trim() || "Producto";
  const price = priceInput.value.trim();
  const desc  = descInput.value.trim();
  const stock = stockInput.value.trim();
  const category = categoryInput.value;
  const perPhoto = perPhotoChk.checked;
  const ppMap = perPhoto ? getPerPhotoPrices() : {};

  if(state.files.length === 0){ return setStatus("Sube al menos una foto 🖼️", true); }
  if(!price){ return setStatus("Agrega un precio 💵", true); }
  if (!stock) {
    return setStatus("Agrega la cantidad disponible 📦", true);
  }

  setStatus("Subiendo fotos… 📤 Esto puede tardar unos segundos.");
  try{
    const urls = [], perPhotoPrices = [];
    for(let i=0;i<state.files.length;i++){
      const file = state.files[i];                                   // <-- corregido
      const compressed = await compressImage(file, 1600, 0.85);
      const delivered = await uploadImageToCloudinary(compressed);
      urls.push(delivered);
      perPhotoPrices.push(perPhoto ? (ppMap[i] || price) : null);
    }

    const productToSave = {
      title: title,
      price: Number(price),
      description: desc,
      image_urls: urls,
      per_photo: perPhoto,
      per_photo_prices: perPhotoPrices,
      stock: Number(stock),
      category: category || null
    };
    
    const savedProduct = await saveProduct(productToSave);
    
    if (!savedProduct) {
      throw new Error("No se pudo guardar el producto en Supabase");
    }

    const savedItem = adaptProductFromDatabase(savedProduct);
    state.items.unshift(savedItem);
    renderList();
    setStatus(`Listo ✔️ Subidas ${urls.length}.`, false);

    // refresca miniaturas con el precio correcto
    preview.innerHTML = "";
    urls.forEach((u,idx)=>{
      const el = document.createElement("div");
      el.className = "thumb";
      const tagPrice = perPhoto ? perPhotoPrices[idx] : price;
      el.innerHTML = `<img src="${u}" alt=""><div class="priceTag">${formatPrice(tagPrice)}</div>`;
      preview.appendChild(el);
    });
  /* }catch(err){
    console.error(err);
    setStatus("Error subiendo. Revisa tu CLOUD_NAME y UPLOAD_PRESET.", true);
  } */
    }catch(err){
      console.error("Error completo:", err);
      setStatus(`Error: ${err.message}`, true);
  }
});


function setStatus(msg, isError=false){
  statusEl.textContent = msg;
  statusEl.className = isError ? "muted bad" : "muted ok";
}

function adaptProductFromDatabase(product) {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    desc: product.description,
    urls: product.image_urls || [],
    perPhoto: product.per_photo,
    perPhotoPrices: product.per_photo_prices || [],
    stock: product.stock ?? 0,
    category: product.category || "",
    createdAt: product.created_at
  };
}

async function loadProductsFromDatabase() {
  setStatus("Cargando publicaciones...");

  const products = await getProducts();

  state.items = products.map(adaptProductFromDatabase);

  renderList();
  setStatus("");
}


function renderList(){
  list.innerHTML = "";
  if(state.items.length===0){
    list.innerHTML = `<div class="muted">Aún no hay publicaciones. Sube una foto para empezar.</div>`;
    return;
  }
  for(const it of state.items){
    const cover = it.urls[0];
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <img src="${cover}" alt="">
      <div>
        <div class="inline" style="align-items:center;gap:8px;margin-bottom:4px">
          <strong>${it.title}</strong>

          <span class="pill">
          ${it.perPhoto ? "Precio por foto" : formatPrice(it.price)}
          </span>
        </div>

        <div class="muted">
          Stock: <strong>${it.stock}</strong>
          &nbsp;&nbsp;•&nbsp;&nbsp;
          ${it.category || "Sin categoría"}
          </div>
          <div class="muted" style="margin-top:8px;margin-bottom:12px">
          ${it.desc || ""}
      </div>
  
      <div class="share">
          <button class="btn whats">Compartir WhatsApp</button>
  
          <button class="btn copy">Copiar mensaje</button>
  
          <button class="btn btn-ghost gal">Ver galería</button>
  
          <button class="btn btn-ghost del">Eliminar</button>
      </div>
      </div>
    `;
    const btnWa  = div.querySelector(".whats");
    const btnCp  = div.querySelector(".copy");
    const btnGal = div.querySelector(".gal");
    const btnDel = div.querySelector(".del");

    btnWa.addEventListener("click", ()=> shareWhatsApp(it));
    btnCp.addEventListener("click", ()=> copyMessage(it));
    btnGal.addEventListener("click", ()=> window.open(buildGalleryLink(it), "_blank"));
   /*  btnDel.addEventListener("click", ()=>{
      state.items = state.items.filter(x=>x.id!==it.id);
     
      saveItems(state.items);
      renderList();
    }); */
    btnDel.addEventListener("click", async () => {
      const confirmed = confirm(`¿Eliminar "${it.title}"?`);
    
      if (!confirmed) return;
    
      const deleted = await deleteProduct(it.id);
    
      if (!deleted) {
        setStatus("No se pudo eliminar el producto.", true);
        return;
      }
    
      state.items = state.items.filter(product => product.id !== it.id);
    
      renderList();
      setStatus("Producto eliminado correctamente.");
    });

    list.appendChild(div);
  }
}

// arranque
loadProductsFromDatabase();
//renderList();
