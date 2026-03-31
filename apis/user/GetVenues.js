const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetVenues(req, res) {
  try {
    const { city_id, occasion_id, venue_type_id, min_price, max_price } = req.query;

    const db = await connectDB();
    const matchStage = { status: "Active" };

    if (city_id && ObjectId.isValid(city_id)) matchStage.city_id = new ObjectId(city_id);
    if (occasion_id && ObjectId.isValid(occasion_id)) matchStage.occasion_id = new ObjectId(occasion_id);
    if (venue_type_id && ObjectId.isValid(venue_type_id)) matchStage.venue_type_id = new ObjectId(venue_type_id);

    if (min_price || max_price) {
      matchStage.price = {};
      if (min_price) matchStage.price.$gte = parseFloat(min_price);
      if (max_price) matchStage.price.$lte = parseFloat(max_price);
    }

    const venues = await db
      .collection("venues")
      .aggregate([
        { $match: matchStage },
        { $lookup: { from: "cities", localField: "city_id", foreignField: "_id", as: "city" } },
        { $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "occasions", localField: "occasion_id", foreignField: "_id", as: "occasion" } },
        { $unwind: { path: "$occasion", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "venue_types", localField: "venue_type_id", foreignField: "_id", as: "venue_type" } },
        { $unwind: { path: "$venue_type", preserveNullAndEmptyArrays: true } },
        { $sort: { created_at: -1 } },
      ])
      .toArray();

    return res.status(200).json({ success: true, message: "Venues fetched successfully", data: venues });
  } catch (error) {
    console.error("GetVenues.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetVenues };
