const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateCity(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id, name, status } = req.body;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Valid city ID is required" });

    const db = await connectDB();
    const updateFields = { updated_at: new Date() };
    if (name) updateFields.name = name;
    if (status) updateFields.status = status;

    const result = await db.collection("cities").updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "City not found" });

    return res.status(200).json({ success: true, message: "City updated successfully" });
  } catch (error) {
    console.error("UpdateCity.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { UpdateCity };
