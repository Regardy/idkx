import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

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

    if (!name || !amount) {
      return res.status(400).json({ error: "Name and amount are required" });
    }

    // Simpan data donasi ke Supabase
    const { data, error } = await supabase.from("donations").insert([{ name, amount, message }]);

    if (error) {
      console.error("Supabase error:", error.message);
      throw error;
    }

    res.status(200).json({ success: true, message: "Donation saved", data });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
