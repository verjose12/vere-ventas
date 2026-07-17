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
    console.log("Producto que se enviará:", product);

    const { data, error } = await supabaseClient
      .from("products")
      .insert([product]) // para poder insertar en data base agregamos politicas de seguridad en supabase
      .select("*");// politica INSERT Y SELECT
  
    if (error) {
      console.error("Error en supabase:", error);
      return null;
    }
  
    console.log("Producto guardado en Supabase:", data);
    return data[0];
  }

  async function getProducts() {
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
  
    if (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }
  
    console.log("Productos obtenidos:", data);
    return data;
  }

  
 /*  async function testGetProducts() {
    const products = await getProducts();
    console.log("Prueba de productos:", products);
  }
  
  testGetProducts(); */