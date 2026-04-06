const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function UpdateOccasion(req, res) {
  try {
    const { id, name } = req.body;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Valid occasion ID is required" });
    const db = await connectDB();
    const result = await db.collection("occasions").updateOne({ _id: new ObjectId(id) }, { $set: { name, updated_at: new Date() } });
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Occasion not found" });
    return res.status(200).json({ success: true, message: "Occasion updated successfully" });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { UpdateOccasion };
