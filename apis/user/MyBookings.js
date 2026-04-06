const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function MyBookings(req, res) {
  try {
    const db = await connectDB();
    const bookings = await db.collection("bookings").aggregate([
      { $match: { register_id: new ObjectId(req.user._id) } },
      { $lookup: { from: "venues", localField: "venue_id", foreignField: "_id", as: "venue" } },
      { $unwind: { path: "$venue", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "cities", localField: "venue.city_id", foreignField: "_id", as: "city" } },
      { $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "occasions", localField: "venue.occasion_id", foreignField: "_id", as: "occasion" } },
      { $unwind: { path: "$occasion", preserveNullAndEmptyArrays: true } },
      { $sort: { created_at: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Bookings fetched successfully", data: bookings });
  } catch (error) {
    console.error("MyBookings.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { MyBookings };
