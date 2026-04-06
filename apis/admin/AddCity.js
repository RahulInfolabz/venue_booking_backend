const connectDB = require("../../db/dbConnect");
async function AddCity(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "City name is required" });
    const db = await connectDB();
    await db.collection("cities").insertOne({ name, status: "Active", created_at: new Date() });
    return res.status(201).json({ success: true, message: "City added successfully" });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { AddCity };
