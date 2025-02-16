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
    console.log("Request body:", req.body); // Debugging

    // Ambil data dari request
    const { donator_name, amount_raw, message } = req.body;

    // Validasi input
    if (!donator_name || typeof donator_name !== "string") {
      return res.status(400).json({ error: "Invalid donator_name" });
    }
    if (!amount_raw || isNaN(amount_raw)) {
      return res.status(400).json({ error: "Invalid amount_raw" });
    }

    // Ubah nama field agar sesuai dengan database Supabase
    const name = donator_name;
    const amount = parseFloat(amount_raw); // Sesuaikan jika perlu dibagi 100
    const donation_message = message || "";

    // Simpan data donasi ke Supabase
    const { data, error } = await supabase
      .from("donations")
      .insert([{ name, amount, message: donation_message }]);

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ error: "Database error", details: error.message });
    }

    res.status(200).json({ success: true, message: "Donation saved", data });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
