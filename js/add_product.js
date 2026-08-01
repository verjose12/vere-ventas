const state ={
    files: [],
  };
  
  const $ = s => document.querySelector(s);
  
  const fileInput = $("#fileInput");
  const titleInput = $("#titleInput");
  const priceInput = $("#priceInput");
  const descInput = $("#descInput");
  const uploadBtn = $("#uploadBtn");
  const clearBtn = $("#clearBtn");
  const preview = $("#preview");
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
  
      setStatus(
        `Producto agregado correctamente ✔️`,
        false
      );
      
      setTimeout(() => {
        window.location.href = "index.html";
      }, 700);

  
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


  function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.className = isError
      ? "muted bad"
      : "muted ok";
  }
  
  