const connectDB = require("../../db/dbConnect");
async function GetAdminVenues(req, res) {
  try {
    const db = await connectDB();
    const venues = await db.collection("venues").aggregate([
      { $lookup: { from: "cities", localField: "city_id", foreignField: "_id", as: "city" } },
      { $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "occasions", localField: "occasion_id", foreignField: "_id", as: "occasion" } },
      { $unwind: { path: "$occasion", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "venue_types", localField: "venue_type_id", foreignField: "_id", as: "venue_type" } },
      { $unwind: { path: "$venue_type", preserveNullAndEmptyArrays: true } },
      { $sort: { created_at: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Venues fetched successfully", data: venues });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { GetAdminVenues };
