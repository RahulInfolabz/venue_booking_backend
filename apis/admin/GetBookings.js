const connectDB = require("../../db/dbConnect");

async function GetBookings(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const db = await connectDB();
    const bookings = await db
      .collection("bookings")
      .aggregate([
        { $lookup: { from: "users", localField: "register_id", foreignField: "_id", as: "user" } },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "venues", localField: "venue_id", foreignField: "_id", as: "venue" } },
        { $unwind: { path: "$venue", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "cities", localField: "venue.city_id", foreignField: "_id", as: "city" } },
        { $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },
        { $project: { "user.password": 0 } },
        { $sort: { created_at: -1 } },
      ])
      .toArray();

    return res.status(200).json({ success: true, message: "Bookings fetched successfully", data: bookings });
  } catch (error) {
    console.error("GetBookings.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetBookings };
