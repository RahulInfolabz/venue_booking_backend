const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetVenueDetails(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid venue ID" });
    }

    const db = await connectDB();
    const details = await db
      .collection("venues")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $lookup: { from: "cities", localField: "city_id", foreignField: "_id", as: "city" } },
        { $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "occasions", localField: "occasion_id", foreignField: "_id", as: "occasion" } },
        { $unwind: { path: "$occasion", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "venue_types", localField: "venue_type_id", foreignField: "_id", as: "venue_type" } },
        { $unwind: { path: "$venue_type", preserveNullAndEmptyArrays: true } },
      ])
      .toArray();

    if (!details.length) {
      return res.status(404).json({ success: false, message: "Venue not found" });
    }

    return res.status(200).json({ success: true, message: "Venue details fetched successfully", data: details[0] });
  } catch (error) {
    console.error("GetVenueDetails.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetVenueDetails };
