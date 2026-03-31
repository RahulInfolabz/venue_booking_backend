const connectDB = require("../../db/dbConnect");

async function GetCities(req, res) {
  try {
    const db = await connectDB();
    const cities = await db
      .collection("cities")
      .find({ status: "Active" })
      .sort({ name: 1 })
      .toArray();

    return res.status(200).json({ success: true, message: "Cities fetched successfully", data: cities });
  } catch (error) {
    console.error("GetCities.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetCities };
