const connectDB = require("../../db/dbConnect");
async function GetAdminOccasions(req, res) {
  try {
    const db = await connectDB();
    const occasions = await db.collection("occasions").find({}).sort({ name: 1 }).toArray();
    return res.status(200).json({ success: true, message: "Occasions fetched successfully", data: occasions });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { GetAdminOccasions };
