const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetFeedbacks(req, res) {
  try {
    const { venue_id } = req.params;
    const db = await connectDB();

    const matchStage = {};
    if (venue_id && ObjectId.isValid(venue_id)) {
      matchStage.venue_id = new ObjectId(venue_id);
    }

    const feedbacks = await db
      .collection("feedbacks")
      .aggregate([
        { $match: matchStage },
        { $lookup: { from: "users", localField: "register_id", foreignField: "_id", as: "user" } },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $lookup: { from: "venues", localField: "venue_id", foreignField: "_id", as: "venue" },
        },
        { $unwind: { path: "$venue", preserveNullAndEmptyArrays: true } },
        { $project: { "user.password": 0 } },
        { $sort: { created_at: -1 } },
      ])
      .toArray();

    return res.status(200).json({ success: true, message: "Feedbacks fetched successfully", data: feedbacks });
  } catch (error) {
    console.error("GetFeedbacks.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetFeedbacks };
