const SUPABASE_URL = "https://hmdxqtcxsafqoympyttr.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_l6yOXCyNUW9FSNOd7h6f5g_SeSI7aJD";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("Supabase conectado");

const { data, error } = await supabaseClient
    .from("products")
    .select("*");