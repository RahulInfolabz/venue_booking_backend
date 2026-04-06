const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function AddVenue(req, res) {
  try {
    const { occasion_id, venue_type_id, city_id, description, price } = req.body;
    if (!occasion_id || !venue_type_id || !city_id || !description || !price) return res.status(400).json({ success: false, message: "All fields are required" });
    if (!ObjectId.isValid(occasion_id) || !ObjectId.isValid(venue_type_id) || !ObjectId.isValid(city_id)) return res.status(400).json({ success: false, message: "Invalid ID provided" });
    const db = await connectDB();
    const image = req.file ? `/uploads/venues/${req.file.filename}` : "";
    await db.collection("venues").insertOne({ occasion_id: new ObjectId(occasion_id), venue_type_id: new ObjectId(venue_type_id), city_id: new ObjectId(city_id), description, price: parseInt(price), image, status: "Active", created_at: new Date() });
    return res.status(201).json({ success: true, message: "Venue added successfully" });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { AddVenue };
