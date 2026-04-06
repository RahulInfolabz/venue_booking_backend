const connectDB = require("../../db/dbConnect");
async function AddVenueType(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Venue type name is required" });
    const db = await connectDB();
    await db.collection("venue_types").insertOne({ name, created_at: new Date() });
    return res.status(201).json({ success: true, message: "Venue type added successfully" });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { AddVenueType };
