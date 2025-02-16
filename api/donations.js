import supabase from "../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Cek token keamanan
  const { token } = req.query;
  if (token !== process.env.SECRET_TOKEN) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const { data, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
