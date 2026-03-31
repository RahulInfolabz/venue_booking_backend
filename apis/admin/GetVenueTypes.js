const connectDB = require("../../db/dbConnect");

async function GetAdminVenueTypes(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const db = await connectDB();
    const types = await db.collection("venue_types").find({}).sort({ name: 1 }).toArray();
    return res.status(200).json({ success: true, message: "Venue types fetched successfully", data: types });
  } catch (error) {
    console.error("admin/GetVenueTypes.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetAdminVenueTypes };
