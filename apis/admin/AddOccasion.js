const connectDB = require("../../db/dbConnect");
async function AddOccasion(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Occasion name is required" });
    const db = await connectDB();
    await db.collection("occasions").insertOne({ name, created_at: new Date() });
    return res.status(201).json({ success: true, message: "Occasion added successfully" });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { AddOccasion };
