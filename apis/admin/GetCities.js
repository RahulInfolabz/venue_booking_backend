const connectDB = require("../../db/dbConnect");
async function GetAdminCities(req, res) {
  try {
    const db = await connectDB();
    const cities = await db.collection("cities").find({}).sort({ name: 1 }).toArray();
    return res.status(200).json({ success: true, message: "Cities fetched successfully", data: cities });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { GetAdminCities };
