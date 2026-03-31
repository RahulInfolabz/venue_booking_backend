const connectDB = require("../../db/dbConnect");

async function GetAdminOccasions(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const db = await connectDB();
    const occasions = await db.collection("occasions").find({}).sort({ name: 1 }).toArray();
    return res.status(200).json({ success: true, message: "Occasions fetched successfully", data: occasions });
  } catch (error) {
    console.error("admin/GetOccasions.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetAdminOccasions };
