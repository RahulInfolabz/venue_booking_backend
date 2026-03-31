const connectDB = require("../../db/dbConnect");

async function GetVenueTypes(req, res) {
  try {
    const db = await connectDB();
    const venueTypes = await db
      .collection("venue_types")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return res.status(200).json({ success: true, message: "Venue types fetched successfully", data: venueTypes });
  } catch (error) {
    console.error("GetVenueTypes.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetVenueTypes };
