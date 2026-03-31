const connectDB = require("../../db/dbConnect");

async function AddVenueType(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Venue type name is required" });

    const db = await connectDB();
    await db.collection("venue_types").insertOne({ name, created_at: new Date() });
    return res.status(201).json({ success: true, message: "Venue type added successfully" });
  } catch (error) {
    console.error("AddVenueType.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { AddVenueType };
