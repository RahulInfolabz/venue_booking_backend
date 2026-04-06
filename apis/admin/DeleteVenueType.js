const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function DeleteVenueType(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid venue type ID" });
    const db = await connectDB();
    const result = await db.collection("venue_types").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: "Venue type not found" });
    return res.status(200).json({ success: true, message: "Venue type deleted successfully" });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { DeleteVenueType };
