const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function DeleteVenue(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid venue ID" });
    const db = await connectDB();
    const result = await db.collection("venues").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: "Venue not found" });
    return res.status(200).json({ success: true, message: "Venue deleted successfully" });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { DeleteVenue };
