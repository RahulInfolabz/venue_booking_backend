const connectDB = require("../../db/dbConnect");

async function DashboardStats(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const db = await connectDB();

    const totalUsers       = await db.collection("users").countDocuments({ role: "User" });
    const totalCities      = await db.collection("cities").countDocuments({});
    const totalOccasions   = await db.collection("occasions").countDocuments({});
    const totalVenueTypes  = await db.collection("venue_types").countDocuments({});
    const totalVenues      = await db.collection("venues").countDocuments({});
    const activeVenues     = await db.collection("venues").countDocuments({ status: "Active" });
    const totalBookings    = await db.collection("bookings").countDocuments({});
    const pendingBookings  = await db.collection("bookings").countDocuments({ booking_status: "Pending" });
    const approvedBookings = await db.collection("bookings").countDocuments({ booking_status: "Approved" });
    const cancelledBookings = await db.collection("bookings").countDocuments({ booking_status: "Cancelled" });

    const revenueResult = await db
      .collection("payments")
      .aggregate([
        { $match: { payment_status: "Done" } },
        { $group: { _id: null, total: { $sum: "$total_amount" } } },
      ])
      .toArray();
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const ratingResult = await db
      .collection("feedbacks")
      .aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }])
      .toArray();
    const avgRating = ratingResult.length > 0 ? Math.round(ratingResult[0].avg * 10) / 10 : 0;

    const recentBookings = await db
      .collection("bookings")
      .aggregate([
        { $sort: { created_at: -1 } },
        { $limit: 5 },
        { $lookup: { from: "users", localField: "register_id", foreignField: "_id", as: "user" } },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "venues", localField: "venue_id", foreignField: "_id", as: "venue" } },
        { $unwind: { path: "$venue", preserveNullAndEmptyArrays: true } },
        { $project: { "user.password": 0 } },
      ])
      .toArray();

    const recentPayments = await db
      .collection("payments")
      .aggregate([
        { $sort: { date: -1 } },
        { $limit: 5 },
        { $lookup: { from: "users", localField: "register_id", foreignField: "_id", as: "user" } },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        { $project: { "user.password": 0 } },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalUsers, totalCities, totalOccasions, totalVenueTypes,
        totalVenues, activeVenues, totalBookings, pendingBookings,
        approvedBookings, cancelledBookings, totalRevenue, avgRating,
        recentBookings, recentPayments,
      },
    });
  } catch (error) {
    console.error("DashboardStats.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { DashboardStats };
