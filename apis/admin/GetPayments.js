const connectDB = require("../../db/dbConnect");

async function GetPayments(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const db = await connectDB();
    const payments = await db
      .collection("payments")
      .aggregate([
        { $lookup: { from: "users", localField: "register_id", foreignField: "_id", as: "user" } },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "bookings", localField: "booking_id", foreignField: "_id", as: "booking" } },
        { $unwind: { path: "$booking", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "venues", localField: "booking.venue_id", foreignField: "_id", as: "venue" } },
        { $unwind: { path: "$venue", preserveNullAndEmptyArrays: true } },
        { $project: { "user.password": 0 } },
        { $sort: { date: -1 } },
      ])
      .toArray();

    return res.status(200).json({ success: true, message: "Payments fetched successfully", data: payments });
  } catch (error) {
    console.error("GetPayments.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetPayments };
