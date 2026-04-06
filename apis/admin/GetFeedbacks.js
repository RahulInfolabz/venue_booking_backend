const connectDB = require("../../db/dbConnect");
async function GetAdminFeedbacks(req, res) {
  try {
    const db = await connectDB();
    const feedbacks = await db.collection("feedbacks").aggregate([
      { $lookup: { from: "users", localField: "register_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "venues", localField: "venue_id", foreignField: "_id", as: "venue" } },
      { $unwind: { path: "$venue", preserveNullAndEmptyArrays: true } },
      { $project: { "user.password": 0 } },
      { $sort: { created_at: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Feedbacks fetched successfully", data: feedbacks });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { GetAdminFeedbacks };
