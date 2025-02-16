
import supabase from "../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Cek token keamanan
  const { token } = req.query;
  if (token !== process.env.SECRET_TOKEN) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const { name, amount, message } = req.body;

    // Simpan data donasi ke Supabase
    const { error } = await supabase.from("donations").insert([{ name, amount, message }]);
    if (error) throw error;

    res.status(200).json({ success: true, message: "Donation saved" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
