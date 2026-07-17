const SUPABASE_URL = "https://hmdxqtcxsafqoympyttr.supabase.co";
const SUPABASE_KEY = "sb_publishable_l6yOXCyNUW9FSNOd7h6f5g_SeSI7aJD";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* console.log("Supabase conectado");

async function testConnection() {

    const { data, error } = await supabaseClient
        .from("products")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    console.log(data);
}

testConnection(); */

async function saveProduct(product) {
    const { data, error } = await supabaseClient
      .from("products")
      .insert([product])
      .select();
  
    if (error) {
      console.error("Error al guardar el producto:", error);
      return null;
    }
  
    console.log("Producto guardado en Supabase:", data);
    return data[0];
  }